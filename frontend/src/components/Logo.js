export const LOGO_URL =
  "https://customer-assets-7cd3h4nn.emergentagent.net/job_23527a80-73ab-45d1-b929-e06ee4f59fc4/artifacts/4bloappr_BigLyp_Logo.webp";

export function Logo({ className = "h-9", withTagline = false }) {
  return (
    <div className="flex items-center gap-2" data-testid="brand-logo">
      <img src={LOGO_URL} alt="Biglyp" className={className} />
      {withTagline && (
        <span className="hidden sm:inline text-xs tracking-[0.2em] uppercase text-muted-foreground">
          Enroll
        </span>
      )}
    </div>
  );
}
