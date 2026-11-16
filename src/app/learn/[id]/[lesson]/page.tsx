import { notFound, redirect } from "next/navigation";
import { LessonCheck } from "@/components/LessonCheck";
import { findLesson, nextLessonId } from "@/lib/courses";
import { AppError } from "@/lib/errors";
import { getLearning } from "@/lib/service";

export default async function LessonPage({ params }: { params: Promise<{ id: string; lesson: string }> }) {
  const { id, lesson: lessonId } = await params;
  let done: string[];
  try {
    done = (await getLearning(id)).done;
  } catch (error) {
    if (error instanceof AppError && error.status === 404) notFound();
    if (error instanceof AppError && error.status === 402) redirect(`/result/${id}`);
    throw error;
  }

  const found = findLesson(lessonId);
  if (!found) notFound();
  const { course, lesson, index } = found;
  const next = nextLessonId(lesson.id);
  const bullets = (lines: string[]) => <ul className="includes">{lines.map((line) => <li key={line}>{line.slice(2)}</li>)}</ul>;
  // Group consecutive "- " lines into one list.
  const blocks: (string | string[])[] = [];
  for (const line of lesson.body) {
    const last = blocks[blocks.length - 1];
    if (line.startsWith("- ")) Array.isArray(last) ? last.push(line) : blocks.push([line]);
    else blocks.push(line);
  }

  return (
    <main>
      <div className="stack">
        <a className="label" href={`/learn/${id}`}>← {course.title} · lesson {index + 1} of {course.lessons.length}</a>
        <h1>{lesson.title}</h1>
        <span className="caption">{lesson.minutes} minute read{done.includes(lesson.id) ? " · Done" : ""}</span>
      </div>
      <article className="stack lesson">
        {blocks.map((block, i) => (Array.isArray(block) ? <div key={i}>{bullets(block)}</div> : <p key={i}>{block}</p>))}
      </article>
      <section className="panel">
        <span className="label">Takeaway</span>
        <p><strong>{lesson.takeaway}</strong></p>
      </section>
      <LessonCheck attemptId={id} lessonId={lesson.id} checks={lesson.checks} nextHref={next ? `/learn/${id}/${next}` : `/learn/${id}`} last={!next} />
    </main>
  );
}
