"use client";
import { ArrowBackUp } from "tabler-icons-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NotFound from "../../not-found";
import { useState } from "react";

import { Question, QuestionAnswer, QuizAnswer } from "../../types/quiz";
import LoadingCircular from "../../components/LoadingCircular";

type FormDataObject = {
  email: string;
};


const DoQuiz = ({ backendUri, backendApiKey, quizDetails }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const submitAnswer = async (formData: FormData) => {
    setIsLoading(true);
    const formDataObject: FormDataObject = { email: "" };
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
    const req: QuizAnswer = { quiz_id: "", user_id: "", answers: [] };
    req.quiz_id = quizDetails?.id;
    if (quizDetails?.collect_email) req.user_id = formDataObject?.email;
    req.answers = [];
    const quizQuestions = quizDetails?.questions;
    quizQuestions?.forEach((question: Question) => {
      const questionAnswer: QuestionAnswer = { question_id: "", answer: "" };
      const questionId = question?.id;
      questionAnswer.question_id = questionId;
      questionAnswer.answer = formDataObject[questionId];
      req.answers.push(questionAnswer);
    });
    try {
      const response = await fetch(`${backendUri}/api/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${backendApiKey}`,
        },
        body: JSON.stringify(req),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      router.push('/');
      return data;
    } catch (error) {
      console.error("Error fetching data: ", error);
      return null;
    }
  };

  return (
    <div className="min-h-screen">
      {quizDetails ? (
        <div>
          <header>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <div className="flex">
                <Link href="/dashboard">
                  <button className="btn btn-xs btn-outline mt-1">
                    <ArrowBackUp size={20} />
                  </button>
                </Link>
                <h1 className="tracking-tigh pl-4 text-2xl font-bold">{`${quizDetails?.title}`}</h1>
              </div>
              <span className="badge my-4">{quizDetails?.difficulty}</span>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
            <div className="flex justify-center overflow-x-auto pb-6">
              <form className="w-full md:w-1/2" action={submitAnswer}>
                {quizDetails?.collect_email ? (
                  <div className="flex flex-col">
                    <label className="text-2xl">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder={`Enter you email address`}
                      className="input input-bordered input-sm my-2"
                      required
                    />
                  </div>
                ) : null}
                <h2 className="py-2 text-2xl">Questions</h2>
                {quizDetails?.questions?.map((question: Question, index) => (
                  <div key={index} className="flex flex-col">
                    <label className="px-1 py-2 text-lg font-bold">
                      {question?.text}
                    </label>
                    {
                      /* map through question.choices to show checkboxed for question options */
                      question?.choices?.map((choice, index) => (
                        <label
                          key={index}
                          className="label curson-pointer flex justify-between py-1"
                        >
                          <span className="label-text">{choice}</span>
                          <input
                            type="radio"
                            name={question?.id}
                            className="radio checked:bg-blue-500"
                            value={choice}
                          />
                        </label>
                      ))
                    }
                  </div>
                ))}
                <div className="flex justify-center p-3 pt-10">
                  <button
                    type="submit"
                    className="btn btn-primary btn-wide"
                    disabled={isLoading}
                  >
                    {isLoading ? <LoadingCircular /> : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default DoQuiz;
