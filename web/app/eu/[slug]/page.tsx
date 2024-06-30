import DoQuiz from "./DoQuiz";
import { Quiz } from "../../types/quiz";
import NotFound from "../../not-found";

const page = async ({ params }) => {
  const backendUri = process.env.BACKEND_URI;
  const backendApiKey = process.env.BACKEND_API_KEY;

  const fetchQuizDetails = async (id: string) => {
    "use server";
    try {
      const response = await fetch(`${backendUri}/api/quiz/${id}`, {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${backendApiKey}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: Quiz = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data: ", error);
      return null;
    }
  };

  const quizDetails = await fetchQuizDetails(params.slug);
  return (
    <div>
      {quizDetails?.active ? (
        <>
          <header>
            <div className="mx-auto sm:max-w-[90svw] md:max-w-[80svw] px-4 py-6 sm:px-6 lg:px-8">
              <div className="flex">
                <h1 className="text-xl font-medium tracking-tigh pl-2">
                  {quizDetails?.title}
                </h1>
              </div>
            </div>
          </header>
          <main className="mx-auto sm:max-w-[90svw] md:max-w-[80svw] px-4 pb-6 sm:px-6 lg:px-8">
            <div className="overflow-x-hidden px-2 flex justify-center">
              <DoQuiz
                backendUri={backendUri}
                backendApiKey={backendApiKey}
                quizDetails={quizDetails}
              />
            </div>
          </main>
        </>
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default page;
