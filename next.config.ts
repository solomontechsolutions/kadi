import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The genome engine is plain ES modules under /engine, imported directly by
  // the app and also served verbatim to the legacy static pages. Nothing to
  // transpile -- keeping it framework-neutral is what lets both consume it.
  reactStrictMode: true,
};

export default nextConfig;
