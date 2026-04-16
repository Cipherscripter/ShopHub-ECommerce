import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="page-wrapper">
      <div className="container" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: '700', marginBottom: '1rem' }}>404</h1>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
