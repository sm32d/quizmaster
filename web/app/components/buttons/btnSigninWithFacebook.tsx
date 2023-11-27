"use client";
import { signIn } from "next-auth/react";
import { BrandFacebook } from "tabler-icons-react";
const SignInWithFacebook = () => {
  return (
    <button
      onClick={() => signIn("facebook", { callbackUrl: "/dashboard" })}
      className="btn btn-wide btn-neutral"
    >
      <BrandFacebook size={20} /> With Facebook
    </button>
  );
};

export default SignInWithFacebook;
