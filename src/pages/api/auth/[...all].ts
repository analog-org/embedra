import { auth } from "../../../lib/auth"; // import your Better Auth instance
import type { APIRoute } from "astro";

export const ALL: APIRoute = async (ctx) => {
  return auth.handler(ctx.request);
};