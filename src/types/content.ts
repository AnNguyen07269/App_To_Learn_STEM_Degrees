// Shape of the JSON content files under /public/content.
// This is the one place that defines what a valid lesson/course looks like —
// the loader validates against it, and every component trusts it.

export interface Choice {
  id: string;
  text: string;
}

export interface StepBase {
  id: string;
}

export interface TextStep extends StepBase {
  type: 'text';
  body: string;
}

export interface MultipleChoiceStep extends StepBase {
  type: 'multiple-choice';
  prompt: string;
  choices: Choice[];
  correctChoiceId: string;
  feedback: {
    correct: string;
    /** Optional per-choice feedback, keyed by choice id, for naming a specific misconception. */
    incorrectByChoice?: Record<string, string>;
    /** Shown for a wrong choice that has no entry in incorrectByChoice. */
    incorrectDefault: string;
  };
}

export interface NumericStep extends StepBase {
  type: 'numeric';
  prompt: string;
  answer: number;
  /** Allowed absolute difference from `answer` to still count as correct. Defaults to 0. */
  tolerance?: number;
  /** Display-only unit shown next to the input, e.g. "V/µm". */
  unit?: string;
  feedback: {
    correct: string;
    incorrect: string;
  };
}

export type Step = TextStep | MultipleChoiceStep | NumericStep;

export interface Lesson {
  id: string;
  title: string;
  steps: Step[];
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Course {
  id: string;
  title: string;
  description?: string;
  level: CourseLevel;
  /** Emoji shown on the course card. */
  icon: string;
  /** Lesson ids, resolved to lessons/<id>.json under this course's folder. Empty = "coming soon". */
  lessons: string[];
}
