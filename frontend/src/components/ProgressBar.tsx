interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="w-full mb-8">
      <div
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${currentStep} of ${totalSteps}`}
        className="flex gap-1.5"
      >
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i < currentStep ? 'bg-brand-accent' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className="text-sm text-brand-muted mt-2">
        Step {currentStep} of {totalSteps}
      </p>
    </div>
  );
}
