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
      to: "/book-equipment"
    },
    {
      title: "Book Court",
      image: court,
      to: "/book-court"
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

export default CarouselStudent;