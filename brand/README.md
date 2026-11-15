# KnowYourIQ

A reasoning test you play, and a five-minute habit after it.

KnowYourIQ is a mobile-first web app: a 25-question test with a game feel, a personal report, and a daily training loop with streaks, XP and leagues. The brand has to do two jobs at once. It must feel playful enough that people finish the test and come back tomorrow, and trustworthy enough that people believe the score and are comfortable paying.

Version 3 of this sheet. The look is the night arcade: a deep indigo night lit by rich 3D toy artwork, with every skill as a world and every question built from the same toys. Artwork is generated with an image model in one fixed style; the logo and all interface pieces are drawn in code.

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

The wordmark is KnowYourIQ in Bricolage Grotesque ExtraBold, one word, three capitals, with a spark bar under IQ.

- The product is dark, so `knowyouriq-wordmark-reversed.svg` (light letters) is the primary wordmark. Use `knowyouriq-wordmark.svg` only on light grounds such as documents and invoices.
- Clear space on every side equals the height of the K.
- Minimum width: wordmark 96px, mark 24px.
- Do not recolour, outline, rotate, add a shadow, or set the name in another typeface. Do not write Know Your IQ, KnowyourIQ or KYIQ.
- `knowyouriq-mark.svg` is the favicon. For the home-screen icon and social avatars use Quo (`quo-wave` from the Mascot group) on `bg`.

## Colour

One committed dark world. There is no light theme.

- `bg` is the night; panels sit on it in `panel`, tiles in `panel-2`.
- `spark` is the one action colour: primary buttons, answered progress, the score. If it is yellow, it is either the thing to tap or the thing you earned.
- `brand` is Quo's violet: number tiles, the selected answer, the curve.
- `coral`, `mint`, `sky` and `pink` belong to the artwork. In the interface they never carry meaning.
- Pricing and renewal text is always `text` on `panel`, with no artwork beside it.

## Typography

Three hosted Google Fonts families, no font files.

- **Bricolage Grotesque** (700, 800) for the logo, headlines, the question, number tiles and the big numbers.
- **Barlow** (400, 500, 700) for everything people read or tap, including all billing text.
- **Barlow Condensed** (600, 700) for uppercase labels: section names, counters, names under pictures, axis numbers.

The `score` style is reserved for the estimate. Billing terms use `body`, never `caption`.

## Shape and layout

- One column on a phone, 16px gutter. Celebration moments are centred; questions and reports are left-aligned.
- Everything you can press sits on a solid lip and moves down into it: buttons, answer tiles, number tiles.
- Each skill is a world. Its artwork sits above every question in that section and fills the section-break screen.
- A question is a prompt, a tray of pieces with the missing one marked, and four answer tiles in a two-by-two grid.
- Content is grouped in panels with `radius-lg`. Artwork fades into the night; it never has a hard picture edge on the landing page.
- 56px minimum button height; answer tiles at least 104px tall.

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
- **Staggers have shrinking gaps** and the lead (the artwork) moves most. On the report, skill pips land row by row. Buttons are never delayed and can be tapped at once.
- **Nothing moves on price, consent or cancel controls.** Colour changes only.
- **Hover styles** apply only to real pointers. **Reduced motion** keeps fades and drops movement and delays.

## Quo, the mascot

Quo is a small violet octopus with a glowing spark above its head, rendered as a 3D vinyl toy. Quo is the guide: on the landing hero, inside every world scene, and at the moments between (scoring, test complete, not found).

| Pose | Asset | Where it appears |
| --- | --- | --- |
| Wave | `quo-wave` | Home-screen icon, avatars, emails |
| Celebrate | `quo-celebrate` | Test complete |
| Detective | `quo-detective` | The scoring screen |
| Thinking | `quo-thinking` | Not found, empty states |

Rules: never stretch, recolour or crop through the eyes. Never place Quo next to the price, the consent box or the cancel button; those screens stay plain. Do not show Quo sad, crying or disappointed. New poses are generated from `quo-wave` as the reference image so the character stays the same.

## Illustration and iconography

All artwork is one style: stylised 3D toy renders in soft vinyl and clay, saturated colour, soft studio light, set at night against `bg`. It is generated with an image model using the prompts kept in the repository under `brand/`, always with the same style paragraph, and with Quo's reference image whenever Quo appears.

- **Worlds**: one wide scene per skill, plus the landing hero. Scenes are composed with the action in the central band so they crop to a banner.
- **Toys**: single objects on transparent backgrounds. Questions are assembled from these in code, which is what guarantees one correct answer. Never generate a whole puzzle as one image.
- **Medallions**: one coin per cognitive style, shown on the report.
- No text, letters or numerals inside any generated image. Numbers are set as number tiles in code.

The artwork was made by a model and has not been retouched; check each new image at 44px and at full size before using it. Interface icons are not part of this sheet yet.

## Asset groups

Logos, Mascot, Worlds, Toys (the puzzle pieces) and Medallions. Each group has its own note on use. The earlier flat illustration set is kept in the repository under `brand/assets/_archive-flat/` and is not part of the brand.

## Open items

- Generated artwork is 1024px to 1536px; large-format or print use needs upscaling or a redraw.
- Check that the name and the octopus mascot are clear for trademark use in launch markets.
- Interface icon set and sound design are not defined yet.
