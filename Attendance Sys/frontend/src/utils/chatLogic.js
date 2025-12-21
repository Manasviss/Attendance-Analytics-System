/**
 * Professional rule-based chat logic for the Attendance System AI Assistant.
 * Processes user messages with flexible keyword matching and clear, direct responses.
 */

export const processMessage = (message) => {
    const lowerMsg = message.toLowerCase().trim();

    // 0. Handle very short/unclear inputs
    if (lowerMsg.length < 2) {
        return "Could you please provide more details? I can help with attendance, leaves, and reports.";
    }

    // 1. Greetings & Social (Professional)
    if (lowerMsg.match(/^(hi|hello|hey|he\b|greetings|good morning|good afternoon)/)) {
        return "Hello. I am the Attendance System Assistant. How can I assist you today?";
    }
    if (lowerMsg.match(/(thank|thanks|appreciate)/)) {
        return "You're welcome.";
    }
    if (lowerMsg.match(/(bye|goodbye)/)) {
        return "Goodbye.";
    }

    // 2. Navigation & Core Features

    // Dashboard
    if (lowerMsg.includes('dashboard') || lowerMsg.includes('home')) {
        return "The Dashboard is your main hub. Click the top icon in the sidebar to view daily stats and quick actions.";
    }

    // Profile
    if (lowerMsg.includes('profile') || lowerMsg.includes('account') || lowerMsg.includes('settings')) {
        return "You can view and update your personal information on the Profile page.";
    }

    // 3. Specific Actions

    // Attendance - Marking (Improved matching)
    // Matches: "mark attendance", "marking attendance", "how to mark", "attendance marking"
    if ((lowerMsg.includes('mark') || lowerMsg.includes('take') || lowerMsg.includes('input')) && lowerMsg.includes('attendance')) {
        return "To mark attendance:\n1. Navigate to the Dashboard or Attendance page.\n2. Select the class and subject.\n3. Mark each student as Present or Absent.";
    }

    // Attendance - Viewing/Reports
    if ((lowerMsg.includes('view') || lowerMsg.includes('check') || lowerMsg.includes('show') || lowerMsg.includes('my')) && lowerMsg.includes('attendance')) {
        return "You can view detailed attendance records in the Reports section.";
    }
    if (lowerMsg.includes('report') || lowerMsg.includes('stats')) {
        return "The Reports section provides detailed statistics and downloadable attendance summaries.";
    }

    // Leaves
    if (lowerMsg.includes('leave') || lowerMsg.includes('sick') || lowerMsg.includes('vacation')) {
        if (lowerMsg.includes('apply') || lowerMsg.includes('request') || lowerMsg.includes('new')) {
            return "To apply for leave, go to the Leave Application page and submit a new request with your dates and reason.";
        }
        return "You can manage and view the status of your leave requests on the Leave Application page.";
    }

    // Students
    if (lowerMsg.includes('student') || lowerMsg.includes('class list')) {
        if (lowerMsg.includes('add') || lowerMsg.includes('create')) {
            return "To add a student, go to the Students page and click the 'Add Student' button.";
        }
        return "The Students page lists all registered students and allows you to manage their profiles.";
    }

    // Face Attendance
    if (lowerMsg.includes('face') || lowerMsg.includes('camera') || lowerMsg.includes('biometric')) {
        return "The Face Attendance feature allows for automated attendance using the camera. Ensure student faces are registered first.";
    }

    // Help / Support
    if (lowerMsg.includes('help') || lowerMsg.includes('support') || lowerMsg.includes('contact')) {
        return "For technical issues, please use the 'Email Support' button to contact an administrator directly.";
    }

    // 4. Fallback (Direct and helpful)
    return "I can assist with:\n- Marking Attendance\n- Leave Applications\n- Viewing Reports\n- Managing Students\n\nPlease specify what you need help with.";
};
