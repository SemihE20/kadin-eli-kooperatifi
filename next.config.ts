import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // reactCompiler: true, // disabled: babel-plugin-react-compiler incompatible with Node 26 / webpack WASM path
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
