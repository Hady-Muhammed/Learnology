export interface Teacher {
  _id: string,
  name: string,
  email: string,
  password: string,
  title: string,
  picture: string,
  courses_teaching: string[],
  createdAt: string,
  articles_published: string[],
  quizzes_published: string[],
  likes: number,
}
