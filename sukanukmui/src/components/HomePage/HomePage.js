import React, { useContext } from 'react';
import Hero from '../Hero';
import HeroStudent from '../HeroStudent';
import Carousel from '../Carousel';
import CarouselStudent from '../CarouselStudent';
import './HomePage.css';

// Add this to determine whether user is an Admin or Student or Staff
import { UserContext } from '../UserContext';

const StaffView = () => {
  return (
    <div className="homepage">
      <main>
        <Hero />
        <Carousel />
      </main>
    </div>
  );
};

const StudentView = () => {
  return (
    <div className="homepageStudent">
      <main>
        <HeroStudent />
        <CarouselStudent />
      </main>
    </div>
  );
};

const HomePage = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="homepage">
      <main>
        {user?.Role === 'Staff' ? <StaffView /> : <StudentView />}
      </main>
    </div>
  );
};

export default HomePage;