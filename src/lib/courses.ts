// Courses for people who want paid AI-training work: rating, ranking and
// correcting AI answers for the companies that build the models.
//
// Rules for this content:
// - No promise of work or income. Getting accepted does not guarantee tasks.
// - Platforms are named only as examples. KnowYourIQ is not affiliated with any of them.
// - No pay rates or acceptance rates: published figures conflict and go stale.

export interface Check {
  question: string;
  options: string[];
  answer: number;
  why: string;
}

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  /** Paragraphs. A line starting with "- " is a bullet. */
  body: string[];
  takeaway: string;
  checks: Check[];
}

export interface Course {
  id: string;
  title: string;
  summary: string;
  cover: string;
  lessons: Lesson[];
}

export const COURSE_DISCLAIMER =
  "KnowYourIQ is not affiliated with Mercor, Outlier, DataAnnotation or any other company named in these courses. The courses teach skills; they do not guarantee acceptance, work or income.";

export const COURSES: readonly Course[] = [
  {
    id: "orientation",
    title: "How AI training work works",
    summary: "What the job is, how people get in, and what to expect once you are accepted.",
    cover: "orientation",
    lessons: [
      {
        id: "orientation-1",
        title: "What an AI trainer actually does",
        minutes: 4,
        body: [
          "AI models learn from examples of good and bad answers. Companies that build models pay people to produce those examples. That work is usually called AI training, data annotation or model evaluation.",
          "Most tasks fall into a few types:",
          "- Rating: read one AI answer and score it against written criteria.",
          "- Ranking: compare two or more answers to the same prompt and say which is better, and why.",
          "- Rewriting: fix a flawed answer so it becomes a model example.",
          "- Writing: create prompts, reference answers or test questions in a subject you know.",
          "- Checking: verify facts, run code, or confirm an answer followed its instructions.",
          "The common thread is judgement you can explain. Anyone can say an answer feels wrong. The paid skill is saying exactly what is wrong, pointing to the rule it breaks, and doing that the same way on the hundredth task as on the first.",
        ],
        takeaway: "The job is explained judgement: what is wrong, which rule it breaks, every time.",
        checks: [
          { question: "Which of these is closest to a typical AI-training task?", options: ["Designing the model's hardware", "Comparing two AI answers and explaining which is better", "Selling AI subscriptions", "Writing marketing copy for an AI company"], answer: 1, why: "Ranking answers with a written reason is one of the most common task types." },
          { question: "What separates paid evaluation from a casual opinion?", options: ["Speed", "A strong personal view", "A reason tied to written criteria, applied consistently", "Longer comments"], answer: 2, why: "Platforms pay for judgements that follow the criteria and can be repeated." },
        ],
      },
      {
        id: "orientation-2",
        title: "How people get in",
        minutes: 4,
        body: [
          "Each platform has its own door, and the doors change, so always read the platform's own instructions. The patterns below are common at the time of writing.",
          "- A written assessment. You are given guidelines and sample tasks, and your answers are graded. DataAnnotation is known for starting this way.",
          "- A profile plus project screenings. You list your skills, then take a short test for each project you want. Outlier works roughly like this.",
          "- A resume and a recorded interview, sometimes run by an AI interviewer that asks about your experience. Mercor is known for this route, and for roles that expect real expertise in a field.",
          "Three things hold across all of them. Screenings are usually unpaid. You often get one attempt. And you may never be told why you were not accepted.",
          "That makes preparation worth more than speed. Apply to several platforms rather than waiting on one, and treat each screening like an exam you cannot retake.",
        ],
        takeaway: "Expect an unpaid, one-attempt screening. Prepare first, and apply to more than one platform.",
        checks: [
          { question: "Why prepare before starting a screening?", options: ["They are timed in seconds", "You often get only one attempt and no feedback", "Preparation is required by law", "Screenings are always paid by the minute"], answer: 1, why: "A single attempt with silent rejection is common, so the first try has to be your best." },
          { question: "What is the safest way to learn a platform's current process?", options: ["A social media thread", "This course", "The platform's own instructions", "A friend's memory of last year"], answer: 2, why: "Processes change. The platform's own pages are the only current source." },
        ],
      },
      {
        id: "orientation-3",
        title: "Work comes in waves",
        minutes: 3,
        body: [
          "Being accepted puts you in a pool. It does not put work in front of you. Tasks appear when a client project matches your skills, language and location, and they stop when the project ends.",
          "People who do this for long describe the same rhythm: busy weeks, then quiet ones, sometimes with no warning. Projects can be paused or cancelled, and rates can change between projects.",
          "Plan for that honestly:",
          "- Treat it as variable contract income, not a salary.",
          "- You are normally an independent contractor, so tax and insurance are yours to handle. Check the rules where you live.",
          "- Being on two or three platforms smooths the quiet periods.",
          "- Quality scores usually decide who gets the next project, so early tasks matter most.",
        ],
        takeaway: "Acceptance is a place in the pool. Treat the income as variable and protect your quality score.",
        checks: [
          { question: "You were accepted last week and have no tasks. What is the most likely reason?", options: ["Your account was deleted", "No current project matches your profile yet", "You must pay to unlock tasks", "The platform has closed"], answer: 1, why: "Tasks depend on live projects matching your skills, language and region." },
          { question: "Which habit best protects your access to future projects?", options: ["Working as fast as possible", "Keeping quality high on early tasks", "Messaging support daily", "Skipping the guidelines"], answer: 1, why: "Quality scores commonly decide who is offered the next project." },
        ],
      },
      {
        id: "orientation-4",
        title: "Spotting scams and staying safe",
        minutes: 3,
        body: [
          "Because this work is remote and popular, scammers imitate it. A few checks keep you safe.",
          "- Real platforms do not charge you to apply, to take a screening, or to unlock tasks.",
          "- Apply only through the company's own website. Check the address carefully; fake sites use near-identical names.",
          "- Be wary of recruiters who contact you first on messaging apps and push you to act quickly.",
          "- Never share passwords, one-time codes, or let someone else work under your account. Account sharing usually gets both people removed.",
          "- Keep client material confidential. Tasks often include unreleased prompts and guidelines, and posting them breaks your agreement.",
          "If something feels off, stop and look the company up independently before you go further.",
        ],
        takeaway: "You should never pay to work. Apply only on the company's own site and keep your account yours.",
        checks: [
          { question: "A recruiter says you must pay a small fee to unlock your first tasks. What is this?", options: ["Standard practice", "A refundable deposit", "A warning sign of a scam", "A tax"], answer: 2, why: "Legitimate platforms do not charge workers to apply or to receive tasks." },
          { question: "A friend offers to do tasks on your account while you are busy. Should you agree?", options: ["Yes, if they are skilled", "Yes, if you split the pay", "No, account sharing usually breaks the rules", "Only on weekends"], answer: 2, why: "Accounts are tied to one verified person; sharing commonly leads to removal." },
        ],
      },
    ],
  },
  {
    id: "rubrics",
    title: "Thinking in rubrics",
    summary: "Score and compare AI answers the way graders do, and write reasons that hold up.",
    cover: "rubrics",
    lessons: [
      {
        id: "rubrics-1",
        title: "What a rubric is, and why it beats your opinion",
        minutes: 4,
        body: [
          "A rubric is a written list of what counts as good for one task: the criteria, and what each score on each criterion looks like. A typical rubric might score accuracy, completeness, following instructions, and clarity, each from 1 to 5.",
          "The rubric exists so that a thousand different people give the same answer the same score. Your personal taste is not part of it. If the rubric says a correct but blunt answer scores 5 for accuracy, it scores 5, even if you would have written it more kindly.",
          "New evaluators lose points in two ways. They score what they would have preferred instead of what the rubric asks. And they let one strong feeling, good or bad, pull every criterion in the same direction.",
          "The fix is mechanical: take one criterion at a time, find its definition, and decide that score on its own before you look at the next.",
        ],
        takeaway: "Score each criterion separately against its written definition, not against your taste.",
        checks: [
          { question: "An answer is fully correct but written in a style you dislike. The rubric has no style criterion. What happens to the accuracy score?", options: ["It drops a little", "It is unaffected", "It drops a lot", "You skip the task"], answer: 1, why: "Accuracy is judged on correctness alone. Taste is not in the rubric." },
          { question: "What is the main purpose of a rubric?", options: ["To slow evaluators down", "To make different people score the same answer the same way", "To reward long answers", "To replace the guidelines"], answer: 1, why: "Rubrics exist for consistency between evaluators." },
        ],
      },
      {
        id: "rubrics-2",
        title: "Scoring one answer: evidence first, score second",
        minutes: 4,
        body: [
          "Good evaluators collect evidence before they pick a number. Try this order on every task.",
          "- Read the prompt twice and list what it actually asked for, including limits such as length, format or tone.",
          "- Read the answer once without judging.",
          "- For each criterion, mark the exact words in the answer that help or hurt it.",
          "- Only then choose the score whose description matches what you marked.",
          "Example. The prompt asks for three budget tips in under 60 words. The answer gives four good tips in 110 words. Accuracy is high: the tips are sound. Following instructions is low: wrong count and nearly double the length. One answer, two very different scores, and both are right.",
          "If you cannot point to words in the answer that justify a score, you are guessing. Go back and find them.",
        ],
        takeaway: "Mark the evidence in the answer for each criterion, then choose the score that matches it.",
        checks: [
          { question: "A prompt asks for a two-sentence summary. The answer is accurate but five sentences long. Which is true?", options: ["Both accuracy and instruction-following are high", "Accuracy is high, instruction-following is low", "Both are low", "Length never matters"], answer: 1, why: "The content is right, but the stated limit was broken. Criteria are scored separately." },
          { question: "What should you have before choosing a score?", options: ["A gut feeling", "Specific words in the answer that justify it", "The other evaluator's score", "A longer answer to compare"], answer: 1, why: "A score you cannot tie to the text is a guess." },
        ],
      },
      {
        id: "rubrics-3",
        title: "Comparing two answers",
        minutes: 4,
        body: [
          "Ranking tasks show you two answers to one prompt and ask which is better. The trap is choosing the one that looks more impressive: longer, more confident, better formatted.",
          "Use the rubric's priorities instead. Most guidelines put them in roughly this order: safe, then correct, then follows the instructions, then complete, then well written. A short correct answer beats a long polished one with a factual error.",
          "Work through it like this:",
          "- Check each answer for serious problems first: errors, broken instructions, harmful content.",
          "- If only one has a serious problem, the other wins, however plain it is.",
          "- If both are clean, compare completeness, then clarity.",
          "- If they are truly equal, say so. Most tasks allow a tie, and forcing a winner is itself an error.",
          "Decide how big the gap is as well. 'Slightly better' and 'much better' are different answers, and graders check both.",
        ],
        takeaway: "Rank by the rubric's priorities: a plain correct answer beats a polished wrong one.",
        checks: [
          { question: "Answer A is long, confident and contains one wrong fact. Answer B is short and fully correct. Which usually wins?", options: ["A, it is more detailed", "B, correctness outranks polish", "A, confidence matters most", "Neither can be ranked"], answer: 1, why: "Correctness sits above completeness and style in most guidelines." },
          { question: "Both answers are equally good on every criterion. What should you do?", options: ["Pick the first one", "Pick the longer one", "Mark a tie if the task allows it", "Report a bug"], answer: 2, why: "Forcing a winner when there is none is an evaluation error." },
        ],
      },
      {
        id: "rubrics-4",
        title: "Writing the justification",
        minutes: 4,
        body: [
          "Most tasks ask you to explain your score in a sentence or two. Reviewers read these to decide whether you understood the task, so a correct score with a vague reason can still count against you.",
          "A strong justification has three parts: the claim, the evidence, and the rule.",
          "- Claim: what you decided. 'Response B is better.'",
          "- Evidence: the specific thing in the text. 'Response A states the boiling point of water as 90°C.'",
          "- Rule: the criterion it touches. 'That is a factual error, so A fails accuracy.'",
          "Weak: 'B is better because it is more helpful and accurate.' Strong: 'B is better. A gives the boiling point of water as 90°C, a factual error. B's figures are correct and it answers all three parts of the question.'",
          "Write it in your own words. Many platforms prohibit using AI tools to write justifications, and reviewers can tell.",
        ],
        takeaway: "Claim, evidence, rule: say what you decided, quote what you saw, name the criterion.",
        checks: [
          { question: "Which justification is strongest?", options: ["'A is better overall.'", "'A is more helpful and clear.'", "'A is better: B gives the wrong year for the event, which fails accuracy.'", "'I prefer A.'"], answer: 2, why: "It states the decision, cites the specific error, and names the criterion." },
          { question: "Why avoid using an AI tool to write your justifications?", options: ["It is slower", "Many platforms prohibit it and it defeats the purpose of human judgement", "AI cannot write sentences", "It costs money"], answer: 1, why: "The work is your judgement; outsourcing it commonly breaks platform rules." },
        ],
      },
    ],
  },
  {
    id: "errors",
    title: "Catching what the AI got wrong",
    summary: "Find the factual slips, missed instructions and broken reasoning that graders look for.",
    cover: "errors",
    lessons: [
      {
        id: "errors-1",
        title: "Fact-checking without losing an hour",
        minutes: 4,
        body: [
          "AI answers can state false things in a calm, confident voice. Names, dates, numbers, quotations and citations are where it happens most.",
          "You cannot verify every word, so check what matters:",
          "- Pull out the specific claims: figures, dates, names, 'the first', 'the largest', direct quotes.",
          "- Check the ones the answer depends on. If the conclusion rests on a number, check that number.",
          "- Use a reliable source and, for anything important, a second one.",
          "- Treat citations with suspicion. Models sometimes invent sources that look real. If a reference is given, confirm it exists and says what the answer claims.",
          "Record what you found. 'The answer says the treaty was signed in 1921; the national archive gives 1919' is a finding. 'Seems inaccurate' is not.",
          "If the guidelines say not to use outside sources for a task, follow the guidelines and judge only what you were given.",
        ],
        takeaway: "Check the claims the answer depends on, confirm citations exist, and record exactly what you found.",
        checks: [
          { question: "An answer cites a study to support its main point. What should you do?", options: ["Trust it, citations are reliable", "Confirm the study exists and says what is claimed", "Ignore citations entirely", "Mark it wrong without checking"], answer: 1, why: "Models can invent realistic-looking sources, so cited support needs confirming." },
          { question: "Which note is the most useful finding?", options: ["'Feels off.'", "'Probably wrong.'", "'States the bridge opened in 1940; the city record says 1937.'", "'Needs work.'"], answer: 2, why: "It names the claim, the correct value and the source." },
        ],
      },
      {
        id: "errors-2",
        title: "Did it do what was asked?",
        minutes: 3,
        body: [
          "A large share of flawed AI answers are accurate and still wrong, because they ignored part of the request. These are the easiest errors to catch once you look for them.",
          "Turn the prompt into a checklist before you read the answer:",
          "- Count: 'give three examples' means three.",
          "- Format: a table, a list, JSON, a single paragraph.",
          "- Length: word or sentence limits.",
          "- Audience and tone: 'for a ten-year-old', 'formal'.",
          "- Exclusions: 'without using the word budget', 'do not mention prices'.",
          "- Every part of a multi-part question.",
          "Then tick each item against the answer. One missed constraint is an instruction-following error even when everything else is excellent.",
          "Watch for the quiet failures too: an answer that responds to an easier version of the question, or one that adds advice nobody asked for.",
        ],
        takeaway: "Turn the prompt into a checklist of constraints and tick each one against the answer.",
        checks: [
          { question: "The prompt says 'list five tips, no more than ten words each'. The answer gives five tips, two of them 15 words long. Verdict?", options: ["Fully follows instructions", "Breaks the length constraint", "Breaks the count constraint", "Cannot be judged"], answer: 1, why: "The count is right, but two tips exceed the stated limit." },
          { question: "A prompt has three questions. The answer handles two very well. What is the problem?", options: ["None", "Incomplete: one part was not answered", "Too short", "Wrong tone"], answer: 1, why: "Every part of a multi-part prompt must be addressed." },
        ],
      },
      {
        id: "errors-3",
        title: "Following the reasoning",
        minutes: 4,
        body: [
          "Some answers reach the right result by a wrong path, or a wrong result by steps that each look fine. Reasoning tasks ask you to check the path, not only the destination.",
          "- Redo the arithmetic yourself. Do not trust a total because the working looks tidy.",
          "- Check that each step follows from the one before. Look for a jump where a conclusion appears without support.",
          "- Check units and conversions.",
          "- Test the answer against the question's own conditions. If the puzzle says the total must be even, is it?",
          "- Notice contradictions: an answer that says one thing early and the opposite later.",
          "Example. 'A shirt costs $40 after a 20% discount, so the original price was $48.' The working adds 20% to 40. The correct method divides by 0.8, giving $50. The answer is wrong, and the reason is a specific step you can name.",
          "This is the same skill the reasoning test measures: holding the rule in mind and checking each move against it.",
        ],
        takeaway: "Check every step and redo the numbers; name the exact step where the reasoning breaks.",
        checks: [
          { question: "An item costs $60 after a 25% discount. What was the original price?", options: ["$75", "$80", "$85", "$45"], answer: 1, why: "$60 is 75% of the original, and 60 ÷ 0.75 = 80." },
          { question: "An answer's final number is correct but one step in the working is invalid. How should reasoning be scored?", options: ["Full marks, the result is right", "Marked down, the path contains an error", "Ignored", "Automatically zero"], answer: 1, why: "Reasoning criteria judge the steps, not only the final result." },
        ],
      },
      {
        id: "errors-4",
        title: "Safety and tone",
        minutes: 3,
        body: [
          "Guidelines nearly always put safety first: an answer that could cause harm fails, however accurate or well written it is. Each project defines its own rules, so learn that project's definitions and do not rely on your own instincts.",
          "Common things guidelines ask you to flag:",
          "- Instructions that could help someone hurt themselves or others.",
          "- Private information about real people.",
          "- Medical, legal or financial advice stated with more certainty than is safe.",
          "- Hateful or demeaning content.",
          "- An answer that refuses a harmless request for no good reason. Over-refusal is also an error.",
          "Tone is judged separately. An answer can be safe and still preachy, cold or condescending when the user asked a simple question.",
          "Some projects include disturbing material. You are allowed to skip tasks or leave projects that affect you; check what support the platform offers before you start one.",
        ],
        takeaway: "Safety outranks everything, the project's own definitions decide it, and refusing a harmless request is an error too.",
        checks: [
          { question: "An answer is accurate and well written but includes a private person's home address. How does it fare?", options: ["Passes, it is accurate", "Fails on safety or privacy", "Loses style points only", "Needs more detail"], answer: 1, why: "Privacy and safety problems outrank accuracy and style." },
          { question: "A user asks how to boil an egg and the AI refuses, citing safety. What is this?", options: ["Correct caution", "An over-refusal error", "A formatting issue", "A factual error"], answer: 1, why: "Refusing a harmless request is a recognised failure." },
        ],
      },
    ],
  },
  {
    id: "assessment",
    title: "Getting through the screening",
    summary: "Prepare for the written assessment, the interview, and your first paid week.",
    cover: "assessment",
    lessons: [
      {
        id: "assessment-1",
        title: "Read the guidelines like an exam paper",
        minutes: 3,
        body: [
          "Screenings test whether you can apply a specific document, not whether you are clever. Most people who are not accepted knew the subject and skimmed the guidelines.",
          "- Read the whole document before the first question, including the examples. The examples show how strict the graders are.",
          "- Note the definitions. Words like 'helpful' or 'complete' mean exactly what the document says they mean.",
          "- Note the priority order when criteria conflict.",
          "- Keep the document open and look things up while you work. It is an open-book test; use the book.",
          "- When your instinct and the document disagree, the document wins.",
          "Pick your moment as well. Do the screening rested, without interruptions, on a reliable connection. If it is timed, read how the timer works before you press start.",
        ],
        takeaway: "The screening tests the document. Read all of it, keep it open, and let it overrule your instinct.",
        checks: [
          { question: "Your instinct says an answer deserves a 4. The guideline's example of a very similar answer is scored 2. What do you give?", options: ["4", "3, as a compromise", "2, following the guideline", "Skip it"], answer: 2, why: "The screening measures whether you apply the document, not your instinct." },
          { question: "When should you read the examples in the guidelines?", options: ["Only if you get stuck", "Before starting", "After submitting", "Never"], answer: 1, why: "Examples show how the criteria are applied in practice." },
        ],
      },
      {
        id: "assessment-2",
        title: "The writing sample",
        minutes: 3,
        body: [
          "Many screenings include a short piece of writing: explain a decision, correct an answer, or respond to a prompt yourself. Graders are looking for clear thinking in plain language.",
          "- Answer the question in the first sentence. Put the reasons after it.",
          "- Use short sentences and everyday words. Precision reads as competence.",
          "- Be specific. Quote or point to the exact thing you are discussing.",
          "- Stay inside any length limit, and use the format requested.",
          "- Proofread once out loud. Careless errors suggest careless task work.",
          "Write it yourself. Platforms generally forbid AI-written submissions, and a sample that reads like a model wrote it is a common reason for rejection. You will be doing the real work without that help, so the sample should show what you can do.",
        ],
        takeaway: "Answer first, be specific, stay within the limits, and write every word yourself.",
        checks: [
          { question: "What should the first sentence of your written answer do?", options: ["Give background", "State your answer", "Thank the reader", "Define terms"], answer: 1, why: "Leading with the answer shows clear thinking and respects the grader's time." },
          { question: "Why write the sample without AI help?", options: ["It is faster", "Platforms generally forbid it and the sample should show your own ability", "AI writing is always wrong", "It is not allowed by law"], answer: 1, why: "It commonly breaks the rules, and the real work depends on your own judgement." },
        ],
      },
      {
        id: "assessment-3",
        title: "The interview, including AI interviewers",
        minutes: 4,
        body: [
          "Some platforms interview applicants, and some use an automated interviewer that asks questions based on your resume and records your answers. Mercor is the best-known example.",
          "- Know your own resume. Expect to be asked to go deeper on anything listed, so list only what you can discuss.",
          "- Prepare two or three real examples of work you did, with what the problem was, what you did, and what happened.",
          "- Answer the question asked, in a minute or two. Give the answer, then the example.",
          "- If you do not know, say so and explain how you would find out. Bluffing is easy to detect in follow-up questions.",
          "- Test your camera, microphone and connection first, and find a quiet, well-lit place.",
          "With an automated interviewer, speak at a normal pace and finish your sentences; pauses can be read as the end of an answer. Treat it as you would a person. A human reviewer may watch the recording.",
        ],
        takeaway: "Know your resume, bring real examples, answer directly, and admit what you do not know.",
        checks: [
          { question: "You are asked about a tool on your resume that you barely used. Best response?", options: ["Bluff confidently", "Say honestly how much you used it and what you did", "Change the subject", "End the interview"], answer: 1, why: "Follow-up questions expose bluffing; honesty with specifics reads far better." },
          { question: "What is a good structure for an interview answer?", options: ["Background, then more background", "The answer, then a real example", "A list of every skill you have", "A question back to the interviewer"], answer: 1, why: "A direct answer supported by one concrete example is clear and credible." },
        ],
      },
      {
        id: "assessment-4",
        title: "Your first paid week",
        minutes: 3,
        body: [
          "The first tasks you submit are often reviewed more closely than later ones, and early quality decides whether you keep access.",
          "- Go slowly. Speed comes later; a low quality score early is hard to recover from.",
          "- Reread the project guidelines before each session. Projects change their rules mid-stream.",
          "- When a task is ambiguous, look for the rule that covers it, then the project's help channel. Do not guess and move on.",
          "- Read any feedback you get and adjust at once.",
          "- Log your time accurately. Over-reporting hours is a common reason accounts are closed.",
          "- Keep your own notes of recurring cases and how the guidelines resolve them.",
          "Then keep the habit that got you in: one criterion at a time, evidence before score, reasons in your own words.",
        ],
        takeaway: "Start slow, reread the guidelines, ask when unsure, and report your time honestly.",
        checks: [
          { question: "What matters most in your first tasks on a project?", options: ["Finishing as many as possible", "Quality", "Working at night", "Writing long comments"], answer: 1, why: "Early work is often reviewed closely and shapes your quality score." },
          { question: "A task does not fit any example in the guidelines. What should you do?", options: ["Guess and continue", "Skip every similar task forever", "Look for the covering rule, then ask through the project's help channel", "Submit it blank"], answer: 2, why: "Guessing risks repeated errors; guidelines and help channels exist for these cases." },
        ],
      },
    ],
  },
];

export const LESSON_COUNT = COURSES.reduce((sum, course) => sum + course.lessons.length, 0);
export const COURSE_MINUTES = COURSES.reduce((sum, course) => sum + course.lessons.reduce((m, lesson) => m + lesson.minutes, 0), 0);

const lessonIndex = new Map(COURSES.flatMap((course) => course.lessons.map((lesson, i) => [lesson.id, { course, lesson, index: i }] as const)));

export function findLesson(lessonId: string) {
  return lessonIndex.get(lessonId);
}

/** The lesson after this one, across course boundaries; undefined after the last. */
export function nextLessonId(lessonId: string): string | undefined {
  const all = COURSES.flatMap((course) => course.lessons.map((lesson) => lesson.id));
  const at = all.indexOf(lessonId);
  return at === -1 ? undefined : all[at + 1];
}
