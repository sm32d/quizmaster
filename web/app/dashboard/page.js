import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
const Dashboard = async () => {
  const session = await getServerSession(options);
  return <div>dashboard</div>;
};

export default Dashboard;
