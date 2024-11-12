// Components/Carousel.js
import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import './Carousel.css';
import equipment from '../images/equipment.jpg';
import court from '../images/court.jpg';
import report from '../images/report.jpg';

const Carousel = () => {
  const cards = [
    {
      title: "Manage Equipment",
      image: equipment,
      to: "/manage-equipment"
    },
    {
      title: "Manage Court",
      image: court,
      to: "/venues"
    },
    {
      title: "View Booking Report",
      image: report,
      to: "/booking-report"
    }
  ];

  return (
    <div className="carousel-container">
      <button className="carousel-arrow left">&lt;</button>
      <div className="carousel-cards">
        {cards.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            image={card.image}
            to={card.to}
          />
        ))}
      </div>
      <button className="carousel-arrow right">&gt;</button>
    </div>
  );
};

export default Carousel;