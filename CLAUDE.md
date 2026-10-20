# Anject

## What this is

An interactive, Brilliant-style learning app. Courses are played step by
step — short explanations mixed with multiple-choice and numeric questions —
and all course content lives in plain JSON files, separate from the app's
code.

**Mission:** School gives you knowledge; tools are how knowledge touches the
world. This app makes learning both, especially the tools, fast and
hands-on, so people can go from understanding to building sooner.

## Content model

Flat course catalog under `public/content/`, fetched at runtime (not
bundled), so adding/editing a course is a data change, not a code change:

```
public/content/
  courses/
    index.json              ordered list of every course id in the catalog
    <courseId>/
      course.json            { id, title, description, level, icon, lessons }
      lessons/
        <lessonId>.json       { id, title, steps: [...] }
  degrees/
    <degreeId>.json           { id, title, description, courses: [courseIds] }
                               (data only — not read by any UI yet)
```

A course with `lessons: []` renders as "Coming soon" (muted on its card, a
placeholder message on its course page).

**Lesson/step format:** a lesson is `{ id, title, steps }`. Each step has an
`id` and a `type`:

- `text` — `{ body }`, just an explanation with a Continue button.
- `multiple-choice` — `{ prompt, choices: [{id, text}], correctChoiceId, feedback }`.
  `feedback.incorrectByChoice` lets a specific wrong choice name its own
  misconception; `feedback.incorrectDefault` is the fallback.
- `numeric` — `{ prompt, answer, tolerance?, unit?, feedback: {correct, incorrect} }`.

## Folder map (`src/`)

- `types/content.ts` — the single source of truth for course/lesson/step
  shape. Everything else trusts this.
- `content/loader.ts` — the only code that knows content file paths. Fetches
  and validates JSON from `public/content/`, throwing descriptive errors on
  malformed data.
- `main.tsx` — entry point, wraps `<App/>` in `<BrowserRouter>`.
- `App.tsx` — route table only: `/`, `/domains`, `/courses/:courseId`,
  `/courses/:courseId/:lessonId`, all under `Layout`.
- `components/Layout.tsx` — persistent top bar (app name + Courses/Domains
  nav) wrapping every page via `<Outlet/>`.
- `components/Home.tsx` — fetches every course, renders the scrollable card
  grid.
- `components/CourseCard.tsx` — one square card: level, icon, progress bar
  (static 0% for now), title.
- `components/CoursePage.tsx` — course header + vertical lesson path with
  real lesson titles (fetched, not derived from the id), or "Coming soon".
- `components/DomainsPage.tsx` — static placeholder for the future
  domains/categories feature.
- `components/LessonPlayer.tsx` — plays a lesson's `steps[]` one at a time;
  generic over step type, knows nothing about course content itself.
- `components/steps/*.tsx` — one component per step type (`TextStep`,
  `MultipleChoiceStep`, `NumericStep`). Adding a new step type means adding
  one type in `content.ts`, one component here, and one case in
  `LessonPlayer`'s `renderStep`.
- `index.css` — dark theme is the actual default (not a
  `prefers-color-scheme` fallback).

## Conventions for working in this repo

- **Always show a plan and wait for explicit OK before writing code.** List
  files to create/move/delete and the reasoning; don't start editing until
  approved.
- **Run `npm run build` before saying a task is done.** Fix any type errors.
  Run `npm run lint` too and fix anything it flags, not just hard failures.
- Content changes (new/edited courses, lessons) are data-only — they should
  never require touching `src/`.
- Prefer keying a component on the id that changes (see `CoursePage`,
  `LessonPlayer`) over manually resetting state in a `useEffect` — cleaner
  and is what this codebase already does.

## Ideas for later (not started)

- **Domains window** — browse/filter courses by domain instead of one flat
  grid (the `/domains` route and nav link already exist as a placeholder).
- **Progress tracking** — persist per-lesson/per-course completion; feed the
  course card's progress bar real data instead of a static 0%.
- **Interactive widgets** — richer step types beyond text/multiple-choice/
  numeric (e.g. drag-and-drop, circuit/graph manipulation).
- **Tooling courses** — Git, GitHub, Linux CLI, LTspice, Vivado, AI coding
  assistants already have placeholder course entries with no lessons yet.
- **Career path builder** — use the existing (currently unused) `degrees/`
  path files as the basis for guided multi-course sequences.
