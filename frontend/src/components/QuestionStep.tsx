'use client';

import { useState, useEffect } from 'react';
import type { QuestionConfig } from '@/lib/types';

interface QuestionStepProps {
  question: QuestionConfig;
  currentAnswer: unknown;
  onAnswer: (value: unknown) => void;
  onBack: () => void;
  isFirstStep: boolean;
  stepNumber: number;
}

function initSelected(answer: unknown, questionId: string): string[] {
  if (!answer) return [];
  if (typeof answer === 'string') return [answer];
  if (Array.isArray(answer)) return answer as string[];
  if (typeof answer === 'object' && answer !== null) {
    const obj = answer as Record<string, unknown>;
    if (questionId === 'language' && 'preference' in obj) return [obj.preference as string];
    if (questionId === 'streaming' && 'services' in obj) return obj.services as string[];
  }
  return [];
}

function initConditionalText(answer: unknown): string {
  if (typeof answer === 'object' && answer !== null) {
    const obj = answer as Record<string, unknown>;
    return typeof obj.specific === 'string' ? obj.specific : '';
  }
  return '';
}

function initExtraText(answer: unknown): string {
  if (typeof answer === 'object' && answer !== null) {
    const obj = answer as Record<string, unknown>;
    return typeof obj.country === 'string' ? obj.country : '';
  }
  return '';
}

export default function QuestionStep({
  question,
  currentAnswer,
  onAnswer,
  onBack,
  isFirstStep,
  stepNumber,
}: QuestionStepProps) {
  const [selected, setSelected] = useState<string[]>(() =>
    initSelected(currentAnswer, question.id)
  );
  const [conditionalText, setConditionalText] = useState(() =>
    initConditionalText(currentAnswer)
  );
  const [extraText, setExtraText] = useState(() => initExtraText(currentAnswer));

  // Re-initialise when step changes (navigating back)
  useEffect(() => {
    setSelected(initSelected(currentAnswer, question.id));
    setConditionalText(initConditionalText(currentAnswer));
    setExtraText(initExtraText(currentAnswer));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question.id]);

  const needsNextButton =
    question.type === 'multi' ||
    question.conditionalText !== undefined ||
    question.extraTextField !== undefined;

  const showConditionalInput =
    question.conditionalText && selected.includes(question.conditionalText.trigger);

  function buildAnswer(sel: string[], condText: string, extraTxt: string): unknown {
    if (question.id === 'language') {
      return { preference: sel[0], specific: condText.trim() || undefined };
    }
    if (question.id === 'streaming') {
      return { services: sel, country: extraTxt.trim() || undefined };
    }
    if (question.type === 'single') return sel[0] ?? '';
    return sel;
  }

  function isValid(sel: string[], condText: string): boolean {
    if (sel.length === 0) return false;
    if (
      question.id === 'language' &&
      sel[0] === 'specific' &&
      condText.trim().length === 0
    )
      return false;
    return true;
  }

  function handleOptionClick(value: string) {
    let next: string[];

    if (question.type === 'single') {
      next = [value];
      setSelected(next);
      // Auto-advance for simple single-select (no conditional inputs)
      if (!needsNextButton) {
        onAnswer(buildAnswer(next, conditionalText, extraText));
      }
    } else {
      const isSelected = selected.includes(value);
      if (isSelected) {
        next = selected.filter((v) => v !== value);
      } else if (question.maxSelections && selected.length >= question.maxSelections) {
        next = [...selected.slice(1), value];
      } else {
        next = [...selected, value];
      }
      setSelected(next);
    }
  }

  function handleNext() {
    if (!isValid(selected, conditionalText)) return;
    onAnswer(buildAnswer(selected, conditionalText, extraText));
  }

  const valid = isValid(selected, conditionalText);

  return (
    <div className="w-full">
      <h2 className="font-serif text-3xl md:text-4xl text-brand-text mb-2 leading-tight">
        {question.title}
      </h2>
      {question.subtitle ? (
        <p className="text-brand-muted mb-6">{question.subtitle}</p>
      ) : (
        <div className="mb-6" />
      )}

      {/* Options */}
      <div
        className={`grid gap-3 ${
          question.options.length > 4 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
        }`}
      >
        {question.options.map((option) => {
          const isSelected = selected.includes(option.value);
          return (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              aria-pressed={isSelected}
              className={`text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-150 min-h-[52px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 ${
                isSelected
                  ? 'border-brand-accent bg-brand-accent-light text-brand-text'
                  : 'border-gray-200 bg-white text-brand-text hover:border-gray-300'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {/* Conditional text input */}
      {showConditionalInput && question.conditionalText && (
        <div className="mt-4">
          <input
            type="text"
            value={conditionalText}
            onChange={(e) => setConditionalText(e.target.value)}
            placeholder={question.conditionalText.placeholder}
            maxLength={50}
            autoFocus
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-accent outline-none transition-colors duration-150 text-brand-text bg-white"
            aria-label="Specific language"
          />
        </div>
      )}

      {/* Extra text field (country for Q7) */}
      {question.extraTextField && (
        <div className="mt-4">
          <label className="block text-sm text-brand-muted mb-1.5">
            {question.extraTextField.label}
          </label>
          <input
            type="text"
            value={extraText}
            onChange={(e) => setExtraText(e.target.value)}
            placeholder={question.extraTextField.placeholder}
            maxLength={60}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-accent outline-none transition-colors duration-150 text-brand-text bg-white"
            aria-label={question.extraTextField.label}
          />
        </div>
      )}

      {/* Navigation — only shown when Next button is needed */}
      {needsNextButton && (
        <div className="flex gap-3 mt-8">
          {!isFirstStep && (
            <button
              onClick={onBack}
              className="px-6 py-3.5 rounded-xl border-2 border-gray-200 text-brand-text font-medium hover:border-gray-300 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 min-h-[52px]"
            >
              ← Back
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!valid}
            className={`flex-1 px-6 py-3.5 rounded-xl font-medium transition-all duration-150 min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 ${
              valid
                ? 'bg-brand-accent text-white hover:bg-brand-accent-dark'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {stepNumber === 7 ? 'Find something to watch →' : 'Next →'}
          </button>
        </div>
      )}

      {/* Back button for auto-advance steps */}
      {!needsNextButton && !isFirstStep && (
        <div className="mt-6">
          <button
            onClick={onBack}
            className="text-brand-muted text-sm hover:text-brand-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
