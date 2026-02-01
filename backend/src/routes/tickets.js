const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');

// GET all tickets
router.get('/', async (req, res) => {
  try {
    const { status, priority, search, limit = 50 } = req.query;
    let filter = {};
    
    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ticketNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const tickets = await Ticket.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    console.error('GET tickets error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET single ticket
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    res.json({ success: true, data: ticket });
  } catch (error) {
    console.error('GET ticket error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ CREATE TICKET - WORKS PERFECTLY
router.post('/', async (req, res) => {
  try {
    console.log('Creating ticket:', req.body);
    
    const { title, description, priority } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ success: false, message: 'Title required' });
    }
    if (!description?.trim()) {
      return res.status(400).json({ success: false, message: 'Description required' });
    }

    const ticketNumber = `HD-${Date.now()}`;
    
    const ticket = await Ticket.create({
      ticketNumber,
      title: title.trim(),
      description: description.trim(),
      priority: priority || 'medium',
      status: 'open',
      history: [{ status: 'open', timestamp: new Date() }]
    });

    console.log('✅ Ticket created:', ticket._id);
    
    res.status(201).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    console.error('CREATE ERROR:', error);
    res.status(500).json({ success: false, message: 'Failed to create ticket' });
  }
});

// UPDATE ticket
router.put('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    
    res.json({ success: true, data: ticket });
  } catch (error) {
    console.error('UPDATE error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE ticket
router.delete('/:id', async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Ticket deleted' });
  } catch (error) {
    console.error('DELETE error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
