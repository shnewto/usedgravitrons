export interface ZineIssue {
  id: number;
  title: string;
  coverImage: string;
  pdfPath: string;
  publishedDate: string;
  description: string;
  pieces: ZinePiece[];
}

export interface ZinePiece {
  id: string;
  title: string;
  author: string;
  type: 'fiction' | 'poetry' | 'art' | 'editorial' | 'expose' | 'six_pack' | 'dream' | 'chronicles' | 'other';
  content: string;
  pageNumber: number;
  issueId: number;
  category?: string;
  wordCount?: number;
  charCount?: number;
}

export interface Author {
  name: string;
  pieces: ZinePiece[];
  bio?: string;
}

export interface SearchResult {
  piece: ZinePiece;
  issue: ZineIssue;
  relevanceScore: number;
}
