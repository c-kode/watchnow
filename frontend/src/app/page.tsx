'use client';

import { useReducer, useEffect } from 'react';
import type { AppState, AppAction, RecommendRequest, Recommendation } from '@/lib/types';
import { QUESTIONS } from '@/lib/questions';
import LandingScreen from '@/components/LandingScreen';
import ProgressBar from '@/components/ProgressBar';
import QuestionStep from '@/components/QuestionStep';
import LoadingScreen from '@/components/LoadingScreen';
import ResultCard from '@/components/ResultCard';
import AuthHeader from '@/components/AuthHeader';
import SaveButton from '@/components/SaveButton';
import AutoLogUsage from '@/components/AutoLogUsage';
import ReleaseDateStep from '@/components/ReleaseDateStep';
import CastStep from '@/components/CastStep';
import type { ReleaseDateFilter } from '@/lib/types';

const TOTAL_STEPS = 7;
const TOTAL_WITH_OPTIONAL = 9;

function setAnswerForStep(
  answers: Partial<RecommendRequest>,
  step: number,
  value: unknown
): Partial<RecommendRequest> {
  const next = { ...answers };
  switch (step) {
    case 1:
      next.mood = (Array.isArray(value) ? value : [value]) as RecommendRequest['mood'];
      break;
    case 2:
      next.time = value as RecommendRequest['time'];
      break;
    case 3:
      next.watchingWith = value as RecommendRequest['watchingWith'];
      break;
    case 4:
      next.format = value as RecommendRequest['format'];
      break;
    case 5:
      next.language = value as RecommendRequest['language'];
      break;
    case 6:
      next.popularity = value as RecommendRequest['popularity'];
      break;
    case 7:
      next.streaming = value as RecommendRequest['streaming'];
      break;
    case 8:
      next.releaseDate = value as ReleaseDateFilter;
      break;
    case 9:
      next.cast = value as string;
      break;
  }
  return next;
}

function getAnswerForStep(answers: Partial<RecommendRequest>, step: number): unknown {
  switch (step) {
    case 1: return answers.mood;
    case 2: return answers.time;
    case 3: return answers.watchingWith;
    case 4: return answers.format;
    case 5: return answers.language;
    case 6: return answers.popularity;
    case 7: return answers.streaming;
    case 8: return answers.releaseDate;
    case 9: return answers.cast;
    default: return undefined;
  }
}

const initialState: AppState = { screen: 'landing' };

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'START':
      return { screen: 'question', step: 1, answers: {} };

    case 'ANSWER': {
      if (state.screen !== 'question') return state;
      const newAnswers = setAnswerForStep(state.answers, action.step, action.value);
      // Steps 1-6 auto-advance to next step
      if (action.step < TOTAL_STEPS) {
        return { screen: 'question', step: action.step + 1, answers: newAnswers };
      }
      // Step 7 "Find something to watch" → submit
      if (action.step === TOTAL_STEPS) {
        return { screen: 'loading', answers: newAnswers as RecommendRequest };
      }
      // Step 8 (release date) → advance to step 9 (cast)
      if (action.step === 8) {
        return { screen: 'question', step: 9, answers: newAnswers };
      }
      // Step 9 (cast) → submit
      if (action.step === 9) {
        return { screen: 'loading', answers: newAnswers as RecommendRequest };
      }
      return state;
    }

    case 'GO_TO_FILTERS': {
      if (state.screen !== 'question') return state;
      const answersWithStreaming = setAnswerForStep(state.answers, 7, action.streamingValue);
      return { screen: 'question', step: 8, answers: answersWithStreaming };
    }

    case 'SUBMIT': {
      if (state.screen !== 'question') return state;
      return { screen: 'loading', answers: state.answers as RecommendRequest };
    }

    case 'SKIP_FILTER': {
      if (state.screen !== 'question') return state;
      // Skip step 8 → go to step 9
      if (action.step === 8) {
        return { screen: 'question', step: 9, answers: state.answers };
      }
      // Skip step 9 → submit
      return { screen: 'loading', answers: state.answers as RecommendRequest };
    }

    case 'GO_BACK': {
      if (state.screen !== 'question') return state;
      if (state.step === 1) return { screen: 'landing' };
      // Going back from step 8 → step 7
      if (state.step === 8) return { ...state, step: 7 };
      // Going back from step 9 → step 8
      if (state.step === 9) return { ...state, step: 8 };
      return { ...state, step: state.step - 1 };
    }

    case 'RECEIVE_RESULTS': {
      if (state.screen !== 'loading') return state;
      return {
        screen: 'results',
        answers: state.answers,
        recommendations: action.recommendations,
      };
    }

    case 'ERROR': {
      if (state.screen !== 'loading') return state;
      return { screen: 'error', answers: state.answers, message: action.message };
    }

    case 'RESET':
      return { screen: 'landing' };

    default:
      return state;
  }
}

