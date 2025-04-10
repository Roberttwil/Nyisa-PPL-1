import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404 - Not Found</h1>
      <p className="not-found-text">Halaman yang Anda cari tidak ditemukan.</p>
      <Link to="/" className="not-found-link">
        Kembali ke Beranda
      </Link>
    </div>
  );
}

export default NotFound;
