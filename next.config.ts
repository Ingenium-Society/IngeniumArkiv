import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* TEMPORARY — verification build only. Remove before handing back: a non-default
     distDir left in place breaks the user's `next dev`. */
  distDir: ".next-verify",
};

export default nextConfig;
