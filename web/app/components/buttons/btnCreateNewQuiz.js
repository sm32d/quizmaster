import Link from "next/link";
import { Plus } from "tabler-icons-react";

const CreateNewQuizBtn = () => {
  return (
    <Link href="/dashboard/quiz/new">
      <button className="btn btn-neutral">
        <Plus size={20} />
        <div className="max-md:hidden">New Quiz</div>
      </button>
    </Link>
  );
};

export default CreateNewQuizBtn;
