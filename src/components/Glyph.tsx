import type { Token } from "@/lib/questions";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Draws one visual token: a picture (optionally turned, mirrored or repeated),
 * a number tile, the missing piece, or plain text.
 */
export function Glyph({ token, size = "md" }: { token: Token; size?: Size }) {
  if (token === "?") return <span className={`tile tile-q tile-${size}`} role="img" aria-label="missing piece">?</span>;
  if (token.startsWith("n:")) return <span className={`tile tile-${size}`}>{token.slice(2)}</span>;
  if (!token.startsWith("img:")) return <span>{token}</span>;

  const [, name = "", turn = "0", mirror, count] = /^img:([a-z]+)(?:@(\d+)(m)?)?(?:\*(\d+))?$/.exec(token) ?? [];
  // Mirrored first, then turned: a mirrored picture can never be matched by turning alone.
  const transform = `rotate(${turn}deg)${mirror ? " scaleX(-1)" : ""}`;
  const picture = (key?: number) => (
    <img key={key} className={`sprite sprite-${size}`} src={`/art/sprites/${name}.webp`} alt="" draggable={false} style={{ transform }} />
  );
  const label = `${count ? `${count} × ` : ""}${name}${Number(turn) ? ` turned ${turn}°` : ""}${mirror ? " mirrored" : ""}`;
  return (
    <span className={count ? "sprite-group" : "sprite-one"} role="img" aria-label={label}>
      {count ? Array.from({ length: Number(count) }, (_, i) => picture(i)) : picture()}
    </span>
  );
}
