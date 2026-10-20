import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Lesson, Step } from '../types/content';
import { loadLesson } from '../content/loader';
import TextStep from './steps/TextStep';
import MultipleChoiceStep from './steps/MultipleChoiceStep';
import NumericStep from './steps/NumericStep';

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

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  if (!courseId || !lessonId) return null;
  // Keying on the lesson remounts this on navigation between lessons, so
  // each lesson starts with fresh state instead of resetting it by hand.
  return <LessonPlayerForLesson key={`${courseId}/${lessonId}`} courseId={courseId} lessonId={lessonId} />;
}

function LessonPlayerForLesson({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    loadLesson(courseId, lessonId)
      .then(setLesson)
      .catch((err) => setError(String((err as Error).message ?? err)));
  }, [courseId, lessonId]);

  function exitToCourse() {
    navigate(`/courses/${courseId}`);
  }

  if (error) {
    return (
      <div className="app-error">
        {error}
        <button type="button" onClick={exitToCourse}>
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
      exitToCourse();
    } else {
      setStepIndex((index) => index + 1);
    }
  }

  return (
    <div className="lesson-player">
      <div className="lesson-progress">
        <button type="button" className="lesson-back" onClick={exitToCourse}>
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
