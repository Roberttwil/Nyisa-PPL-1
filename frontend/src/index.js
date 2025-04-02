import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
import Login from './Login';
import Register from './Register';
import Forgot from './Forgot';
import OTP from './OTP';
import VerifOTP from './Verif-OTP';
import RequireAuth from './RequireAuth';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/verif-otp" element={
          <RequireAuth>
            <VerifOTP />
          </RequireAuth>
        } />
        <Route path="/" element={
          <RequireAuth>
            <App />
          </RequireAuth>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
