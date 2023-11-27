import Link from "next/link";
import { ArrowBackUp } from "tabler-icons-react";
import CreateQuizQuestions from "./createQuizQuestions";
import { getServerSession } from "next-auth";
import { options } from "../../../api/auth/[...nextauth]/options";

const NewQuiz = async () => {
  const backendUri = process.env.BACKEND_URI;
  const backendApiKey = process.env.BACKEND_API_KEY;
  const session = await getServerSession(options);
  const userEmail = session?.user?.email;
  return (
    <div>
      <header>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex">
            <Link href="/dashboard">
              <button className="btn btn-xs btn-outline mt-1">
                <ArrowBackUp size={20} />
              </button>
            </Link>
            <h1 className="text-2xl font-bold tracking-tigh pl-4">{`New Quiz`}</h1>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="overflow-x-auto p-6 flex justify-center">
          <CreateQuizQuestions backendUri={backendUri} email={userEmail} backendApiKey={backendApiKey} />
        </div>
      </main>
    </div>
  );
};

export default NewQuiz;
