// /examples/proof: the same prompt built with and without the Design Lounge skill, several runs per arm,
// all shown, none edited. Builds live in public/built/proof/<subject>-<arm>-<n>/index.html.
export type Arm = 'without' | 'with';

export interface ProofSubject {
  id: string;
  title: string;
  prompt: string;
  /** Run numbers present for each arm, in order. */
  runs: { without: number[]; with: number[] };
}

export const PROOF_META = {
  model: 'Claude Fable 5.1 (claude-fable-5-1)',
  harness: 'Claude Code subagent (the Agent tool), one fresh session per run, plain HTML + CSS + JS, no build step',
  date: '2026-10-07',
  stack: 'index.html + styles.css + main.js, opened directly from the file system',
  without: 'the run was told to ignore the repository and any skill, and built in an empty folder outside it',
  with: 'the run was pointed at skills/design-lounge/SKILL.md and told to follow it',
};

export const PROOF: ProofSubject[] = [
  {
    id: 'late-light',
    title: 'Late Light',
    prompt: "A site for a planetarium's late-night show. You scroll and you travel through space. Make it unforgettable.",
    // With-skill run 3 was still building when this was published; it is added when it finishes, unedited.
    runs: { without: [1, 2, 3], with: [1, 2] },
  },
  {
    id: 'aadhi-raat',
    title: 'Aadhi Raat',
    prompt: 'Make a website for a record label that only releases music recorded after midnight in Kathmandu. Go wild, I want it to feel like an Awwwards site of the day.',
    runs: { without: [1, 2, 3], with: [1, 2, 3] },
  },
  {
    id: 'key-01',
    title: 'KEY-01',
    prompt: 'Build a launch page for a mechanical keyboard called KEY-01. I want people to be able to actually play with it on the page.',
    runs: { without: [1, 2, 3], with: [1, 2, 3] },
  },
];

export const proofUrl = (subject: string, arm: Arm, n: number) => `/built/proof/${subject}-${arm}-${n}/index.html`;
export const proofCount = () => PROOF.reduce((n, s) => n + s.runs.without.length + s.runs.with.length, 0);
