async function fetchQuizzes() {
  const backendUri = process.env.BACKEND_URI;
  try {
    const response = await fetch(`${backendUri}/api/quizzes`, {
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

const Quiz = async () => {
  const quizzes = await fetchQuizzes();
  console.log(quizzes);
  return <main>test</main>;
};

export default Quiz;
