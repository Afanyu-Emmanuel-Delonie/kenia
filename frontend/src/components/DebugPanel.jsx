import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import api from '../api/client';
import { API_BASE } from '../utils/urls';

export function DebugPanel() {
  const { user } = useAuth();
  const { info, error } = useNotification();
  const [debugInfo, setDebugInfo] = useState({});

  const checkAuth = () => {
    const token = localStorage.getItem('kernia_token');
    const userData = localStorage.getItem('kernia_user');
    
    setDebugInfo({
      hasToken: !!token,
      tokenLength: token?.length || 0,
      hasUser: !!userData,
      contextUser: !!user,
      baseURL: api.defaults.baseURL,
    });

    info(`Token: ${token ? 'Present' : 'Missing'}, User: ${user ? 'Logged in' : 'Not logged in'}`);
  };

  const testBackend = async () => {
    try {
      // Test without auth first
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test', password: 'test' })
      });
      
      const responseText = await response.text();
      
      if (response.status === 404) {
        error('Backend server not running on port 8084');
      } else if (response.status === 400 || response.status === 401) {
        info('Backend is running - authentication endpoint accessible');
      } else {
        info(`Backend responded with status: ${response.status}`);
        if (responseText) {
          console.log('Response body:', responseText);
          info(`Response: ${responseText.substring(0, 100)}...`);
        }
      }
    } catch (err) {
      error(`Backend connection failed: ${err.message}`);
    }
  };

  const testAuthenticatedEndpoint = async () => {
    try {
      const token = localStorage.getItem('kernia_token');
      const response = await fetch(`${API_BASE}/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const responseText = await response.text();
      info(`Auth test - Status: ${response.status}`);
      
      if (responseText) {
        console.log('Auth response:', responseText);
        if (response.status >= 400) {
          error(`Auth failed: ${responseText.substring(0, 100)}`);
        }
      }
    } catch (err) {
      error(`Auth test failed: ${err.message}`);
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('kernia_token');
    localStorage.removeItem('kernia_user');
    window.location.reload();
  };

  useEffect(() => {
    checkAuth();
  }, [user]);

  return (
    <div style={{
      position: 'fixed', bottom: '1rem', right: '1rem',
      background: '#fff', border: '2px solid #B68D40',
      borderRadius: '8px', padding: '1rem', zIndex: 9999,
      fontFamily: 'monospace', fontSize: '0.75rem',
      maxWidth: '300px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <h4 style={{ margin: '0 0 0.5rem 0', color: '#B68D40' }}>Debug Panel</h4>
      
      <div style={{ marginBottom: '0.5rem' }}>
        <strong>Auth Status:</strong><br/>
        Token: {debugInfo.hasToken ? '✅' : '❌'} ({debugInfo.tokenLength} chars)<br/>
        User Data: {debugInfo.hasUser ? '✅' : '❌'}<br/>
        Context User: {debugInfo.contextUser ? '✅' : '❌'}<br/>
        Base URL: {debugInfo.baseURL}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button onClick={checkAuth} style={{
          padding: '0.25rem 0.5rem', fontSize: '0.7rem',
          background: '#B68D40', color: '#fff', border: 'none',
          borderRadius: '4px', cursor: 'pointer'
        }}>
          Check Auth
        </button>
        
        <button onClick={testBackend} style={{
          padding: '0.25rem 0.5rem', fontSize: '0.7rem',
          background: '#3b82f6', color: '#fff', border: 'none',
          borderRadius: '4px', cursor: 'pointer'
        }}>
          Test Backend
        </button>
        
        <button onClick={testAuthenticatedEndpoint} style={{
          padding: '0.25rem 0.5rem', fontSize: '0.7rem',
          background: '#8b5cf6', color: '#fff', border: 'none',
          borderRadius: '4px', cursor: 'pointer'
        }}>
          Test Auth API
        </button>
        
        <button onClick={clearAuth} style={{
          padding: '0.25rem 0.5rem', fontSize: '0.7rem',
          background: '#ef4444', color: '#fff', border: 'none',
          borderRadius: '4px', cursor: 'pointer'
        }}>
          Clear Auth
        </button>
      </div>
    </div>
  );
}
