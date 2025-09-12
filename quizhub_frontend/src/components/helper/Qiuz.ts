export interface Quiz {
  id: number;
  title: string;
  description: string;
  questionsCount: number;
  difficulty: "Lako" | "Srednje" | "Teško";
  timeLimit: number; // u minutima
  category: string;
}
