const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Public (add auth later)
router.get('/', async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    
    // Build filter object
    let filter = {};
    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await Ticket.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get single ticket
// @route   GET /api/tickets/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    // Basic validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required'
      });
    }

    const ticket = await Ticket.create({
      title,
      description,
      priority: priority || 'medium'
    });
    // Add to existing POST route (after creating ticket)
    const user = await User.findById(req.user?.id || 'demo-user');
    ticket.user = user._id;

    res.status(201).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});


// Add PUT for status update
router.put('/:id/status', async (req, res) => {
  try {
    const { status, assignedTo, notes } = req.body;
    
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    
    // Add to history
    ticket.history.push({
      status,
      assignedTo,
      notes,
      updatedBy: req.user?.id,
      timestamp: new Date()
    });
    
    ticket.status = status;
    ticket.assignedTo = assignedTo;
    await ticket.save();
    
    res.json({ success: true, data: ticket });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});


// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    let ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    ticket = await Ticket.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { 
        new: true,
        runValidators: true 
      }
    );

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    await Ticket.deleteOne({ _id: req.params.id });

    res.json({
      success: true,
      message: 'Ticket removed'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

module.exports = router;
