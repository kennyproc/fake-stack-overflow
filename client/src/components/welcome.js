/* Start up page if there is not currently a user logged in */

export default function Welcome({user, setUser, registerUserClick, loginClick}) {
    function beGuest() {
        user = "guest";
        setUser(user);
    }

    return (
        <>
            <h1>Welcome</h1>
            {/* Functions defined in fakestackoverflow.js */}
            <button onClick={() => registerUserClick()}>Register</button>
            <button onClick={() => loginClick()}>Login</button>
            <button onClick={() => beGuest()}>Continue as Guest</button>
        
        </>
    )
}