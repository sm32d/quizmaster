export type Quiz = {
    id?: string;
    title: string;
    sections: string[];
    difficulty: string;
    questions: Question[];
    collect_email: boolean;
    allow_multiple_attempts: boolean;
    created_at?: string;
    updated_at?: string;
    created_by: string;
};

export type Question = {
    id?: string;
    text: string;
    choices: string[];
    correct: string;
    difficulty: string;
    section: string;
};

export type QuizAnswer = {
    quiz_id: string;
    user_id: string;
    answers: QuestionAnswer[];
}

export type QuestionAnswer = {
    question_id: string;
    answer: string;
}