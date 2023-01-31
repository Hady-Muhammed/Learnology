import { NgToastService } from 'ng-angular-popup';
import { Teacher } from 'src/app/models/teacher';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Course } from 'src/app/models/course';
import { Student } from 'src/app/models/student';
import { API_URL, SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.css'],
})
export class InstructorComponent implements OnInit {
  id!: string;
  teacher!: Teacher;
  account!: Student;
  courses!: Course[];
  liked!: boolean;
  statusText!: string;
  
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private toast: NgToastService
  ) {
    window.scrollTo(0, 0);
    this.id = this.route.snapshot.params['id'];
    this.getInstructor(this.id);
    const token: any = localStorage.getItem('token');
    const student: any = jwtDecode(token);
    this.getAccount(student.email);
  }

  ngOnInit(): void {}

  getAccount(email: string) {
    this.http
      .get<Student>(API_URL + `/api/students/getStudent/${email}`)
      .subscribe((student: Student) => {
        this.account = student;
        this.isLiked();
      });
  }


  getInstructor(id: string) {
    this.http
      .get<Teacher>(API_URL + `/api/teachers/getTeacherById/${id}`)
      .subscribe((teacher: Teacher) => {
        this.teacher = teacher;
        this.getCourses(teacher.courses_teaching);
      });
  }

  createChat() {
    this.http
      .post(API_URL + '/api/chats/createChat', {
        chat: {
          person1: {
            picture: this.account.picture,
            name: this.account.name,
            email: this.account.email,
          },
          person2: {
            picture: this.teacher.picture,
            name: this.teacher.name,
            email: this.teacher.email,
          },
          newMessages: 0,
          messages: [],
        },
      })
      .subscribe((res: any) => {
        if (res.message === 'Chat already exists') {
          console.log(res);
          this.router.navigateByUrl(`/account/messages/${res.id}`);
        } else {
          console.log(res);
          this.router.navigateByUrl(`/account/messages/${res.id}`);
        }
      });
  }

  getCourses(courses: string[]) {
    this.http
      .post<Course[]>(API_URL + '/api/courses/getCoursesByIds', {
        courses,
      })
      .subscribe((courses: Course[]) => (this.courses = courses));
  }

  isLiked() {
    this.liked = this.account.liked_teachers.includes(this.id);
  }

  addLike() {
    this.http
      .post(API_URL + `/api/students/likeTeacher`, {
        email: this.account.email,
        teacherID: this.id,
      })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.toast.success({ detail: res.message });
          this.getAccount(this.account.email);
          this.getInstructor(this.id);
        },
        error: (res) => {
          console.log(res);
          this.toast.error({ detail: 'Something went wrong!' });
        },
      });
  }
}
