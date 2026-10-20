import { Link } from 'react-router-dom';
import type { Course } from '../types/content';

interface Props {
  course: Course;
}

export default function CourseCard({ course }: Props) {
  const comingSoon = course.lessons.length === 0;

  return (
    <Link to={`/courses/${course.id}`} className={`course-card ${comingSoon ? 'coming-soon' : ''}`}>
      <div className="course-card-tile">
        <span className="course-level">{comingSoon ? 'Coming soon' : course.level}</span>
        <span className="course-icon" aria-hidden="true">
          {course.icon}
        </span>
        <div className="course-progress">
          <div className="course-progress-fill" style={{ width: '0%' }} />
        </div>
      </div>
      <span className="course-title">{course.title}</span>
    </Link>
  );
}
