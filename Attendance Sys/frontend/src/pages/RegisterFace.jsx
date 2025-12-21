import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';

const RegisterFace = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const videoRef = useRef();
    const canvasRef = useRef();
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [captureVideo, setCaptureVideo] = useState(false);
    const [faceDetected, setFaceDetected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [samplesCount, setSamplesCount] = useState(0);

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models';
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
                ]);
                setModelsLoaded(true);
            } catch (error) {
                console.error("Error loading models:", error);
                setMessage("Error loading face recognition models. Please ensure models are in public/models");
            }
        };
        loadModels();
    }, []);

    const startVideo = () => {
        setCaptureVideo(true);
        navigator.mediaDevices
            .getUserMedia({ video: { width: 300 } })
            .then((stream) => {
                let video = videoRef.current;
                video.srcObject = stream;
                video.play();
            })
            .catch((err) => {
                console.error("error:", err);
                setMessage("Error accessing camera");
            });
    };

    const handleVideoOnPlay = () => {
        setInterval(async () => {
            if (canvasRef.current && videoRef.current) {
                canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
                const displaySize = {
                    width: videoRef.current.width,
                    height: videoRef.current.height
                };
                faceapi.matchDimensions(canvasRef.current, displaySize);
                const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                canvasRef.current.getContext('2d').clearRect(0, 0, displaySize.width, displaySize.height);
                faceapi.draw.drawDetections(canvasRef.current, resizedDetections);

                if (detections.length > 0) {
                    setFaceDetected(true);
                } else {
                    setFaceDetected(false);
                }
            }
        }, 100);
    };

    const captureAndSave = async (label) => {
        if (!faceDetected) {
            setMessage("No face detected! Please position yourself in front of the camera.");
            return;
        }

        setLoading(true);
        try {
            const detections = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

            if (detections) {
                const descriptor = Array.from(detections.descriptor);

                // Send to backend
                const response = await fetch(`http://localhost:5000/api/students/${studentId}/face`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({ faceDescriptor: descriptor })
                });

                const data = await response.json();
                if (data.success) {
                    setSamplesCount(prev => prev + 1);
                    setMessage(`Face sample saved! (${label})`);
                } else {
                    setMessage(data.error || "Failed to register face");
                }
            } else {
                setMessage("Could not capture face clearly. Please try again.");
            }
        } catch (error) {
            console.error(error);
            setMessage("An error occurred");
        }
        setLoading(false);
    };

    const closeWebcam = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            setCaptureVideo(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-4 text-cyan-400">Register Face</h1>
            <p className="mb-8 text-gray-400">Capture multiple angles (Front, with Glasses, with Cap) for better accuracy.</p>

            {message && (
                <div className={`p-4 mb-4 rounded ${message.includes('saved') ? 'bg-green-600' : 'bg-red-600'}`}>
                    {message}
                </div>
            )}

            <div className="relative flex justify-center items-center bg-gray-800 rounded-lg overflow-hidden shadow-2xl border border-cyan-500/30" style={{ width: '300px', height: '225px' }}>
                {captureVideo ? (
                    <>
                        <video
                            ref={videoRef}
                            height="225"
                            width="300"
                            onPlay={handleVideoOnPlay}
                            style={{ borderRadius: '10px' }}
                        />
                        <canvas ref={canvasRef} style={{ position: 'absolute' }} />
                    </>
                ) : (
                    <div className="text-gray-400">Camera is off</div>
                )}
            </div>

            <div className="mt-8 flex flex-col items-center space-y-4">
                {!captureVideo && modelsLoaded && (
                    <button
                        onClick={startVideo}
                        className="px-6 py-2 bg-cyan-600 hover:bg-white hover:text-cyan-600 hover:border-cyan-600 hover:border-2 rounded-full font-semibold transition-all shadow-lg shadow-cyan-500/30 border-2 border-transparent"
                    >
                        Open Camera
                    </button>
                )}

                {captureVideo && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex gap-2">
                            <button
                                onClick={() => captureAndSave("Front")}
                                disabled={loading || !faceDetected}
                                className={`px-4 py-2 rounded-full font-semibold transition-all shadow-lg border-2 border-transparent ${loading || !faceDetected
                                    ? 'bg-gray-500 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-white hover:text-green-600 hover:border-green-600 shadow-green-500/30'
                                    }`}
                            >
                                Capture Front
                            </button>
                            <button
                                onClick={() => captureAndSave("With Glasses")}
                                disabled={loading || !faceDetected}
                                className={`px-4 py-2 rounded-full font-semibold transition-all shadow-lg border-2 border-transparent ${loading || !faceDetected
                                    ? 'bg-gray-500 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-white hover:text-blue-600 hover:border-blue-600 shadow-blue-500/30'
                                    }`}
                            >
                                With Glasses
                            </button>
                            <button
                                onClick={() => captureAndSave("With Cap")}
                                disabled={loading || !faceDetected}
                                className={`px-4 py-2 rounded-full font-semibold transition-all shadow-lg border-2 border-transparent ${loading || !faceDetected
                                    ? 'bg-gray-500 cursor-not-allowed'
                                    : 'bg-purple-600 hover:bg-white hover:text-purple-600 hover:border-purple-600 shadow-purple-500/30'
                                    }`}
                            >
                                With Cap
                            </button>
                        </div>

                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={closeWebcam}
                                className="px-6 py-2 bg-gray-600 hover:bg-white hover:text-gray-600 hover:border-gray-600 hover:border-2 rounded-full font-semibold transition-all border-2 border-transparent"
                            >
                                Close Camera
                            </button>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-2 bg-cyan-600 hover:bg-white hover:text-cyan-600 hover:border-cyan-600 hover:border-2 rounded-full font-semibold transition-all border-2 border-transparent"
                            >
                                Done ({samplesCount} saved)
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {!modelsLoaded && <p className="mt-4 text-yellow-400">Loading face recognition models... (Please wait)</p>}

            {/* Debug Info */}
            <div className="mt-4 p-4 bg-gray-800 rounded text-xs text-gray-400 font-mono">
                <p>Status: {modelsLoaded ? "Models Loaded" : "Loading Models..."}</p>
                <p>Camera: {captureVideo ? "Active" : "Inactive"}</p>
                <p>Face Detected: {faceDetected ? "YES" : "NO"}</p>
            </div>
        </div>
    );
};

export default RegisterFace;
