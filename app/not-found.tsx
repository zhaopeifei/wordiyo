import Link from 'next/link';

const NotFoundPage = () => {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-foreground text-4xl font-semibold">Page not found</h1>
      <p className="text-muted-foreground">We could not locate the requested word root entry.</p>
      <div className="flex justify-center gap-4">
        <Link href="/" className="bg-primary text-primary-foreground rounded-md px-4 py-2 text-sm font-medium">
          Return home
        </Link>
        <Link
          href="/explore"
          className="border-primary text-primary rounded-md border px-4 py-2 text-sm font-medium"
        >
          Explore catalog
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
