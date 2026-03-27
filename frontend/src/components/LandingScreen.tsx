interface LandingScreenProps {
  onStart: () => void;
}

export default function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="font-serif text-5xl md:text-6xl text-brand-text mb-4 leading-tight">
        WatchNow
      </h1>
      <p className="text-xl text-brand-muted mb-10 max-w-sm">
        Answer 7 questions. Get the perfect thing to watch tonight.
      </p>
      <button
        onClick={onStart}
        className="bg-brand-accent text-white text-lg font-medium px-8 py-4 rounded-xl hover:bg-brand-accent-dark transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 min-h-[56px]"
      >
        Let&apos;s go →
      </button>
    </div>
  );
}
