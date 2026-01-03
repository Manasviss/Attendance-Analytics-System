import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { API_BASE_URL } from '../config';
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
        labels: [],
        datasets: [
            {
                label: 'Attendance %',
                data: [],
                backgroundColor: '#00BAF2',
                borderRadius: 4,
            },
        ],
    });

    useEffect(() => {
        const fetchWeeklyStats = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch(`${API_BASE_URL}/api/analytics/weekly`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await response.json();

                if (result.success) {
                    const labels = result.data.map(item => item.day);
                    const data = result.data.map(item => item.percentage);

                    setChartData({
                        labels,
                        datasets: [
                            {
                                label: 'Attendance %',
                                data,
                                backgroundColor: '#00BAF2',
                                borderRadius: 4,
                            },
                        ],
                    });
                }
            } catch (err) {
                console.error('Failed to fetch weekly stats:', err);
            }
        };

        fetchWeeklyStats();
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
