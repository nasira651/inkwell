type DocumentAccessBannerProps = {
  isOwner: boolean;
  ownerName?: string;
};

export function DocumentAccessBanner({ isOwner, ownerName }: DocumentAccessBannerProps) {
  if (isOwner) {
    return (
      <div className="border-b border-border bg-paper-deep px-6 py-2 text-sm text-ink-muted">
        You own this document — you can share or delete it.
      </div>
    );
  }

  return (
    <div className="border-b border-accent/20 bg-accent-light px-6 py-2 text-sm text-accent">
      Shared with you{ownerName ? ` by ${ownerName}` : ""} — you can edit this document.
    </div>
  );
}
