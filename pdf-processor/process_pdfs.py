#!/usr/bin/env python3
"""
PDF Processing Script for Used Gravitrons
Extracts text, images, and metadata from all PDF issues
"""

import os
import json
import sys
import re
from pathlib import Path
from typing import List, Dict, Any, Optional
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

try:
    import fitz  # PyMuPDF
    import pdfplumber
    from pdf2image import convert_from_path
    from PIL import Image
except ImportError as e:
    logger.error(f"Missing required packages: {e}")
    logger.error("Please install with: pip install PyMuPDF pdfplumber pdf2image pillow")
    sys.exit(1)

class PDFProcessor:
    def __init__(self, issues_dir: str = "../website/issues", output_dir: str = "../website/data"):
        self.issues_dir = Path(issues_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
               # Create parent index
               self.parent_index = {"total_issues": 0, "issues": []}
    
    def clean_text(self, text: str) -> str:
        """Clean text by removing encoding artifacts and fixing common issues"""
        if not text:
            return ""
        
        # Remove common PDF encoding artifacts
        text = re.sub(r'\(cid:\d+\)', '', text)  # Remove (cid:123) patterns
        text = re.sub(r'\s+', ' ', text)  # Normalize whitespace
        text = text.strip()
        
        return text

    def extract_text_from_pdf(self, pdf_path: Path) -> List[Dict[str, Any]]:
        """Extract text from PDF with page-by-page breakdown using multiple methods"""
        logger.info(f"Extracting text from {pdf_path.name}")
        
        pages = []
        try:
            # Try pdfplumber first
            with pdfplumber.open(pdf_path) as pdf:
                for page_num, page in enumerate(pdf.pages, 1):
                    text = page.extract_text()
                    if text:
                        text = self.clean_text(text)
                        if text and len(text) > 10:  # Only include pages with substantial text
                            pages.append({
                                "page_number": page_num,
                                "text": text,
                                "word_count": len(text.split()),
                                "char_count": len(text)
                            })
            
            # If pdfplumber didn't work well, try PyMuPDF as fallback
            if not pages or any('(cid:' in page['text'] for page in pages):
                logger.info(f"Trying PyMuPDF fallback for {pdf_path.name}")
                doc = fitz.open(pdf_path)
                for page_num in range(len(doc)):
                    page = doc[page_num]
                    text = page.get_text()
                    if text:
                        text = self.clean_text(text)
                        if text and len(text) > 10:
                            # Update or add page
                            existing_page = next((p for p in pages if p['page_number'] == page_num + 1), None)
                            if existing_page:
                                existing_page['text'] = text
                                existing_page['word_count'] = len(text.split())
                                existing_page['char_count'] = len(text)
                            else:
                                pages.append({
                                    "page_number": page_num + 1,
                                    "text": text,
                                    "word_count": len(text.split()),
                                    "char_count": len(text)
                                })
                doc.close()
        
        except Exception as e:
            logger.error(f"Error extracting text from {pdf_path.name}: {e}")
        
        return pages

    def find_table_of_contents(self, pages: List[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
        """Find the table of contents page"""
        toc_keywords = ['contents', 'table of contents', 'toc', 'index']
        
        for page in pages:
            text = page['text'].lower()
            if any(keyword in text for keyword in toc_keywords):
                return page
        
        return None

    def parse_table_of_contents(self, toc_page: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Parse table of contents to extract pieces"""
        pieces = []
        text = toc_page['text']
        
        # Look for patterns like "Title ................ 5" or "Title ... 5"
        # Split by looking for sequences of dots followed by numbers
        entries = re.split(r'([A-Za-z][^.]*?\.{3,}\s*\d+)', text)
        
        current_category = None
        
        for entry in entries:
            entry = entry.strip()
            if not entry or len(entry) < 5:
                continue
            
            # Look for category headers (single words in caps)
            if entry.isupper() and len(entry.split()) <= 3:
                current_category = entry
                continue
            
            # Look for piece entries with page numbers
            # Pattern: "Title ................ 5"
            page_match = re.search(r'\.{3,}\s*(\d+)\s*$', entry)
            if page_match:
                page_num = int(page_match.group(1))
                
                # Extract title by removing dots and page number
                title = re.sub(r'\.{3,}\s*\d+\s*$', '', entry).strip()
                
                # Skip if title is too long or too short
                if title and 3 <= len(title) <= 100:
                    pieces.append({
                        "title": title,
                        "author": "Unknown",
                        "category": current_category or "Uncategorized",
                        "page_number": page_num,
                        "type": self._classify_content_type(current_category or title)
                    })
        
        return pieces

    def _classify_content_type(self, text: str) -> str:
        """Classify content type based on text"""
        if not text:
            return "other"
        
        text_lower = text.lower()
        
        if 'fiction' in text_lower:
            return 'fiction'
        elif 'poetry' in text_lower:
            return 'poetry'
        elif 'art' in text_lower or 'photo' in text_lower:
            return 'art'
        elif 'editorial' in text_lower:
            return 'editorial'
        elif 'exposé' in text_lower or 'expose' in text_lower:
            return 'expose'
        elif 'six pack' in text_lower:
            return 'six_pack'
        else:
            return 'other'

    def process_single_pdf(self, pdf_path: Path) -> Dict[str, Any]:
        """Process a single PDF and create issue directory"""
        logger.info(f"Processing {pdf_path.name}")
        
        issue_id = int(pdf_path.stem)
        
        # Create issue directory
        issue_dir = self.output_dir / f"issue_{issue_id:02d}"
        issue_dir.mkdir(exist_ok=True)
        
        # Extract text
        pages = self.extract_text_from_pdf(pdf_path)
        
        # Find and parse table of contents
        toc_page = self.find_table_of_contents(pages)
        pieces = []
        if toc_page:
            pieces = self.parse_table_of_contents(toc_page)
            logger.info(f"Found {len(pieces)} pieces in TOC")
        
        # Create issue data
        issue_data = {
            "issue_id": issue_id,
            "filename": pdf_path.name,
            "toc_page": toc_page['page_number'] if toc_page else None,
            "pieces": pieces,
            "total_pieces": len(pieces),
            "categories": list(set(piece['category'] for piece in pieces)),
            "authors": list(set(piece['author'] for piece in pieces)),
            "text_pages": pages
        }
        
        # Save issue data
        with open(issue_dir / "issue_data.json", 'w') as f:
            json.dump(issue_data, f, indent=2)
        
        # Save individual pieces
        for piece in pieces:
            # Limit filename length to avoid filesystem issues
            safe_title = piece['title'].replace(' ', '_').replace('/', '_')[:50]
            piece_filename = f"{safe_title}.json"
            with open(issue_dir / piece_filename, 'w') as f:
                json.dump(piece, f, indent=2)
        
        logger.info(f"✅ Processed {pdf_path.name} - {len(pieces)} pieces")
        return issue_data
    
    def process_all_pdfs(self):
        """Process all PDFs in the issues directory"""
        logger.info("Starting PDF processing...")
        
        pdf_files = list(self.issues_dir.glob("*.pdf"))
        if not pdf_files:
            logger.error(f"No PDF files found in {self.issues_dir}")
            return
        
        logger.info(f"Found {len(pdf_files)} PDF files")
        
        all_issues = []
        
        for pdf_file in sorted(pdf_files):
            try:
                issue_data = self.process_single_pdf(pdf_file)
                all_issues.append(issue_data)
            except Exception as e:
                logger.error(f"Error processing {pdf_file.name}: {e}")
                continue
        
               # Create parent index
               self.parent_index = {
                   "total_issues": len(all_issues),
                   "total_pieces": sum(issue['total_pieces'] for issue in all_issues),
                   "all_categories": list(set(cat for issue in all_issues for cat in issue['categories'])),
                   "all_authors": list(set(author for issue in all_issues for author in issue['authors'])),
                   "issues": all_issues
               }
        
               # Save parent index
               with open(self.output_dir / "parent_index.json", 'w') as f:
            json.dump(self.parent_index, f, indent=2)
        
        logger.info(f"✅ Processing complete! Processed {len(all_issues)} issues")
        logger.info(f"📊 Total pieces: {self.parent_index['total_pieces']}")
        logger.info(f"📁 Output saved to: {self.output_dir}")

def main():
    """Main function"""
    processor = PDFProcessor()
    
    # Check if issues directory exists
    if not processor.issues_dir.exists():
        logger.error(f"Issues directory not found: {processor.issues_dir}")
        logger.error("Please ensure PDF files are in the 'issues' directory")
        return
    
    # Process all PDFs
    processor.process_all_pdfs()
    
    print(f"\n🎉 Successfully processed {processor.parent_index['total_issues']} issues!")
    print(f"📊 Total pieces extracted: {processor.parent_index['total_pieces']}")
    print(f"📁 Check the 'website/data' directory for results")
    print(f"📊 Parent index: website/data/parent_index.json")

if __name__ == "__main__":
    main()
