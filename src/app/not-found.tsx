import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper p-8">
      <div className="text-center">
        <h1 className="font-serif text-2xl font-semibold text-ink">Document not found</h1>
        <p className="mt-2 text-sm text-ink-muted">It may have been deleted or the link is wrong.</p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-medium text-accent hover:underline"
        >
          Back to Inkwell
        </Link>
      </div>
    </div>
  );
}
