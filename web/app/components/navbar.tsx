import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import React from "react";
import SignOut from "./signout";

import { Alpha } from "tabler-icons-react";
import { ExtendedSession } from "../types/user";

const navbar = async () => {
  const APP_NAME = process.env.APP_NAME;

  const session: ExtendedSession = await getServerSession(options);
  const classes = session?.user.ab
    ? "navbar min-h-[8svh] m-4 max-w-[92svw] shadow rounded-3xl"
    : "navbar border-b border-dashed border-neutral dark:border-base-content min-h-[8svh]";

  return (
    <div className={classes}>
      <details className="dropdown">
        <summary tabIndex={0} className="btn btn-ghost btn-circle">
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
        </summary>
        {/* alt <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content p-0 mt-3 z-[1] shadow bg-base-100 rounded-box w-52 border border-neutral"
        >
          <li className="border-b border-neutral">
            <Link className="py-2 px-4" href="/">Home</Link>
          </li>
          {session ? (
            <li className="border-b border-neutral">
              <Link className="py-2 px-4" href="/dashboard">Dashboard</Link>
            </li>
          ) : null}

          <li>
            <a className="py-2 px-4">About</a>
          </li>
        </ul> */}
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border border-dotted border-neutral"
        >
          <li>
            <Link href="/">Home</Link>
          </li>
          {session ? (
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
          ) : null}
        </ul>
      </details>
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          {APP_NAME}{" "}
          <span className="text-xs flex -ml-2 -mb-5">
            <Alpha size={10} /> alpha
          </span>
        </Link>
      </div>
      <div className="flex-none px-4">
        {session ? (
          <details className="dropdown dropdown-end">
            <summary tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={session?.user?.image} />
              </div>
            </summary>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border border-dotted border-neutral"
            >
              <li>
                <a className="justify-between">
                  Settings
                  <span className="badge badge-neutral">New</span>
                </a>
              </li>
              <li>
                <SignOut />
              </li>
            </ul>
          </details>
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
