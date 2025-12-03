import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItinerary, adjustItinerary } from '../services/api';

function ItineraryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adjustmentText, setAdjustmentText] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  const loadItinerary = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getItinerary(id);
      setItinerary(data);
    } catch (err) {
      setError('Failed to load itinerary');
      console.error('Error loading itinerary:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadItinerary();
  }, [loadItinerary]);

  const handleAdjustment = async () => {
    if (!adjustmentText.trim()) return;
    
    setAdjusting(true);
    try {
      console.log('Adjusting itinerary with:', adjustmentText);
      const updatedItinerary = await adjustItinerary(id, adjustmentText);
      console.log('Received updated itinerary:', updatedItinerary);
      
      setItinerary(updatedItinerary);
      setAdjustmentText('');
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 1000;
        background: #48bb78; color: white; padding: 1rem 2rem;
        border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      `;
      successMessage.textContent = '✅ Itinerary updated successfully!';
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);
      
    } catch (err) {
      console.error('Error adjusting itinerary:', err);
      setError('Failed to adjust itinerary. Please try again.');
    } finally {
      setAdjusting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading itinerary...</p>
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
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
        <button 
          onClick={() => navigate('/saved')} 
          className="btn btn-secondary"
        >
          ← Back to Saved Trips
        </button>
      </div>
    );
  }

  if (!itinerary) {
    return (
      <div className="card">
        <h3>Itinerary not found</h3>
        <button 
          onClick={() => navigate('/saved')} 
          className="btn btn-secondary"
        >
          ← Back to Saved Trips
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>✈️ {itinerary.destination} Itinerary</h2>
        <button 
          onClick={() => navigate('/saved')} 
          className="btn btn-secondary"
        >
          ← Back to Saved Trips
        </button>
      </div>

      <div className="card">
        <div style={{ marginBottom: '2rem' }}>
          <h3>Trip Overview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <strong>Destination:</strong><br />
              {itinerary.destination}
            </div>
            <div>
              <strong>Dates:</strong><br />
              {formatDate(itinerary.start_date)} - {formatDate(itinerary.end_date)}
            </div>
            <div>
              <strong>Duration:</strong><br />
              {Math.ceil((new Date(itinerary.end_date) - new Date(itinerary.start_date)) / (1000 * 60 * 60 * 24)) + 1} days
            </div>
            <div>
              <strong>Created:</strong><br />
              {formatDate(itinerary.created_at)}
            </div>
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <strong>Your Interests:</strong>
            <div className="interests-container" style={{ marginTop: '0.5rem' }}>
              {itinerary.interests.map((interest, index) => (
                <span key={index} className="interest-tag selected">
                  {interest}
                </span>
              ))}
            </div>
          </div>
          
          {itinerary.itinerary_data?.total_estimated_cost && (
            <div style={{ marginTop: '1rem' }}>
              <strong>Estimated Cost:</strong> {itinerary.itinerary_data.total_estimated_cost}
            </div>
          )}
        </div>

        {/* Daily Itinerary */}
        <div>
          <h3>📅 Daily Itinerary</h3>
          {itinerary.itinerary_data?.itinerary?.map((day, index) => (
            <div key={index} className="itinerary-day">
              <h3>Day {day.day} - {day.date}</h3>
              
              {day.activities && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4>🗓️ Activities</h4>
                  <ul className="activities-list">
                    {day.activities.map((activity, i) => (
                      <li key={i}>{activity}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {day.meals && (
                <div className="meals-section">
                  <h4>🍽️ Recommended Meals</h4>
                  {day.meals.breakfast && (
                    <div className="meal-item">
                      <strong>Breakfast:</strong> {day.meals.breakfast}
                    </div>
                  )}
                  {day.meals.lunch && (
                    <div className="meal-item">
                      <strong>Lunch:</strong> {day.meals.lunch}
                    </div>
                  )}
                  {day.meals.dinner && (
                    <div className="meal-item">
                      <strong>Dinner:</strong> {day.meals.dinner}
                    </div>
                  )}
                </div>
              )}
              
              {day.accommodation && (
                <div style={{ marginTop: '1rem' }}>
                  <strong>🏨 Accommodation:</strong> {day.accommodation}
                </div>
              )}
              
              {day.notes && (
                <div style={{ marginTop: '1rem', fontStyle: 'italic', color: '#718096' }}>
                  💡 <strong>Notes:</strong> {day.notes}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Information */}
        {itinerary.itinerary_data && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f7fafc', borderRadius: '10px' }}>
            <h3>📋 Travel Information</h3>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
              {itinerary.itinerary_data.transportation && (
                <div>
                  <strong>🚌 Transportation:</strong><br />
                  {itinerary.itinerary_data.transportation}
                </div>
              )}
              {itinerary.itinerary_data.best_time_to_visit && (
                <div>
                  <strong>🌤️ Best Time to Visit:</strong><br />
                  {itinerary.itinerary_data.best_time_to_visit}
                </div>
              )}
              {itinerary.itinerary_data.cultural_tips && (
                <div>
                  <strong>🎭 Cultural Tips:</strong><br />
                  {itinerary.itinerary_data.cultural_tips}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Adjustment Section */}
        <div className="adjustment-form">
          <h3>🔧 Adjust Your Itinerary</h3>
          <p>Want to modify your trip? Tell us what changes you'd like to make!</p>
          <textarea
            value={adjustmentText}
            onChange={(e) => setAdjustmentText(e.target.value)}
            placeholder="E.g., 'make it more budget-friendly', 'add more outdoor activities', 'focus on local food experiences'..."
          />
          <button 
            onClick={handleAdjustment}
            className="btn btn-primary"
            disabled={adjusting || !adjustmentText.trim()}
            style={{ marginTop: '1rem' }}
          >
            {adjusting ? (
              <>
                <div style={{ display: 'inline-block', width: '16px', height: '16px', marginRight: '0.5rem' }}>
                  <div className="spinner" style={{ width: '16px', height: '16px', margin: '0' }}></div>
                </div>
                Adjusting...
              </>
            ) : (
              'Adjust Itinerary'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItineraryView;