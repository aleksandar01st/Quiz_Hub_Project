import axios from "axios";
import { API_URL } from "../config/api";

// DTO za snimanje rezultata
export interface SaveResultDto {
  quizId: number;
  userId: number;
  score: number;
  timeTaken: number; // u sekundama
  userAnswers?: {
    questionId: number;
    selectedAnswer: string;
  }[];
}

// DTO za prikaz rezultata
export interface QuizResultDto {
  id: number;
  score: number;
  timeTaken: number;
  datePlayed: string;
  username: string;
}

// Snimanje rezultata
export const saveResult = async (
  result: SaveResultDto
): Promise<QuizResultDto> => {
  const response = await axios.post<QuizResultDto>(
    `${API_URL}/results`,
    result
  );
  return response.data;
};

// Dobavljanje rezultata za određeni kviz
export const getResultsByQuiz = async (
  quizId: number
): Promise<QuizResultDto[]> => {
  const response = await axios.get<QuizResultDto[]>(
    `${API_URL}/results/quiz/${quizId}`
  );
  return response.data;
};
