import { Teacher } from 'src/app/models/teacher';
import { Student } from 'src/app/models/student';

export type message = {
  belongsTo: string,
  content: string,
  sentAt: string,
}

export interface Chat {
  _id: string,
  person1_ID: string,
  person2_ID: string,
  person1: Student | Teacher,
  person2: Student | Teacher,
  newMessages: number,
  messages: message[],
}

