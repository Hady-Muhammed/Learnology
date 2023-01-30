import { Student } from './student';

export type comment = {
  _id: string;
  belongsTo: string;
  commenter: any;
  content: string;
  replies: number;
  commentedAt: string;
  reacts: number;
  commentHasLikes: boolean,
  commentHasLoves: boolean,
  commentHasWows: boolean,
};
export type reply = {
  _id: string;
  content: string;
  postID: string;
  commentID: string;
  replier: any[];
  reacts: number;
  repliedAt: string;
  replyHasLikes: boolean,
  replyHasLoves: boolean,
  replyHasWows: boolean,
};

export type react = {
  type: string;
  owner: string;
  belongsTo: string;
  postID: string;
  reacter: any[],
};

export interface Post {
  _id: string;
  authorID: string;
  author: Student[];
  image: string;
  publishedAt: string;
  content: string;
  comments: number;
  reacts: number;
  postHasLikes: boolean,
  postHasLoves: boolean,
  postHasWows: boolean,
}
