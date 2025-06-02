import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebaseconfig';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import { Button, Container, Form, Modal, Card } from 'react-bootstrap';
import { FaUpload, FaCheckCircle } from 'react-icons/fa';
import Web3 from 'web3';
import { useParams, useNavigate } from 'react-router-dom';
import EvidenceChain from '../absi/EvidenceChain.json';
import { ThirdwebStorage } from '@thirdweb-dev/storage';
import './UploadEvidence.css';
import bg from "../assets/bg2.mp4";

const storage = new ThirdwebStorage({
    clientId: 'ca7a1235af205629113bde8bc1052466',
    secretKey: 'L3bnpo8jJXOqMgFiuUD4lj5GQKCYepKrZujsV2ZfM6ScBzdhe312ly9_V89-GL42Pq004AJRFLJ4RrdvHaHOlQ',
});

function UploadEvidence() {
    const { role } = useParams();
    const [user] = useAuthState(auth);
    const navigate = useNavigate();
    const [account, setAccount] = useState('');
    const [file, setFile] = useState(null);
    const [cid, setCid] = useState('');
    const [verificationCid, setVerificationCid] = useState('');
    const [evidenceContract, setEvidenceContract] = useState(null);
    const [showModal, setShowModal] = useState({ visible: false, title: '', message: '' });
    const [chainOfCustody, setChainOfCustody] = useState([]);

    useEffect(() => {
        if (cid) {
            fetchChainOfCustody();
        }
    }, [cid]);

    useEffect(() => {
        if (!user) {
            navigate('/');
        } else {
            loadWeb3();
            loadBlockchainData();
            fetchChainOfCustody();
        }
    }, [user, navigate, cid]);

    const loadWeb3 = async () => {
        if (window.ethereum) {
            try {
                window.web3 = new Web3(window.ethereum);
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
            } catch (error) {
                console.error('Error connecting to MetaMask:', error);
            }
        } else {
            alert('Non-Ethereum browser detected. Please install MetaMask!');
        }
    };

    const loadBlockchainData = async () => {
        try {
            const web3 = window.web3;
            const networkId = await web3.eth.net.getId();
            const networkData = EvidenceChain.networks[networkId];

            if (networkData) {
                const contract = new web3.eth.Contract(EvidenceChain.abi, networkData.address);
                setEvidenceContract(contract);
            } else {
                alert('Smart contract not deployed to the detected network.');
            }
        } catch (error) {
            console.error('Error loading blockchain data:', error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const addChainOfCustodyLog = async (action, cid) => {
        try {
            console.log("Adding chain of custody log:", { action, cid, user: user.email, role });
            await addDoc(collection(db, "chainOfCustody"), {
                user: user.email,
                role: role,
                action: action,
                cid: cid,
                timestamp: Date.now(), // Using Date.now() for the current timestamp in milliseconds
            });
            console.log("Log added successfully");
        } catch (error) {
            console.error('Error adding chain of custody log:', error);
        }
    };

    const fetchChainOfCustody = async () => {
        if (!cid) {
            console.log('No CID provided, skipping fetch.');
            return;
        }

        console.log('Fetching chain of custody logs for CID:', cid);

        try {
            const q = query(collection(db, "chainOfCustody"), where("cid", "==", cid));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.log('No logs found for this CID.');
            }

            const logs = [];
            querySnapshot.forEach((doc) => {
                logs.push(doc.data());
            });

            console.log("Fetched logs:", logs);
            setChainOfCustody(logs);
        } catch (error) {
            console.error('Error fetching chain of custody:', error);
        }
    };

    const uploadEvidence = async () => {
        if (!file) {
            setShowModal({
                visible: true,
                title: 'Upload Failed',
                message: 'Please select a file to upload.',
            });
            return;
        }

        if (!evidenceContract) {
            setShowModal({
                visible: true,
                title: 'Upload Failed',
                message: 'Smart contract is not loaded. Please ensure it is connected.',
            });
            return;
        }

        try {
            const uploadResult = await storage.upload(file);
            const uploadedCid = uploadResult.replace('ipfs://', '').split('/')[0];
            setCid(uploadedCid);
            await evidenceContract.methods.uploadEvidence(uploadedCid).send({ from: account, gas: 500000 });

            setShowModal({
                visible: true,
                title: 'Upload Successful',
                message: `Evidence uploaded successfully! CID: ${uploadedCid}`,
            });
            await addChainOfCustodyLog('Uploaded', uploadedCid);
            fetchChainOfCustody();
        } catch (error) {
            console.error('Error uploading evidence:', error);
            setShowModal({
                visible: true,
                title: 'Upload Failed',
                message: 'There was an error uploading the evidence.',
            });
        }
    };

    const verifyEvidence = async () => {
        if (!evidenceContract || !verificationCid) {
            setShowModal({
                visible: true,
                title: 'Verification Failed',
                message: 'Smart contract not loaded or CID not provided.',
            });
            return;
        }

        try {
            const storedCid = await evidenceContract.methods.getEvidence().call();
            if (storedCid === verificationCid) {
                setShowModal({
                    visible: true,
                    title: 'Verification Successful',
                    message: `Evidence is NOT Altered! CID: ${verificationCid}`,
                });

                await addChainOfCustodyLog('Verified', verificationCid);
            } else {
                setShowModal({
                    visible: true,
                    title: 'Verification Failed',
                    message: 'Evidence has been altered!',
                });
            }
        } catch (error) {
            console.error('Error verifying evidence:', error);
            setShowModal({
                visible: true,
                title: 'Verification Failed',
                message: 'Error verifying the evidence.',
            });
        }
    };

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="upload-evidence-container">
            <video autoPlay muted loop className="background-video">
                <source src={bg} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <Container className="content-container">
                <Card className="p-4 mb-4 bg-light">
                    <h2>Logged in as: {user ? user.email : 'Guest'}</h2>
                    <h3>Role: {role.charAt(0).toUpperCase() + role.slice(1)}</h3>
                    <h4>Account: {account}</h4>
                    <h5>CID: {cid ? cid : "Not generated yet"}</h5>

                    <Button variant="danger" className="mb-3" onClick={handleSignOut}>
                        Sign Out
                    </Button>

                    <Form.Group controlId="formFile" className="mt-3">
                        <Form.Label>Select evidence file to upload</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} />
                    </Form.Group>
                    <Button variant="primary" className="mt-3" onClick={uploadEvidence}>
                        <FaUpload /> Upload Evidence
                    </Button>

                    <Form.Group controlId="formVerificationCid" className="mt-4">
                        <Form.Label>Enter CID for Verification</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter CID to verify"
                            value={verificationCid}
                            onChange={(e) => setVerificationCid(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="success" className="mt-3" onClick={verifyEvidence}>
                        <FaCheckCircle /> Verify Evidence
                    </Button>

                    <h4 className="mt-4">Chain of Custody:</h4>
                    {chainOfCustody.length > 0 ? (
                        <ul className="list-group">
                            {chainOfCustody.map((log, index) => (
                                <li key={index} className="list-group-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>Action:</strong> {log.action === 'Uploaded' ? <FaUpload className="text-success" /> : <FaCheckCircle className="text-info" />} {log.action}
                                        </div>
                                        <div>
                                            <strong>User:</strong> {log.user}
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                        <div>
                                            <strong>Role:</strong> {log.role}
                                        </div>
                                        <div>
                                            <strong>CID:</strong> {log.cid}
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <strong>Time:</strong> {log.timestamp}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="alert alert-warning" role="alert">
                            No actions recorded for this evidence.
                        </div>
                    )}
                </Card>

                <Modal show={showModal.visible} onHide={() => setShowModal({ ...showModal, visible: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>{showModal.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{showModal.message}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal({ ...showModal, visible: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
}

export default UploadEvidence;