import { Student } from 'src/app/models/student';

export interface Email {
  _id: string;
  belongsTo: string;
  subject: string;
  sentAt: string;
  body: string;
  sender: Student;
  read: boolean;
  replied: boolean;
}
