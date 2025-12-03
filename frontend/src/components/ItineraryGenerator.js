import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { generateItinerary, saveItinerary, adjustItinerary } from '../services/api';

const INTEREST_OPTIONS = [
  'culture', 'food', 'nature', 'adventure', 'history', 'art', 'music', 
  'nightlife', 'shopping', 'architecture', 'museums', 'beaches', 
  'hiking', 'photography', 'local experiences', 'festivals'
];

function ItineraryGenerator() {
  const [formData, setFormData] = useState({
    destination: '',
    start_date: new Date(),
    end_date: new Date(Date.now() + 86400000 * 3), // 3 days from now
    interests: []
  });
  const [loading, setLoading] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleDateChange = (date, field) => {
    setFormData({
      ...formData,
      [field]: date
    });
  };

  const toggleInterest = (interest) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    
    setFormData({
      ...formData,
      interests: newInterests
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Format dates for API
      const requestData = {
        ...formData,
        start_date: formData.start_date.toISOString().split('T')[0],
        end_date: formData.end_date.toISOString().split('T')[0]
      };
      
      const response = await generateItinerary(requestData);
      setGeneratedItinerary(response);
    } catch (err) {
      setError('Failed to generate itinerary. Please try again.');
      console.error('Error generating itinerary:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setGeneratedItinerary(null);
    setError('');
  };

  if (generatedItinerary) {
    return <ItineraryDisplay 
      itinerary={generatedItinerary} 
      onBack={resetForm}
      onUpdate={setGeneratedItinerary}
    />;
  }

  return (
    <div className="card">
      <h2>Generate Your Perfect Itinerary</h2>
      <p>Tell us about your dream trip and let AI create a personalized itinerary for you!</p>
      
      {error && (
        <div style={{ 
          background: '#fed7d7', 
          color: '#c53030', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginTop: '1rem' 
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <div className="form-group">
          <label htmlFor="destination">Destination</label>
          <input
            type="text"
            id="destination"
            name="destination"
            className="form-control"
            placeholder="e.g., Paris, Tokyo, New York..."
            value={formData.destination}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Start Date</label>
            <DatePicker
              selected={formData.start_date}
              onChange={(date) => handleDateChange(date, 'start_date')}
              className="form-control"
              minDate={new Date()}
              dateFormat="yyyy-MM-dd"
            />
          </div>
          
          <div className="form-group">
            <label>End Date</label>
            <DatePicker
              selected={formData.end_date}
              onChange={(date) => handleDateChange(date, 'end_date')}
              className="form-control"
              minDate={formData.start_date}
              dateFormat="yyyy-MM-dd"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Your Interests</label>
          <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '1rem' }}>
            Select what you're passionate about to personalize your itinerary
          </p>
          <div className="interests-container">
            {INTEREST_OPTIONS.map(interest => (
              <span
                key={interest}
                className={`interest-tag ${formData.interests.includes(interest) ? 'selected' : ''}`}
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading || !formData.destination || formData.interests.length === 0}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          {loading ? 'Generating Your Itinerary...' : 'Generate Itinerary ✈️'}
        </button>
      </form>
      
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>AI is crafting your perfect itinerary...</p>
        </div>
      )}
    </div>
  );
}

function ItineraryDisplay({ itinerary, onBack, onUpdate }) {
  const [adjustmentText, setAdjustmentText] = useState('');
  const [adjusting, setAdjusting] = useState(false);
  const [error, setError] = useState('');

  const handleAdjustment = async () => {
    if (!adjustmentText.trim()) return;
    
    setAdjusting(true);
    setError('');
    try {
      console.log('Adjusting itinerary:', adjustmentText);
      const updatedItinerary = await adjustItinerary(itinerary.id, adjustmentText);
      console.log('Received updated itinerary:', updatedItinerary);
      
      onUpdate(updatedItinerary);
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
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage);
        }
      }, 3000);
      
    } catch (err) {
      console.error('Error adjusting itinerary:', err);
      setError('Failed to adjust itinerary. Please try again.');
    } finally {
      setAdjusting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>🎉 Your Itinerary for {itinerary.destination}</h2>
        <button onClick={onBack} className="btn btn-secondary">
          ← Generate New
        </button>
      </div>

      <div className="card">
        {error && (
          <div style={{ 
            background: '#fed7d7', 
            color: '#c53030', 
            padding: '1rem', 
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '2rem' }}>
          <h3>Trip Overview</h3>
          <p><strong>Dates:</strong> {itinerary.start_date} to {itinerary.end_date}</p>
          <p><strong>Interests:</strong> {itinerary.interests.join(', ')}</p>
          {itinerary.itinerary_data?.total_estimated_cost && (
            <p><strong>Estimated Cost:</strong> {itinerary.itinerary_data.total_estimated_cost}</p>
          )}
        </div>

        {itinerary.itinerary_data?.itinerary?.map((day, index) => (
          <div key={index} className="itinerary-day">
            <h3>Day {day.day} - {day.date}</h3>
            
            <div>
              <h4>🗓️ Activities</h4>
              <ul className="activities-list">
                {day.activities?.map((activity, i) => (
                  <li key={i}>{activity}</li>
                ))}
              </ul>
            </div>
            
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
            
            {day.notes && (
              <div style={{ marginTop: '1rem', fontStyle: 'italic', color: '#718096' }}>
                💡 {day.notes}
              </div>
            )}
          </div>
        ))}

        {/* Additional Info */}
        {itinerary.itinerary_data && (
          <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f7fafc', borderRadius: '10px' }}>
            <h3>📋 Additional Information</h3>
            {itinerary.itinerary_data.transportation && (
              <p><strong>Transportation:</strong> {itinerary.itinerary_data.transportation}</p>
            )}
            {itinerary.itinerary_data.best_time_to_visit && (
              <p><strong>Best Time to Visit:</strong> {itinerary.itinerary_data.best_time_to_visit}</p>
            )}
            {itinerary.itinerary_data.cultural_tips && (
              <p><strong>Cultural Tips:</strong> {itinerary.itinerary_data.cultural_tips}</p>
            )}
          </div>
        )}

        {/* Adjustment Form */}
        <div className="adjustment-form">
          <h3>🔧 Want to Adjust Your Itinerary?</h3>
          <p>Tell us how you'd like to modify your trip (e.g., "make it more budget-friendly", "add more outdoor activities")</p>
          <textarea
            value={adjustmentText}
            onChange={(e) => setAdjustmentText(e.target.value)}
            placeholder="Describe how you'd like to adjust your itinerary..."
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

export default ItineraryGenerator;