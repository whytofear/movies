import { Metadata } from "next";

/**
 * Get canonical URL for the current page
 * @param path - Path relative to the domain root
 * @returns Full canonical URL
 */
export function getCanonicalUrl(path: string = ""): string {
  // Strip leading and trailing slashes for consistency
  const cleanPath = path.replace(/^\/|\/$/g, "");

  // Base URL with no trailing slash
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://SimilarMovie.me"
  ).replace(/\/$/, "");

  // For root page (home), return just the base URL
  if (!cleanPath) {
    return baseUrl;
  }

  // For other pages, combine with path
  return `${baseUrl}/${cleanPath}`;
}

interface SEOMetadataProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export function generateSEOMetadata({
  title,
  description,
  canonical,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
}: SEOMetadataProps): Metadata {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://SimilarMovie.me"
  ).replace(/\/$/, "");
  const fullTitle = title.includes("SimilarMovie")
    ? title
    : `${title} | SimilarMovie`;
  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : `${baseUrl}${image}`
    : `${baseUrl}/og-image.jpg`;
  // Create a self-referencing canonical URL instead of pointing to home page
  const canonicalUrl = canonical
    ? canonical.startsWith("http")
      ? canonical
      : `${baseUrl}${canonical.startsWith("/") ? canonical : `/${canonical}`}`
    : undefined;

  return {
    title: fullTitle,
    description,
    keywords: tags?.join(", "),
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: "SimilarMovie",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type,
      publishedTime,
      modifiedTime,
      section,
      tags,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: "@SimilarMovie",
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function generateStructuredData(data: any) {
  return {
    __html: JSON.stringify(data, null, 2),
  };
}

export function generateMovieStructuredData(movie: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    description: movie.description,
    image: (movie.poster_path || movie.posterurl)?.startsWith("http")
      ? movie.poster_path || movie.posterurl
      : `https://image.tmdb.org/t/p/w500${
          movie.poster_path || movie.posterurl
        }`,
    datePublished: movie.release_date,
    genre: movie.genres?.split(",").map((g: string) => g.trim()),
    duration: movie.runtime ? `PT${movie.runtime}M` : undefined,
    aggregateRating: movie.vote_average
      ? {
          "@type": "AggregateRating",
          ratingValue: movie.vote_average,
          ratingCount: movie.vote_count,
          bestRating: 10,
          worstRating: 0,
        }
      : undefined,
    director: movie.director
      ? { "@type": "Person", name: movie.director }
      : undefined,
    productionCompany: movie.production_companies
      ?.split(",")
      .map((company: string) => ({
        "@type": "Organization",
        name: company.trim(),
      })),
    countryOfOrigin: movie.production_countries
      ?.split(",")
      .map((country: string) => ({
        "@type": "Country",
        name: country.trim(),
      })),
  };
}

export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${process.env.NEXT_PUBLIC_SITE_URL}${item.url}`,
    })),
  };
}
