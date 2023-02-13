import { API_URL } from './../../../../../app/services/socketio.service';
import { Quiz, question } from './../../../../../app/models/quiz';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import * as Aos from 'aos';

@Component({
  selector: 'app-teacher-modify-quiz',
  templateUrl: './teacher-modify-quiz.component.html',
  styleUrls: ['./teacher-modify-quiz.component.css'],
})
export class TeacherModifyQuizComponent implements OnInit {
  id!: string;
  form!: FormGroup;
  quiz!: Quiz;
  open: number = 99999;
  clicked: boolean = false;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private toast: NgToastService,
    private fb: FormBuilder
  ) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      imageURL: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      selectedValue: new FormControl('', [Validators.required]),
      questions: this.fb.array([]),
    });
  }

  changed: boolean = false;

  categories: any[] = [
    { value: 'Easy', viewValue: 'Easy' },
    { value: 'Medium', viewValue: 'Medium' },
    { value: 'Hard', viewValue: 'Hard' },
  ];

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
  get questions(): FormArray {
    return this.form.get('questions') as FormArray;
  }
  /* Form Fields Getters */

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getQuiz();
    Aos.refresh();
  }

  getQuiz() {
    this.http
      .get<Quiz>(API_URL + `/api/quizzes/getSingleQuiz/${this.id}`)
      .subscribe((quiz: Quiz) => {
        this.quiz = quiz;
        this.getOriginalData(quiz);
      });
  }

  getOriginalData(quiz: Quiz) {
    this.imageURL?.setValue(quiz.image);
    this.name?.setValue(quiz.name);
    this.category?.setValue(quiz.category);
    this.selectedValue?.setValue(quiz.difficulty);
    for (let i = 0; i < quiz.questions.length; i++) {
      this.addOldQuestions(quiz.questions[i]);
    }
  }

  addOldQuestions(question: question) {
    this.questions.push(
      this.fb.group({
        head: question.head,
        solving_time: question.solving_time,
        correctAnswer: question.correctAnswer,
        answers: this.fb.group({
          ans1: question.answers[0],
          ans2: question.answers[1],
          ans3: question.answers[2],
          ans4: question.answers[3],
        }),
      })
    );
  }

  addNewQuestion() {
    this.clicked = true;
    let question = {
      head: 'New question',
      correctAnswer: '',
      answers: ['', '', '', ''],
      solving_time: '',
    };
    this.quiz.questions.push(question);
    this.questions.push(
      this.fb.group({
        head: '',
        solving_time: '',
        correctAnswer: '',
        answers: this.fb.group({
          ans1: '',
          ans2: '',
          ans3: '',
          ans4: '',
        }),
      })
    );
  }

  editQuestion(i: any) {
    if (this.open === i) {
      this.open = 99999;
    } else [(this.open = i)];
  }

  saveChanges() {
    // Changing the format of the answers to send it to the database
    for (let i = 0; i < this.form.value.questions.length; i++) {
      let obj = this.form.value.questions[i].answers;
      let answers = Object.keys(obj).map((key) => obj[key]);
      this.form.value.questions[i].answers = answers;
    }
    this.http
      .post(API_URL + '/api/quizzes/updateQuiz', {
        id: this.id,
        modifiedQuiz: {
          name: this.name?.value,
          category: this.category?.value,
          image: this.imageURL?.value,
          difficulty: this.selectedValue?.value,
        },
        questionss: this.form.value.questions,
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          this.return();
        },
        error: (err) => {
          this.toast.success({ detail: err.message });
        },
      });
  }

  cancelChanges() {
    this.form.reset();
    this.questions.clear();
    this.getQuiz();
    this.clicked = false;
  }

  deleteQuestion(i: number) {
    this.questions.removeAt(i);
    this.quiz.questions.splice(i, 1);
    this.clicked = true;
  }

  return() {
    window.history.back();
  }
}
