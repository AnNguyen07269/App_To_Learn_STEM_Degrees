import { useEffect, useState } from 'react';
import type { Course } from '../types/content';
import { loadCourse, loadCourseIds } from '../content/loader';
import CourseCard from './CourseCard';

export default function Home() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const ids = await loadCourseIds();
        const loaded = await Promise.all(ids.map(loadCourse));
        setCourses(loaded);
      } catch (err) {
        setError(String((err as Error).message ?? err));
      }
    }
    init();
  }, []);

  if (error) return <div className="app-error">{error}</div>;
  if (!courses) return <div className="app-loading">Loading…</div>;

  return (
    <div className="home">
      <h1>All courses</h1>
      <div className="course-grid">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
