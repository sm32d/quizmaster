import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
const Dashboard = async () => {
  const session = await getServerSession(options);
  if (!session) {
    redirect("/");
  }
  return <div>dashboard</div>;
};

export default Dashboard;
