import React from 'react';

function About() {
  return (
    <div className="about-page">
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#667eea' }}>
            ✈️ AI Travel Itinerary Generator
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#718096' }}>
            Your intelligent travel companion powered by Google Gemini AI
          </p>
          <div style={{ 
            display: 'inline-block', 
            background: '#667eea', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            borderRadius: '20px',
            fontSize: '0.875rem',
            marginTop: '1rem'
          }}>
            Version 1.0
          </div>
        </div>

        <div className="features-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          <div className="feature-card">
            <h3>🤖 AI-Powered Planning</h3>
            <p>
              Harness the power of Google's Gemini AI to create personalized travel itineraries 
              tailored to your interests, budget, and preferences. Get intelligent recommendations 
              for activities, restaurants, and cultural experiences.
            </p>
          </div>

          <div className="feature-card">
            <h3>🎯 Personalized Experiences</h3>
            <p>
              Select from 16 different interest categories including culture, food, nature, 
              adventure, and more. Our AI creates detailed daily plans that match your 
              travel style and preferences.
            </p>
          </div>

          <div className="feature-card">
            <h3>💾 Trip Management</h3>
            <p>
              Save your generated itineraries, view all your planned trips in one place, 
              and easily manage your travel plans. Edit details, delete old trips, 
              and keep everything organized.
            </p>
          </div>

          <div className="feature-card">
            <h3>🔧 Smart Adjustments</h3>
            <p>
              Need to make changes? Use natural language to adjust your itinerary. 
              Say "make it more budget-friendly" or "add more outdoor activities" 
              and watch AI modify your plans instantly.
            </p>
          </div>

          <div className="feature-card">
            <h3>📱 Responsive Design</h3>
            <p>
              Access your travel plans anywhere, anytime. Our responsive design works 
              seamlessly on desktop, tablet, and mobile devices, ensuring you have 
              your itinerary when you need it.
            </p>
          </div>

          <div className="feature-card">
            <h3>🌍 Global Destinations</h3>
            <p>
              Plan trips to any destination worldwide. From bustling cities to remote 
              villages, our AI provides relevant local insights, cultural tips, 
              and practical travel information.
            </p>
          </div>
        </div>

        <div style={{ 
          background: '#f7fafc', 
          padding: '2rem', 
          borderRadius: '15px',
          marginBottom: '3rem'
        }}>
          <h2 style={{ color: '#4a5568', marginBottom: '1.5rem', textAlign: 'center' }}>
            How It Works
          </h2>
          
          <div className="steps-container" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem'
          }}>
            <div className="step-item" style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: '#667eea', 
                color: 'white', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '1.5rem',
                margin: '0 auto 1rem'
              }}>
                1
              </div>
              <h3 style={{ color: '#4a5568', marginBottom: '0.5rem' }}>Choose Destination</h3>
              <p style={{ color: '#718096', fontSize: '0.875rem' }}>
                Enter your dream destination and select your travel dates
              </p>
            </div>

            <div className="step-item" style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: '#667eea', 
                color: 'white', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '1.5rem',
                margin: '0 auto 1rem'
              }}>
                2
              </div>
              <h3 style={{ color: '#4a5568', marginBottom: '0.5rem' }}>Select Interests</h3>
              <p style={{ color: '#718096', fontSize: '0.875rem' }}>
                Pick your interests from our curated list to personalize your experience
              </p>
            </div>

            <div className="step-item" style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: '#667eea', 
                color: 'white', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '1.5rem',
                margin: '0 auto 1rem'
              }}>
                3
              </div>
              <h3 style={{ color: '#4a5568', marginBottom: '0.5rem' }}>Generate Itinerary</h3>
              <p style={{ color: '#718096', fontSize: '0.875rem' }}>
                Our AI creates a detailed, day-by-day itinerary tailored just for you
              </p>
            </div>

            <div className="step-item" style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                background: '#667eea', 
                color: 'white', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '1.5rem',
                margin: '0 auto 1rem'
              }}>
                4
              </div>
              <h3 style={{ color: '#4a5568', marginBottom: '0.5rem' }}>Customize & Save</h3>
              <p style={{ color: '#718096', fontSize: '0.875rem' }}>
                Make adjustments using AI and save your perfect itinerary
              </p>
            </div>
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white',
          padding: '2rem', 
          borderRadius: '15px',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Built with Modern Technology</h2>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: '2rem',
            marginTop: '1.5rem'
          }}>
            <div>
              <strong>Frontend:</strong> React 18 + React Router
            </div>
            <div>
              <strong>Backend:</strong> FastAPI + Python 3.11
            </div>
            <div>
              <strong>AI:</strong> Google Gemini AI
            </div>
            <div>
              <strong>Database:</strong> PostgreSQL
            </div>
            <div>
              <strong>Deployment:</strong> Docker + Docker Compose
            </div>
          </div>
        </div>

        <div className="faq-section">
          <h2 style={{ color: '#4a5568', marginBottom: '2rem', textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          
          <div className="faq-grid" style={{ 
            display: 'grid', 
            gap: '1.5rem'
          }}>
            <div className="faq-item" style={{ 
              background: '#f7fafc', 
              padding: '1.5rem', 
              borderRadius: '10px'
            }}>
              <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>
                How accurate are the AI-generated itineraries?
              </h3>
              <p style={{ color: '#718096', lineHeight: '1.6' }}>
                Our AI uses Google's advanced Gemini model trained on vast amounts of travel data. 
                While recommendations are highly relevant and well-researched, we always recommend 
                verifying current information like opening hours, prices, and availability before your trip.
              </p>
            </div>

            <div className="faq-item" style={{ 
              background: '#f7fafc', 
              padding: '1.5rem', 
              borderRadius: '10px'
            }}>
              <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>
                Can I modify the generated itinerary?
              </h3>
              <p style={{ color: '#718096', lineHeight: '1.6' }}>
                Absolutely! Use our smart adjustment feature to modify your itinerary with natural language. 
                Just describe what you want to change, like "make it more budget-friendly" or "add more museums," 
                and our AI will update your plans accordingly.
              </p>
            </div>

            <div className="faq-item" style={{ 
              background: '#f7fafc', 
              padding: '1.5rem', 
              borderRadius: '10px'
            }}>
              <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>
                Is my travel data saved securely?
              </h3>
              <p style={{ color: '#718096', lineHeight: '1.6' }}>
                Yes, all your itineraries are stored securely in our PostgreSQL database. 
                We don't store any personal information beyond your travel preferences and 
                generated itineraries. Your data is never shared with third parties.
              </p>
            </div>

            <div className="faq-item" style={{ 
              background: '#f7fafc', 
              padding: '1.5rem', 
              borderRadius: '10px'
            }}>
              <h3 style={{ color: '#667eea', marginBottom: '0.5rem' }}>
                Does this work for any destination worldwide?
              </h3>
              <p style={{ color: '#718096', lineHeight: '1.6' }}>
                Yes! Our AI can generate itineraries for destinations anywhere in the world. 
                From major cities to remote locations, the AI provides relevant local insights, 
                cultural tips, and practical travel information based on your chosen destination.
              </p>
            </div>
          </div>
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '3rem', 
          padding: '2rem',
          background: '#f7fafc',
          borderRadius: '15px'
        }}>
          <h2 style={{ color: '#4a5568', marginBottom: '1rem' }}>Ready to Start Planning?</h2>
          <p style={{ color: '#718096', marginBottom: '2rem' }}>
            Create your first AI-powered travel itinerary in minutes!
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/" className="btn btn-primary">
              Generate Itinerary ✈️
            </a>
            <a href="/saved" className="btn btn-secondary">
              View Saved Trips 📚
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
