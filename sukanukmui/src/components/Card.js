// Components/Card.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Card.css';

// Card.js
const Card = ({ image, title, to }) => {
    return (
      <Link to={to} className="card">
        <div className="card-image">
          <img src={image} alt={title} />
        </div>
        <h3>{title}</h3>
      </Link>
    );
  };

export default Card;