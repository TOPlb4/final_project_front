"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Booking() {
    const [rooms, setRooms] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentBookingId, setCurrentBookingId] = useState(null);
    const [bookingData, setBookingData] = useState({
        customer_name: "",
        customer_phone: "",
        room_id: "",
        check_in_date: "",
        check_out_date: "",
        total_price_: "",
    });

    const fetchBooking = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/booking", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("auth"),
                },
            });
            setBookings(res.data.data);
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
                timer: 1000,
            });
        }
    };

    const fetchRooms = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/rooms", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("auth"),
                },
            });
            setRooms(res.data.data); // เก็บ rooms ไว้ใน state
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
                timer: 1000,
            });
        }
    };

    const handleSaveBooking = async () => {
        try {
            if (editMode) {
                // Update Booking
                await axios.post(
                    `http://localhost:4000/api/booking/${currentBookingId}`,
                    {
                        customer_name: bookingData.customer_name,
                        customer_phone: bookingData.customer_phone,
                        room_id: bookingData.room_id,
                        total_price_: bookingData.total_price_,
                        check_in_date: new Date(bookingData.check_in_date).toISOString(), // แปลงเป็น ISO
                        check_out_date: new Date(bookingData.check_out_date).toISOString(), // แปลงเป็น ISO
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("auth"),
                        },
                    }
                );
                Swal.fire({
                    title: "Updated",
                    text: "อัปเดตข้อมูลการจองสำเร็จ",
                    icon: "success",
                    timer: 1000,
                });
            } else {
                // Create Booking
                await axios.post("http://localhost:4000/api/booking", 
                    {
                        customer_name: bookingData.customer_name,
                        customer_phone: bookingData.customer_phone,
                        room_id: bookingData.room_id,
                        total_price_: bookingData.total_price_,
                        check_in_date: new Date(bookingData.check_in_date).toISOString(), // แปลงเป็น ISO
                        check_out_date: new Date(bookingData.check_out_date).toISOString(), // แปลงเป็น ISO
                    },
                    {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("auth"),
                        },
                    }
                );
                Swal.fire({
                    title: "Created",
                    text: "เพิ่มการจองสำเร็จ",
                    icon: "success",
                    timer: 1000,
                });
            }
            setIsModalOpen(false);
            fetchBooking();
            setBookingData({
                customer_name: "",
                customer_phone: "",
                room_id: "",
                check_in_date: "",
                check_out_date: "",
                total_price_: "",
            });
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
                timer: 1000,
            });
        }
    };

    const handleDeleteBooking = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/booking/${id}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("auth"),
                },
            });
            Swal.fire({
                title: "Deleted",
                text: "ลบการจองสำเร็จ",
                icon: "success",
                timer: 1000,
            });
            fetchBooking();
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
                timer: 1000,
            });
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.post(
                `http://localhost:4000/api/booking/${id}`,
                { status },
                {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("auth"),
                    },
                }
            );
            Swal.fire({
                title: "Updated",
                text: "สถานะการจองถูกอัปเดตสำเร็จ",
                icon: "success",
                timer: 1000,
            });
            fetchBooking();
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
                timer: 1000,
            });
        }
    };

    const handleEditBooking = (booking) => {
        setBookingData({
            customer_name: booking.customer_name,
            customer_phone: booking.customer_phone,
            room_id: booking.room_id,
            check_in_date: booking.check_in_date.split("T")[0],
            check_out_date: booking.check_out_date.split("T")[0],
            total_price_: booking.total_price_,
        });
        setCurrentBookingId(booking.id);
        setEditMode(true);
        setIsModalOpen(true);
    };

    useEffect(() => {
        const calculateTotalPrice = () => {
            const room = rooms.find((item) => item.id == bookingData.room_id);
            if (room && bookingData.check_in_date && bookingData.check_out_date) {
                const checkInDate = new Date(bookingData.check_in_date);
                const checkOutDate = new Date(bookingData.check_out_date);
                const diffTime = Math.abs(checkOutDate - checkInDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // คำนวณจำนวนวัน
                return diffDays * room.price; // คำนวณราคาทั้งหมด
            }
            return ""; // ถ้าไม่มีข้อมูลที่ครบถ้วน ให้คืนค่าเป็นว่าง
        };
    
        setBookingData({ 
            ...bookingData, 
            total_price_: calculateTotalPrice() 
        });
    }, [bookingData.room_id, bookingData.check_in_date, bookingData.check_out_date]);    

    useEffect(() => {
        fetchBooking();
        fetchRooms();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Booking List</h1>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    onClick={() => {
                        setBookingData({
                            customer_name: "",
                            customer_phone: "",
                            room_id: "",
                            check_in_date: "",
                            check_out_date: "",
                            total_price_: "",
                        });
                        setEditMode(false);
                        setIsModalOpen(true);
                    }}
                >
                    Add Booking
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg shadow-md">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="py-3 px-4 text-left">Customer Name</th>
                            <th className="py-3 px-4 text-left">Phone</th>
                            <th className="py-3 px-4 text-left">Room ID</th>
                            <th className="py-3 px-4 text-left">Check-In</th>
                            <th className="py-3 px-4 text-left">Check-Out</th>
                            <th className="py-3 px-4 text-left">Total Price</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <tr key={booking.id} className="border-b">
                                    <td className="py-3 px-4">{booking.customer_name}</td>
                                    <td className="py-3 px-4">{booking.customer_phone}</td>
                                    <td className="py-3 px-4">{booking.room_id}</td>
                                    <td className="py-3 px-4">
                                        {new Date(booking.check_in_date).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4">
                                        {new Date(booking.check_out_date).toLocaleDateString()}
                                    </td>
                                    <td className="py-3 px-4">{booking.total_price_} THB</td>
                                    <td className="py-3 px-4">{booking.status || "Pending"}</td>
                                    <td className="py-3 px-4 flex space-x-2">
                                        <button
                                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                                            onClick={() => handleEditBooking(booking)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                                            onClick={() => handleDeleteBooking(booking.id)}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                            onClick={() => handleUpdateStatus(booking.id, "Confirmed")}
                                        >
                                            Confirm
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="py-6 text-center text-gray-500">
                                    No bookings found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
                        <h2 className="text-2xl font-bold mb-4">
                            {editMode ? "Edit Booking" : "Add New Booking"}
                        </h2>
                        <div className="mb-4">
                            <label className="block text-gray-700">Customer Name</label>
                            <input
                                type="text"
                                className="w-full border px-3 py-2 rounded-lg"
                                value={bookingData.customer_name}
                                onChange={(e) =>
                                    setBookingData({ ...bookingData, customer_name: e.target.value })
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Phone</label>
                            <input
                                type="text"
                                className="w-full border px-3 py-2 rounded-lg"
                                value={bookingData.customer_phone}
                                onChange={(e) =>
                                    setBookingData({ ...bookingData, customer_phone: e.target.value })
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Room</label>
                            <select
                                className="w-full border px-3 py-2 rounded-lg"
                                value={bookingData.room_id}
                                onChange={(e) =>
                                    setBookingData({ ...bookingData, room_id: e.target.value })
                                }
                            >
                                <option value="" disabled>
                                    Select a room
                                </option>
                                {rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.room_number} - {room.type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Check-In Date</label>
                            <input
                                type="date"
                                className="w-full border px-3 py-2 rounded-lg"
                                value={bookingData.check_in_date}
                                onChange={(e) =>
                                    setBookingData({
                                        ...bookingData,
                                        check_in_date: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Check-Out Date</label>
                            <input
                                type="date"
                                className="w-full border px-3 py-2 rounded-lg"
                                value={bookingData.check_out_date}
                                onChange={(e) =>
                                    setBookingData({
                                        ...bookingData,
                                        check_out_date: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Total Price</label>
                            <input
                                type="number"
                                className="w-full border px-3 py-2 rounded-lg"
                                value={bookingData.total_price_}
                                onChange={(e) =>
                                    setBookingData({
                                        ...bookingData,
                                        total_price_: e.target.value,
                                    })
                                }
                                disabled
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                                onClick={handleSaveBooking}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
