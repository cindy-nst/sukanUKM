// HomePage.js
import React from 'react';
import { useContext } from 'react';
import Hero from '../Hero';
import HeroStudent from '../HeroStudent';
import Carousel from '../Carousel';
import CarouselStudent from '../CarouselStudent';
//import Layout from '../Layout';
import './HomePage.css';

// Add this to determine whether user is an Admin or Student 
import { UserContext } from '../UserContext';

const AdminView = () => {
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
              <CarouselStudent/>
            </main>
          </div>
        );
  };

  const HomePage = () => {
    const { user } = useContext(UserContext);
  
    return (
        <div className="homepage">
          <main>
            {user?.role === 'admin' ? <AdminView /> : <StudentView />}
          </main>
        </div>
    );
  };
  
  export default HomePage;





