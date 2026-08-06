export type Testimonial = {
  // Set true once a real, approved quote is in place. While false the whole
  // section is skipped, so placeholder text can never ship as if it were real.
  published: boolean;
  quote: string;
  name: string;
  role: string;
  company: string;
  // Optional link to the LinkedIn recommendation the quote came from. A quote a
  // reader can verify is worth more than one they have to take on faith.
  sourceUrl?: string;
};

// PLACEHOLDER — not rendered while `published` is false.
//
// When you have a real quote, replace every field and flip `published` to true.
// Ask for a sentence about what you did and what changed as a result: "he
// rebuilt our enrollment flow and cut a manual step out of every purchase"
// carries far more weight with a hiring manager than "great to work with".
export const testimonial: Testimonial = {
  published: false,
  quote: "Replace with a real quote about specific work and its outcome.",
  name: "Full Name",
  role: "Their job title",
  company: "Company",
};
