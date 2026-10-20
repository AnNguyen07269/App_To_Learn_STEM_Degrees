# Anject

An interactive, Brilliant-style learning app. Courses are played step by step —
short explanations mixed with multiple-choice and numeric questions — and all
course content lives in plain JSON files, separate from the app's code.

School gives you knowledge; tools are how knowledge touches the world. This
app makes learning both, especially the tools, fast and hands-on, so people
can go from understanding to building sooner.

## Running it

```
npm install
npm run dev
```

Then open the printed `localhost` URL. `npm run build` type-checks and
produces a production build in `dist/`.

## Content structure

Everything under `public/content/` is data, not code. Adding or editing a
course means adding or editing JSON files — no TypeScript changes needed.

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
                               (not used by the UI yet — reserved for a future
                               "paths" feature)
```

A course with an empty `lessons` array shows up on the home screen as
"Coming soon."

### Adding a course

1. Create `public/content/courses/<new-id>/course.json` with `id`, `title`,
   `description`, `level`, `icon`, and a `lessons` array (an empty array is
   fine if you don't have lessons written yet).
2. Add `<new-id>` to `public/content/courses/index.json`.
3. For each lesson id in that course, add
   `public/content/courses/<new-id>/lessons/<lessonId>.json`.

### Lesson / step format

A lesson is `{ id, title, steps }`. Each step has an `id` and a `type` of
`text`, `multiple-choice`, or `numeric`:

```json
{
  "id": "step-2",
  "type": "multiple-choice",
  "prompt": "What is this charge-carrier-depleted region called?",
  "choices": [
    { "id": "a", "text": "The depletion region" },
    { "id": "b", "text": "The conduction band" }
  ],
  "correctChoiceId": "a",
  "feedback": {
    "correct": "Right — this is the depletion region.",
    "incorrectByChoice": {
      "b": "The conduction band is an energy-level concept, not a region."
    },
    "incorrectDefault": "Think about what happens right at the junction."
  }
}
```

A `numeric` step additionally has `answer`, an optional `tolerance` (default
`0`), and an optional display `unit`, with `feedback.correct` /
`feedback.incorrect` messages.
