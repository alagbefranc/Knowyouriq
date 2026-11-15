/** An answer-sheet bubble. Filled means marked in graphite. */
export function Bubble(props: { letter?: string; filled?: boolean; small?: boolean; className?: string; style?: React.CSSProperties }) {
  return (
    <span
      className={`bubble${props.small ? " bubble-sm" : ""}${props.className ? ` ${props.className}` : ""}`}
      data-filled={props.filled ? "true" : undefined}
      style={props.style}
      aria-hidden="true"
    >
      {props.letter}
    </span>
  );
}
