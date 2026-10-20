import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Course, Lesson } from '../types/content';
import { loadCourse, loadLesson } from '../content/loader';

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  if (!courseId) return null;
  // Keying on courseId remounts this on navigation between courses, so each
  // course page starts with fresh state instead of resetting it by hand.
  return <CoursePageForCourse key={courseId} courseId={courseId} />;
}

function CoursePageForCourse({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const loadedCourse = await loadCourse(courseId);
        setCourse(loadedCourse);
        const loadedLessons = await Promise.all(
          loadedCourse.lessons.map((lessonId) => loadLesson(courseId, lessonId)),
        );
        setLessons(loadedLessons);
      } catch (err) {
        setError(String((err as Error).message ?? err));
      }
    }
    init();
  }, [courseId]);

  if (error) return <div className="app-error">{error}</div>;
  if (!course || !lessons) return <div className="app-loading">Loading…</div>;

  return (
    <div className="course-page">
      <Link to="/" className="nav-back">
        ← All courses
      </Link>
      <div className="course-header">
        <span className="course-icon-large" aria-hidden="true">
          {course.icon}
        </span>
        <div>
          <h1>{course.title}</h1>
          {course.description && <p>{course.description}</p>}
        </div>
      </div>

      {lessons.length === 0 ? (
        <p className="course-coming-soon">Coming soon — no lessons yet.</p>
      ) : (
        <ol className="lesson-path">
          {lessons.map((lesson) => (
            <li key={lesson.id}>
              <Link to={`/courses/${course.id}/${lesson.id}`} className="lesson-node">
                {lesson.title}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
