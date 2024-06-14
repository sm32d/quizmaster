"use client";
import { useState } from "react";
import { Minus, Plus } from "tabler-icons-react";
import { Quiz } from "../../../types/quiz";
import { useRouter } from "next/navigation";
import LoadingCircular from "../../../components/LoadingCircular";

const CreateQuizQuestions = ({
  backendUri,
  email,
  backendApiKey,
}: {
  backendUri: string;
  email: string;
  backendApiKey: string;
}) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questions, setQuestions] = useState([
    { text: "", choices: ["", ""], correct: "", difficulty: "", section: "" },
  ]);

  const nextStep = () => {
    setStep(step + 1);
  };

  const previousStep = () => {
    setStep(step - 1);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", choices: ["", ""], correct: "", difficulty: "", section: "" },
    ]);
  };

  const updateQuestion = (index, value, optionIndex) => {
    const newQuestions = [...questions];
    if (optionIndex === undefined) {
      newQuestions[index] = value;
    } else {
      newQuestions[index].choices[optionIndex] = value;
    }
    setQuestions(newQuestions);
  };

  const updateQuestionchoices = (questionIndex, choices) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices = choices;
    setQuestions(newQuestions);
  };

  const updateCorrectAnswer = (questionIndex, answer) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correct = answer;
    setQuestions(newQuestions);
  };

  // function to check if all choices in a question are filled
  const checkIfAllchoicesFilled = (questionIndex) => {
    const choices = questions[questionIndex].choices;
    return choices.every((option) => option !== "");
  };

  // function to check if all questions are filled
  const checkIfAllQuestionsFilled = () => {
    return questions.every(
      (question) => question.text !== "" && question.correct !== ""
    );
  };

  const handleCreateQuiz = async () => {
    setIsLoading(true);
    const quiz: Quiz = {
      title: "",
      sections: [],
      difficulty: "",
      questions: [],
      collect_email: false,
      allow_multiple_attempts: true,
      created_by: "",
    };
    quiz.title = title as string;
    quiz.difficulty = difficulty as string;
    quiz.questions = questions;
    quiz.created_by = email;

    const req = {
      ...quiz,
      questions: quiz.questions.map((question) => ({
        ...question,
        correct:
          question.correct === "" ? question.choices[0] : question.correct,
      })),
    };

    try {
      const response = await fetch(`${backendUri}/api/quiz`, {
        method: "POST",
        cache: "no-store",
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
      router.push("/dashboard");
      return data;
    } catch (error) {
      console.error("Error fetching data: ", error);
      return false;
    }
  };

  return (
    <div className="min-w-[92svw] min-h-[82svh]">
      {step === 0 && (
        <div className="flex flex-col h-full px-4">
          <div>
            <div className="flex flex-col pt-4">
              <label className="text-lg flex-grow">Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input input-bordered flex-grow mt-2"
              />
            </div>
            <div className="flex flex-col pt-4">
              <label className="text-lg flex-grow">Difficulty:</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="select select-bordered flex-grow mt-2"
              >
                <option disabled selected value="">
                  Select difficulty
                </option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          <div className="py-10 flex justify-end">
            <button
              className="btn btn-neutral btn-active"
              onClick={nextStep}
              disabled={!title || !difficulty}
            >
              Next
            </button>
          </div>
        </div>
      )}
      {step === 1 && (
        <div className="flex flex-col h-full px-4">
          <div>
            {questions.map((question, questionIndex) => (
              <div key={questionIndex} className="card bg-neutral mt-4">
                <div className="card-body text-gray-300">
                  <div className="flex flex-col">
                    <label className="text-lg flex-grow">{`Question ${
                      questionIndex + 1
                    }:`}</label>
                    <input
                      type="text"
                      value={question.text || ""}
                      onChange={(e) =>
                        updateQuestion(
                          questionIndex,
                          {
                            ...question,
                            text: e.target.value,
                          },
                          undefined
                        )
                      }
                      className="input input-bordered flex-grow mt-2"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>
                      <label className="text-base flex-grow">Choices:</label>
                      {question.choices.map((option, questionOptionIndex) => (
                        <div
                          key={questionOptionIndex}
                          className="flex items-center gap-2"
                        >
                          <input
                            type="text"
                            value={option || ""}
                            onChange={(e) =>
                              updateQuestion(
                                questionIndex,
                                e.target.value,
                                questionOptionIndex
                              )
                            }
                            className="input input-bordered flex-grow mt-2"
                          />
                          <button
                            className="btn btn-square btn-sm"
                            onClick={() => {
                              question.choices.length > 2 &&
                                question.choices.splice(questionOptionIndex, 1);
                              updateQuestionchoices(
                                questionIndex,
                                question.choices
                              );
                            }}
                          >
                            <Minus />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      className="btn btn-square btn-sm"
                      onClick={() => {
                        updateQuestion(
                          questionIndex,
                          "",
                          question.choices.length
                        );
                      }}
                    >
                      <Plus />
                    </button>
                  </div>
                  {checkIfAllchoicesFilled(questionIndex) && (
                    <div className="flex flex-col">
                      <label className="text-base flex-grow">
                        Correct Option:
                      </label>
                      <select
                        value={question.correct || ""}
                        onChange={(e) =>
                          updateCorrectAnswer(questionIndex, e.target.value)
                        }
                        className="select select-bordered flex-grow mt-2"
                      >
                        <option disabled selected value="">
                          Select correct option
                        </option>
                        {question.choices.map((option, questionOptionIndex) => (
                          <option key={questionOptionIndex} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div>
            <button
              className="mt-5 btn btn-sm btn-neutral btn-outline"
              onClick={addQuestion}
            >
              Add Question
            </button>
            <div className="py-10 flex justify-between items-center gap-2">
              <button
                className="btn btn-sm btn-neutral btn-outline"
                onClick={previousStep}
              >
                Previous
              </button>
              <button
                className="btn btn-neutral btn-active"
                disabled={!checkIfAllQuestionsFilled()}
                onClick={nextStep}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="flex flex-col h-full px-4">
          <div className="text-lg md:px-4 pb-4">Review your quiz</div>
          <div className="md:px-4 pt-2 text-lg">{title}</div>
          <div className="md:px-4">
            <span className="badge">{difficulty}</span>
          </div>
          {questions.map((question, index) => (
            <div key={index} className="card bg-neutral mt-4 md:mx-4">
              <div className="card-body text-gray-300 px-4 py-2">
                <div className="flex flex-col">
                  <div className="text-lg">
                    Question {index + 1}: {question.text}
                  </div>
                  <div className="divider m-0"></div>
                  <div>
                    {question.choices.map((option, questionOptionIndex) => (
                      <div
                        key={questionOptionIndex}
                        className={`flex items-center gap-2 ${
                          option === question.correct ? "text-success" : ""
                        }`}
                      >
                        {questionOptionIndex + 1}. {option}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="py-10 flex justify-between items-center gap-2">
            <button
              className="btn btn-sm btn-neutral btn-outline"
              onClick={previousStep}
            >
              Previous
            </button>
            <button
              className="btn btn-neutral btn-active"
              disabled={isLoading}
              onClick={handleCreateQuiz}
            >
              {isLoading ? <LoadingCircular /> : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQuizQuestions;
