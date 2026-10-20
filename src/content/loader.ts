import type { Course, Lesson, Step } from '../types/content';

const CONTENT_ROOT = '/content';

/**
 * Fetches and JSON-parses a file under /public, with error messages that
 * point at the actual problem instead of a generic "fetch failed" — this
 * matters because the files it reads are hand-authored data, not code.
 */
async function fetchJson<T>(path: string): Promise<T> {
  const url = `${CONTENT_ROOT}${path}`;
  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error(`Could not reach content file "${url}": ${String(error)}`);
  }

  if (!response.ok) {
    throw new Error(`Content file "${url}" returned ${response.status} ${response.statusText}`);
  }

  try {
    return (await response.json()) as T;
  } catch (error) {
    throw new Error(`Content file "${url}" is not valid JSON: ${String(error)}`);
  }
}

const KNOWN_STEP_TYPES: Step['type'][] = ['text', 'multiple-choice', 'numeric'];

/** Minimal runtime validation so a malformed lesson file fails loudly, with a useful message. */
function validateLesson(lesson: Lesson, sourcePath: string): void {
  if (!Array.isArray(lesson.steps)) {
    throw new Error(`Lesson "${sourcePath}" has no "steps" array.`);
  }

  lesson.steps.forEach((step, index) => {
    if (!step.id) {
      throw new Error(`Lesson "${sourcePath}" step at index ${index} is missing an "id".`);
    }
    if (!KNOWN_STEP_TYPES.includes(step.type)) {
      throw new Error(
        `Lesson "${sourcePath}" step "${step.id}" has unknown type "${step.type}". ` +
          `Expected one of: ${KNOWN_STEP_TYPES.join(', ')}.`,
      );
    }
    if (step.type === 'multiple-choice' && !step.choices?.some((c) => c.id === step.correctChoiceId)) {
      throw new Error(
        `Lesson "${sourcePath}" step "${step.id}" has correctChoiceId "${step.correctChoiceId}" ` +
          `that doesn't match any choice id.`,
      );
    }
  });
}

/** The ordered list of every course id in the catalog. */
export async function loadCourseIds(): Promise<string[]> {
  return fetchJson<string[]>('/courses/index.json');
}

export async function loadCourse(courseId: string): Promise<Course> {
  return fetchJson<Course>(`/courses/${courseId}/course.json`);
}

export async function loadLesson(courseId: string, lessonId: string): Promise<Lesson> {
  const path = `/courses/${courseId}/lessons/${lessonId}.json`;
  const lesson = await fetchJson<Lesson>(path);
  validateLesson(lesson, path);
  return lesson;
}
