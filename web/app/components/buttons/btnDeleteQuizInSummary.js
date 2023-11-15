"use client";
import { TrashX } from "tabler-icons-react";

async function deleteQuiz(quizId, backendUri, backendApiKey) {
  try {
    const response = await fetch(`${backendUri}/api/quiz/${quizId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${backendApiKey}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.error(`Error deleting quiz with id: ${quizId}: ${error}`);
    return false;
  }
}

const DeleteQuizInSummaryBtn = ({ quizId, backendUri, backendApiKey }) => {
  const handleDelete = async () => {
    const resp = await deleteQuiz(quizId, backendUri, backendApiKey);
    resp && window.location.reload();
  };

  return (
    <div>
      <button
        onClick={() =>
          document.getElementById(`delete_quiz_${quizId}_modal`).showModal()
        }
      >
        <TrashX size={20} />
      </button>
      <dialog
        id={`delete_quiz_${quizId}_modal`}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Quiz</h3>
          <p className="py-4">
            Are you sure that you want to delete this quiz? This is
            <span className="text-error"> irreversible.</span>
          </p>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <form method="dialog">
              <button className="btn btn-neutral">Cancel</button>
            </form>
            <form method="dialog">
              <button onClick={handleDelete} className="btn btn-error">
                Delete
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default DeleteQuizInSummaryBtn;
