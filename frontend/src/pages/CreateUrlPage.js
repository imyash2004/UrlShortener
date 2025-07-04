import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import urlService from '../services/urlService';
import { AuthContext } from '../context/AuthContext';

const CreateUrlPage = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Assuming the user has at least one organization and we use the first one
      // A better approach would be to let the user select an organization
      const organizationId = user.organizations[0].id;
      await urlService.createUrl(organizationId, { originalUrl });
      navigate('/my-urls');
    } catch (err) {
      setError('Failed to create short URL. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(33, 150, 243, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 90%, rgba(156, 39, 176, 0.1) 0%, transparent 50%)
        `,
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '500px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '2.5rem',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          fontSize: '2rem',
          color: 'white',
          fontWeight: '700',
          textAlign: 'center',
          marginBottom: '2rem',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
        }}>Create a New Short URL</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="originalUrl" style={{
              display: 'block',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '0.5rem',
              fontSize: '1rem'
            }}>Original URL</label>
            <input
              type="url"
              id="originalUrl"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.15)',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.3s ease'
              }}
            />
          </div>
          {error && <p style={{ color: '#ff4757', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{
            display: 'block',
            width: '100%',
            padding: '1rem',
            border: 'none',
            borderRadius: '15px',
            background: loading ? 'grey' : 'linear-gradient(45deg, #4ecdc4, #44a08d)',
            color: 'white',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease'
          }}>
            {loading ? 'Creating...' : 'Create Short URL'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUrlPage;
