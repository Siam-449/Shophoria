
/**
 * Structured Data (JSON-LD) component for SEO.
 * This helps search engines understand the content and organization of the site.
 */
export default function StructuredData({ data }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
