import { notFound, redirect } from "next/navigation";
import { COURSE_DISCLAIMER, COURSES, LESSON_COUNT } from "@/lib/courses";
import { AppError } from "@/lib/errors";
import { getLearning } from "@/lib/service";

export default async function LearnPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let done: string[];
  try {
    done = (await getLearning(id)).done;
  } catch (error) {
    if (error instanceof AppError && error.status === 404) notFound();
    if (error instanceof AppError && error.status === 402) redirect(`/result/${id}`);
    throw error;
  }

  return (
    <main>
      <div className="stack">
        <span className="label">Courses · {done.length} of {LESSON_COUNT} lessons done</span>
        <h1>Get ready for <mark>AI training work</mark></h1>
        <p className="muted">Short lessons on the skills that screenings test: scoring answers against a rubric, catching errors, and explaining your judgement.</p>
      </div>
      {COURSES.map((course) => {
        const finished = course.lessons.filter((lesson) => done.includes(lesson.id)).length;
        const next = course.lessons.find((lesson) => !done.includes(lesson.id)) ?? course.lessons[0]!;
        return (
          <section className="course" key={course.id} data-testid="course">
            <div className="world"><img src={`/art/courses/${course.cover}.webp`} alt="" width={960} height={640} loading="lazy" /></div>
            <div className="stack" style={{ padding: "4px 4px 0" }}>
              <h2>{course.title}</h2>
              <p className="muted">{course.summary}</p>
              <ol className="lessons">
                {course.lessons.map((lesson) => (
                  <li key={lesson.id}>
                    <a href={`/learn/${id}/${lesson.id}`}>
                      <i data-on={done.includes(lesson.id)} aria-hidden="true" />
                      <span>{lesson.title}</span>
                      <span className="caption">{done.includes(lesson.id) ? "Done" : `${lesson.minutes} min`}</span>
                    </a>
                  </li>
                ))}
              </ol>
              <a className="btn btn-primary" href={`/learn/${id}/${next.id}`}>
                {finished === 0 ? "Start course" : finished === course.lessons.length ? "Review course" : "Continue course"}
              </a>
            </div>
          </section>
        );
      })}
      <a className="btn btn-secondary" href={`/report/${id}`}>Back to my report</a>
      <p className="caption">{COURSE_DISCLAIMER}</p>
    </main>
  );
}
