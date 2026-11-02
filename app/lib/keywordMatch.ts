export interface KeywordMatchResult {
    matchPercentage: number;
    matched: string[];
    missing: string[];
}

// common words that carry no signal for a skills/requirements match
const STOPWORDS = new Set([
    "the", "and", "for", "are", "but", "not", "you", "all", "any", "can",
    "had", "her", "was", "one", "our", "out", "day", "get", "has", "him",
    "his", "how", "man", "new", "now", "old", "see", "two", "way", "who",
    "boy", "did", "its", "let", "put", "say", "she", "too", "use", "with",
    "this", "that", "from", "they", "have", "will", "your", "about", "into",
    "than", "them", "then", "were", "when", "what", "which", "their", "would",
    "there", "being", "while", "where", "could", "should", "other", "some",
    "such", "these", "those", "through", "across", "within", "a", "an", "to",
    "of", "in", "on", "at", "by", "or", "is", "it", "as", "we", "be", "job",
    "role", "work", "team", "years", "year", "experience", "ability",
    "strong", "including", "etc", "also", "including", "preferred", "plus",
    "looking", "software", "engineer", "developer", "candidate", "position",
]);

function normalize(word: string): string {
    return word
        .toLowerCase()
        .replace(/[^a-z0-9+#.]/g, "")
        .replace(/^\.+|\.+$/g, "");
}

export function extractKeywords(jobDescription: string, limit = 25): string[] {
    const counts = new Map<string, number>();

    const words = jobDescription.split(/\s+/).map(normalize).filter(Boolean);

    for (const word of words) {
        if (word.length < 3 || STOPWORDS.has(word)) continue;
        counts.set(word, (counts.get(word) ?? 0) + 1);
    }

    return [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([word]) => word);
}

export function matchKeywords(resumeText: string, keywords: string[]): KeywordMatchResult {
    const normalizedResume = resumeText.toLowerCase();

    const matched: string[] = [];
    const missing: string[] = [];

    for (const keyword of keywords) {
        if (normalizedResume.includes(keyword)) {
            matched.push(keyword);
        } else {
            missing.push(keyword);
        }
    }

    const matchPercentage = keywords.length === 0
        ? 0
        : Math.round((matched.length / keywords.length) * 100);

    return { matchPercentage, matched, missing };
}

export function analyzeKeywordMatch(resumeText: string, jobDescription: string): KeywordMatchResult | null {
    if (!jobDescription.trim()) return null;

    const keywords = extractKeywords(jobDescription);
    if (keywords.length === 0) return null;

    return matchKeywords(resumeText, keywords);
}
