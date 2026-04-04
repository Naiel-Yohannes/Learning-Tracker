const RegisterForm = ({registerFormHandler, setRegisterUsername, registerUsername, registerName, setRegisterName, registerPassword, setRegisterPassword}) => {
    return(
        <div>
            <h1>Create an account</h1>
            <form onSubmit={registerFormHandler}>
                <label>Username: <input type="text" value={registerUsername} onChange={e => setRegisterUsername(e.target.value)} /></label>
                <label>Name: <input type="text" value={registerName} onChange={e => setRegisterName(e.target.value)} /></label>
                <label>Password: <input type="password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} /></label>

                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default RegisterForm