import { ArrowBackUp, MoodSadDizzy } from "tabler-icons-react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { options } from "../../../api/auth/[...nextauth]/options";

async function fetchQuizDetails(id) {
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
        "Authorization": `Bearer ${backendApiKey}`
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
              <div className="flex">
                <Link href="/dashboard">
                  <button className="btn btn-xs btn-outline mt-1">
                    <ArrowBackUp size={20} />
                  </button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tigh pl-4">{`${quizDetails?.title}`}</h1>
              </div>
              <span className="badge my-4">{quizDetails?.difficulty}</span>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
            <div className="overflow-x-auto pb-6">
              <h2 className="text-2xl">Questions</h2>
              {quizDetails?.questions?.map((question) => (
                <div
                  tabIndex={0}
                  className="my-4 collapse collapse-arrow border border-base-300"
                >
                  <div className="flex justify-between collapse-title text-base font-medium">
                    {question.text}
                    <span className="badge p-3">{question.difficulty}</span>
                  </div>
                  <div className="collapse-content px-10">
                    <ul className="list-disc">
                      {question?.choices?.map((choice) => (
                        <li>{`${choice}`}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      ) : (
        <div className="hero min-h-screen">
          <div className="hero-content flex-col">
            <div className="flex">
              <div className="flex items-center px-1"><MoodSadDizzy size={30} /></div>
              <h1 className="text-2xl font-bold px-1">Uh oh!</h1>
            </div>
            <span className="max-w-md text-center">
              This link seems broken or you do not have permission to view the
              requested content.
            </span>
            <Link href="/dashboard">
              <button className="btn mt-4">Go Back</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizDetails;
