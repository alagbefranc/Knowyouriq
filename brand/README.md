# KnowYourIQ

A reasoning test you play, and a five-minute habit after it.

KnowYourIQ is a mobile-first web app: a 25-question test with a game feel, a personal report, and a daily training loop with streaks, XP and leagues. The brand has to do two jobs at once. It must feel playful enough that people finish the test and come back tomorrow, and trustworthy enough that people believe the score and are comfortable paying.

Version 1 of this sheet. Illustrations were generated with an image model and have not yet been redrawn as vectors by a designer; the logo files are true vectors.

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

The wordmark is KnowYourIQ in Fredoka SemiBold, one word, three capitals, with IQ in `brand` and a `spark` four-point star off the top right of the Q. The mark is a `brand` rounded tile with a white IQ and the spark.

- Use `knowyouriq-wordmark.svg` on `surface` and `surface-raised`, and `knowyouriq-wordmark-reversed.svg` on `night` and `brand`.
- Clear space on every side equals the height of the K.
- Minimum width: wordmark 96px, mark 24px.
- Do not recolour, outline, rotate, add a shadow, or set the name in another typeface. Do not write Know Your IQ, KnowyourIQ or KYIQ.
- The app icon (`app-icon.png`) is Quo's face on `brand`. Use it for the home-screen icon and social avatars; use the IQ mark for the favicon and anywhere under 32px.

## Colour

Violet is the brand. Spark yellow is the reward. Everything else is support.

- `brand` carries primary actions, selection and the app icon. White text on it.
- `spark` is spent once per screen: the XP count, the streak, the percentile chip. `ink` text on it, never white.
- `night` is the stage for moments: hero band, game tiles, score card, share card.
- `coral`, `mint`, `sky` plus `brand` and `spark` identify the five skills. They are decorative; they never mean error or success. On skill tiles the symbol also differs, so colour is not the only signal.
- `success` and `danger` are for training feedback and real errors only. The test never shows right or wrong.
- Pricing and renewal text is always `ink` on `surface` or `surface-raised`.

| Skill | Colour token | Asset |
| --- | --- | --- |
| Patterns | `brand` | `skill-patterns.png` |
| Numbers | `sky` | `skill-numbers.png` |
| Spatial | `mint` | `skill-spatial.png` |
| Verbal | `coral` | `skill-verbal.png` |
| Memory | `spark` | `skill-memory.png` |

## Typography

Two hosted Google Fonts families, no font files.

- **Fredoka** (500 to 700) for the logo, scores, headlines and numbers in chips. Rounded and friendly; use it large and sparingly.
- **DM Sans** (400, 500, 700) for everything people read or tap, including all billing text.

The `score` style is reserved for the estimate. Billing terms use `body`, never `caption`.

## Shape and layout

- Corners are generous: `radius-md` on controls, `radius-lg` on cards and tiles, pills for bars and chips.
- Primary buttons sit on a solid `lip` shadow that collapses on press. No blurred shadows except `lift` on sheets.
- One column, phone first, `space-4` side gutter, 48px minimum tap height.
- The four-point spark is the brand's one repeating shape: above Quo, on league badges, in background patterns at a `space-12` pitch.

## Quo, the mascot

Quo is a small violet octopus with a spark above its head. Quo reacts; Quo does not talk in speech bubbles or deliver bad news.

| Pose | Asset | Where it appears |
| --- | --- | --- |
| Wave | `quo-wave.png` | Landing page, welcome back |
| Thinking | `quo-thinking.png` | Section-break cards, loading |
| Detective | `quo-detective.png` | The calculating screen, How scoring works |
| Celebrate | `quo-celebrate.png` | Test complete, level up, league promotion |
| Trophy | `quo-trophy.png` | Achievements, weekly league result |
| Streak | `quo-streak.png` | Streak milestones, streak-saver reminder |
| Encourage | `quo-encourage.png` | After a hard round, low-score report intro, missed day |
| Sleeping | `quo-sleeping.png` | Paused plan, notifications off, empty states |

Rules: never stretch, recolour or crop through the eyes. Never place Quo next to the price, the consent box or the cancel button; those screens stay plain. Do not show Quo sad, crying or disappointed.

## Illustration and iconography

All illustrations are flat, rounded, outline-free shapes in the palette with soft two-tone shading. Icons for skills are white symbols on a coloured rounded tile. Rewards are single toy-like objects. Profiles are round medallions. New art should match by reusing the generation prompts kept with the source files in the repository under `brand/`.

Interface icons (arrows, close, settings) are not part of this sheet yet; use a rounded 2px-stroke set such as Lucide until custom ones are drawn.

## Asset groups

Logos, Mascot, Skills, Games, Rewards, Leagues, Profiles and Backgrounds. Each group has its own note on use.

## Open items

- Quo and the illustrations need a designer's vector redraw before large-format or print use.
- Check that the name and the octopus mascot are clear for trademark use in launch markets.
- Interface icon set, sound design and motion rules are not defined yet.
