import React from "react";
import axios from 'axios';

axios.defaults.withCredentials = true;

export default function Login({isVisible, showHomePage, user, setUserState}) {
	function handleSubmit(e) {
		e.preventDefault();

		let formData = new FormData(document.getElementById("login-form"));
		let formDataObject = Object.fromEntries(formData);

		axios.post("http://localhost:8000/login", 
			{
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
                alert("Incorrect username or password");
            }
        })

	}

	return (
		<div id="login" style={{display: isVisible === 'login' ? 'block' : 'none'}}>
			<form action="#" id="login-form" onSubmit={handleSubmit}>
				<h2>Email*</h2>
				<input type="text" name="email" id="login-email" required />
				<h2>Password*</h2>
				<input type="password" name="password" id="login-password" required />
				<br />
				<button type="submit">Log in</button>
				<p className="text-for-mandatory">* indicates mandatory fields</p>
				
			</form>
		</div>
	)
}