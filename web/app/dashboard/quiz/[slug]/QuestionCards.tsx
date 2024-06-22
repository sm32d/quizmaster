import { Question, Quiz } from "../../../types/quiz";

const QuestionCards = ({ quizDetails }: { quizDetails: Quiz }) => {
  return (
    <div>
      {quizDetails?.questions?.map((question: Question, index) => (
        <div key={index} className="card bg-base-100 shadow-xl mt-2 md:mx-4">
          <div className="card-body px-4 py-2">
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
    </div>
  );
};

export default QuestionCards;
