import React from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export function SEO({
  title = "Shadi Khata | Best Shadi (Marriage) Management App in Pakistan & India",
  description = "Shadi Khata helps you manage your wedding (shadi) events, invitations, families, and guests. The #1 marriage management platform for Pakistan and India. Organize your shadi with ease!",
  keywords = "shadi, marriage, wedding, Pakistan, India, shaadi, baraat, walima, mehndi, nikah, wedding management, guest list, invitations, families, events, shadi khata, shaadi app, marriage app, wedding app, Pakistani wedding, Indian wedding",
  image = "/favicon.svg",
  url = "https://your-domain.com"
}: SEOProps) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: title,
            url,
            description,
            inLanguage: "en",
            potentialAction: {
              "@type": "SearchAction",
              target: `${url}/search?q={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    </>
  );
}
