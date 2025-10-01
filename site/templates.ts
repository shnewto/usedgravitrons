// HTML templates for the Used Gravitrons website
import { getAllIssues, getIssueById, getPieceById } from "./data.ts";
import { ZineIssue, ZinePiece } from "./types.ts";

export async function getHomePage() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Used Gravitrons - Literary Zine Archive</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        header {
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        h1 {
            color: #333;
            margin: 0;
            padding: 1rem 0;
            font-size: 2.5rem;
        }
        .subtitle {
            color: #666;
            margin: 0;
            padding-bottom: 1rem;
        }
        .issues-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1.5rem;
        }
        .issue-card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .issue-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .issue-card img {
            width: 100%;
            height: 250px;
            object-fit: cover;
        }
        .issue-card h3 {
            margin: 0;
            padding: 1rem;
            font-size: 1.1rem;
            color: #333;
        }
        .issue-card a {
            text-decoration: none;
            color: inherit;
        }
        .intro {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        .intro h2 {
            color: #333;
            margin-top: 0;
        }
        .intro p {
            color: #666;
            font-size: 1.1rem;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1>Used Gravitrons</h1>
            <p class="subtitle">A Literary Zine Archive</p>
        </div>
    </header>
    
    <main class="container">
        <div class="intro">
            <h2>Welcome to the Archive</h2>
            <p>blar blar blar</p>
        </div>
        
        <div class="issues-grid">
            ${await generateIssueCards()}
        </div>
    </main>
</body>
</html>`;
}

export async function getIssuePage(issueId: number) {
  const issue = await getIssueById(issueId);
  if (!issue) {
    return get404Page();
  }
  const issueNum = issueId.toString().padStart(2, '0');
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${issue.title} - Literary Zine Archive</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        header {
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        .back-link {
            color: #0066cc;
            text-decoration: none;
            margin-bottom: 1rem;
            display: inline-block;
            font-weight: 500;
        }
        .back-link:hover {
            text-decoration: underline;
        }
        .issue-header {
            display: flex;
            gap: 2rem;
            align-items: start;
        }
        .issue-cover {
            flex: 0 0 300px;
        }
        .issue-cover img {
            width: 100%;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .issue-info {
            flex: 1;
        }
        .issue-info h1 {
            color: #333;
            margin: 0 0 1rem 0;
            font-size: 2.5rem;
        }
        .issue-meta {
            color: #666;
            margin-bottom: 1rem;
        }
        .issue-description {
            color: #555;
            margin-bottom: 1.5rem;
            line-height: 1.7;
        }
        .pdf-link {
            display: inline-block;
            background: #0066cc;
            color: white;
            padding: 0.75rem 1.5rem;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 1rem;
            font-weight: 500;
            transition: background 0.2s;
        }
        .pdf-link:hover {
            background: #0052a3;
        }
        .contents {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .contents h2 {
            color: #333;
            margin-top: 0;
        }
        .processing-note {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 1rem;
            margin-top: 1rem;
        }
        .processing-note p {
            margin: 0;
            color: #666;
        }
        .pieces-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-top: 1rem;
        }
        .piece-card {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 1.5rem;
            transition: all 0.2s;
        }
        .piece-card:hover {
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transform: translateY(-2px);
        }
        .piece-card a {
            text-decoration: none;
            color: inherit;
        }
        .piece-card h3 {
            margin: 0 0 0.5rem 0;
            color: #333;
            font-size: 1.2rem;
        }
        .piece-card .author {
            margin: 0 0 0.25rem 0;
            color: #666;
            font-style: italic;
        }
        .piece-card .category {
            margin: 0 0 0.25rem 0;
            color: #0066cc;
            font-weight: 500;
            font-size: 0.9rem;
        }
        .piece-card .page {
            margin: 0;
            color: #999;
            font-size: 0.8rem;
        }
        .piece-count {
            margin: 0.5rem 0 0 0;
            color: #666;
            font-size: 0.9rem;
        }
        @media (max-width: 768px) {
            .issue-header {
                flex-direction: column;
            }
            .issue-cover {
                flex: none;
            }
            .pieces-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <a href="/" class="back-link">← Back to All Issues</a>
            <div class="issue-header">
                <div class="issue-cover">
                    <img src="${issue.coverImage}" alt="${issue.title}" />
                </div>
                <div class="issue-info">
                    <h1>${issue.title}</h1>
                    <div class="issue-meta">
                        <p><strong>Published:</strong> ${issue.publishedDate}</p>
                    </div>
                    <div class="issue-description">
                        <p>${issue.description}</p>
                    </div>
                    <a href="${issue.pdfPath}" class="pdf-link" target="_blank">
                        📖 Read PDF
                    </a>
                </div>
            </div>
        </div>
    </header>
    
    <main class="container">
        <div class="contents">
            <h2>Contents</h2>
            ${issue.pieces.length > 0 ? `
                <div class="pieces-grid">
                    ${issue.pieces.map(piece => `
                        <div class="piece-card">
                            <a href="/piece/${piece.id}">
                                <h3>${piece.title}</h3>
                                <p class="author">by ${piece.author}</p>
                                <p class="category">${piece.category || piece.type}</p>
                                <p class="page">Page ${piece.pageNumber}</p>
                            </a>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="processing-note">
                    <p><strong>Note:</strong> This issue hasn't been processed yet. Click "Read PDF" to view the original content.</p>
                    <p><em>Future versions will include extracted text, individual pieces, and searchable content.</em></p>
                </div>
            `}
        </div>
    </main>
</body>
</html>`;
}

// Generate issue cards HTML
async function generateIssueCards() {
  const allIssues = await getAllIssues();
  return allIssues.map(issue => `
    <div class="issue-card">
      <a href="/issue/${issue.id}">
        <img src="${issue.coverImage}" alt="${issue.title}" />
        <h3>${issue.title}</h3>
        <p class="piece-count">${issue.pieces.length} pieces</p>
      </a>
    </div>
  `).join('');
}

export async function getPiecePage(pieceId: string) {
  const piece = await getPieceById(pieceId);
  if (!piece) {
    return get404Page();
  }

  const issue = await getIssueById(piece.issueId);
  if (!issue) {
    return get404Page();
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${piece.title} - Used Gravitrons</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        header {
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        .back-link {
            color: #0066cc;
            text-decoration: none;
            margin-bottom: 1rem;
            display: inline-block;
            font-weight: 500;
        }
        .back-link:hover {
            text-decoration: underline;
        }
        .piece-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        .piece-title {
            color: #333;
            margin: 0 0 0.5rem 0;
            font-size: 2.5rem;
        }
        .piece-author {
            color: #666;
            font-size: 1.2rem;
            margin: 0 0 0.5rem 0;
        }
        .piece-meta {
            color: #999;
            font-size: 0.9rem;
            margin: 0 0 1rem 0;
        }
        .piece-content {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            white-space: pre-wrap;
            font-size: 1.1rem;
            line-height: 1.8;
        }
        .piece-footer {
            margin-top: 2rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
            text-align: center;
        }
        .piece-footer a {
            color: #0066cc;
            text-decoration: none;
            margin: 0 1rem;
        }
        .piece-footer a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <a href="/issue/${piece.issueId}" class="back-link">← Back to Issue ${piece.issueId}</a>
            <div class="piece-header">
                <h1 class="piece-title">${piece.title}</h1>
                <p class="piece-author">by ${piece.author}</p>
                <p class="piece-meta">
                    ${piece.category || piece.type} • Page ${piece.pageNumber} • 
                    ${piece.wordCount ? `${piece.wordCount} words` : ''}
                </p>
            </div>
        </div>
    </header>
    
    <main class="container">
        <div class="piece-content">${piece.content}</div>
        
        <div class="piece-footer">
            <a href="/issue/${piece.issueId}">View Issue ${piece.issueId}</a>
            <a href="${issue.pdfPath}" target="_blank">Read PDF</a>
            <a href="/">All Issues</a>
        </div>
    </main>
</body>
</html>`;
}

export function get404Page() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Not Found - Used Gravitrons</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        h1 {
            color: #333;
            font-size: 3rem;
            margin: 2rem 0;
        }
        .back-link {
            color: #0066cc;
            text-decoration: none;
            font-size: 1.2rem;
        }
        .back-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>404</h1>
        <p>Sorry, the page you're looking for doesn't exist.</p>
        <a href="/" class="back-link">← Back to All Issues</a>
    </div>
</body>
</html>`;
}
