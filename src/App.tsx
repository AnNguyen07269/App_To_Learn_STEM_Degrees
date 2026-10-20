import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import DomainsPage from './components/DomainsPage';
import CoursePage from './components/CoursePage';
import LessonPlayer from './components/LessonPlayer';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="domains" element={<DomainsPage />} />
        <Route path="courses/:courseId" element={<CoursePage />} />
        <Route path="courses/:courseId/:lessonId" element={<LessonPlayer />} />
      </Route>
    </Routes>
  );
}
