"use client";

import { useState } from "react";
import { Quiz } from "../types/quiz";

const toggleQuiz = async (
  quizId: string,
  backendUri: string,
  backendApiKey: string
) => {
  try {
    const response = await fetch(`${backendUri}/api/quiz/${quizId}/active`, {
      cache: "no-store",
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${backendApiKey}`,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return { response, data };
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
};

const QuizToggle = ({
  quiz,
  backendUri,
  backendApiKey,
  ab,
}: {
  quiz: Quiz;
  backendUri: string;
  backendApiKey: string;
  ab: boolean;
}) => {
  const [active, setActive] = useState(quiz.active);
  const [loading, setLoading] = useState(false);
  return (
    <label>
      <input
        id={`toggle-${quiz.id}`}
        type="checkbox"
        className={`toggle ${active && ab ? "toggle-success" : ""}`}
        checked={active}
        disabled={loading}
        onChange={() => {
          setLoading(true);
          (
            document.getElementById(`toggle-${quiz.id}`) as HTMLInputElement
          ).indeterminate = true;
          toggleQuiz(quiz.id, backendUri, backendApiKey).then((res) => {
            console.log(res?.response?.status === 200 ? "success" : "error");
            res?.response?.status === 200
              ? setActive(res?.data?.status)
              : setActive(active);
            (
              document.getElementById(`toggle-${quiz.id}`) as HTMLInputElement
            ).indeterminate = false;
            setLoading(false);
          });
        }}
      />
    </label>
  );
};

export default QuizToggle;
