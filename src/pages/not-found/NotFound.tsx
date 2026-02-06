export default function NotFound() {
    return (
        <div className="flex-center min-vh-100 flex-col gap-4">
            <h1 className="text-4xl font-bold">404</h1>
            <p className="text-lg text-muted-foreground">Page not found</p>
            <a href="/" className="btn btn-primary">Go Home</a>
        </div>
    );
}
