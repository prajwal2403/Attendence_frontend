import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddLecture() {
    const [lectureName, setLectureName] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [subject, setSubject] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [socket, setSocket] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            if (socket) socket.close(); // Clean up the WebSocket connection
        };
    }, [socket]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:8000/add_lecture',
                {
                    name: lectureName,
                    date,
                    time,
                    subject,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const lectureId = response.data.lecture_id;

            // Establish a WebSocket connection
            const newSocket = new WebSocket(`ws://localhost:8000/ws/${lectureId}`);
            setSocket(newSocket);

            newSocket.onopen = () => {
                console.log('WebSocket connection established');
            };

            newSocket.onmessage = (event) => {
                const qrCode = event.data; // Use the Base64-encoded image directly
                setQrCode(qrCode); // Update the QR code state
            };

            newSocket.onclose = () => {
                console.log('WebSocket connection closed');
            };

            newSocket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        } catch (error) {
            console.error('Error adding lecture', error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Add New Lecture</h1>
            <div className="grid md:grid-cols-2 gap-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Lecture Name"
                        value={lectureName}
                        onChange={(e) => setLectureName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                    >
                        Generate QR Code
                    </button>
                </form>

                {qrCode && (
                    <div className="flex flex-col items-center justify-center">
                        <h2 className="text-2xl font-semibold mb-4">Lecture QR Code</h2>
                        <img
                            src={`data:image/png;base64,${qrCode}`}
                            alt="Lecture QR Code"
                            className="max-w-full h-auto"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddLecture;