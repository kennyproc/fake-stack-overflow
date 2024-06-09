import React from "react";
import axios from 'axios';

axios.defaults.withCredentials = true;

export default function RegisterUser({isVisible, showHomePage, user, setUserState}) {
	function handleSubmit(e) {
		e.preventDefault();

		let formData = new FormData(document.getElementById("register-user"));
		let formDataObject = Object.fromEntries(formData);

		let extractedUsername = formDataObject['email'].match(/[^@]+/)[0];

		if (formDataObject['password'] != formDataObject['password2']) {
			alert("Passwords don't match!");
		} else if (formDataObject['password'].toLowerCase().includes(formDataObject['firstname'].toLowerCase()) 
			|| formDataObject['password'].toLowerCase().includes(formDataObject['lastname'].toLowerCase()) 
			|| formDataObject['password'].toLowerCase().includes(extractedUsername.toLowerCase())) {
			
			alert("Password can't contain name or username");
		} else {

			axios.post("http://localhost:8000/register", 
				{
					firstname: formDataObject['firstname'],
					lastname: formDataObject['lastname'],
					username: extractedUsername,
					email: formDataObject['email'],
					password: formDataObject['password']
				}, 
				{
					headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
					}
				})
				.catch(err => {
					console.log(err);
				})
			.then(res => {
				if (res.data) {
					setUserState(res.data)
					
					for (let field of document.getElementsByTagName('input')) {
						field.value = "";
					}
					for (let field of document.getElementsByTagName('textarea')) {
						field.value = "";
					}
					showHomePage();
				} else {
					alert("User already exists");
				}
			})

		}

		
		// window.location.reload();
	}

	return (
		<div id="registeruser" style={{display: isVisible === 'registeruser' ? 'block' : 'none'}}>
			<form action="#" id="register-user" onSubmit={handleSubmit}>
				<h2>First Name*</h2>
				<input type="text" name="firstname" id="register-firstname" required />
				<h2>Last Name*</h2>
				<input type="text" name="lastname" id="register-lastname" required />
				<h2>Email*</h2>
				<input type="email" name="email" id="register-email" required />
				<h2>Password*</h2>
				<input type="password" name="password" id="register-password" required />
				<h2>Verify Password*</h2>
				<input type="password" name="password2" id="register-password2" required />
				<br />
				<button type="submit">Register</button>
				<p className="text-for-mandatory">* indicates mandatory fields</p>
				
			</form>
		</div>
	)
}