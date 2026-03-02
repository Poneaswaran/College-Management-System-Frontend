import PageLayout from '../../components/layout/PageLayout';

export default function NotFound() {
    return (
        <PageLayout>
            <div className="flex flex-1 items-center justify-center flex-col gap-4 min-h-[60vh] px-4">
                <h1 className="text-4xl font-bold">404</h1>
                <p className="text-lg text-muted-foreground">Page not found</p>
                <a href="/" className="btn btn-primary">Go Home</a>
            </div>
        </PageLayout>
    );
}
