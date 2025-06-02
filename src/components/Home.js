import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();

    const handleLogin = (role) => {
        navigate(`/signin/${role}`);
    };

    return (
        <Container className="text-center my-5">
            <h1>Cyber Forensic Evidence Protection System</h1>
            <h2 className="my-4">Login as:</h2>
            <div className="d-flex justify-content-center">
                <Button variant="primary" className="mx-2" onClick={() => handleLogin('admin')}>
                    Admin <FaFileAlt className="ms-2" />
                </Button>
                <Button variant="success" className="mx-2" onClick={() => handleLogin('police')}>
                    Police <FaFileAlt className="ms-2" />
                </Button>
                <Button variant="danger" className="mx-2" onClick={() => handleLogin('forensic')}>
                    Forensic Staff <FaFileAlt className="ms-2" />
                </Button>
            </div>
        </Container>
    );
}

export default Home;
