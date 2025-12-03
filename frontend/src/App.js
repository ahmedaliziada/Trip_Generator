import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ItineraryGenerator from './components/ItineraryGenerator';
import SavedItineraries from './components/SavedItineraries';
import ItineraryView from './components/ItineraryView';
import About from './components/About';

function App() {
  return (
    <Router future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <div className="App">
        <header className="App-header">
          <div className="container">
            <h1>✈️ AI Travel Itinerary Generator</h1>
            <nav>
              <Link to="/" className="nav-link">Generate Itinerary</Link>
              <Link to="/saved" className="nav-link">Saved Trips</Link>
              <Link to="/about" className="nav-link">About</Link>
            </nav>
          </div>
        </header>

        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<ItineraryGenerator />} />
              <Route path="/saved" element={<SavedItineraries />} />
              <Route path="/itinerary/:id" element={<ItineraryView />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </main>

        <footer className="App-footer">
          <div className="container">
            <p>&copy; 2025 AI Travel Itinerary Generator v1.0</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;