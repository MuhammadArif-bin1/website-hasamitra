export interface ArticleImages {
  cover: string;
  content: string;
  contentImages: string[];
}

/**
 * Parsing data foto berita (foto sampul dan banyak foto di dalam isi berita)
 * Menjamin backwards compatibility untuk data lama yang memiliki 1 URL atau format sebelumnya.
 */
export function parseArticleImages(imageStr: string | null | undefined): ArticleImages {
  if (!imageStr) {
    return { cover: "", content: "", contentImages: [] };
  }

  const trimmed = imageStr.trim();
  if (!trimmed) {
    return { cover: "", content: "", contentImages: [] };
  }

  // Jika format JSON
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    try {
      const parsed = JSON.parse(trimmed);
      const cover = typeof parsed.cover === "string" ? parsed.cover.trim() : "";

      let contentImages: string[] = [];
      if (Array.isArray(parsed.contentImages)) {
        contentImages = parsed.contentImages.filter((url: unknown) => typeof url === "string" && url.trim().length > 0);
      } else if (Array.isArray(parsed.contents)) {
        contentImages = parsed.contents.filter((url: unknown) => typeof url === "string" && url.trim().length > 0);
      } else if (Array.isArray(parsed.content)) {
        contentImages = parsed.content.filter((url: unknown) => typeof url === "string" && url.trim().length > 0);
      } else if (typeof parsed.content === "string" && parsed.content.trim()) {
        contentImages = [parsed.content.trim()];
      }

      const mainContent = contentImages[0] || cover || "";
      const finalCover = cover || contentImages[0] || "";

      return {
        cover: finalCover,
        content: mainContent,
        contentImages: contentImages.length > 0 ? contentImages : (finalCover ? [finalCover] : []),
      };
    } catch {
      // fallback
    }
  }

  // Jika format delimiter "coverUrl|||contentUrl1|||contentUrl2"
  if (trimmed.includes("|||")) {
    const parts = trimmed.split("|||").map((p) => p.trim()).filter((p) => p.length > 0);
    const cover = parts[0] || "";
    const contentImages = parts.length > 1 ? parts.slice(1) : (cover ? [cover] : []);
    return {
      cover,
      content: contentImages[0] || cover || "",
      contentImages,
    };
  }

  // Format single image url (legacy / shared)
  return {
    cover: trimmed,
    content: trimmed,
    contentImages: [trimmed],
  };
}

/**
 * Serialisasi foto sampul dan array foto konten berita ke string penyimpanan
 */
export function serializeArticleImages(
  cover: string | null | undefined,
  contentImagesInput: string[] | string | null | undefined
): string | null {
  const cleanCover = cover?.trim() || "";

  let list: string[] = [];
  if (Array.isArray(contentImagesInput)) {
    list = contentImagesInput.map((url) => (typeof url === "string" ? url.trim() : "")).filter((url) => url.length > 0);
  } else if (typeof contentImagesInput === "string" && contentImagesInput.trim()) {
    list = [contentImagesInput.trim()];
  }

  if (!cleanCover && list.length === 0) {
    return null;
  }

  if (list.length === 0 && cleanCover) {
    return cleanCover;
  }

  if (list.length === 1 && list[0] === cleanCover) {
    return cleanCover;
  }

  return JSON.stringify({
    cover: cleanCover,
    contentImages: list,
  });
}

