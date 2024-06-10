import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import CreateNewQuizBtn from "../components/buttons/btnCreateNewQuiz";
import DashboardTable from "../components/dashboardTable";

const Dashboard = async () => {
  const session = await getServerSession(options);
  return (
    <div className="min-h-[92svh]">
      <header>
        <div className="flex justify-between mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight">{`Welcome, ${session.user.name}!`}</h1>
          <CreateNewQuizBtn />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <span className="text-2xl px-4">Quiz List</span>
        <div className="overflow-x-auto py-6">
          <DashboardTable />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
