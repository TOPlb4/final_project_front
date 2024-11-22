"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // สำหรับเปิด/ปิด modal
    const [editMode, setEditMode] = useState(false); // ใช้ระบุว่าอยู่ในโหมดแก้ไขหรือไม่
    const [currentRoomId, setCurrentRoomId] = useState(null); // เก็บ id ของห้องที่กำลังแก้ไข
    const [roomData, setRoomData] = useState({
        room_number: "",
        type: "",
        price: "",
    });

    const fetchRooms = async () => {
        try {
            const res = await axios
                .get("http://localhost:4000/api/rooms", {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("auth"),
                    },
                })
                .then((res) => res.data);

            setRooms(res.data);
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
                timer: 1000,
            });
        }
    };

    const handleSaveRoom = async () => {
        try {
            if (editMode) {
                // Update room
                await axios.post(
                    `http://localhost:4000/api/rooms/${currentRoomId}`,
                    roomData,
                    {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("auth"),
                        },
                    }
                );
                Swal.fire({
                    title: "Updated",
                    text: "แก้ไขห้องสำเร็จ",
                    icon: "success",
                    timer: 1000,
                });
            } else {
                // Create room
                await axios.post("http://localhost:4000/api/rooms/", roomData, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("auth"),
                    },
                });
                Swal.fire({
                    title: "Created",
                    text: "เพิ่มห้องสำเร็จ",
                    icon: "success",
                    timer: 1000,
                });
            }
            setIsModalOpen(false);
            fetchRooms();
            setRoomData({ room_number: "", type: "", price: "" });
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
                timer: 1000,
            });
        }
    };

    const handleDeleteRoom = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/rooms/${id}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("auth"),
                },
            });
            Swal.fire({
                title: "Deleted",
                text: "ลบห้องสำเร็จ",
                icon: "success",
                timer: 1000,
            });
            fetchRooms();
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
                timer: 1000,
            });
        }
    };

    const handleEditRoom = (room) => {
        setRoomData({
            room_number: room.room_number,
            type: room.type,
            price: room.price,
        });
        setCurrentRoomId(room.id);
        setEditMode(true);
        setIsModalOpen(true);
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Available Rooms</h1>
                <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    onClick={() => {
                        setRoomData({ room_number: "", type: "", price: "" });
                        setEditMode(false);
                        setIsModalOpen(true);
                    }}
                >
                    Add Room
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.length > 0 ? (
                    rooms.map((room) => (
                        <div
                            key={room.id}
                            className="border p-4 rounded-lg shadow-md bg-white"
                        >
                            <h2 className="text-xl font-bold text-blue-600 mb-2">
                                Room: {room.room_number}
                            </h2>
                            <p className="text-gray-700 mb-1">Type: {room.type}</p>
                            <p className="text-gray-700 mb-3">Price: {room.price} THB</p>
                            <div className="flex justify-end space-x-2">
                                <button
                                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                                    onClick={() => handleEditRoom(room)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                                    onClick={() => handleDeleteRoom(room.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center col-span-full text-gray-500">
                        No rooms available at the moment.
                    </p>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
                        <h2 className="text-2xl font-bold mb-4">
                            {editMode ? "Edit Room" : "Add New Room"}
                        </h2>
                        <div className="mb-4">
                            <label className="block text-gray-700">Room Number</label>
                            <input
                                type="text"
                                className="w-full border px-3 py-2 rounded-lg"
                                value={roomData.room_number}
                                onChange={(e) =>
                                    setRoomData({ ...roomData, room_number: e.target.value })
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Type</label>
                            <input
                                type="text"
                                className="w-full border px-3 py-2 rounded-lg"
                                value={roomData.type}
                                onChange={(e) =>
                                    setRoomData({ ...roomData, type: e.target.value })
                                }
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Price</label>
                            <input
                                type="number"
                                className="w-full border px-3 py-2 rounded-lg"
                                value={roomData.price}
                                onChange={(e) =>
                                    setRoomData({ ...roomData, price: e.target.value })
                                }
                            />
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                                onClick={handleSaveRoom}
                            >
                                {editMode ? "Update" : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
