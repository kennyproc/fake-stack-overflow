import { useState } from "react"

export function Header({searchQuery, setSearchQuery, showHomePage, registerUserClick, loginClick, user, setUserState, logoutClick}) {
	const [curSearch, setCurSearch] = useState("");
	function handleSearch() {
		searchQuery = curSearch;
		setSearchQuery(searchQuery);
		showHomePage();
	}
	return (
		<div id="header" className="header">
			<h1>Fake Stack Overflow</h1>
			<input 
				type="text" 
				placeholder="Search..." 
				id="search" 
				onChange={e => setCurSearch(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						handleSearch();
					}
				}}
			/>
			<UserButtons user={user} registerUserClick={registerUserClick} loginClick={loginClick} logoutClick={logoutClick} />
		</div>
	)
}

function UserButtons({user, registerUserClick, loginClick, logoutClick}) {
	if (!user || user == "guest") {
		return (
			<>
				<button onClick={() => registerUserClick()}>Sign up</button>
				<button onClick={() => loginClick()}>Log in</button>
			</>
		)
	}
	return (
		<>
			<em>Hello, {user.username}</em>
			<button onClick={() => logoutClick()}>Logout</button>
		</>
	)
}

export function Sidenav({questionsClick, tagsClick, user}) {
	if (!user) {
		return (
			<div className="sidenav">
				<a href="#" id="questions-link" className="focus">
					Questions
				</a>
				<a href="#" id="tags-link">
					Tags
				</a>
			</div>
		)
	}

	return (
		<div className="sidenav">
			<a href="#" id="questions-link" className="focus" onClick={() => questionsClick()}>
				Questions
			</a>
			<a href="#" id="tags-link" onClick={() => tagsClick()}>
				Tags
			</a>
		</div>
	)
}