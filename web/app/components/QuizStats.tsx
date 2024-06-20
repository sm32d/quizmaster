import { getServerSession } from "next-auth";
import { options } from "../api/auth/[...nextauth]/options";
import { Stats } from "../types/quiz";
import Link from "next/link";

const fetchStats = async (quizId: string) => {
  const backendUri = process.env.BACKEND_URI;
  const backendApiKey = process.env.BACKEND_API_KEY;
  const session = await getServerSession(options);
  const emailObject = {};
  emailObject["email"] = session.user.email;
  try {
    const response = await fetch(`${backendUri}/api/quiz/${quizId}/stats`, {
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

const QuizStats = async ({
  quizId,
  showMoreOption,
}: {
  quizId: string;
  showMoreOption?: boolean;
}) => {
  const stats: Stats = await fetchStats(quizId);
  return (
    <div className="flex flex-col gap-2 px-4">
      <div className="stats stats-vertical md:stats-horizontal shadow">
        <div className="stat place-items-center">
          <div className="stat-title">Attempts</div>
          <div className="stat-value">{stats?.attempts}</div>
          <div className="stat-desc">till now</div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Average Score</div>
          <div className="stat-value">
            {(stats?.average_score ?? 0).toFixed(2)}%
          </div>
          <div className="stat-desc">
            {stats?.average_score > 50 ? "Good" : "Bad"}
          </div>
        </div>

        <div className="stat place-items-center">
          <div className="stat-title">Attempts Per User</div>
          <div className="stat-value">
            {Math.abs(stats?.average_attempts_per_user ?? 0) % 1 === 0
              ? Math.trunc(stats?.average_attempts_per_user ?? 0)
              : (stats?.average_attempts_per_user ?? 0).toFixed(2)}
          </div>
          <div className="stat-desc">on average</div>
        </div>
      </div>
      {showMoreOption && (
        <Link
          href={`/dashboard/quiz/${quizId}/stats`}
          className="link link-primary link-hover"
        >
          More Details
        </Link>
      )}
    </div>
  );
};

export default QuizStats;
