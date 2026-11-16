import { describe, expect, it } from "vitest";
import { COURSE_DISCLAIMER, COURSES, findLesson, LESSON_COUNT, nextLessonId } from "@/lib/courses";

const lessons = COURSES.flatMap((course) => course.lessons);

describe("course content", () => {
  it("has four courses of four lessons with unique ids", () => {
    expect(COURSES).toHaveLength(4);
    for (const course of COURSES) expect(course.lessons).toHaveLength(4);
    expect(LESSON_COUNT).toBe(16);
    expect(new Set(lessons.map((l) => l.id)).size).toBe(16);
    expect(new Set(COURSES.map((c) => c.id)).size).toBe(4);
  });
  it("gives every lesson real content, a takeaway and two valid checks", () => {
    for (const lesson of lessons) {
      expect(lesson.body.join(" ").split(/\s+/).length).toBeGreaterThan(90);
      expect(lesson.takeaway.length).toBeGreaterThan(30);
      expect(lesson.checks).toHaveLength(2);
      for (const check of lesson.checks) {
        expect(check.options).toHaveLength(4);
        expect(new Set(check.options).size).toBe(4);
        expect(check.answer).toBeGreaterThanOrEqual(0);
        expect(check.answer).toBeLessThan(4);
        expect(check.why.length).toBeGreaterThan(20);
      }
    }
  });
  it("makes no promise of work, income or pay", () => {
    const text = JSON.stringify(COURSES).toLowerCase();
    for (const banned of ["guaranteed", "guarantee you", "you will earn", "per hour", "/hr", "get hired fast", "easy money"]) {
      expect(text).not.toContain(banned);
    }
    expect(text).not.toMatch(/\$\d+ ?(an|per) hour/);
    expect(COURSE_DISCLAIMER).toContain("not affiliated");
    expect(COURSE_DISCLAIMER).toContain("do not guarantee");
  });
  it("gets its own worked arithmetic right", () => {
    const check = findLesson("errors-3")!.lesson.checks[0]!;
    expect(check.options[check.answer]).toBe("$80");
    expect(60 / 0.75).toBe(80);
  });
  it("walks lessons in order across courses", () => {
    expect(nextLessonId("orientation-4")).toBe("rubrics-1");
    expect(nextLessonId("assessment-4")).toBeUndefined();
    expect(nextLessonId("nope")).toBeUndefined();
    expect(findLesson("rubrics-2")?.course.id).toBe("rubrics");
  });
});
