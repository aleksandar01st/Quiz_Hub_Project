import { API_URL } from "../config/api";
import axios from "axios";

export interface QuestionDto {
  id: number;
  text: string;
  questionType: string;
  weight: number;
  quizId: number;
  answerOptions?: { id: number; text: string; isCorrect: boolean }[];
}

export const getQuestionById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/question/${id}`);
    return response.data; // vraća QuestionDto
  } catch (error: any) {
    console.error("Greška pri učitavanju pitanja:", error);
    throw error;
  }
};
