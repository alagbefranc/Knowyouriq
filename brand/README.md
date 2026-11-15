# KnowYourIQ

A reasoning test you play, and a five-minute habit after it.

KnowYourIQ is a mobile-first web app: a 25-question test with a game feel, a personal report, and a daily training loop with streaks, XP and leagues. The brand has to do two jobs at once. It must feel playful enough that people finish the test and come back tomorrow, and trustworthy enough that people believe the score and are comfortable paying.

Version 2 of this sheet. The look is the answer sheet: the interface borrows from the printed test form it replaces. The logo and everything on screen is drawn in code as true vectors. The illustration library was generated with an image model and is kept for marketing, not for the product screens.

## Personality

- **Playful, never childish.** Rounded type, a mascot, bright rewards. No baby talk, no jokes about the user's score.
- **Honest.** We say estimate, not IQ certificate. Prices and renewal terms are written in the same size and colour as everything else.
- **Encouraging at every score.** Quo cheers effort and progress. No copy or image ever shames a result.
- **Calm about money.** No countdown timers, no fake scarcity, no red urgency colours near a price.

## Voice

Short sentences. Second person. Verbs on buttons.

| Say | Avoid |
| --- | --- |
| Your estimate is 112, likely range 106 to 118 | Your IQ is 112! |
| $3.99 today for 7 days. Then $39.99 every 4 weeks until you cancel. | Unlock your results for just $3.99! |
| Three quick rounds today. About 5 minutes. | Train your brain to get smarter |
| You kept your streak. 12 days. | Don't lose your streak!!! |
| Cancel plan | Are you sure you want to leave us? |

Claims we never make: that training raises IQ, prevents decline or treats anything; that the test is official, certified, clinical or accepted by any society.

## Logo

The wordmark is KnowYourIQ in Bricolage Grotesque ExtraBold, one word, three capitals, in ink, with a highlighter swipe across the lower half of IQ. The mark is an ink square with IQ in paper and a highlighter bar beneath.

- Use `knowyouriq-wordmark.svg` on paper. On dark grounds use `knowyouriq-wordmark-reversed.svg`, where the highlighter runs as an underline so the letters stay readable.
- Clear space on every side equals the height of the K.
- Minimum width: wordmark 96px, mark 24px.
- Do not recolour, outline, rotate, add a shadow, or set the name in another typeface. Do not write Know Your IQ, KnowyourIQ or KYIQ.
- `knowyouriq-mark.svg` is the favicon and app icon. `app-icon.png` (Quo's face) belongs to the illustration library and is not the product icon.

## Colour

Three inks on paper, each with one job.

- `form` is what the form prints: labels, empty bubbles, the curve, the stamp. If the product is telling you something about itself, it is violet.
- `ink` is what the person marks and reads: text, filled bubbles, primary buttons, timing marks.
- `highlight` is the highlighter: one swipe per screen on the thing worth noticing. In dark theme it runs as an underline, because light text over yellow fails contrast.
- `form-soft` and `paper-2` are the only tints. There are no gradients and no shadows.
- Skills are told apart by name and position, never by colour.
- Pricing and renewal text is always `ink` on `paper`, with no highlighter.

## Typography

Three hosted Google Fonts families, no font files.

- **Bricolage Grotesque** (700, 800) for the logo, headlines, the question and the big numbers. Tight tracking, left-aligned.
- **Barlow** (400, 500, 700) for everything people read or tap, including all billing text.
- **Barlow Condensed** (600, 700) for the form's own voice: uppercase labels, counters, axis numbers, the stamp.

The `score` style is reserved for the estimate. Billing terms use `body`, never `caption`.

## Shape and layout

- One column, left-aligned. Nothing is centred.
- A column of timing marks runs down the left edge of every screen, as on a machine-read answer sheet.
- Sections are separated by a 2px ink rule; rows inside a section by form-soft hairlines. There are no cards.
- Corners are square, except bubbles (round) and buttons, the fees box and the stamp (`radius-sm`).
- Answers are bubbles. Progress is 25 timing marks in five groups. Results are read off a number line or the bell curve. Locked report lines are redacted with ink bars, not blurred.
- Two things sit askew on purpose: the specimen item on the landing page (1.5 degrees) and the stamp (3 degrees). Everything else is square to the sheet.
- 18px side gutter, 52px minimum button height, 60px answer rows.

## Motion

Motion follows Emil Kowalski's design-engineering rules (the skills in `.claude/skills`). The app's tokens live in `src/app/globals.css`.

| Token | Value | Use |
| --- | --- | --- |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Everything that enters or responds. Never `ease-in` |
| `--dur-press` | 120ms | Press feedback on buttons and answer options, `scale(0.97)` |
| `--dur-fast` | 160ms | Colour changes; the entrance of each question |
| `--dur-base` | 220ms | Section-break beats |
| `--dur-moment` | 500ms | Once-per-visit moments only: the landing hero |

- **The more often it is seen, the less it moves.** A new question appears 25 times a test, so it only fades with a 4px rise. The landing hero and the report are seen once, so they get a staggered entrance.
- **Only `transform` and `opacity` animate.** Nothing starts from `scale(0)`. No `transition: all`.
- **One entrance per container.** Answer options arrive with their question; they are not staggered.
- **Staggers have shrinking gaps** and the lead (the headline) moves most. On the report, skill bubbles land row by row. Buttons are never delayed and can be tapped at once.
- **Nothing moves on price, consent or cancel controls.** Colour changes only.
- **Hover styles** apply only to real pointers. **Reduced motion** keeps fades and drops movement and delays.

## Quo, the mascot

Quo is a small violet octopus with a spark above its head. In the product Quo appears exactly once: as the reward sticker stuck on a finished test, rotated 9 degrees with a white sticker edge, the way a teacher puts a sticker on a good paper.

Quo's other poses belong to the illustration library for marketing, email and the future training screens. Rules: never stretch, recolour or crop through the eyes. Never place Quo next to the price, the consent box or the cancel button. Do not show Quo sad, crying or disappointed.

## Illustration and iconography

The product screens use no illustration apart from the Quo sticker. Their graphics are drawn in code from the form's own vocabulary: bubbles, timing marks, rules, the number line, the bell curve, the stamp, redaction bars.

The illustration library (mascot poses, skill tiles, game thumbnails, rewards, league badges, profile medallions, backgrounds) was generated with an image model. It is flat and rounded, a different register from the answer sheet, so use it only where a warmer, more playful tone is wanted: ads, social posts, emails. It needs a designer's redraw before print.

Interface icons are not part of this sheet yet. The only glyph in use is the arrow on forward buttons, set in the display face.

## Asset groups

Logos are the product's own. Mascot, Skills, Games, Rewards, Leagues, Profiles and Backgrounds form the illustration library. Each group has its own note on use.

## Open items

- The illustration library needs a designer's redraw before large-format or print use, and a decision on whether it should be redrawn in the answer-sheet style.
- Check that the name and the octopus mascot are clear for trademark use in launch markets.
- Interface icon set and sound design are not defined yet.
