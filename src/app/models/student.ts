import { Course } from './course';
export interface Student {
  _id: string,
  email: string,
  name: string,
  picture: string,
  password: string,
  createdAt: string,
  enrolled_courses: Course[],
  liked_teachers: string[],
  taken_quizzes: quiz[],
  online: boolean,
  reacts: any[]
}
type quiz = {
  id: string,
  score: string,
  takenAt: string
}