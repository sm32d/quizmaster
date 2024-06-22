import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

export const options = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (
        account.provider === "facebook" &&
        (user.email === "" || user.email === null)
      ) {
        return false;
      }
      const backendUri = process.env.BACKEND_URI;
      const backendApiKey = process.env.BACKEND_API_KEY;
      const jsonObject = {};
      jsonObject["username"] = profile.login;
      jsonObject["email"] = profile.email;
      jsonObject["name"] = user.name;
      jsonObject["provider"] = account.provider;
      jsonObject["providerAccountId"] = account.providerAccountId;
      let isAllowedToSignIn: boolean = false;
      try {
        const response = await fetch(`${backendUri}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${backendApiKey}`,
          },
          body: JSON.stringify(jsonObject),
        });
        isAllowedToSignIn = response.ok;
      } catch (error) {
        console.error("Error fetching data: ", error);
        return false;
      }
      if (isAllowedToSignIn) {
        return true;
      } else {
        return false;
      }
    },
    async session({ session, user, token }) {      
      session.user.id = token.sub;
      return session;
    },
  },
};
