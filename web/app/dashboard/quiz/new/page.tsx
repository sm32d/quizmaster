import Link from "next/link";
import { ArrowNarrowLeft } from "tabler-icons-react";
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
            <Link href="/dashboard" className="pt-1">
              <ArrowNarrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-medium tracking-tigh pl-2">{`New Quiz`}</h1>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <div className="overflow-x-hidden px-2 flex justify-center">
          <CreateQuizQuestions backendUri={backendUri} email={userEmail} backendApiKey={backendApiKey} />
        </div>
      </main>
    </div>
  );
};

export default NewQuiz;