async function fetchRecommendations(
  answers: RecommendRequest,
  signal: AbortSignal
): Promise<Recommendation[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  const res = await fetch(`${apiUrl}/api/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(answers),
    signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Something went wrong.' }));
    throw new Error((err as { error?: string }).error ?? 'Something went wrong.');
  }

  const data = (await res.json()) as { recommendations: Recommendation[] };
  return data.recommendations;
}

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (state.screen !== 'loading') return;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    fetchRecommendations(state.answers, controller.signal)
      .then((recommendations) => {
        dispatch({ type: 'RECEIVE_RESULTS', recommendations });
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') {
          dispatch({ type: 'ERROR', message: 'Request timed out. Please try again.' });
        } else {
          dispatch({ type: 'ERROR', message: err.message || 'Something went wrong.' });
        }
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.screen]);

  return (
    <main className="min-h-screen bg-brand-bg">
      {/* Auth header — top right */}
      <div className="mx-auto max-w-5xl px-4 pt-4 flex justify-end">
        <AuthHeader />
      </div>

      <div className={`mx-auto px-4 py-8 ${state.screen === 'results' ? 'max-w-5xl' : 'max-w-2xl'}`}>
        {state.screen === 'landing' && (
          <LandingScreen onStart={() => dispatch({ type: 'START' })} />
        )}

        {state.screen === 'question' && state.step <= TOTAL_STEPS && (
          <div>
            <ProgressBar currentStep={state.step} totalSteps={TOTAL_STEPS} />
            <QuestionStep
              key={state.step}
              question={QUESTIONS[state.step - 1]}
              currentAnswer={getAnswerForStep(state.answers, state.step)}
              stepNumber={state.step}
              isFirstStep={state.step === 1}
              onAnswer={(value) =>
                dispatch({ type: 'ANSWER', step: state.step, value })
              }
              onBack={() => dispatch({ type: 'GO_BACK' })}
              onAdditionalFilters={
                state.step === 7
                  ? (streamingValue: unknown) => dispatch({ type: 'GO_TO_FILTERS', streamingValue })
                  : undefined
              }
            />
          </div>
        )}

        {state.screen === 'question' && state.step === 8 && (
          <div>
            <ProgressBar currentStep={TOTAL_STEPS} totalSteps={TOTAL_STEPS} />
            <ReleaseDateStep
              currentAnswer={state.answers.releaseDate as ReleaseDateFilter | undefined}
              onAnswer={(value) =>
                dispatch({ type: 'ANSWER', step: 8, value })
              }
              onSkip={() => dispatch({ type: 'SKIP_FILTER', step: 8 })}
              onBack={() => dispatch({ type: 'GO_BACK' })}
            />
          </div>
        )}

        {state.screen === 'question' && state.step === 9 && (
          <div>
            <ProgressBar currentStep={TOTAL_STEPS} totalSteps={TOTAL_STEPS} />
            <CastStep
              currentAnswer={state.answers.cast as string | undefined}
              onAnswer={(value) =>
                dispatch({ type: 'ANSWER', step: 9, value })
              }
              onSkip={() => dispatch({ type: 'SKIP_FILTER', step: 9 })}
              onBack={() => dispatch({ type: 'GO_BACK' })}
            />
          </div>
        )}

        {state.screen === 'loading' && <LoadingScreen />}

        {state.screen === 'results' && (
          <div>
            <AutoLogUsage query={state.answers} recommendations={state.recommendations} />
            <div className="mb-8 text-center">
              <h2 className="font-serif text-3xl text-brand-text mb-2">
                {state.recommendations.length === 1
                  ? 'Your pick for tonight'
                  : 'Your picks for tonight'}
              </h2>
              <p className="text-sm text-brand-muted">
                AI-generated · Verify availability on JustWatch
              </p>
            </div>

            <div
              className={
                state.recommendations.length === 1
                  ? 'max-w-sm mx-auto'
                  : state.recommendations.length === 2
                  ? 'grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto'
                  : 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
              }
            >
              {state.recommendations.map((rec, i) => (
                <ResultCard key={rec.title} recommendation={rec} index={i} />
              ))}
            </div>

            <div className="mt-10 flex justify-center gap-3">
              <button
                onClick={() => dispatch({ type: 'RESET' })}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 text-brand-text font-medium hover:border-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
              >
                Start over
              </button>
              <SaveButton recommendations={state.recommendations} />
            </div>
          </div>
        )}

        {state.screen === 'error' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="text-4xl mb-4" aria-hidden>
              ⚠️
            </div>
            <h2 className="font-serif text-2xl text-brand-text mb-2">
              Something went wrong
            </h2>
            <p className="text-brand-muted mb-2 max-w-sm">{state.message}</p>
            <p className="text-sm text-brand-muted mb-8">
              Your answers are saved — you can retry or start fresh.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => dispatch({ type: 'RESET' })}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 text-brand-text font-medium hover:border-gray-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
              >
                Start over
              </button>
              <button
                onClick={() =>
                  dispatch({
                    type: 'ANSWER',
                    step: TOTAL_STEPS,
                    value: state.answers.streaming,
                  })
                }
                className="px-6 py-3 rounded-xl bg-brand-accent text-white font-medium hover:bg-brand-accent-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
              >
                Try again →
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
