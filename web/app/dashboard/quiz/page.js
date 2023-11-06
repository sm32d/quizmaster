async function fetchQuizzes() {
  const response = await fetch("http://localhost:3000/api/quizzes");
  const data = await response.json();
  return data;
}

const Quiz = async () => {
  const quizzes = await fetchQuizzes();
  console.log(quizzes);
  return <main>test</main>;
};

export default Quiz;
