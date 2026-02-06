export default function Login() {
    return (
        <div className="flex-center min-vh-100">
            <div className="card max-w-md w-full p-8">
                <h1 className="text-2xl font-bold mb-6">Login</h1>
                <form className="flex flex-col gap-4">
                    <input type="email" placeholder="Email" className="input" />
                    <input type="password" placeholder="Password" className="input" />
                    <button type="submit" className="btn btn-primary">Sign In</button>
                </form>
            </div>
        </div>
    );
}
