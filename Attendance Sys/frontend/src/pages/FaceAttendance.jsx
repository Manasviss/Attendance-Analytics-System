import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

const FaceAttendance = () => {
    const videoRef = useRef();
    const canvasRef = useRef();
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [captureVideo, setCaptureVideo] = useState(false);
    const [message, setMessage] = useState('');
    const [labeledDescriptors, setLabeledDescriptors] = useState([]);
    const [recognitionActive, setRecognitionActive] = useState(false);

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
                loadLabeledImages();
            } catch (error) {
                console.error("Error loading models:", error);
                setMessage("Error loading face recognition models. Please ensure models are in public/models");
            }
        };
        loadModels();
    }, []);

    const loadLabeledImages = async () => {
        try {
            // Fetch all students with face descriptors
            const response = await fetch('http://localhost:5000/api/students', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();

            if (data.success) {
                const descriptors = [];
                for (const student of data.data) {
                    if (student.faceDescriptors && student.faceDescriptors.length > 0) {
                        descriptors.push(
                            new faceapi.LabeledFaceDescriptors(
                                student._id, // Use ID as label for easy lookup
                                student.faceDescriptors.map(d => new Float32Array(d))
                            )
                        );
                    }
                }
                setLabeledDescriptors(descriptors);
            }
        } catch (error) {
            console.error("Error loading student data:", error);
        }
    };

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
        setRecognitionActive(true);
        const interval = setInterval(async () => {
            if (canvasRef.current && videoRef.current && labeledDescriptors.length > 0) {
                canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
                const displaySize = {
                    width: videoRef.current.width,
                    height: videoRef.current.height
                };
                faceapi.matchDimensions(canvasRef.current, displaySize);

                const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceDescriptors();

                const resizedDetections = faceapi.resizeResults(detections, displaySize);
                canvasRef.current.getContext('2d').clearRect(0, 0, displaySize.width, displaySize.height);
                faceapi.draw.drawDetections(canvasRef.current, resizedDetections);

                const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);

                const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));

                results.forEach(async (result, i) => {
                    const box = resizedDetections[i].detection.box;
                    const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() });
                    drawBox.draw(canvasRef.current);

                    if (result.label !== 'unknown') {
                        // Mark attendance
                        await markAttendance(result.label);
                    }
                });
            }
        }, 1000); // Check every second to avoid flooding
        return () => clearInterval(interval);
    };

    const markAttendance = async (studentId) => {
        try {
            const response = await fetch('http://localhost:5000/api/attendance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    studentId,
                    status: 'present',
                    date: new Date()
                })
            });
            const data = await response.json();
            if (data.success) {
                setMessage(`Attendance marked for student ID: ${studentId}`);
                // Optional: Stop scanning for this student or show success visual
            } else if (data.error && data.error.includes('already marked')) {
                // Ignore if already marked
            } else {
                console.error("Attendance error:", data.error);
            }
        } catch (error) {
            console.error("Error marking attendance:", error);
        }
    };

    const closeWebcam = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            setCaptureVideo(false);
            setRecognitionActive(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold mb-8 text-cyan-400">Face Attendance</h1>

            {message && (
                <div className="p-4 mb-4 bg-blue-600 rounded">
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

            <div className="mt-8 space-x-4">
                {!captureVideo && modelsLoaded && (
                    <button
                        onClick={startVideo}
                        className="px-6 py-2 bg-cyan-600 hover:bg-white hover:text-cyan-600 hover:border-cyan-600 hover:border-2 rounded-full font-semibold transition-all shadow-lg shadow-cyan-500/30 border-2 border-transparent"
                    >
                        Start Scanning
                    </button>
                )}

                {captureVideo && (
                    <button
                        onClick={closeWebcam}
                        className="px-6 py-2 bg-gray-600 hover:bg-white hover:text-gray-600 hover:border-gray-600 hover:border-2 rounded-full font-semibold transition-all border-2 border-transparent"
                    >
                        Stop Scanning
                    </button>
                )}
            </div>

            {!modelsLoaded && <p className="mt-4 text-yellow-400">Loading face recognition models...</p>}
            {modelsLoaded && labeledDescriptors.length === 0 && <p className="mt-4 text-red-400">No students registered with face data.</p>}
        </div>
    );
};

export default FaceAttendance;
