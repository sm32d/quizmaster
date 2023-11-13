"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Minus, Plus } from "tabler-icons-react";
import LoadingCircular from "../../../components/LoadingCircular";

const CreateQuizQuestions = ({ backendUri, email }) => {

  const router = useRouter()

  const [nextId, setNextId] = useState(1);
  const [inputFields, setInputFields] = useState([
    { id: 0, text: "", choices: ["", ""], correct: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateQuiz = async (formData) => {
    setIsLoading(true);
    const quiz = {};
    quiz.title = formData.get("title");
    quiz.difficulty = formData.get("difficulty");
    quiz.questions = inputFields.map(({ id, ...rest }) => rest);
    quiz.created_by = email;

    const req = {
      ...quiz,
      questions: quiz.questions.map((question) => ({
        ...question,
        correct:
          question.correct === "" ? question.choices[0] : question.correct,
      })),
    };

    try {
      const response = await fetch(`${backendUri}/api/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      router.push('/dashboard')
      return data;
    } catch (error) {
      console.error("Error fetching data: ", error);
      return false;
    }
  };

  const handleAddFields = () => {
    setInputFields([
      ...inputFields,
      { id: nextId, text: "", choices: ["", ""], correct: "" },
    ]);
    setNextId(nextId + 1);
  };

  const handleRemoveFields = (id) => {
    const values = inputFields.filter((field) => field.id !== id);
    setInputFields(values);
  };

  const handleChangeQuestion = (id, event) => {
    const newInputFields = inputFields.map((field) => {
      if (id === field.id) {
        field.text = event.target.value;
      }
      return field;
    });
    setInputFields(newInputFields);
  };

  const handleChangeOption = (questionId, optionIndex, event) => {
    const newInputFields = inputFields.map((field) => {
      if (questionId === field.id) {
        field.choices[optionIndex] = event.target.value;
      }
      return field;
    });
    setInputFields(newInputFields);
  };

  const handleChangeCorrectOption = (questionId, event) => {
    const newInputFields = inputFields.map((field) => {
      if (questionId === field.id) {
        field.correct = event.target.value;
      }
      return field;
    });
    setInputFields(newInputFields);
  };

  const handleAddOption = (questionId) => {
    const newInputFields = inputFields.map((field) => {
      if (questionId === field.id) {
        field.choices.push("");
      }
      return field;
    });
    setInputFields(newInputFields);
  };

  const handleRemoveOption = (questionId, optionIndex) => {
    const newInputFields = inputFields.map((field) => {
      if (questionId === field.id) {
        if (field.choices.length > 2) {
          field.choices.splice(optionIndex, 1);
        }
      }
      return field;
    });
    setInputFields(newInputFields);
  };

  return (
    <form className="flex flex-col w-full md:w-1/2" action={handleCreateQuiz}>
      <div className="form-control py-2">
        <label className="py-2 px-1 font-bold text-xl">Quiz Title</label>
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="input input-bordered w-full"
          required
        />
      </div>
      <div className="form-control py-2">
        <label className="py-2 px-1 font-bold text-xl">Difficulty</label>
        <label className="label cursor-pointer">
          <span className="label-text">Easy</span>
          <input
            type="radio"
            name="difficulty"
            className="radio checked:bg-blue-500"
            value="easy"
            required
          />
        </label>
        <label className="label cursor-pointer">
          <span className="label-text">Medium</span>
          <input
            type="radio"
            name="difficulty"
            className="radio checked:bg-blue-500"
            value="medium"
          />
        </label>
        <label className="label cursor-pointer">
          <span className="label-text">Hard</span>
          <input
            type="radio"
            name="difficulty"
            className="radio checked:bg-blue-500"
            value="hard"
          />
        </label>
      </div>
      <div>
        <label className="py-2 px-1 font-bold text-xl">Questions</label>
        {inputFields.map((inputField) => (
          <div className="form-control pt-4" key={inputField.id}>
            <label className="pb-2 px-1 font-medium">{`Question Title`}</label>
            <div className="flex items-center">
              <input
                type="text"
                placeholder={`Please enter the question`}
                className="input input-bordered w-full"
                required
                value={inputField.text}
                onChange={(e) => handleChangeQuestion(inputField.id, e)}
              />
              {inputFields.length > 1 && (
                <button
                  className="btn btn-square btn-sm ml-2"
                  onClick={() => handleRemoveFields(inputField.id)}
                >
                  <Minus />
                </button>
              )}
            </div>
            <div className="py-2">
              <label className="font-medium">Options</label>
              {inputField.choices.map((option, index) => (
                <div key={index} className="flex items-center my-2">
                  <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    className="input input-bordered input-sm w-full mr-2"
                    required
                    value={option}
                    onChange={(e) =>
                      handleChangeOption(inputField.id, index, e)
                    }
                  />
                  {inputField.choices.length > 2 && (
                    <button
                      className="btn btn-square btn-sm"
                      onClick={() => handleRemoveOption(inputField.id, index)}
                    >
                      <Minus />
                    </button>
                  )}
                  {index === inputField.choices.length - 1 && (
                    <button
                      className="btn btn-square btn-sm ml-2"
                      onClick={() => handleAddOption(inputField.id)}
                    >
                      <Plus />
                    </button>
                  )}
                </div>
              ))}
              <div className="flex flex-col py-2">
                <label className="font-medium">Correct Option</label>
                <select
                  className="select select-bordered w-full my-2 select-sm"
                  onChange={(e) => handleChangeCorrectOption(inputField.id, e)}
                  value={inputField.correct}
                >
                  {inputField.choices.map((choice, index) => (
                    <option key={index} value={choice}>
                      {choice}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
        <button className="btn btn-square btn-sm" onClick={handleAddFields}>
          <Plus />
        </button>
      </div>
      <button
        type="submit"
        className="btn btn-primary m-4"
        disabled={isLoading}
      >
        {isLoading ? <LoadingCircular /> : "Create"}
      </button>
    </form>
  );
};

export default CreateQuizQuestions;
