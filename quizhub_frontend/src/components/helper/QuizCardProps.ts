export interface QuizCardProps {
  id: number;
  title: string;
  description: string;
  questionsCount: number;
  difficulty: string;
  timeLimit: number;
  onClick: (id: number) => void;
  onDelete?: (id: number) => void;
  onEdit?: (
    id: number,
    data: {
      title: string;
      description: string;
      difficulty: string;
      timeLimit: number;
    }
  ) => void;
}
