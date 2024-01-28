import Link from "next/link";
import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

export default async function Home() {
  const session = await getServerSession(options);
  const APP_NAME = process.env.APP_NAME;
  return (
    <div className="hero min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold">Welcome</h1>
          <p className="py-6">
            {APP_NAME} is your one-stop solution for creating and sharing quizzes.
          </p>
          {session ? (
            <Link href="/dashboard">
              <button className="btn btn-neutral">Let's Go</button>
            </Link>
          ) : (
            <Link href="/login">
              <button className="btn btn-neutral">
                Log In
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
