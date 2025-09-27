export interface Question {
  id: number;
  text: string;
  questionType: string;
  quizId: number;
  weight: number;
  answerOptions?: { id: number; text: string; isCorrect: boolean }[];
}

export interface Quiz {
  id: number;
  title: string;
  timeLimit: number; // u minutima
}
