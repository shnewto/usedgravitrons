// Data structure for Used Gravitrons issues with enhanced content
import { ZineIssue, ZinePiece } from "./types.ts";
import { getImageUrl, getPdfUrl } from "./config.ts";
import { getEnabledIssues } from "./launchdarkly.ts";

// Interfaces for the JSON data structure
interface ExtractedPiece {
  title: string;
  author: string;
  category: string;
  page_number: number;
  type: string;
  content?: string;
  word_count?: number;
  char_count?: number;
}

interface ExtractedIssue {
  issue_id: number;
  filename: string;
  toc_page?: number;
  pieces: ExtractedPiece[];
  total_pieces: number;
  categories: string[];
  authors: string[];
  text_pages?: unknown[];
}

interface ExtractedContent {
  total_issues: number;
  total_pieces: number;
  all_categories: string[];
  all_authors: string[];
  issues: ExtractedIssue[];
}

// Load enhanced content from the extracted data
let enhancedContent: ExtractedContent | null = null;

// Map extracted piece types to expected enum values
function mapPieceType(extractedType: string): 'fiction' | 'poetry' | 'art' | 'editorial' | 'expose' | 'six_pack' | 'dream' | 'chronicles' | 'other' {
  const typeMap: Record<string, 'fiction' | 'poetry' | 'art' | 'editorial' | 'expose' | 'six_pack' | 'dream' | 'chronicles' | 'other'> = {
    'fiction': 'fiction',
    'poetry': 'poetry',
    'art': 'art',
    'editorial': 'editorial',
    'expose': 'expose',
    'six_pack': 'six_pack',
    'dream': 'dream',
    'chronicles': 'chronicles',
    'other': 'other',
    'story': 'fiction',
    'poem': 'poetry',
    'artwork': 'art',
    'essay': 'editorial',
    'exposé': 'expose',
    'six pack': 'six_pack',
    'dreams': 'dream',
    'chronicle': 'chronicles'
  };
  
  return typeMap[extractedType.toLowerCase()] || 'other';
}

async function loadEnhancedContent() {
  if (!enhancedContent) {
    try {
      const content = await Deno.readTextFile('./site/data/parent_index.json');
      enhancedContent = JSON.parse(content);
    } catch (error) {
      console.error('Failed to load enhanced content:', error);
      // Fallback to basic data
      return null;
    }
  }
  return enhancedContent;
}

export async function getAllIssues(): Promise<ZineIssue[]> {
  const content = await loadEnhancedContent();
  if (!content) {
    return getBasicIssues();
  }

  const allIssues = content.issues.map((issue: ExtractedIssue) => ({
    id: issue.issue_id,
    title: `Used Gravitrons #${issue.issue_id}`,
    coverImage: getImageUrl(issue.issue_id, `${issue.issue_id.toString().padStart(2, '0')}_page1.png`),
    pdfPath: getPdfUrl(issue.issue_id, issue.filename),
    publishedDate: `Issue ${issue.issue_id}`,
    description: `This issue contains ${issue.pieces.length} pieces.`,
    pieces: issue.pieces.map((piece: ExtractedPiece) => ({
      id: `${issue.issue_id}-${piece.title.replace(/\s+/g, '-').toLowerCase()}`,
      title: piece.title,
      author: piece.author,
      type: mapPieceType(piece.type),
      content: piece.content || "Content not extracted yet",
      pageNumber: piece.page_number,
      issueId: issue.issue_id,
      category: piece.category,
      wordCount: piece.word_count,
      charCount: piece.char_count
    }))
  }));

  // Filter issues based on LaunchDarkly feature flags
  return await getEnabledIssues(allIssues);
}

export async function getIssueById(id: number): Promise<ZineIssue | undefined> {
  const issues = await getAllIssues();
  return issues.find(issue => issue.id === id);
}

export async function getPieceById(pieceId: string): Promise<ZinePiece | undefined> {
  const content = await loadEnhancedContent();
  if (!content) return undefined;

  for (const issue of content.issues) {
    const piece = issue.pieces.find((p: ExtractedPiece) => 
      `${issue.issue_id}-${p.title.replace(/\s+/g, '-').toLowerCase()}` === pieceId
    );
    if (piece) {
      return {
        id: pieceId,
        title: piece.title,
        author: piece.author,
        type: mapPieceType(piece.type),
        content: piece.content || "Content not extracted yet",
        pageNumber: piece.page_number,
        issueId: issue.issue_id,
        category: piece.category,
        wordCount: piece.word_count,
        charCount: piece.char_count
      };
    }
  }
  return undefined;
}

export async function searchPieces(query: string): Promise<ZinePiece[]> {
  const content = await loadEnhancedContent();
  if (!content) return [];

  const results: ZinePiece[] = [];
  const searchLower = query.toLowerCase();

  for (const issue of content.issues) {
    for (const piece of issue.pieces) {
      if (
        piece.title.toLowerCase().includes(searchLower) ||
        piece.author.toLowerCase().includes(searchLower) ||
        (piece.content || '').toLowerCase().includes(searchLower) ||
        piece.category.toLowerCase().includes(searchLower)
      ) {
        results.push({
          id: `${issue.issue_id}-${piece.title.replace(/\s+/g, '-').toLowerCase()}`,
          title: piece.title,
          author: piece.author,
          type: mapPieceType(piece.type),
          content: piece.content || "Content not extracted yet",
          pageNumber: piece.page_number,
          issueId: issue.issue_id,
          category: piece.category,
          wordCount: piece.word_count,
          charCount: piece.char_count
        });
      }
    }
  }

  return results;
}

