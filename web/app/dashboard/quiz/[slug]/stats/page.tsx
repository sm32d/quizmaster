import { getServerSession } from "next-auth";
import { Quiz } from "../../../../types/quiz";
import { options } from "../../../../api/auth/[...nextauth]/options";
import QuizStats from "../../../../components/QuizStats";
import { ArrowNarrowLeft } from "tabler-icons-react";
import Link from "next/link";
import QuizAnswerCards from "../../../../components/quizAnswers/QuizAnswerCards";

const backendUri = process.env.BACKEND_URI;
const backendApiKey = process.env.BACKEND_API_KEY;

const fetchQuizDetails = async (id: Quiz["id"], email: string) => {
  const emailObject = {};
  emailObject["email"] = email;
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
};

const QuizStatsPage = async ({ params }) => {
  const session = await getServerSession(options);
  const quizDetails = await fetchQuizDetails(params.slug, session.user.email);
  return (
    <div className="min-h-[92svh]">
      <header>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link href="./">
              <ArrowNarrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-medium tracking-tigh pl-2">{`${quizDetails?.title}`}</h1>
          </div>
          <span className="badge my-2 mx-6">{quizDetails?.difficulty}</span>
        </div>
      </header>
      <QuizStats quizId={params.slug} />
      <main className="p-6">
        <h1 className="text-xl font-bold">Answers</h1>
        <QuizAnswerCards quizDetails={quizDetails} />
      </main>
    </div>
  );
};

export default QuizStatsPage;
