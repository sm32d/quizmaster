"use client";
import { Download } from "tabler-icons-react";

const DownloadQuizAnswersBtn = ({
  quizId,
  backendUri,
  backendApiKey,
}: {
  quizId: string;
  backendUri: string;
  backendApiKey: string;
}) => {
  const DownloadCSV = async (quizId: string) => {
    try {
      const response = await fetch(
        `${backendUri}/api/quiz/${quizId}/answers/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${backendApiKey}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.blob();
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `answers-${quizId}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <button
      className="btn btn-outline btn-primary"
      onClick={() => DownloadCSV(quizId)}
    >
      <Download />
    </button>
  );
};

export default DownloadQuizAnswersBtn;
