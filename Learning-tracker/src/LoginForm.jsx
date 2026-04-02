const LoginForm = ({username, setUsername, loginHandler, password, setPassword}) => {
    return(
        <form onSubmit={loginHandler}>
            <h1>Login Form</h1>
            <label>
                username: 
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} />    
            </label> 
            <label>
                password: 
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />    
            </label> 
            <button type="submit">Login</button>
        </form>
    )
}

export default LoginForm