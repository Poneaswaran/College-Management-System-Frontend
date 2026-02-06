export default function Dashboard() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid gap-6">
                <div className="card p-6">
                    <h2 className="text-xl font-semibold mb-4">Welcome Back</h2>
                    <p className="text-muted-foreground">Overview of your activity.</p>
                </div>
            </div>
        </div>
    );
}
