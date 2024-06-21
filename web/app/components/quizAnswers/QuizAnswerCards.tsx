import { getServerSession } from "next-auth";
import { options } from "../../api/auth/[...nextauth]/options";
import { Question, Quiz, QuizAnswer } from "../../types/quiz";
import QuizAnswerModal from "./QuizAnswerModal";

const backendUri = process.env.BACKEND_URI;
const backendApiKey = process.env.BACKEND_API_KEY;

const fetchQuizAnswers = async (id: Quiz["id"], page: number) => {
  const session = await getServerSession(options);

  try {
    const response = await fetch(`${backendUri}/api/quiz/${id}/answers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${backendApiKey}`,
      },
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
};

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

const QuizAnswerCards = async ({ quizDetails }: { quizDetails: Quiz }) => {
  const quizAnswers: {
    answers: QuizAnswer[];
    pages: { current_page: number; total_pages: number };
  } = await fetchQuizAnswers(quizDetails.id, 1);
  return (
    <div className="flex flex-col items-center gap-10">
      <div className="pt-4 flex flex-wrap justify-center gap-4">
        {quizAnswers?.answers.map((answer: QuizAnswer) => (
          <div key={answer.id} className="card w-80 md:w-96 bg-base-100 shadow-xl">
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
                      calculateScore(quizDetails.questions, answer?.answers) ??
                        0
                    )
                  : (
                      calculateScore(quizDetails.questions, answer?.answers) ??
                      0
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
        ))}
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
