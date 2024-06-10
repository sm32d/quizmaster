"use client";
import Link from "next/link";
import { Share } from "tabler-icons-react";
const ShareQuiz = ({ quizId }: { quizId: string }) => {
  return (
    <div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <Link
        href=""
        onClick={() => {
          navigator.clipboard.writeText(
            `${window.location.origin}/eu/${quizId}`,
          );
          (
            document.getElementById("share_modal") as HTMLDialogElement
          ).showModal();
        }}
      >
        <Share size={20} />
      </Link>
      <dialog id="share_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Copied 🎉🎉</h3>
          <p className="py-2">Link copied to your clipboard.</p>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <form method="dialog">
              <button className="btn btn-neutral">Great!</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ShareQuiz;
