// Configuration for asset URLs
export const ASSET_CONFIG = {
  // R2 CDN domain
  R2_DOMAIN: "https://cdn.usedgravitrons.com",
};

export function getImageUrl(issueId: number, filename: string): string {
  const paddedId = issueId.toString().padStart(2, '0');
  return `${ASSET_CONFIG.R2_DOMAIN}/issue_${paddedId}/images/${filename}`;
}

export function getPdfUrl(issueId: number, filename: string): string {
  const paddedId = issueId.toString().padStart(2, '0');
  return `${ASSET_CONFIG.R2_DOMAIN}/issue_${paddedId}/pdfs/${filename}`;
}
