"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
const SignOut = () => {
  return (
    <div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <Link
        href=""
        onClick={() => { (document.getElementById("sign_out_modal") as HTMLDialogElement).showModal() }}
      >
        Sign Out
      </Link>
      <dialog
        id="sign_out_modal"
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box sm:border sm:border-dotted sm:border-neutral shadow-xl">
          <h3 className="font-bold text-lg">Sign Out</h3>
          <p className="py-4">Are you sure that you want to sign out?</p>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <form method="dialog">
              <button className="btn btn-primary">Cancel</button>
            </form>
            <form method="dialog">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn btn-error"
              >
                Confirm
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default SignOut;
