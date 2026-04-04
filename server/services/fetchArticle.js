import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';
import * as cheerio from 'cheerio';

/** og/twitter 메타의 이미지 URL을 페이지 기준 절대 URL로 정규화 */
function resolveImageUrl(pageUrl, raw) {
  if (!raw || typeof raw !== "string") return null;
  const t = raw.trim();
  if (!t) return null;
  try {
    return new URL(t, pageUrl).href;
  } catch {
    return null;
  }
}

function pickThumbnail($, pageUrl) {
  // og:image는 스펙상 property지만, 실제로는 name="og:image"만 쓰는 사이트가 많음(MDN 등)
  const candidates = [
    $(`meta[property="og:image"]`).attr("content"),
    $(`meta[name="og:image"]`).attr("content"),
    $(`meta[property="og:image:secure_url"]`).attr("content"),
    $(`meta[name="og:image:secure_url"]`).attr("content"),
    $(`meta[property="twitter:image"]`).attr("content"),
    $(`meta[name="twitter:image"]`).attr("content"),
    $(`meta[name="twitter:image:src"]`).attr("content"),
    $(`meta[itemprop="image"]`).attr("content"),
    $(`link[rel="image_src"]`).attr("href"),
  ];
  for (const raw of candidates) {
    const abs = resolveImageUrl(pageUrl, raw);
    if (abs) return abs;
  }
  return null;
}

async function fetchArticle(url) {
  // 일부 뉴스 사이트는 기본 Node UA를 차단함 — 브라우저에 가깝게 요청
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch URL (${response.status})`);
  }
  const html = await response.text();

  const $ = cheerio.load(html);
  const thumbnail = pickThumbnail($, url);

  const dom = new JSDOM(html, { url });

  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article) {
    throw new Error("Failed to parse the article");
  }

  return {
    title: article.title,
    textContent: article.textContent,
    excerpt: article.excerpt,
    siteName: article.siteName,
    thumbnail,
  };
}

export default fetchArticle;