import { useEffect, useState } from 'react';
import type { Course, Degree } from './types/content';
import { loadCourse, loadDegree, loadIndex } from './content/loader';
import LessonPlayer from './components/LessonPlayer';

function titleCase(id: string): string {
  return id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function App() {
  const [degree, setDegree] = useState<Degree | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const index = await loadIndex();
        const degreeId = index.degrees[0];
        const loadedDegree = await loadDegree(degreeId);
        const courseId = loadedDegree.courses[0];
        const loadedCourse = await loadCourse(degreeId, courseId);
        setDegree(loadedDegree);
        setCourse(loadedCourse);
      } catch (err) {
        setError(String((err as Error).message ?? err));
      }
    }
    init();
  }, []);

  if (error) return <div className="app-error">{error}</div>;
  if (!degree || !course) return <div className="app-loading">Loading…</div>;

  if (activeLessonId) {
    return (
      <LessonPlayer
        degreeId={degree.id}
        courseId={course.id}
        lessonId={activeLessonId}
        onExit={() => setActiveLessonId(null)}
      />
    );
  }

  return (
    <div className="app-browse">
      <h1>{degree.title}</h1>
      <h2>{course.title}</h2>
      {course.description && <p>{course.description}</p>}
      <ul className="lesson-list">
        {course.lessons.map((lessonId) => (
          <li key={lessonId}>
            <button type="button" onClick={() => setActiveLessonId(lessonId)}>
              {titleCase(lessonId)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
