import { API_URL } from './../../../../../app/services/socketio.service';
import { NgToastService } from 'ng-angular-popup';
import { Article } from './../../../../../app/models/article';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-teacher-modify-article',
  templateUrl: './teacher-modify-article.component.html',
  styleUrls: ['./teacher-modify-article.component.css'],
})
export class TeacherModifyArticleComponent implements OnInit {
  id!: string;
  form!: FormGroup;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private toast: NgToastService,
    private router: Router
  ) {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      imageURL: new FormControl('', [Validators.required]),
      articleContent: new FormControl('', [Validators.required]),
      selectedValue: new FormControl('', [Validators.required]),
    });
  }

  changed: boolean = false;

  categories: any[] = [
    { value: 'Web Development', viewValue: 'Web Development' },
    { value: 'Frontend', viewValue: 'Frontend' },
    { value: 'Data Science', viewValue: 'Data Science' },
    { value: 'JavaScript Hacks', viewValue: 'JavaScript Hacks' },
    { value: 'Python Programmming', viewValue: 'Python Programmming' },
  ];

  /* Form Fields Getters */
  get title() {
    return this.form.get('title');
  }
  get imageURL() {
    return this.form.get('imageURL');
  }
  get articleContent() {
    return this.form.get('articleContent');
  }
  get selectedValue() {
    return this.form.get('selectedValue');
  }
  /* Form Fields Getters */

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getArticle();
  }
  getArticle() {
    this.http
      .get<Article>(API_URL + `/api/articles/getArticle/${this.id}`)
      .subscribe((article: Article) => {
        this.title?.setValue(article.title);
        this.imageURL?.setValue(article.image);
        this.articleContent?.setValue(article.body);
        this.selectedValue?.setValue(article.category);
      });
  }

  modifyArticle() {
    this.http
      .post(API_URL + `/api/articles/modifyArticle`, {
        id: this.id,
        modifiedArticle: {
          title: this.title?.value,
          image: this.imageURL?.value,
          body: this.articleContent?.value,
          category: this.selectedValue?.value,
        },
      })
      .subscribe({
        next: (res: any) => {
          this.toast.success({ detail: res.message });
          this.router.navigateByUrl('/teacher/articles');
        },
        error: (err) => {
          this.toast.error({ detail: 'Something went wrong!' });
        },
      });
  }

  cancelChanges() {
    this.getArticle();
    this.form.reset();
  }

  return() {
    window.history.back();
  }
}
