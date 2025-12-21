import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const AttendanceChart = () => {
    const [chartData, setChartData] = useState({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
            {
                label: 'Attendance %',
                data: [0, 0, 0, 0, 0],
                backgroundColor: '#00BAF2',
                borderRadius: 4,
            },
        ],
    });

    useEffect(() => {
        // In a real app, fetch this from /api/analytics/weekly
        // For now, we'll simulate dynamic data based on the dashboard stats
        // or just keep it static until the specific endpoint is built.
        const mockWeeklyData = [85, 88, 92, 87, 90];

        setChartData({
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [
                {
                    label: 'Attendance %',
                    data: mockWeeklyData,
                    backgroundColor: '#00BAF2',
                    borderRadius: 4,
                },
            ],
        });
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                display: false,
            },
            title: {
                display: true,
                text: 'Weekly Attendance Overview',
                align: 'start',
                font: {
                    size: 16,
                    weight: 'bold',
                },
                padding: {
                    bottom: 20,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: {
                    display: false,
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <Bar options={options} data={chartData} />
        </div>
    );
};

export default AttendanceChart;
