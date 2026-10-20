import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="top-bar">
        <span className="app-name">Anject</span>
        <nav className="top-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Courses
          </NavLink>
          <NavLink to="/domains" className={({ isActive }) => (isActive ? 'active' : '')}>
            Domains
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
