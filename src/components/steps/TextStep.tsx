import type { TextStep as TextStepData } from '../../types/content';

interface Props {
  step: TextStepData;
  onComplete: () => void;
}

/** A pure explanation step — nothing to answer, so Continue is always enabled. */
export default function TextStep({ step, onComplete }: Props) {
  return (
    <div className="step step-text">
      <p>{step.body}</p>
      <button type="button" className="continue" onClick={onComplete}>
        Continue
      </button>
    </div>
  );
}
