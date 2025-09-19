import { Quiz } from "../helper/Qiuz";
import { API_URL } from "../config/api";
import axios from "axios";

export const getAllQuizzes = async (): Promise<Quiz[]> => {
  try {
    const response = await fetch(`${API_URL}/quiz`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Greška pri učitavanju kvizova");
    }

    const data: Quiz[] = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getQuizById = async (id: number): Promise<Quiz | null> => {
  try {
    const response = await fetch(`${API_URL}/quiz/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Kviz nije pronađen");
    }

    const data: Quiz = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteQuiz = async (id: number) => {
  const response = await fetch(`${API_URL}/quiz/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Greška pri brisanju kviza");
  }

  return true; // uspešno obrisano
};

export const getCategories = async (): Promise<string[]> => {
  const response = await axios.get(`${API_URL}/quiz/categories`);
  return response.data;
};

export const updateQuiz = async (id: number, quizData: any) => {
  const response = await fetch(`${API_URL}/quiz/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(quizData),
  });

  if (!response.ok) {
    throw new Error("Greška pri izmeni kviza");
  }

  return await response.json();
};
