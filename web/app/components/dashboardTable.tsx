import { Dots } from "tabler-icons-react";
import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import Link from "next/link";
import DeleteQuizInSummaryBtn from "./buttons/btnDeleteQuizInSummary";
import { Session } from "next-auth";
import { Quiz } from "../types/quiz";
import ShareQuiz from "./shareQuiz";

type Quizzes = {
  quizzes: Quiz[];
};

async function fetchQuizzes() {
  const backendUri = process.env.BACKEND_URI;
  const backendApiKey = process.env.BACKEND_API_KEY;
  const session: Session = await getServerSession(options);
  try {
    const response = await fetch(
      `${backendUri}/api/quizzes/${session.user.email}`,
      {
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${backendApiKey}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: Quizzes = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
}

const DashboardTable = async () => {
  const quizzes = await fetchQuizzes();
  return (
    <table className="table">
      {/* head */}
      <thead>
        <tr>
          <th>
            <label>Active</label>
          </th>
          <th>
            <label>Name</label>
          </th>
          <th>
            <label>Difficulty</label>
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {quizzes?.quizzes?.map((quiz) => (
          <tr key={quiz.id}>
            <th>
              <label>
                <input type="checkbox" className="toggle" />
              </label>
            </th>
            <td>
              <Link href={`/dashboard/quiz/${quiz.id}`}>
                <div className="flex items-center space-x-3">
                  <div>
                    <div className="font-bold">{quiz?.title}</div>
                    <div className="text-sm opacity-50">
                      {quiz?.questions?.length} Questions
                    </div>
                  </div>
                </div>
              </Link>
            </td>
            <td>
              <div className="text-sm opacity-60">{quiz?.difficulty}</div>
            </td>
            <td>
              <details className="dropdown max-md:dropdown-bottom md:dropdown-right">
                <summary className="m-1 btn btn-sm">
                  <Dots />
                </summary>
                <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-25">
                  <li>
                    <button>
                      <ShareQuiz quizId={quiz.id} />
                    </button>
                  </li>
                  <li>
                    <DeleteQuizInSummaryBtn
                      quizId={quiz?.id}
                      backendUri={process.env.BACKEND_URI}
                      backendApiKey={process.env.BACKEND_API_KEY}
                    />
                  </li>
                </ul>
              </details>
            </td>
          </tr>
        ))}
      </tbody>
      {/* foot */}
      <tfoot>
        <tr>
          <th>
            <label>Active</label>
          </th>
          <th>
            <label>Name</label>
          </th>
          <th>
            <label>Difficulty</label>
          </th>
          <th></th>
        </tr>
      </tfoot>
    </table>
  );
};

export default DashboardTable;
