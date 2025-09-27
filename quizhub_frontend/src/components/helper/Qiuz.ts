export interface Quiz {
  id: number;
  title: string;
  description: string;
  questionsCount: number;
  difficulty: string;
  timeLimit: number;
  category: string;
}

export interface Result {
  username: string;
  score: number;
  time: string;
}

export interface Question {
  id: number;
  text: string;
  questionType: string;
  quizId: number;
  weight: number;
  answerOptions?: { id: number; text: string; isCorrect: boolean }[];
}
