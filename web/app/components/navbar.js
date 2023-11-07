import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import React from "react";
import SignOut from "./signout";

const navbar = async () => {
  const session = await getServerSession(options);
  return (
    <div className="navbar bg-base-100">
      <div className="dropdown">
        <label tabIndex={0} className="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          {session ? (
            <li>
              <Link href="/dashboard">Home</Link>
            </li>
          ) : null}

          <li>
            <a>About</a>
          </li>
        </ul>
      </div>
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          QuizMaster
        </Link>
      </div>
      <div className="flex-none px-4">
        {session ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={session?.user?.image} />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge badge-neutral">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <SignOut />
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li>
                <Link href="/login">Log In</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default navbar;
