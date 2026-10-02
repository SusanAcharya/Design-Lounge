import type { APIRoute } from 'astro';
import { AUTHOR, CREDIT_LINE } from '../../../../../../lib/pieces';
import { KINDS, kindById, familyById, kitBrief } from '../../../../../../data/kit';
import { themeById, themeCss } from '../../../../../../data/themes';
import { PAIRINGS, pairingCss } from '../../../../../../data/type';

export function getStaticPaths() {
  return KINDS.flatMap((k) =>
    k.palettes.flatMap((theme) =>
      k.pairings.flatMap((pairing) =>
        k.families.map((family) => ({
          params: { kind: k.id, theme, pairing, family },
        })),
      ),
    ),
  );
}

export const GET: APIRoute = ({ params }) => {
  const kind = kindById(params.kind || '');
  const theme = themeById(params.theme || '');
  const pairing = PAIRINGS.find((p) => p.id === params.pairing);
  const family = familyById(params.family || '');
  if (!kind || !theme || !pairing || !family) {
    return new Response('Unknown kit.\n', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  const md = kitBrief({
    kind,
    theme: { name: theme.name, mood: theme.mood, bestFor: [...theme.bestFor], css: themeCss(theme) },
    pairing: { name: pairing.name, mood: pairing.mood, display: pairing.display.family, text: pairing.text.family, css: pairingCss(pairing) },
    family,
    author: AUTHOR,
    credit: CREDIT_LINE,
  });
  return new Response(md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
