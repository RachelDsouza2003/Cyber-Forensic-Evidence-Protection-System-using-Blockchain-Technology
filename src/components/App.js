import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from '../components/SignIn';
import UploadEvidence from '../components/UploadEvidence'
import SplashScreen from '../components/SplashScreen';

function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate a delay to show the splash screen (e.g., 3 seconds)
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <Router>
            <Routes>
                <Route path="/" element={<SignIn />} />
                <Route path="/upload/:role" element={<UploadEvidence />} />
            </Routes>
        </Router>
    );
}

export default App;