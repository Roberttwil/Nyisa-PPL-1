import React from "react";
import "./App.css";

const App = () => {
  return (
    <div className="container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-items">
          <button>home</button>
          <button>search</button>
          <h1 className="logo">nyisa</h1>
          <button>cart</button>
          <button>account</button>
        </div>
      </nav>

      {/* Hero Section */}
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

      {/* Footer */}
      <p className="description">
        Temukan makanan lezat dengan harga <span className="highlight">terjangkau</span> sambil
        berkontribusi menciptakan lingkungan yang lebih berkelanjutan.
      </p>

      {/* Decorative Elements */}
      <div className="decor-left"></div>
      <div className="decor-right"></div>
    </div>
  );
};

export default App;
