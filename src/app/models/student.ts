export interface Student {
  _id: string;
  email: string;
  name: string;
  picture: string;
  password: string;
  createdAt: string;
  enrolled_courses: string[];
  liked_teachers: string[];
  taken_quizzes: quiz[];
  online: boolean;
  last_activity: string;
  reacts: any[];
  friends: string[];
  // Utlities (Not in the database schema)
  pendingRequest: boolean;
  friendRequest: boolean;
  alreadyFriend: boolean;
}
type quiz = {
  id: string;
  score: string;
  takenAt: string;
};
