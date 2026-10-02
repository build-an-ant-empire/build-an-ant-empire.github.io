import { integrations } from "@/config/integrations";

/** Render the Google tag directly in the document head for static verification. */
export function Analytics() {
  if (integrations.analytics.provider !== "google-analytics") return null;
  const measurementId = integrations.analytics.measurementId;

  return (
    <>
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <script
        id="google-analytics"
        dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        ` }}
      />
    </>
  );
}
