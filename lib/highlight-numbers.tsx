// Matches percentages ("50.78%"), point deltas ("+17.0 pts"), and bare numbers
// ("705", "7", "50"). Keep the two patterns in sync — PATTERN splits the text,
// TEST decides which pieces get wrapped.
const NUMBER_PATTERN = /(\+?\d+(?:\.\d+)?%|\+?\d+(?:\.\d+)?\s*pts\.?|\b\d+(?:\.\d+)?\b)/g;
const NUMBER_TEST = /^(\+?\d+(?:\.\d+)?%|\+?\d+(?:\.\d+)?\s*pts\.?|\d+(?:\.\d+)?)$/;

// Wraps every number in a string in teal mono, so results stand out when
// skimming. Used by SampleTile on the work-sample blurbs.
//
// Only safe on normal page backgrounds: --accent-text is a dark teal in light
// mode, so this would disappear on the black lightbox scrim.
export function highlightNumbers(text: string): React.ReactNode {
  return text
    .split(NUMBER_PATTERN)
    .map((part, index) =>
      NUMBER_TEST.test(part) ? (
        <span key={index} className="font-mono text-accent-text">
          {part}
        </span>
      ) : (
        part
      ),
    );
}
