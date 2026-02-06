import { Link } from 'react-router-dom';

export function Navbar() {
    return (
        <nav className="h-16 border-b flex items-center px-6">
            <Link to="/" className="text-xl font-bold">College MS</Link>
            <div className="ml-auto flex gap-4">
                <Link to="/features" className="hover:text-primary">Features</Link>
            </div>
        </nav>
    );
}
