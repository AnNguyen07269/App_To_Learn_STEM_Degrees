import { useState } from 'react';
import type { MultipleChoiceStep as MultipleChoiceStepData } from '../../types/content';

interface Props {
  step: MultipleChoiceStepData;
  onComplete: () => void;
}

/** Lets the learner retry after a wrong answer; only a correct pick unlocks Continue. */
export default function MultipleChoiceStep({ step, onComplete }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const isCorrect = selectedId === step.correctChoiceId;
  const feedbackMessage =
    selectedId == null
      ? null
      : isCorrect
        ? step.feedback.correct
        : step.feedback.incorrectByChoice?.[selectedId] ?? step.feedback.incorrectDefault;

  return (
    <div className="step step-multiple-choice">
      <p className="step-prompt">{step.prompt}</p>
      <div className="choices">
        {step.choices.map((choice) => {
          const isSelected = choice.id === selectedId;
          return (
            <button
              key={choice.id}
              type="button"
              className={
                'choice' +
                (isSelected ? (isCorrect ? ' choice-correct' : ' choice-incorrect') : '')
              }
              onClick={() => setSelectedId(choice.id)}
              disabled={isCorrect}
            >
              {choice.text}
            </button>
          );
        })}
      </div>
      {feedbackMessage && (
        <p className={'feedback' + (isCorrect ? ' feedback-correct' : ' feedback-incorrect')}>
          {feedbackMessage}
        </p>
      )}
      {isCorrect && (
        <button type="button" className="continue" onClick={onComplete}>
          Continue
        </button>
      )}
    </div>
  );
}
