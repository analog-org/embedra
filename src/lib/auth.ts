import { betterAuth } from "better-auth";

export const auth = betterAuth({
  socialProviders: {
    discord: {
      clientId: import.meta.env.DISCORD_CLIENT_ID as string,
      clientSecret: import.meta.env.DISCORD_CLIENT_SECRET as string,
      scope: ["identify", "guilds"]
    },
  },
});
