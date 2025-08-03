// Simple token approximation (more accurate would require tiktoken library)
export function estimateTokens(text) {
  if (!text) return 0;
  // Rough approximation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4);
}

export function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
}
