import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // servePage() (src/lib/serve-static-page.ts) reads site/*.html via a
  // runtime-computed path, which build-time file tracing can't always
  // resolve through static analysis — without this, some routes' deployed
  // serverless bundles silently omit the site/ HTML files and 404 in
  // production even though the build succeeds locally.
  outputFileTracingIncludes: {
    "/**": ["./site/**/*"],
  },
};

export default nextConfig;
