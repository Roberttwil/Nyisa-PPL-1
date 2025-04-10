import React from 'react';
import "./Home.css";

const Home = () => {
  return (
    <div>
      <div className="container">
        <div className="hero-section">
          <div className="text-left">
            <p>LETS</p>
            <p>SAVING</p>
            <p>LETS</p>
            <p>SAVING</p>
            <p>LETS</p>
          </div>
          <div className="images">
            <img src="/images/croissant.png" alt="Croissant" className="croissant" />
          </div>
          <div className="text-right">
            <p>START</p>
            <p>FOOD</p>
            <p>START</p>
            <p>FOOD</p>
            <p>START</p>
          </div>
        </div>

        <p className="description">
          Temukan makanan lezat dengan harga <span className="highlight-text">terjangkau</span> sambil
          berkontribusi menciptakan lingkungan yang lebih berkelanjutan.
        </p>
      </div>
    </div>
  );
};

export default Home;
