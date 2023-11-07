import Link from "next/link";
import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

export default async function Home() {
  const session = await getServerSession(options);
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-lg">
          <h1 className="text-5xl font-bold">Hello there</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          {session ? (
            <Link href="/dashboard">
              <button className="btn btn-neutral">Let's Go</button>
            </Link>
          ) : (
            <Link href="/api/auth/signin">
              <button className="btn btn-neutral">Login</button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
