import Link from "next/link";
import { MoodSadDizzy } from "tabler-icons-react";

export default function NotFound() {
  return (
    <div className="hero min-h-screen">
          <div className="hero-content flex-col">
            <div className="flex">
              <div className="flex items-center px-1"><MoodSadDizzy size={30} /></div>
              <h1 className="text-2xl font-bold px-1">Uh oh!</h1>
            </div>
            <span className="max-w-md text-center">
              This link seems broken or you do not have permission to view the
              requested content.
            </span>
            <Link href="/">
              <button className="btn mt-4">Go Back</button>
            </Link>
          </div>
        </div>
  );
}
