export interface Course {
  _id: string;
  instructor_name: string;
  instructor_title: string;
  course_title: string;
  short_desc: string;
  image: string;
  postedAt: string;
  category: string;
  overview: string;
  num_of_likes: number;
  enrolled_students: string[];
  videos: [];
  rating: [];
  price: number;
  WhatYouWillLearn: string[];
  sections: section[]
}

export type section = {
  _id: string;
  title: string;
  videos: video[];
  total_time: string
}

export type video = {
  _id: string;
  title: string;
  video_url: string;
  duration: string
}
