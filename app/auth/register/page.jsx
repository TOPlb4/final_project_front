"use client"
import axios from 'axios';
import { useState } from 'react';
import Swal from 'sweetalert2';

export default function Register() {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');


	const handleSubmit = async (e) => {
		e.preventDefault();
		// เรียก API Register
		try {

			if (password === confirmPassword) {
				const res = await axios.post("http://localhost:4000/api/auth/register",
					{
						user_name: username,
						email: email,
						password
					}
				).then(res => res.data)

				if (res.status == "OK") {
					const res_login = await axios.post("http://localhost:4000/api/auth/login",
						{
							user_name: username,
							password: password
						}
					).then(res => res.data)

					if (res_login.status == "OK") {
						localStorage.setItem("auth", res_login.data.token)
						Swal.fire({
							title: "Login Success",
							icon: "success",
							timer: 1000
						}).then(() => window.location.href = "/booking")

					} else {
						throw new Error(res_login.message)
					}
				} else {
					throw new Error(res.message)
				}
			} else {
				Swal.fire({
					title: "Error",
					text: "กรุณากรอกรหัสผ่านให้ตรงกัน",
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
				<h1 className="text-2xl font-bold mb-4">Register</h1>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">Username</label>
					<input
						type="text"
						className="w-full p-2 border rounded"
						value={username}
						placeholder='Enter Username'
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">Email</label>
					<input
						type="email"
						className="w-full p-2 border rounded"
						value={email}
						placeholder='Enter Email'
						onChange={(e) => setEmail(e.target.value)}
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
				<div className="mb-4">
					<label className="block text-sm font-medium mb-1">Confirm Password</label>
					<input
						type="password"
						className="w-full p-2 border rounded"
						value={confirmPassword}
						placeholder='Enter Confirm Password'
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
				</div>
				<button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
					Register
				</button>
			</form>
		</div>
	);
}
