// next.config.js
module.exports = {
  reactStrictMode: true,
  // agar Vercel mem-publish folder `api/` sebagai Python Functions
  functions: {
    'api/**/*.py': { runtime: 'python3.9' }
  }
};
