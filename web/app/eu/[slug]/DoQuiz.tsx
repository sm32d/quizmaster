"use client";
import { Ban } from "tabler-icons-react";
import { useRouter } from "next/navigation";
import NotFound from "../../not-found";
import { useState } from "react";

import {
  Question,
  QuestionAnswer,
  Quiz,
  QuizAnswer,
  QuizEligibility,
} from "../../types/quiz";
import LoadingCircular from "../../components/LoadingCircular";
import CountdownTimer from "./CountdownTimer";

const DoQuiz = ({
  backendUri,
  backendApiKey,
  quizDetails,
}: {
  backendUri: string;
  backendApiKey: string;
  quizDetails: Quiz;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingClose, setIsLoadingClose] = useState(false);

  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<QuizAnswer | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestionAnswer, setCurrentQuestionAnswer] = useState("");

  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [email, setEmail] = useState("");

  const router = useRouter();

  const verifyEligibility = async () => {
    setIsLoading(true);
    setStep(1);
    const response = await fetch(
      `${backendUri}/api/quiz/${quizDetails.id}/eligibility`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${backendApiKey}`,
        },
        body: JSON.stringify({ email }),
      }
    );
    const data: QuizEligibility = await response.json();
    if (!response?.ok) {
      setStep(0);
      setIsLoading(false);
      return;
    }
    if (data?.eligible) {
      if (!data?.answer) {
        const initAnswer = await fetch(
          `${backendUri}/api/quiz/${quizDetails.id}/init-answer`,
          {
            cache: "no-store",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${backendApiKey}`,
            },
            body: JSON.stringify({ email }),
          }
        );
        const initAnswerData: QuizAnswer = await initAnswer.json();
        setAnswer(initAnswerData);
      } else {
        setAnswer(data?.answer);
        setCurrentQuestionAnswer(
          getAnswerByQuestionId(data?.answer, quizDetails.questions[0].id)
        );
      }
    } else {
      setStep(-1);
    }
    setIsLoading(false);
  };

  const getAnswerByQuestionId = (
    quizAnswer: QuizAnswer,
    questionId: string
  ): string | undefined => {
    const qa = quizAnswer?.answers?.find((qa) => qa.question_id === questionId);
    return qa ? qa.answer : "";
  };

  const goNext = async () => {
    quizDetails.questions.length > currentQuestionIndex + 1
      ? setCurrentQuestionIndex(currentQuestionIndex + 1)
      : setStep(2);

    const response = await fetch(`${backendUri}/api/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${backendApiKey}`,
      },
      body: JSON.stringify({
        email: email,
        answer_id: answer?.id,
        questionAnswer: {
          question_id: quizDetails.questions[currentQuestionIndex].id,
          answer: currentQuestionAnswer,
        },
      }),
    });
    const data: QuizAnswer = await response.json();
    setAnswer(data);

    quizDetails.questions.length > currentQuestionIndex + 1 &&
      setCurrentQuestionAnswer(
        getAnswerByQuestionId(
          data,
          quizDetails.questions[currentQuestionIndex + 1].id
        )
      );
    setIsLoading(false);
  };

  const goBack = async () => {
    setIsLoading(true);
    const response = await fetch(`${backendUri}/api/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${backendApiKey}`,
      },
      body: JSON.stringify({
        email: email,
        answer_id: answer?.id,
        questionAnswer: {
          question_id: quizDetails.questions[currentQuestionIndex].id,
          answer: currentQuestionAnswer,
        },
      }),
    });
    const data: QuizAnswer = await response.json();
    response?.ok && setAnswer(data);

    currentQuestionIndex > 0 &&
      setCurrentQuestionIndex(currentQuestionIndex - 1);

    response?.ok
      ? setCurrentQuestionAnswer(
          getAnswerByQuestionId(
            data,
            quizDetails.questions[currentQuestionIndex - 1].id
          )
        )
      : setCurrentQuestionAnswer(
          getAnswerByQuestionId(
            answer,
            quizDetails.questions[currentQuestionIndex - 1].id
          )
        );
    setIsLoading(false);
  };

  const goToQuestion = async (step: number) => {
    setIsLoading(true);
    const response = await fetch(`${backendUri}/api/answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${backendApiKey}`,
      },
      body: JSON.stringify({
        email: email,
        answer_id: answer?.id,
        questionAnswer: {
          question_id: quizDetails.questions[currentQuestionIndex].id,
          answer: currentQuestionAnswer,
        },
      }),
    });
    const data: QuizAnswer = await response.json();
    response?.ok && setAnswer(data);
    setCurrentQuestionIndex(step);
    response?.ok
      ? setCurrentQuestionAnswer(
          getAnswerByQuestionId(data, quizDetails.questions[step].id)
        )
      : setCurrentQuestionAnswer(
          getAnswerByQuestionId(answer, quizDetails.questions[step].id)
        );
    setIsLoading(false);
  };

  const closeAttempt = async () => {
    setIsLoadingClose(true);
    const response = await fetch(`${backendUri}/api/answer/${answer.id}/complete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${backendApiKey}`,
      }
    });

    response?.ok ? router.push("/") : setIsLoadingClose(false);
  }

  return (
    <div className="min-h-[85svh] min-w-full">
      {quizDetails && quizDetails?.active ? (
        <div className="min-w-full min-h-[80%] flex flex-col pb-4">
          {step === -1 && (
            <div className="hero-content flex-col">
              <div className="flex">
                <div className="flex items-center px-1">
                  <Ban size={30} />
                </div>
                <h1 className="text-2xl font-bold px-1">Oopsie!</h1>
              </div>
              <span className="max-w-md text-center">
                It seems like you have already completed this quiz.
              </span>
              <button onClick={() => router.refresh()} className="btn mt-4">
                Go back
              </button>
            </div>
          )}
          {step === 0 && (
            <div className="flex flex-col justify-center w-full">
              <div className="collapse collapse-arrow bg-base-200 mb-6">
                <input type="checkbox" />
                <div className="collapse-title text-md font-medium">
                  About this quiz
                </div>
                <div className="collapse-content mx-6">
                  <ul className="text-base list-disc">
                    <li>{quizDetails?.questions.length} questions</li>
                    <li>{quizDetails?.difficulty} difficulty</li>
                    <li>
                      {quizDetails?.allow_multiple_attempts
                        ? "Allows multiple attempts"
                        : "Does not allow multiple attempts"}
                    </li>
                    {quizDetails?.timer > 0 && (
                      <li>Timed quiz with ${quizDetails?.timer} seconds</li>
                    )}
                  </ul>
                </div>
              </div>
              <dialog
                id="proceed_to_answer_dialog"
                className="modal modal-bottom sm:modal-middle"
              >
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Start Attempt</h3>
                  <p className="py-4">
                    {quizDetails?.timer > 0 && (
                      <>
                        Upon clicking start, the quiz will start immediately and
                        you will only have {quizDetails?.timer} minutes to
                        complete it.
                      </>
                    )}
                    {!quizDetails?.allow_multiple_attempts && (
                      <>
                        {" "}
                        Since the quiz does not allow multiple attempts, you
                        will not be able to attempt it again once completed.
                      </>
                    )}
                    {!quizDetails?.allow_multiple_attempts ||
                      quizDetails?.timer > 0 ? (
                        <>
                          <br />
                        </>
                      ): null}
                    <>
                      Fret not! If you accidentally close the window, you can
                      still resume from where you left off before the attempt is
                      completed.
                    </>
                  </p>
                  <div className="modal-action">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn">Close</button>
                    </form>
                    <form method="dialog">
                      <button
                        onClick={verifyEligibility}
                        className="btn btn-primary"
                      >
                        {isLoading ? <LoadingCircular /> : "Start"}
                      </button>
                    </form>
                  </div>
                </div>
              </dialog>
              <div className="flex flex-col w-full">
                <label className="text-lg flex-grow">
                  We need your email to start this quiz
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`input input-bordered flex-grow mt-2 ${
                    !EMAIL_REGEX.test(email) ? "input-error" : "input-success"
                  }`}
                  placeholder="Please provide your email"
                />
                <div className="flex mt-4 justify-end">
                  <button
                    className="btn btn-primary mt-4"
                    onClick={() =>
                      (
                        document.getElementById(
                          "proceed_to_answer_dialog"
                        ) as HTMLDialogElement
                      ).showModal()
                    }
                    disabled={isLoading || !EMAIL_REGEX.test(email)}
                  >
                    {isLoading ? <LoadingCircular /> : "Continue"}
                  </button>
                </div>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="flex flex-col w-full min-h-[80svh]">
              {quizDetails?.timer > 0 && (
                <CountdownTimer answer={answer} quizDetails={quizDetails} />
              )}
              <div className="overflow-x-auto flex justify-center mb-8">
                {isLoading ? (
                  <ul className="steps skeleton">
                    {quizDetails?.questions.map((question, index) => (
                      <li key={index} data-content="" className="step"></li>
                    ))}
                  </ul>
                ) : (
                  <ul className="steps">
                    {quizDetails?.questions.map((question, index) => (
                      <li
                        key={index}
                        data-content={
                          index === currentQuestionIndex ? "●" : index + 1
                        }
                        className={`step cursor-pointer ${
                          index === currentQuestionIndex
                            ? ""
                            : getAnswerByQuestionId(answer, question.id) !== ""
                            ? "step-primary"
                            : ""
                        } `}
                        onClick={() => goToQuestion(index)}
                      ></li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex-1 flex flex-col items-center gap-8">
                {isLoading ? (
                  <div className="skeleton h-10 text-2xl w-full"></div>
                ) : (
                  <div className="text-2xl w-full">
                    {quizDetails?.questions[currentQuestionIndex]?.text}
                  </div>
                )}
                <div className="flex w-full">
                  <div className="flex flex-col w-full items-center">
                    {isLoading ? (
                      <div className="skeleton h-10 w-full"></div>
                    ) : (
                      <select
                        value={currentQuestionAnswer}
                        onChange={(e) =>
                          setCurrentQuestionAnswer(e.target.value)
                        }
                        className="select select-bordered w-full"
                      >
                        <option
                          value=""
                          disabled
                          selected={currentQuestionAnswer === ""}
                        >
                          Choose one option
                        </option>
                        {
                          /* map through question.choices to show checkboxed for question options */
                          quizDetails?.questions[
                            currentQuestionIndex
                          ]?.choices?.map((choice, index) => (
                            <option
                              key={index}
                              selected={currentQuestionAnswer === choice}
                              value={choice}
                            >
                              {choice}
                            </option>
                          ))
                        }
                      </select>
                    )}
                    <div
                      className={`flex w-full mt-8 ${
                        currentQuestionIndex > 0
                          ? "justify-between"
                          : "justify-end"
                      }`}
                    >
                      {currentQuestionIndex > 0 ? (
                        isLoading ? (
                          <div className="skeleton h-10 w-20"></div>
                        ) : (
                          <button
                            className="btn btn-primary max-w-sm"
                            onClick={goBack}
                            disabled={isLoading || !EMAIL_REGEX.test(email)}
                          >
                            {isLoading ? <LoadingCircular /> : "Back"}
                          </button>
                        )
                      ) : (
                        ""
                      )}
                      {isLoading ? (
                        <div className="skeleton h-10 w-20"></div>
                      ) : (
                        <button
                          className="btn btn-primary max-w-sm"
                          onClick={() => {
                            setIsLoading(true);
                            goNext();
                          }}
                          disabled={isLoading || !EMAIL_REGEX.test(email)}
                        >
                          {isLoading ? (
                            <LoadingCircular />
                          ) : quizDetails.questions.length >
                            currentQuestionIndex + 1 ? (
                            "Next"
                          ) : (
                            "Review"
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="flex flex-col w-full min-h-[80svh]">
              <div className="w-full">
                {quizDetails?.questions?.map((question: Question, index) => {
                  return isLoading ? (
                    <div
                      key={index}
                      className="card skeleton shadow-xl mt-2 md:mx-4 w-full h-32"
                    ></div>
                  ) : (
                    <div
                      key={index}
                      className="card bg-base-100 shadow-xl mt-2 md:mx-4"
                    >
                      <div className="card-body px-4 py-2">
                        <div className="flex flex-col">
                          <div className="text-lg">
                            Question {index + 1}: {question.text}
                          </div>
                          <div className="divider m-0"></div>
                          <div>
                            {getAnswerByQuestionId(answer, question.id)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex w-full justify-between py-8 px-2 md:px-6">
                {isLoading ? (
                  <div className="skeleton h-10 w-20"></div>
                ) : (
                  <button
                    className="btn btn-primary max-w-sm"
                    onClick={() => {
                      setStep(1);
                    }}
                  >
                    Back
                  </button>
                )}
                {isLoading ? (
                  <div className="skeleton h-10 w-20"></div>
                ) : (
                  <button
                    className="btn btn-primary max-w-sm"
                    onClick={() => {
                      closeAttempt();
                    }}
                    disabled={isLoadingClose || !EMAIL_REGEX.test(email)}
                  >
                    {isLoadingClose ? <LoadingCircular /> : "Submit"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default DoQuiz;
