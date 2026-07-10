import { Link } from "@i18n/navigation";

export default function NotFound() {
  return (
    <div className="container flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <p className="text-accent text-9xl font-bold tracking-tight">404</p>

        <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
        <p className="text-muted mt-2 text-sm">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been
          moved.
        </p>

        <div className="mt-6">
          <Link
            href="/"
            className="bg-foreground text-surface hover:bg-foreground-hover inline-block rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
