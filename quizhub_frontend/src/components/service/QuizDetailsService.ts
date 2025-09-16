import { QuizDetailsDto } from "../helper/QuizDetailsDto";
import { API_URL } from "../config/api";

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
