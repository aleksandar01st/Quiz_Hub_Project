export interface QuizDetailsDto {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  timeLimit: number;
  questionsCount: number; // dodaj u backend DTO ako već ne postoji
}
