import { NgToastService } from 'ng-angular-popup';
import { Teacher } from 'src/app/models/teacher';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Course } from 'src/app/models/course';
import { Student } from 'src/app/models/student';
import { API_URL } from 'src/app/services/socketio.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-instructor',
  templateUrl: './instructor.component.html',
  styleUrls: ['./instructor.component.css'],
})
export class InstructorComponent implements OnInit, OnDestroy {
  id!: string;
  teacher!: Teacher;
  account!: Student;
  courses!: Observable<Course[]>;
  liked!: boolean;
  statusText!: string;
  subscription!: Subscription;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public router: Router,
    public toast: NgToastService
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
    const sub = this.http
      .get<Student>(API_URL + `/api/students/getStudent/${email}`)
      .subscribe((student: Student) => {
        this.account = student;
        this.isLiked();
      });
    this.subscription?.add(sub);
  }

  getInstructor(id: string) {
    const sub = this.http
      .get<Teacher>(API_URL + `/api/teachers/getTeacherById/${id}`)
      .subscribe((teacher: Teacher) => {
        this.teacher = teacher;
        this.getCourses(teacher.courses_teaching);
      });
    this.subscription?.add(sub);
  }

  createChat() {
    const sub = this.http
      .post(API_URL + '/api/chats/createChat', {
        chat: {
          person1_ID: this.account._id,
          person2_ID: this.teacher._id,
          newMessages: 0,
          messages: [],
        },
      })
      .subscribe((res: any) => {
        this.router.navigateByUrl(`/account/messages/${res.id}`);
      });
    this.subscription?.add(sub);
  }

  getCourses(courses: string[]) {
    this.courses = this.http.post<Course[]>(
      API_URL + '/api/courses/getCoursesByIds',
      {
        courses,
      }
    );
  }

  isLiked() {
    this.liked = this.account.liked_teachers.includes(this.id);
  }

  addLike() {
    const sub = this.http
      .post(API_URL + `/api/students/likeTeacher`, {
        email: this.account.email,
        teacherID: this.id,
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          this.getAccount(this.account.email);
          this.getInstructor(this.id);
        },
        error: (res) => {
          this.toast.error({ detail: 'Something went wrong!' });
        },
      });
    this.subscription?.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
