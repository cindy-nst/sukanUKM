// Components/Carousel.js
import React from 'react';
import Card from './Card';
import './Carousel.css';
import equipment from '../images/equipment.jpg';
import court from '../images/court.jpg';

const CarouselStudent = () => {
  const cards = [
    {
      title: "Book Equipment",
      image: equipment,
      to: "/manage-equipment"
    },
    {
      title: "Book Court",
      image: court,
      to: "/venues"
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

export default CarouselStudent;