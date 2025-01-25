import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Attendance() {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const { lectureId } = useParams();

    useEffect(() => {
        fetchAttendance();
    }, [lectureId]);

    const fetchAttendance = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/attendance/${lectureId}`);
            setAttendanceRecords(response.data);
        } catch (error) {
            console.error('Error fetching attendance', error);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Attendance Records</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left">Student ID</th>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Scan Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceRecords.map((record, index) => (
                            <tr key={index} className="border-b">
                                <td className="px-4 py-2">{record.student_id}</td>
                                <td className="px-4 py-2">{record.student_name}</td>
                                <td className="px-4 py-2">
                                    {new Date(record.scan_time).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Attendance;
