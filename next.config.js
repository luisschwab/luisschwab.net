/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'export',
    reactStrictMode: true,

    images: {
        unoptimized: true,
    },

    trailingSlash: true,
}

const withFonts = require('next-fonts');
module.exports = {
    withFonts: withFonts({
        enableSvg: true,
        webpack: (config, options) => {
            return config;
        },
    }),
};

module.exports = nextConfig
