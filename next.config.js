/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  experimental: {
    serverActions: {
      // Enabling server actions as an object; additional config can be added if needed
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "frame-ancestors 'self' https://www.google.com https://*.firebaseapp.com",
              "frame-src https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://js.stripe.com https://hooks.stripe.com https://b.stripecdn.com https://checkout.stripe.com https://pay.google.com https://*.firebaseapp.com https://*.js.stripe.com https://connect-js.stripe.com",
              "script-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://va.vercel-scripts.com https://js.stripe.com https://b.stripecdn.com https://checkout.stripe.com https://applepay.cdn-apple.com https://pay.google.com https://maps.googleapis.com https://connect-js.stripe.com https://*.js.stripe.com https://apis.google.com 'unsafe-inline' 'unsafe-eval'", // 'unsafe-inline' and 'unsafe-eval' are often needed for scripts but try to minimize their use.

              "style-src 'self' 'unsafe-inline' 'unsafe-hashes' https://applepay.cdn-apple.com https://js.stripe.com https://b.stripecdn.com https://checkout.stripe.com https://*.stripe.com",
              "font-src 'self' data: https://assets.alicdn.com",
              "connect-src 'self' http://localhost:8080 http://localhost:9099 https://*.vercel-insights.com https://vitals.vercel-insights.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://firestore.googleapis.com https://identitytoolkit.googleapis.com https://*.googleapis.com https://api.stripe.com https://r.stripe.com/b https://checkout.stripe.com https://maps.googleapis.com https://*.firebaseapp.com https://applepay.cdn-apple.com https://*.cloudfunctions.net",
              "img-src 'self' data: blob: https://www.google.com https://res.cloudinary.com https://www.gstatic.com https://*.stripe.com https://*.googleusercontent.com"
            ].join("; ")
          },

        ]
      }
    ]
  }
};

module.exports = nextConfig;
