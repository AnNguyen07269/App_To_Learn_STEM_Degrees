import { useState, type FormEvent } from 'react';
import type { NumericStep as NumericStepData } from '../../types/content';

interface Props {
  step: NumericStepData;
  onComplete: () => void;
}

export default function NumericStep({ step, onComplete }: Props) {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState<number | null>(null);

  const tolerance = step.tolerance ?? 0;
  const isCorrect = submitted != null && Math.abs(submitted - step.answer) <= tolerance;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;
    setSubmitted(parsed);
  }

  return (
    <div className="step step-numeric">
      <p className="step-prompt">{step.prompt}</p>
      <form className="numeric-form" onSubmit={handleSubmit}>
        <input
          type="number"
          step="any"
          inputMode="decimal"
          value={value}
          disabled={isCorrect}
          onChange={(event) => {
            setValue(event.target.value);
            setSubmitted(null);
          }}
        />
        {step.unit && <span className="numeric-unit">{step.unit}</span>}
        {!isCorrect && (
          <button type="submit" disabled={value.trim() === ''}>
            Submit
          </button>
        )}
      </form>
      {submitted != null && (
        <p className={'feedback' + (isCorrect ? ' feedback-correct' : ' feedback-incorrect')}>
          {isCorrect ? step.feedback.correct : step.feedback.incorrect}
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
