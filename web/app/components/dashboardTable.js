import { Share } from "tabler-icons-react";
import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import Link from "next/link";

async function fetchQuizzes() {
  const backendUri = process.env.BACKEND_URI;
  const session = await getServerSession(options);
  try {
    const response = await fetch(
      `${backendUri}/api/quizzes/${session.user.email}`,
      {
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
          <th>
            <label>Share</label>
          </th>
        </tr>
      </thead>
      <tbody>
        {quizzes?.quizzes?.map((quiz) => (
          <tr key={quiz.id}>
            <th>
              <label>
                <input type="checkbox" className="toggle" checked />
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
              <button className="btn btn-square btn-outline">
                <Share size={20} />
              </button>
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
          <th>
            <label>Share</label>
          </th>
        </tr>
      </tfoot>
    </table>
  );
};

export default DashboardTable;
