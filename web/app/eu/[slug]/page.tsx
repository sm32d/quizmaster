import { ArrowBackUp } from "tabler-icons-react";
import Link from "next/link";
import NotFound from "../../not-found";

type Question = {
  id?: string;
  text: string;
  choices: string[];
  correct: string;
  difficulty: string;
  section: string;
};

type QuizAnswer = {
  quiz_id: string;
  user_id: string;
  answers: QuestionAnswer[];
}

type QuestionAnswer = {
  question_id: string;
  answer: string;
}

type FormDataObject = {
  email: string;
}

const DoQuiz = async ({ params }) => {
  const fetchQuizDetails = async (id) => {
    const backendUri = process.env.BACKEND_URI;
    const backendApiKey = process.env.BACKEND_API_KEY;
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

  const submitAnswer = async (formData: FormData) => {
    "use server";
    const formDataObject: FormDataObject = {email: ''};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
    const req: QuizAnswer = {quiz_id: '', user_id: '', answers: []};
    req.quiz_id = quizDetails?.id;
    if (quizDetails?.collect_email) req.user_id = formDataObject?.email
    req.answers = []
    const quizQuestions = quizDetails?.questions
    quizQuestions?.forEach((question: Question) => {
      const questionAnswer: QuestionAnswer = {question_id: '', answer: ''}
      const questionId = question?.id;
      questionAnswer.question_id = questionId;
      questionAnswer.answer = formDataObject[questionId];
      req.answers.push(questionAnswer)
    })
    console.log('Final req', req)
  };

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
            <div className="overflow-x-auto pb-6 flex justify-center">
              <form className="w-full md:w-1/2" action={submitAnswer}>
                {quizDetails?.collect_email ? (
                  <div className="flex flex-col">
                    <label className="text-2xl">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder={`Enter you email address`}
                      className="input input-bordered input-sm my-2"
                      required
                    />
                  </div>
                ) : null}
                <h2 className="text-2xl py-2">Questions</h2>
                {quizDetails?.questions?.map((question, index) => (
                  <div key={index} className="flex flex-col">
                    <label className="py-2 px-1 font-bold text-lg">
                      {question?.text}
                    </label>
                    {
                      /* map through question.choices to show checkboxed for question options */
                      question?.choices?.map((choice, index) => (
                        <label
                          key={index}
                          className="flex justify-between py-1 label curson-pointer"
                        >
                          <span className="label-text">{choice}</span>
                          <input
                            type="radio"
                            name={question?.id}
                            className="radio checked:bg-blue-500"
                            value={choice}
                            required
                          />
                        </label>
                      ))
                    }
                  </div>
                ))}
                <div className="flex justify-center p-3 pt-10">
                  <button type="submit" className="btn btn-primary btn-wide">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export default DoQuiz;
