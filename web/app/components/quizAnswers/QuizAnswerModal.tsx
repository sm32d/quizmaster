"use client";

import { Question, QuizAnswer } from "../../types/quiz";

const QuizAnswerModal = ({
  questions,
  answer,
}: {
  questions: Question[];
  answer: QuizAnswer;
}) => {
  return (
    <div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        className="btn btn-primary"
        onClick={() => {
          (
            document.getElementById(
              `answer_modal_${answer.id}`
            ) as HTMLDialogElement
          ).showModal();
        }}
      >
        View
      </button>
      <dialog
        id={`answer_modal_${answer.id}`}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box sm:border sm:border-dotted sm:border-neutral shadow-xl">
          <h3 className="font-bold text-lg">Answers by {answer.user_id}</h3>
          <div className="divider my-2"></div>
          <div className="py-2">
            {questions.map((question) => (
              <div key={question.id}>
                <h4 className="font-semibold text-base">{question.text}</h4>
                {answer.answers.map(
                  (answer) =>
                    answer.question_id === question.id && (
                      <p key={answer.question_id}>
                        -{" "}
                        <span
                          className={
                            answer.answer === question.correct
                              ? "text-success"
                              : "text-error"
                          }
                        >
                          {answer.answer}
                        </span>
                      </p>
                    )
                )}
              </div>
            ))}
          </div>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <form method="dialog">
              <button className="btn btn-primary">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default QuizAnswerModal;
