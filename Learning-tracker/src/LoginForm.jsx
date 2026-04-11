const LoginForm = ({username, setUsername, loginHandler, password, setPassword}) => {
    return(
        <form className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm" onSubmit={loginHandler}>
            <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
            <label className="grid gap-1 text-sm">
                <span className="font-medium text-slate-700">Username</span>
                <input className="rounded-md border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" type="text" value={username} onChange={e => setUsername(e.target.value)} />
            </label>
            <label className="grid gap-1 text-sm">
                <span className="font-medium text-slate-700">Password</span>
                <input className="rounded-md border border-slate-300 bg-white px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" type="password" value={password} onChange={e => setPassword(e.target.value)} />
            </label>
            <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 cursor-pointer" type="submit">Login</button>
        </form>
    )
}

export default LoginForm