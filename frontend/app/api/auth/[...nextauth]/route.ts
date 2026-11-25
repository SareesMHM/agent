// Placeholder: authentication is handled by the NestJS backend (JWT) via lib/auth.ts.
// Replace with NextAuth (credentials provider -> POST /api/auth/login) if server-side sessions are required.
export async function GET() { return Response.json({ status: 'jwt-auth', backend: process.env.NEXT_PUBLIC_API_URL }); }
