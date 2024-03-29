import { NgToastService } from 'ng-angular-popup';
import { Teacher } from 'src/app/models/teacher';
import { API_URL } from 'src/app/services/socketio.service';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-teacher-create-quiz',
  templateUrl: './teacher-create-quiz.component.html',
  styleUrls: ['./teacher-create-quiz.component.css'],
})
export class TeacherCreateQuizComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  categories: any[] = [
    { value: 'Easy', viewValue: 'Easy' },
    { value: 'Medium', viewValue: 'Medium' },
    { value: 'Hard', viewValue: 'Hard' },
  ];
  account!: Teacher;
  subscription!: Subscription;

  constructor(private http: HttpClient, public toast: NgToastService) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      imageURL: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      selectedValue: new FormControl('', [Validators.required]),
    });
    this.getAccount();
  }
  /* Form Fields Getters */
  get name() {
    return this.form.get('name');
  }
  get imageURL() {
    return this.form.get('imageURL');
  }
  get category() {
    return this.form.get('category');
  }
  get selectedValue() {
    return this.form.get('selectedValue');
  }
  /* Form Fields Getters */
  ngOnInit(): void {}

  getAccount(): void {
    const token: any = localStorage.getItem('token');
    const teacher: any = jwtDecode(token);
    const sub = this.http
      .get<Teacher>(API_URL + `/api/teachers/getTeacher/${teacher.email}`)
      .subscribe((teacher: Teacher) => (this.account = teacher));
    this.subscription?.add(sub);
  }

  postQuiz(): void {
    if (
      this.imageURL?.value &&
      this.category?.value &&
      this.name?.value &&
      this.selectedValue?.value
    ) {
      const sub = this.http
        .post(API_URL + '/api/quizzes/createQuiz', {
          quizz: {
            name: this.name.value,
            image: this.imageURL.value,
            author: {
              name: this.account.name,
              id: this.account._id,
            },
            publishedAt: new Date().toUTCString(),
            category: this.category.value,
            difficulty: this.selectedValue.value,
            questions: [],
          },
        })
        .subscribe({
          next: (res: any) => {
            this.toast.success({ detail: res.message });
            this.return();
          },
          error: (err) => this.toast.error({ detail: err.message }),
        });
      this.subscription?.add(sub);
    } else {
      this.toast.error({ detail: 'Enter valid data!' });
    }
  }

  return(): void {
    window.history.back();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
