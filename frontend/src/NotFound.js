import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={{ textAlign: "center"}}>
      <h1>404 - Not Found</h1>
      <p>Halaman yang Anda cari tidak ditemukan.</p>
      <Link to="/" style={{ textDecoration: "none", color: "blue"}}>
        Kembali ke Beranda
      </Link>
    </div>
  );
}

export default NotFound;
