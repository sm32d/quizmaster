"use client";
import { signIn } from "next-auth/react";
import { BrandGithub } from "tabler-icons-react";
const SignInWithGithub = () => {
  return (
    <button
      onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
      className="btn btn-wide btn-primary"
    >
      <BrandGithub size={20} /> With Github
    </button>
  );
};

export default SignInWithGithub;
