import { QuizDetailsDto } from "../helper/QuizDetailsDto";
import { API_URL } from "../config/api";
import axios from "axios";

export const getQuizById = async (id: number): Promise<QuizDetailsDto> => {
  const response = await fetch(`${API_URL}/quiz/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) throw new Error("Kviz nije pronađen");
  return await response.json();
};

export const getQuestionsByQuizId = async (quizId: number) => {
  const response = await axios.get(`${API_URL}/Question/by-quiz/${quizId}`);
  return response.data; // već filtrirano na backendu
};

export const deleteQuestion = async (questionId: number) => {
  const response = await axios.delete(`${API_URL}/Question/${questionId}`);
  return response.data;
};

export const createQuestion = async (dto: {
  text: string;
  questionType: string;
  quizId: number;
  answerOptions?: { text: string; isCorrect: boolean }[];
}) => {
  const response = await axios.post(`${API_URL}/Question`, dto);
  return response.data;
};

export const updateQuestion = async (
  id: number,
  dto: {
    text: string;
    questionType: string;
    weight: number;
    answerOptions?: { text: string; isCorrect: boolean }[];
  }
) => {
  const response = await axios.put(`${API_URL}/Question/${id}`, dto, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};
