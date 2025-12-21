# Face Scanning Attendance System Walkthrough

This guide explains how to set up and test the new face scanning attendance system.

## Prerequisites

> [!IMPORTANT]
> You **MUST** download the `face-api.js` models for the system to work.

1.  Download the models from: [face-api.js models](https://github.com/justadudewhohacks/face-api.js/tree/master/weights)
    -   You need the following files:
        -   `tiny_face_detector_model-weights_manifest.json`
        -   `tiny_face_detector_model-shard1`
        -   `face_landmark_68_model-weights_manifest.json`
        -   `face_landmark_68_model-shard1`
        -   `face_recognition_model-weights_manifest.json`
        -   `face_recognition_model-shard1`
        -   `face_recognition_model-shard2`
        -   `ssd_mobilenetv1_model-weights_manifest.json`
        -   `ssd_mobilenetv1_model-shard1`
        -   `ssd_mobilenetv1_model-shard2`
2.  Create a folder named `models` inside `frontend/public`.
3.  Place all downloaded files into `frontend/public/models`.

## How to Test

### 1. Register a Face
1.  Log in to the application.
2.  Navigate to the **Students** page.
3.  (Note: You might need to add a link or button to access the registration page manually for now, or use the URL directly: `/register-face/<student_id>`).
4.  Allow camera access when prompted.
5.  Position your face in the camera view.
6.  Click **Capture & Save**.
7.  Wait for the success message.

### 2. Mark Attendance (Face Scan)
1.  Navigate to `/face-attendance`.
2.  Allow camera access.
3.  The system will automatically detect faces.
4.  If your face is recognized, it will mark your attendance and show a success message.

### 3. Phone Demo
1.  Find your computer's local IP address (e.g., `192.168.1.x`).
2.  Connect your phone to the same Wi-Fi network.
3.  Open your phone's browser and go to `http://<your-pc-ip>:5173/face-attendance`.
4.  Allow camera access on your phone.
5.  Point the phone camera at your face to mark attendance.

## Troubleshooting
-   **Models not loading**: Check the browser console for errors. Ensure files are in `public/models`.
-   **Camera not working**: Ensure you have granted camera permissions.
-   **Face not recognized**: Try better lighting or register your face again.
