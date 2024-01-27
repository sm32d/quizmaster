import DoQuiz from "./DoQuiz";

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
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data: ", error);
      return null;
    }
  };

  const quizDetails = await fetchQuizDetails(params.slug);
  return (
    <DoQuiz
      backendUri={backendUri}
      backendApiKey={backendApiKey}
      quizDetails={quizDetails}
    />
  );
};

export default page;
