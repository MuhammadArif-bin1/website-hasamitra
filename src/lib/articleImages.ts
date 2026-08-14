export interface ArticleImages {
  cover: string;
  content: string;
}

/**
 * Parsing data foto berita (foto sampul dan foto di dalam isi berita)
 * Menjamin backwards compatibility untuk data lama yang hanya memiliki 1 URL string.
 */
export function parseArticleImages(imageStr: string | null | undefined): ArticleImages {
  if (!imageStr) {
    return { cover: "", content: "" };
  }

  const trimmed = imageStr.trim();
  if (!trimmed) {
    return { cover: "", content: "" };
  }

  // Jika format JSON { cover: "...", content: "..." }
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed);
      return {
        cover: parsed.cover || parsed.content || "",
        content: parsed.content || parsed.cover || "",
      };
    } catch {
      // fallback
    }
  }

  // Jika format delimiter "coverUrl|||contentUrl"
  if (trimmed.includes("|||")) {
    const [cover, content] = trimmed.split("|||");
    return {
      cover: cover?.trim() || content?.trim() || "",
      content: content?.trim() || cover?.trim() || "",
    };
  }

  // Format single image url (legacy / shared)
  return {
    cover: trimmed,
    content: trimmed,
  };
}

/**
 * Serialisasi foto sampul dan foto konten berita ke string penyimpanan
 */
export function serializeArticleImages(
  cover: string | null | undefined,
  content: string | null | undefined
): string | null {
  const cleanCover = cover?.trim() || "";
  const cleanContent = content?.trim() || "";

  if (!cleanCover && !cleanContent) {
    return null;
  }

  if (cleanCover && cleanContent && cleanCover !== cleanContent) {
    return JSON.stringify({ cover: cleanCover, content: cleanContent });
  }

  return cleanCover || cleanContent || null;
}
