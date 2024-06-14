import { getServerSession } from "next-auth";
import Link from "next/link";
import { ArrowNarrowLeft } from "tabler-icons-react";
import { options } from "../../../api/auth/[...nextauth]/options";
import NotFound from "../../../not-found";
import { Question, Quiz } from "../../../types/quiz";

async function fetchQuizDetails(id: Quiz["id"]) {
  const backendUri = process.env.BACKEND_URI;
  const backendApiKey = process.env.BACKEND_API_KEY;
  const session = await getServerSession(options);
  const emailObject = {};
  emailObject["email"] = session.user.email;
  try {
    const response = await fetch(`${backendUri}/api/quiz/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${backendApiKey}`,
      },
      body: JSON.stringify(emailObject),
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
}

const QuizDetails = async ({ params }) => {
  const quizDetails = await fetchQuizDetails(params.slug);
  return (
    <div className="min-h-screen">
      {quizDetails ? (
        <div>
          <header>
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <div className="flex items-center">
                <Link href="/dashboard">
                  <ArrowNarrowLeft size={20} />
                </Link>
                <h1 className="text-xl font-medium tracking-tigh pl-2">{`${quizDetails?.title}`}</h1>
              </div>
              <span className="badge my-2 mx-6">{quizDetails?.difficulty}</span>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
            <div className="overflow-x-auto pb-6 px-6">
              <h2 className="text-2xl">Questions</h2>
              {quizDetails?.questions?.map((question: Question, index) => (
                <div key={index} className="card bg-base-300 mt-2 md:mx-4">
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
          </main>
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default QuizDetails;
