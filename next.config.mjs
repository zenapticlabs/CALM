/** @type {import('next').NextConfig} */
const nextConfig = {
  // transpilePackages: ["@refinedev/antd"],
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    );

    config.module.rules.push(
      // Convert all other *.svg?icon imports to React components
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: /icon/, // *.svg?icon
        use: ['@svgr/webpack'],
      },
      // Reapply the existing rule, for all other *.svg imports
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: { not: /icon/ }, // exclude if *.svg?icon
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  output: 'export',
  distDir: 'dist'
};



export default nextConfig;
