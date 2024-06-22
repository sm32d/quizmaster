"use client";

import { useState } from "react";
import { Quiz, QuizAnswer } from "../../../types/quiz";
import QuestionCards from "./QuestionCards";
import QuizAnswerCards from "../../../components/quizAnswers/QuizAnswerCards";

const Tabbed = ({ quizDetails, quizAnswers }: { quizDetails: Quiz, quizAnswers: { answers: QuizAnswer[] } }) => {
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tab: number) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div role="tablist" className="tabs tabs-boxed my-2 md:my-4">
        <a
          onClick={() => handleTabClick(0)}
          role="tab"
          className={`tab ${activeTab === 0 ? "tab-active" : ""}`}
        >
          Questions
        </a>
        <a
          onClick={() => handleTabClick(1)}
          role="tab"
          className={`tab ${activeTab === 1 ? "tab-active" : ""}`}
        >
          Answers
        </a>
      </div>

      {activeTab === 0 && <QuestionCards quizDetails={quizDetails} />}
      {activeTab === 1 && <QuizAnswerCards quizDetails={quizDetails} quizAnswers={quizAnswers} />}
    </div>
  );
};

export default Tabbed;
