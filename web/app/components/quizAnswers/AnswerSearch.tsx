"use client";

import Link from "next/link";
import { Search } from "tabler-icons-react";

const AnswerSearch = ({
  quizDetails,
  quizAnswers,
}: {
  quizDetails: any;
  quizAnswers: any;
}) => {
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const text = (
            e.currentTarget.querySelector(
              'input[name="search-user"]'
            ) as HTMLInputElement
          )?.value;
          for (let i = 0; i < quizAnswers.length; i++) {
            if (quizAnswers[i].user_id.includes(text)) {
              console.log(quizAnswers[i]);
            }
          }
        }}
      >
        <div className="mt-4 flex items-center gap-2">
          <input
            type="text"
            name="search-user"
            placeholder="Type here"
            className="input input-bordered grow w-full"
          />
          <button type="submit" className="btn btn-square">
            <Search />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AnswerSearch;
