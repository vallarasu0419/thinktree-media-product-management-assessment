import React from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState/EmptyState';
import CustomButton from '../components/CustomButton/CustomButton';

function NotFound() {
  return (
    <div className="app-container page-section">
      <EmptyState
        icon="fa-solid fa-compass"
        title="Page not found"
        message="The page you're looking for doesn't exist or has moved."
      >
        <Link to="/">
          <CustomButton icon="fa-solid fa-house">Go home</CustomButton>
        </Link>
      </EmptyState>
    </div>
  );
}

export default NotFound;
