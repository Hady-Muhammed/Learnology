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
  section_title: string;
  section_desc: string;
  lectures: lecture[];
  total_time: string
}

export type lecture = {
  lecture_title: string;
  lecture_desc: string;
  video_url: string;
  duration: string
}
