import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from '../firebaseconfig';
import { Form, Button, Alert } from 'react-bootstrap';
import './Signin.css'; // Import the CSS file for styling
import bg from "../assets/bg1.mp4"

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('police');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate(`/upload/${role}`);
        } catch (error) {
            console.error('Error:', error.message || error);
            setError(error.message || 'An error occurred.');
        }
    };

    return (
        <div className="signin-container">
            {/* Video background */}
            <video autoPlay muted loop className="video-background">
                <source src={bg} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Sign-in form */}
            <div className="signin-content">
                <h2>Sign In</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSignIn}>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Select Role</Form.Label>
                        <Form.Control
                            as="select"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="police">Police</option>
                            <option value="forensics">Forensics</option>
                            <option value="admin">Admin</option>
                        </Form.Control>
                    </Form.Group>
                    <Button type="submit" variant="primary" className="mt-3">
                        Sign In
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default SignIn;