// Fallback basic data if enhanced content fails to load
function getBasicIssues(): ZineIssue[] {
  return [
    {
      id: 1,
      title: "Used Gravitrons #1",
      coverImage: "/images/01_page1.png",
      pdfPath: "/issues/01.pdf",
      publishedDate: "Issue 1",
      description: "The inaugural issue featuring emerging voices and experimental forms.",
      pieces: []
    },
    {
      id: 2,
      title: "Used Gravitrons #2",
      coverImage: "/images/02_page1.png",
      pdfPath: "/issues/02.pdf",
      publishedDate: "Issue 2",
      description: "A collection of poetry and prose exploring themes of identity and belonging.",
      pieces: []
    },
    {
      id: 3,
      title: "Used Gravitrons #3",
      coverImage: "/images/03_page1.png",
      pdfPath: "/issues/03.pdf",
      publishedDate: "Issue 3",
      description: "Featuring visual art and experimental writing from diverse creators.",
      pieces: []
    },
    {
      id: 4,
      title: "Used Gravitrons #4",
      coverImage: "/images/04_page1.png",
      pdfPath: "/issues/04.pdf",
      publishedDate: "Issue 4",
      description: "A special issue focusing on environmental themes and climate consciousness.",
      pieces: []
    },
    {
      id: 5,
      title: "Used Gravitrons #5",
      coverImage: "/images/05_page1.png",
      pdfPath: "/issues/05.pdf",
      publishedDate: "Issue 5",
      description: "Poetry and prose that explores the human condition in modern times.",
      pieces: []
    },
    {
      id: 6,
      title: "Used Gravitrons #6",
      coverImage: "/images/06_page1.png",
      pdfPath: "/issues/06.pdf",
      publishedDate: "Issue 6",
      description: "A summer collection featuring light and experimental works.",
      pieces: []
    },
    {
      id: 7,
      title: "Used Gravitrons #7",
      coverImage: "/images/07_page1.png",
      pdfPath: "/issues/07.pdf",
      publishedDate: "Issue 7",
      description: "Mid-year showcase of established and emerging literary voices.",
      pieces: []
    },
    {
      id: 8,
      title: "Used Gravitrons #8",
      coverImage: "/images/08_page1.png",
      pdfPath: "/issues/08.pdf",
      publishedDate: "Issue 8",
      description: "A diverse collection spanning multiple genres and artistic styles.",
      pieces: []
    },
    {
      id: 9,
      title: "Used Gravitrons #9",
      coverImage: "/images/09_page1.png",
      pdfPath: "/issues/09.pdf",
      publishedDate: "Issue 9",
      description: "Back-to-school issue featuring academic and experimental writing.",
      pieces: []
    },
    {
      id: 10,
      title: "Used Gravitrons #10",
      coverImage: "/images/10_page1.png",
      pdfPath: "/issues/10.pdf",
      publishedDate: "Issue 10",
      description: "A milestone issue celebrating the zine's first year of publication.",
      pieces: []
    },
    {
      id: 11,
      title: "Used Gravitrons #11",
      coverImage: "/images/11_page1.png",
      pdfPath: "/issues/11.pdf",
      publishedDate: "Issue 11",
      description: "Autumn collection featuring contemplative and introspective works.",
      pieces: []
    },
    {
      id: 12,
      title: "Used Gravitrons #12",
      coverImage: "/images/12_page1.png",
      pdfPath: "/issues/12.pdf",
      publishedDate: "Issue 12",
      description: "Year-end issue with reflections on the past and hopes for the future.",
      pieces: []
    },
    {
      id: 13,
      title: "Used Gravitrons #13",
      coverImage: "/images/13_page1.png",
      pdfPath: "/issues/13.pdf",
      publishedDate: "Issue 13",
      description: "New year, new voices - featuring fresh perspectives and innovative forms.",
      pieces: []
    },
    {
      id: 14,
      title: "Used Gravitrons #14",
      coverImage: "/images/14_page1.png",
      pdfPath: "/issues/14.pdf",
      publishedDate: "Issue 14",
      description: "A love-themed issue exploring relationships, connection, and intimacy.",
      pieces: []
    },
    {
      id: 15,
      title: "Used Gravitrons #15",
      coverImage: "/images/15_page1.png",
      pdfPath: "/issues/15.pdf",
      publishedDate: "Issue 15",
      description: "Spring awakening with works that celebrate renewal and growth.",
      pieces: []
    },
    {
      id: 16,
      title: "Used Gravitrons #16",
      coverImage: "/images/16_page1.png",
      pdfPath: "/issues/16.pdf",
      publishedDate: "Issue 16",
      description: "A collection focused on social justice and community voices.",
      pieces: []
    },
    {
      id: 17,
      title: "Used Gravitrons #17",
      coverImage: "/images/17_page1.png",
      pdfPath: "/issues/17.pdf",
      publishedDate: "Issue 17",
      description: "Experimental forms and boundary-pushing creative works.",
      pieces: []
    },
    {
      id: 18,
      title: "Used Gravitrons #18",
      coverImage: "/images/18_page1.png",
      pdfPath: "/issues/18.pdf",
      publishedDate: "Issue 18",
      description: "Summer solstice issue with works celebrating light and warmth.",
      pieces: []
    },
    {
      id: 19,
      title: "Used Gravitrons #19",
      coverImage: "/images/19_page1.png",
      pdfPath: "/issues/19.pdf",
      publishedDate: "Issue 19",
      description: "The final issue - a retrospective and celebration of the zine's journey.",
      pieces: []
    }
  ];
}