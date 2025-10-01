import { getHomePage, getIssuePage, getPiecePage, get404Page } from "../site/templates.ts";
import { getIssueById, getPieceById } from "../site/data.ts";

// Handle HTTP requests
async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // Static files are now served from R2, no local serving needed

  // Route handling
  if (path === '/') {
    return new Response(await getHomePage(), {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  if (path.startsWith('/issue/')) {
    const issueId = parseInt(path.split('/')[2]);
    const issue = await getIssueById(issueId);
    if (issue) {
      return new Response(await getIssuePage(issueId), {
        headers: { 'Content-Type': 'text/html' }
      });
    }
  }

  if (path.startsWith('/piece/')) {
    const pieceId = path.split('/')[2];
    const piece = await getPieceById(pieceId);
    if (piece) {
      return new Response(await getPiecePage(pieceId), {
        headers: { 'Content-Type': 'text/html' }
      });
    }
  }

  return new Response(get404Page(), { 
    status: 404,
    headers: { 'Content-Type': 'text/html' }
  });
}

// Export the handler as default for Vercel
export default handler;