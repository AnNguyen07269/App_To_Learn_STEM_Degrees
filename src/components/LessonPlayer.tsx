import { useEffect, useState } from 'react';
import type { Lesson, Step } from '../types/content';
import { loadLesson } from '../content/loader';
import TextStep from './steps/TextStep';
import MultipleChoiceStep from './steps/MultipleChoiceStep';
import NumericStep from './steps/NumericStep';

interface Props {
  degreeId: string;
  courseId: string;
  lessonId: string;
  onExit: () => void;
}

function renderStep(step: Step, onComplete: () => void) {
  switch (step.type) {
    case 'text':
      return <TextStep step={step} onComplete={onComplete} />;
    case 'multiple-choice':
      return <MultipleChoiceStep step={step} onComplete={onComplete} />;
    case 'numeric':
      return <NumericStep step={step} onComplete={onComplete} />;
  }
}

export default function LessonPlayer({ degreeId, courseId, lessonId, onExit }: Props) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    setLesson(null);
    setError(null);
    setStepIndex(0);
    loadLesson(degreeId, courseId, lessonId)
      .then(setLesson)
      .catch((err) => setError(String((err as Error).message ?? err)));
  }, [degreeId, courseId, lessonId]);

  if (error) {
    return (
      <div className="app-error">
        {error}
        <button type="button" onClick={onExit}>
          Back
        </button>
      </div>
    );
  }
  if (!lesson) return <div className="app-loading">Loading…</div>;

  const step = lesson.steps[stepIndex];
  const isLastStep = stepIndex === lesson.steps.length - 1;

  function handleStepComplete() {
    if (isLastStep) {
      onExit();
    } else {
      setStepIndex((index) => index + 1);
    }
  }

  return (
    <div className="lesson-player">
      <div className="lesson-progress">
        <button type="button" className="lesson-back" onClick={onExit}>
          ← Exit
        </button>
        <span>
          Step {stepIndex + 1} / {lesson.steps.length}
        </span>
      </div>
      <h1>{lesson.title}</h1>
      {/* key forces a remount on step change, resetting each step component's local state */}
      <div key={step.id}>{renderStep(step, handleStepComplete)}</div>
    </div>
  );
}
