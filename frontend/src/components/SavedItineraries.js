import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getItineraries, deleteItinerary } from '../services/api';

function SavedItineraries() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadItineraries();
  }, []);

  const loadItineraries = async () => {
    try {
      setLoading(true);
      const data = await getItineraries();
      setItineraries(data);
    } catch (err) {
      setError('Failed to load saved itineraries');
      console.error('Error loading itineraries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this itinerary?')) {
      return;
    }

    try {
      await deleteItinerary(id);
      setItineraries(itineraries.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete itinerary');
      console.error('Error deleting itinerary:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading your saved trips...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div style={{ 
          background: '#fed7d7', 
          color: '#c53030', 
          padding: '1rem', 
          borderRadius: '8px' 
        }}>
          {error}
        </div>
        <button 
          onClick={loadItineraries} 
          className="btn btn-primary" 
          style={{ marginTop: '1rem' }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>📚 Your Saved Itineraries</h2>
        <Link to="/" className="btn btn-primary">
          + Create New Trip
        </Link>
      </div>

      {itineraries.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No saved itineraries yet</h3>
          <p style={{ color: '#718096', marginBottom: '2rem' }}>
            Start planning your first trip to see it here!
          </p>
          <Link to="/" className="btn btn-primary">
            Generate Your First Itinerary ✈️
          </Link>
        </div>
      ) : (
        <div className="itinerary-grid">
          {itineraries.map(itinerary => (
            <div key={itinerary.id} className="itinerary-card">
              <h3>{itinerary.destination}</h3>
              <div className="dates">
                {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
                <span style={{ marginLeft: '0.5rem', color: '#667eea' }}>
                  ({calculateDays(itinerary.start_date, itinerary.end_date)} days)
                </span>
              </div>
              
              <div className="interests">
                {itinerary.interests.map((interest, index) => (
                  <span key={index} className="interest-badge">
                    {interest}
                  </span>
                ))}
              </div>
              
              <div style={{ 
                fontSize: '0.875rem', 
                color: '#718096', 
                marginBottom: '1.5rem' 
              }}>
                Created: {formatDate(itinerary.created_at)}
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link 
                  to={`/itinerary/${itinerary.id}`} 
                  className="btn btn-primary"
                  style={{ flex: 1, fontSize: '0.875rem' }}
                >
                  View Details
                </Link>
                <button
                  onClick={() => handleDelete(itinerary.id)}
                  className="btn btn-danger"
                  style={{ fontSize: '0.875rem' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedItineraries;