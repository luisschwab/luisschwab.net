/** @type {import('next').NextConfig} */
const withFonts = require('next-fonts');

const nextConfig = {
    output: 'export',
    reactStrictMode: true,
    images: {
        unoptimized: true,
    },
    trailingSlash: true
}

module.exports = withFonts({
    ...nextConfig,
    enableSvg: true,
    webpack: (config, options) => {
        return config;
    }
});