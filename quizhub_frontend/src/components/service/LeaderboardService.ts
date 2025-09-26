import { API_URL } from "../config/api";
import axios from "axios";

export interface LeaderboardEntry {
  userId: number;
  username: string;
  totalScore: number; // poeni za taj rezultat
  quizzesTaken: number; // ovde može biti 1 za pojedinačni rezultat
  quizTitle: string; // naziv kviza
  datePlayed: string; // datum kada je kviz odigran
}

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    const res = await axios.get<LeaderboardEntry[]>(
      `${API_URL}/results/leaderboard`
    );
    const data = res.data;

    // backend već vraća po korisniku: totalScore i quizzesTaken
    // samo sortiramo po totalScore silazno
    data.sort((a, b) => b.totalScore - a.totalScore);

    return data;
  } catch (err) {
    console.error("Greška prilikom učitavanja rang liste:", err);
    throw err;
  }
};
