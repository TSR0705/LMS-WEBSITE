const baseUrl =
  process.env.NODE_ENV === "production"
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : `${process.env.NEXT_PUBLIC_BASE_URL}`;

export default baseUrl;
