// Vercel strips ".html" before a static file can answer. Search Console asks for this exact path and will not follow the redirect.
export default function middleware() {
  return new Response('google-site-verification: google2ecc5152f148cbc3.html\n', {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}

export const config = {
  matcher: '/google2ecc5152f148cbc3.html',
};
