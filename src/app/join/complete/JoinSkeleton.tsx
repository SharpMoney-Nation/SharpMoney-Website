// The static prerender of /join/complete and the dynamic loader's placeholder:
// the same "setting up" screen the old join box showed after a completed join.

const FONT_BODY = 'var(--font-roboto-cond), sans-serif';

export function JoinSkeleton({ children }: { children?: React.ReactNode }) {
  return (
    <main
      style={{
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        padding: '48px 24px',
        textAlign: 'center',
      }}
    >
      {children ?? (
        <>
          <span
            aria-hidden="true"
            style={{ width: 12, height: 12, borderRadius: '50%', background: '#22d3ee', animation: 'blinkDot 1.2s ease-in-out infinite' }}
          />
          <span role="status" style={{ fontFamily: FONT_BODY, fontSize: 17, color: '#e5e7eb' }}>
            Setting up your free account&hellip; taking you to the tool.
          </span>
        </>
      )}
    </main>
  );
}
