import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { CreateTicket } from './pages/CreateTicket';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-ticket" element={<CreateTicket />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
