export const TIMETABLE = {
    'K23DF': {
        'Monday': [
            { time: '09:00 - 10:00', subject: 'Advanced Web Development', type: 'Lecture' },
            { time: '10:00 - 11:00', subject: 'Database Management System', type: 'Lecture' },
            { time: '11:00 - 12:00', subject: 'Lunch Break', type: 'Break' },
            { time: '12:00 - 14:00', subject: 'Web Dev Lab', type: 'Lab', subjectAlias: 'Advanced Web Development' }
        ],
        'Tuesday': [
            { time: '09:00 - 10:00', subject: 'Operating Systems', type: 'Lecture' },
            { time: '10:00 - 12:00', subject: 'OS Lab', type: 'Lab', subjectAlias: 'Operating Systems' },
            { time: '12:00 - 13:00', subject: 'Lunch Break', type: 'Break' },
            { time: '13:00 - 14:00', subject: 'Soft Skills', type: 'Lecture' }
        ],
        'Wednesday': [
            { time: '09:00 - 10:00', subject: 'Advanced Web Development', type: 'Lecture' },
            { time: '10:00 - 11:00', subject: 'Mathematics', type: 'Lecture' },
            { time: '11:00 - 12:00', subject: 'Lunch Break', type: 'Break' },
            { time: '12:00 - 13:00', subject: 'Database Management System', type: 'Lecture' }
        ],
        'Thursday': [
            { time: '09:00 - 11:00', subject: 'DBMS Lab', type: 'Lab', subjectAlias: 'Database Management System' },
            { time: '11:00 - 12:00', subject: 'Lunch Break', type: 'Break' },
            { time: '12:00 - 13:00', subject: 'Operating Systems', type: 'Lecture' }
        ],
        'Friday': [
            { time: '09:00 - 10:00', subject: 'Mathematics', type: 'Lecture' },
            { time: '10:00 - 11:00', subject: 'Soft Skills', type: 'Lecture' },
            { time: '11:00 - 13:00', subject: 'Project Work', type: 'Lab', subjectAlias: 'Advanced Web Development' }
        ]
    },
    'K23GH': {
        'Monday': [
            { time: '09:00 - 10:00', subject: 'Mathematics', type: 'Lecture' },
            { time: '10:00 - 11:00', subject: 'Operating Systems', type: 'Lecture' },
            { time: '11:00 - 12:00', subject: 'Lunch Break', type: 'Break' },
            { time: '12:00 - 14:00', subject: 'DBMS Lab', type: 'Lab', subjectAlias: 'Database Management System' }
        ],
        // ... simplified for demo
        'Tuesday': [], 'Wednesday': [], 'Thursday': [], 'Friday': []
    }
    // Add other sections as needed, fallback to default or empty
};

export const getSubjectForTime = (section, day, timeStr) => {
    // timeStr is HH:MM
    const sectionSchedule = TIMETABLE[section];
    if (!sectionSchedule) return null;

    const daySchedule = sectionSchedule[day];
    if (!daySchedule) return null;

    const [currentHour, currentMinute] = timeStr.split(':').map(Number);
    const currentTotal = currentHour * 60 + currentMinute;

    const slot = daySchedule.find(s => {
        if (s.type === 'Break') return false;
        const [start, end] = s.time.split(' - ');

        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);

        const startTotal = startH * 60 + startM;
        const endTotal = endH * 60 + endM;

        return currentTotal >= startTotal && currentTotal < endTotal;
    });

    return slot ? (slot.subjectAlias || slot.subject) : null;
};
