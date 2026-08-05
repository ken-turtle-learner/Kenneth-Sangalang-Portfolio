// Matches percentages ("50.78%"), point deltas ("+17.0 pts"), and bare
// numbers ("705", "7", "50") so body text can wrap them in teal mono —
// lets someone skimming catch the results without reading every word.
const NUMBER_PATTERN = /(\+?\d+(?:\.\d+)?%|\+?\d+(?:\.\d+)?\s*pts\.?|\b\d+(?:\.\d+)?\b)/g;
const NUMBER_TEST = /^(\+?\d+(?:\.\d+)?%|\+?\d+(?:\.\d+)?\s*pts\.?|\d+(?:\.\d+)?)$/;

// Used by ExperienceTimeline (long resume bullets). It lives here rather than
// inside that component because the regexes above are the kind of thing more
// than one section tends to want, and a copy per caller would be one more
// place for the pattern to drift.
//
// .tsx rather than .ts: this returns JSX, not a string.
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
