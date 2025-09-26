import axios from "axios";
import { API_URL } from "../config/api";

export interface QuizResult {
  id: number;
  score: number;
  totalPoints: number;
  timeTaken: number;
  datePlayed: string;
  username: string;
  quizTitle: string;
  quizQuestionsCount?: number;
  position: number;
}

export interface UserAnswer {
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
}

export interface TopResult {
  quizId: number;
  quizTitle: string;
  username: string;
  score: number;
  timeTaken: number;
  datePlayed: string;
  position: number;
}

export const getResultsByUser = async (
  userId: number
): Promise<QuizResult[]> => {
  const response = await axios.get<QuizResult[]>(
    `${API_URL}/results/user/${userId}`
  );
  return response.data;
};

export const getUserAnswersByResult = async (resultId: number) => {
  const response = await axios.get(`${API_URL}/results/answers/${resultId}`);
  return response.data;
};

export const getTopResults = async (
  quizId?: number,
  period?: "weekly" | "monthly"
): Promise<TopResult[]> => {
  const params: any = {};

  if (quizId) params.quizId = quizId;

  if (period) {
    const now = new Date();
    if (period === "weekly") {
      const from = new Date();
      from.setDate(now.getDate() - 7);
      params.from = from.toISOString();
    } else if (period === "monthly") {
      const from = new Date();
      from.setMonth(now.getMonth() - 1);
      params.from = from.toISOString();
    }
  }

  const response = await axios.get<TopResult[]>(`${API_URL}/results/top`, {
    params,
  });
  return response.data;
};
