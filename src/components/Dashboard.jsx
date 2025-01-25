import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

function Dashboard() {
    const [lectures, setLectures] = useState([]);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => {
        fetchLectures();
    }, []);

    const fetchLectures = async () => {
        try {
            const response = await axios.get('http://localhost:8000/lectures');
            setLectures(response.data);
        } catch (error) {
            console.error('Error fetching lectures', error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <span>{user?.full_name}</span>
                    <button
                        onClick={() => {
                            logout();
                            navigate('/login');
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="flex justify-end mb-4">
                <button
                    onClick={() => navigate('/add-lecture')}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Add New Lecture
                </button>
            </div>

            <div className="grid gap-4">
                {lectures.map(lecture => (
                    <div
                        key={lecture.id}
                        className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                    >
                        <div>
                            <h3 className="text-xl font-semibold">{lecture.name}</h3>
                            <p>{lecture.subject} - {new Date(lecture.date).toLocaleDateString()}</p>
                        </div>
                        <button
                            onClick={() => navigate(`/attendance/${lecture.id}`)}
                            className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                            View Attendance
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
