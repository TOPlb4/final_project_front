"use client"
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post("http://localhost:4000/api/auth/login",
				{
					user_name: username,
					password
				}
			).then(res => res.data)
			
			if(res.status == "OK" && res.data?.token) {
				localStorage.setItem("auth", res.data?.token)
				Swal.fire({
					title: "Login Success",
					icon: "success",
					timer: 1000
				})
				.then(() => window.location.href = "/booking")
			} else {
				Swal.fire({
					title: "Failed",
					text: res.message,
					icon: "error",
					timer: 1000
				})
			}
		} catch (error) {
			Swal.fire({
				title: "Error",
				text: error.message,
				icon: "error",
				timer: 1000
			})
		}
	};

	return (
		<div className="flex items-center justify-center h-screen bg-gray-100">
			<form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
				<h1 className="text-2xl font-bold mb-4">Login</h1>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">Username</label>
					<input
						type="text"
						className="w-full p-2 border rounded"
						value={username}
						placeholder='Enter username'
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">Password</label>
					<input
						type="password"
						className="w-full p-2 border rounded"
						value={password}
						placeholder='Enter Password'
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
					Login
				</button>
			</form>
		</div>
	);
}
