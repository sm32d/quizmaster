import GitHubProvider from "next-auth/providers/github";

export const options = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn(props) {
      const backendUri = process.env.BACKEND_URI;
      const jsonObject = {};
      jsonObject["username"] = props.profile.login;
      jsonObject["email"] = props.profile.email;
      jsonObject["name"] = props.user.name;
      jsonObject["provider"] = props.account.provider;
      jsonObject["providerAccountId"] = props.account.providerAccountId;
      let isAllowedToSignIn;
      try {
        const response = await fetch(`${backendUri}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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
    }
  },
};
