import { useEffect, useState } from 'react';
import type { Course, Degree } from './types/content';
import { loadCourse, loadDegree, loadIndex } from './content/loader';
import LessonPlayer from './components/LessonPlayer';

function titleCase(id: string): string {
  return id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

type Nav =
  | { screen: 'degrees' }
  | { screen: 'courses'; degree: Degree; courses: Course[] }
  | { screen: 'lessons'; degree: Degree; course: Course }
  | { screen: 'lesson'; degree: Degree; course: Course; lessonId: string };

export default function App() {
  const [degrees, setDegrees] = useState<Degree[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nav, setNav] = useState<Nav>({ screen: 'degrees' });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const index = await loadIndex();
        const loadedDegrees = await Promise.all(index.degrees.map(loadDegree));
        setDegrees(loadedDegrees);
      } catch (err) {
        setError(String((err as Error).message ?? err));
      }
    }
    init();
  }, []);

  async function openDegree(degree: Degree) {
    setBusy(true);
    try {
      const courses = await Promise.all(
        degree.courses.map((courseId) => loadCourse(degree.id, courseId)),
      );
      setNav({ screen: 'courses', degree, courses });
    } catch (err) {
      setError(String((err as Error).message ?? err));
    } finally {
      setBusy(false);
    }
  }

  if (error) return <div className="app-error">{error}</div>;
  if (!degrees) return <div className="app-loading">Loading…</div>;

  if (nav.screen === 'lesson') {
    const { degree, course, lessonId } = nav;
    return (
      <LessonPlayer
        degreeId={degree.id}
        courseId={course.id}
        lessonId={lessonId}
        onExit={() => setNav({ screen: 'lessons', degree, course })}
      />
    );
  }

  if (nav.screen === 'lessons') {
    const { degree, course } = nav;
    return (
      <div className="app-browse">
        <button type="button" className="nav-back" onClick={() => openDegree(degree)}>
          ← {degree.title}
        </button>
        <h1>{course.title}</h1>
        {course.description && <p>{course.description}</p>}
        <ul className="lesson-list">
          {course.lessons.map((lessonId) => (
            <li key={lessonId}>
              <button
                type="button"
                onClick={() => setNav({ screen: 'lesson', degree, course, lessonId })}
              >
                {titleCase(lessonId)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (nav.screen === 'courses') {
    const { degree, courses } = nav;
    return (
      <div className="app-browse">
        <button type="button" className="nav-back" onClick={() => setNav({ screen: 'degrees' })}>
          ← Degrees
        </button>
        <h1>{degree.title}</h1>
        {degree.description && <p>{degree.description}</p>}
        <ul className="lesson-list">
          {courses.map((course) => (
            <li key={course.id}>
              <button type="button" onClick={() => setNav({ screen: 'lessons', degree, course })}>
                {course.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="app-browse">
      <h1>Choose a Degree</h1>
      <ul className="lesson-list">
        {degrees.map((degree) => (
          <li key={degree.id}>
            <button type="button" disabled={busy} onClick={() => openDegree(degree)}>
              {degree.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
