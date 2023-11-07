"use client";
import { signIn } from "next-auth/react";
import { BrandGithub } from "tabler-icons-react";
const SignInWithGithub = () => {
  return (
    <button
      onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
      className="btn btn-wide btn-neutral"
    >
      <BrandGithub size={20} /> Sign In With Github
    </button>
  );
};

export default SignInWithGithub;
