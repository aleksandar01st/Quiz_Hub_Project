import { API_URL } from "../config/api";
import { CreateQuizDto } from "../helper/CreateQuizDto";

export const createQuiz = async (dto: CreateQuizDto) => {
  const response = await fetch(`${API_URL}/quiz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(dto),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Greška pri kreiranju kviza");
  }

  return await response.json();
};
