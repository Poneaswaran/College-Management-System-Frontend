import Sidebar from '../../components/layout/Sidebar';

export default function NotFound() {
    return (
        <div className="flex min-h-screen bg-[var(--color-background)]">
            <Sidebar />
            <div className="flex-1 ml-64 flex items-center justify-center flex-col gap-4">
                <h1 className="text-4xl font-bold">404</h1>
                <p className="text-lg text-muted-foreground">Page not found</p>
                <a href="/" className="btn btn-primary">Go Home</a>
            </div>
        </div>
    );
}
