import type { Recommendation } from '@/lib/types';

interface ResultCardProps {
  recommendation: Recommendation;
  index: number;
}

export default function ResultCard({ recommendation, index }: ResultCardProps) {
  const delay = `${index * 200}ms`;

  return (
    <article
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4 opacity-0 animate-fade-in-up"
      style={{ animationDelay: delay, animationFillMode: 'forwards' }}
    >
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="font-serif text-2xl text-brand-text leading-tight">
            {recommendation.title}
          </h3>
          <span className="shrink-0 text-xs font-medium text-brand-muted bg-gray-100 px-2.5 py-1 rounded-full mt-1">
            {recommendation.type}
          </span>
        </div>
        <p className="text-sm text-brand-muted">
          {recommendation.year} · {recommendation.runtime}
        </p>
      </div>

      {/* Genre tags */}
      <div className="flex flex-wrap gap-2">
        {recommendation.genres.map((genre) => (
          <span
            key={genre}
            className="text-xs text-brand-muted border border-gray-200 px-2.5 py-1 rounded-full"
          >
            {genre}
          </span>
        ))}
      </div>

      {/* Logline */}
      <p className="text-brand-text">{recommendation.logline}</p>

      {/* Why this for you */}
      <div className="border-l-2 border-brand-accent pl-4">
        <p className="text-sm text-brand-muted font-medium mb-1">Why this for you</p>
        <p className="text-brand-text text-sm leading-relaxed">{recommendation.whyForYou}</p>
      </div>

      {/* Available on */}
      {recommendation.availableOn.length > 0 && (
        <div>
          <p className="text-xs text-brand-muted mb-2">Likely available on</p>
          <div className="flex flex-wrap gap-2">
            {recommendation.availableOn.map((service) => (
              <span
                key={service}
                className="text-xs font-medium text-brand-text bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* JustWatch link */}
      <a
        href={recommendation.justWatchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-accent hover:text-brand-accent-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
      >
        Find on JustWatch ↗
      </a>
    </article>
  );
}
