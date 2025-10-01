#!/usr/bin/env deno run --allow-read --allow-net

import { getHomePage, getIssuePage, getPiecePage, get404Page } from "./templates.ts";
import { getIssueById, getPieceById } from "./data.ts";

// Handle HTTP requests
async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;

  // Serve static files
  if (path.startsWith('/images/') || path.startsWith('/issues/') || path.startsWith('/data/')) {
    try {
      const filePath = path.startsWith('/images/') ? `./public${path}` : `.${path}`;
      const file = await Deno.readFile(filePath);
      const contentType = path.endsWith('.png') ? 'image/png' : 
                         path.endsWith('.pdf') ? 'application/pdf' : 
                         path.endsWith('.json') ? 'application/json' :
                         'application/octet-stream';
      
      return new Response(file, {
        headers: { 'Content-Type': contentType }
      });
    } catch {
      return new Response('File not found', { status: 404 });
    }
  }

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