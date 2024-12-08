// Components/Carousel.js
import React from 'react';
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
      to: "/sportequipment"
    },
    {
      title: "Manage Court",
      image: court,
      to: "/venues"
    },
    {
      title: "View Booking Report",
      image: report,
      to: "/report"
    }
  ];

  return (
    <div className="carousel-container">
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
    </div>
  );
};

export default Carousel;