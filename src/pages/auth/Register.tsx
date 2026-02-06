export default function Register() {
    return (
        <div className="flex-center min-vh-100">
            <div className="card max-w-md w-full p-8">
                <h1 className="text-2xl font-bold mb-6">Register</h1>
                <form className="flex flex-col gap-4">
                    <input type="text" placeholder="Full Name" className="input" />
                    <input type="email" placeholder="Email" className="input" />
                    <input type="password" placeholder="Password" className="input" />
                    <button type="submit" className="btn btn-primary">Sign Up</button>
                </form>
            </div>
        </div>
    );
}
