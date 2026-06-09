/** @type {import('next').NextConfig} */
const nextConfig = {
    devIndicators: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "koilink-s3-bucket.s3.amazonaws.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "koilink-s3-bucket.s3.us-east-1.amazonaws.com",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
