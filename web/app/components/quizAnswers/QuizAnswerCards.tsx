import { AlertOctagon, SearchOff } from "tabler-icons-react";
import { Question, Quiz, QuizAnswer } from "../../types/quiz";
import QuizAnswerModal from "./QuizAnswerModal";

const calculateScore = (
  questions: Question[],
  answers: QuizAnswer["answers"]
) => {
  const totalQuestions = questions.length;
  let correctAnswers = 0;
  questions.forEach((question) => {
    answers.forEach((answer) => {
      if (answer.question_id === question.id) {
        if (answer.answer === question.correct) {
          correctAnswers++;
        }
      }
    });
  });
  return (correctAnswers / totalQuestions) * 100;
};

const QuizAnswerCards = ({
  quizDetails,
  quizAnswers,
}: {
  quizDetails: Quiz;
  quizAnswers: { answers: QuizAnswer[] };
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="pt-4 flex flex-wrap justify-center gap-4">
        {quizAnswers?.answers?.length > 0 ? (
          quizAnswers?.answers?.map((answer: QuizAnswer) => (
            <div
              key={answer.id}
              className="card w-[75svw] md:w-10/12 lg:w-96 bg-base-100 shadow-xl"
            >
              <div className="card-body">
                <h2 className="card-title">{answer?.user_id}</h2>
                <p>
                  Score:{" "}
                  {Math.abs(
                    calculateScore(quizDetails.questions, answer?.answers) ?? 0
                  ) %
                    1 ===
                  0
                    ? Math.trunc(
                        calculateScore(
                          quizDetails.questions,
                          answer?.answers
                        ) ?? 0
                      )
                    : (
                        calculateScore(
                          quizDetails.questions,
                          answer?.answers
                        ) ?? 0
                      ).toFixed(2)}
                  %
                </p>
                <p className="text-primary">
                  {new Date(answer?.created_at).toLocaleString()}
                </p>
                <div className="card-actions justify-end">
                  <QuizAnswerModal
                    questions={quizDetails.questions}
                    answer={answer}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center py-10 gap-4">
            <AlertOctagon size={60} />
            <h1 className="text-xl">No Answers Found!</h1>
          </div>
        )}
      </div>
      {/* <div className="join">
        <button className="join-item btn">«</button>
        <button className="join-item btn">Page 1</button>
        <button className="join-item btn">»</button>
      </div> */}
    </div>
  );
};

export default QuizAnswerCards;
