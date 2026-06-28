
/**
 * Structured Data (JSON-LD) component for SEO.
 * This helps search engines understand the content and organization of the site.
 */
export default function StructuredData({ data }) {
  // Safe JSON stringify to avoid circular reference errors
  const safeStringify = (obj) => {
    let cache = [];
    const retVal = JSON.stringify(
      obj,
      (key, value) =>
        typeof value === "object" && value !== null
          ? cache.includes(value)
            ? undefined
            : cache.push(value) && value
          : value
    );
    cache = null;
    return retVal;
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeStringify(data) }}
    />
  );
}
