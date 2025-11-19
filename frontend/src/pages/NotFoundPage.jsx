import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8f9fa',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                textAlign: 'center',
                padding: '2rem',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                maxWidth: '500px',
                width: '90%'
            }}>
                <div style={{ fontSize: '6rem', marginBottom: '1rem' }}>🔍</div>
                <h1 style={{
                    fontSize: '4rem',
                    color: '#dc3545',
                    margin: '0 0 1rem 0',
                    fontWeight: 'bold'
                }}>404</h1>
                <h2 style={{
                    color: '#333',
                    marginBottom: '1rem',
                    fontSize: '1.5rem'
                }}>Page Not Found</h2>
                <p style={{
                    color: '#666',
                    marginBottom: '2rem',
                    fontSize: '1.1rem',
                    lineHeight: '1.6'
                }}>
                    Sorry, the page you are looking for doesn't exist or has been moved.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '500'
                        }}
                    >
                        🏠 Go Home
                    </button>

                    <button
                        onClick={() => navigate(-1)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '500'
                        }}
                    >
                        ⬅️ Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}