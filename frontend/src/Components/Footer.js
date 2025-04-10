import React from "react";
import { Twitter, Linkedin, Youtube, Facebook } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer-wrapper">
      {/* Bagian atas footer */}
      <div className="footer-top">
        <div className="footer-logo-container">
          <img src="/images/logo-nyisa.png" alt="Logo" />
        </div>
        <div className="footer-icons">
          <Twitter />
          <Linkedin />
          <Youtube />
          <Facebook />
        </div>
      </div>

      {/* Bagian tengah footer */}
      <div className="footer-middle">
        <div className="footer-columns">
          <span>Robert</span>
          <span>William</span>
          <span>Hendra</span>
          <span>Tjuju</span>
        </div>
        <div className="footer-columns">
          <span>0815-8502-9676</span>
          <span>robert@gmail.com</span>
          <span>william@gmail.com</span>
          <span>tjutju@gmail.com</span>
        </div>
      </div>

      {/* Bagian bawah footer */}
      <div className="footer-bottom">
        <span className="footer-copy">© 2025 Nyisa</span>
        <div className="footer-bottom-content">
          <span>Terms & Conditions</span>
          <span>Privacy Policy</span>
          <span>Being Nyisa Partner</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;