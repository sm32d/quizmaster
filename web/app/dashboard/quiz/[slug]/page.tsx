import { getServerSession } from "next-auth";
import Link from "next/link";
import { ArrowNarrowLeft } from "tabler-icons-react";
import { options } from "../../../api/auth/[...nextauth]/options";
import NotFound from "../../../not-found";
import { Quiz, QuizAnswer } from "../../../types/quiz";
import QuizStats from "../../../components/quizAnswers/QuizStats";
import QuizAnswerCards from "../../../components/quizAnswers/QuizAnswerCards";
import Tabbed from "./tabbed";
import QuestionCards from "./QuestionCards";
import { ExtendedSession } from "../../../types/user";
import DownloadQuizAnswersBtn from "../../../components/buttons/DownloadQuizAnswersBtn";

const backendUri = process.env.BACKEND_URI;
const backendApiKey = process.env.BACKEND_API_KEY;

async function fetchQuizDetails(id: Quiz["id"]) {
  const session = await getServerSession(options);
  const emailObject = {};
  emailObject["email"] = session.user.email;
  try {
    const response = await fetch(`${backendUri}/api/quiz/${id}`, {
      cache: "no-store",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${backendApiKey}`,
      },
      body: JSON.stringify(emailObject),
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

const fetchQuizAnswers = async (id: Quiz["id"], page: number) => {
  try {
    const response = await fetch(
      `${backendUri}/api/quiz/${id}/answers/?perPage=999999999&page=${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${backendApiKey}`,
        },
        cache: "no-store",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
};

const QuizDetails = async ({ params }) => {
  const quizDetails: Quiz = await fetchQuizDetails(params.slug);
  const quizAnswers: { answers: QuizAnswer[] } = await fetchQuizAnswers(
    params.slug,
    1
  );

  const session: ExtendedSession = await getServerSession(options);
  const ab = session.user.ab;

  return (
    <div className="min-h-[92svh]">
      {quizDetails ? (
        <div>
          <header>
            <div className="mx-auto sm:max-w-[90svw] md:max-w-[80svw] px-4 py-6 sm:px-6 lg:px-8">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Link href="/dashboard">
                    <ArrowNarrowLeft size={20} />
                  </Link>
                  <h1 className="text-xl font-medium tracking-tigh pl-2">{`${quizDetails?.title}`}</h1>
                </div>
                {quizAnswers?.answers?.length > 0 && (
                  <DownloadQuizAnswersBtn quizId={quizDetails?.id} backendApiKey={backendApiKey} backendUri={backendUri} />
                )}
              </div>
              <span className="badge my-2 mx-6">{quizDetails?.difficulty}</span>
            </div>
          </header>
          <main className="mx-auto sm:max-w-[90svw] md:max-w-[80svw] px-6 pb-6 sm:px-6 lg:px-8 flex flex-col gap-2">
            <QuizStats quizId={quizDetails?.id} />
            {ab ? (
              <Tabbed quizDetails={quizDetails} quizAnswers={quizAnswers} />
            ) : (
              <>
                <div className="collapse collapse-arrow bg-base-200">
                  <input type="radio" name="quiz-details" />
                  <div className="collapse-title text-xl font-medium">
                    Questions
                  </div>
                  <div className="collapse-content">
                    <div className="overflow-x-auto pb-6 px-4">
                      <QuestionCards quizDetails={quizDetails} />
                    </div>
                  </div>
                </div>
                <div className="collapse collapse-arrow bg-base-200">
                  <input type="radio" name="quiz-details" defaultChecked />
                  <div className="collapse-title text-xl font-medium">
                    Answers
                  </div>
                  <div className="collapse-content">
                    <div className="overflow-x-auto pb-6">
                      <QuizAnswerCards
                        quizDetails={quizDetails}
                        quizAnswers={quizAnswers}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default QuizDetails;
