import React from 'react';
import './SplashScreen.css'; // Import the CSS file for splash screen styling
import { Spinner } from 'react-bootstrap';
import bg from "../assets/splash.mp4"
import pic from "../assets/evi.png"
function SplashScreen() {
    return (
        <div className="splash-screen">
            {/* Background video */}
            <video autoPlay muted loop className="splash-video">
                <source src={bg} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Overlay content */}
            <div className="splash-content">
                <img src={pic} alt="Forensic Logo" className="splash-logo" />
                <h1 className="splash-title">Forensic Evidence Protection</h1>
                <p className="splash-subtitle">Secure, Reliable, and Forensically Sound</p>
                <Spinner animation="border" variant="light" className="splash-spinner" />
            </div>
        </div>
    );
}

export default SplashScreen;