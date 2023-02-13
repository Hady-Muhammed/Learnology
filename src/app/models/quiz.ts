export type question = {
  head: string;
  correctAnswer: string;
  answers: string[];
  solving_time: string;
};
export interface Quiz {
  _id: string;
  name: string;
  image: string;
  author: {
    name: string;
    id: string;
  };
  publishedAt: string;
  category: string;
  difficulty: string;
  questions: question[];
}
