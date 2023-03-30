import { API_URL } from './../../../../../app/services/socketio.service';
import { NgToastService } from 'ng-angular-popup';
import { Article } from './../../../../../app/models/article';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-teacher-modify-article',
  templateUrl: './teacher-modify-article.component.html',
  styleUrls: ['./teacher-modify-article.component.css'],
})
export class TeacherModifyArticleComponent implements OnInit {
  id!: string;
  form!: FormGroup;
  subscription!: Subscription;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    public toast: NgToastService,
    public router: Router
  ) {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      imageURL: new FormControl('', [Validators.required]),
      articleContent: new FormControl('', [Validators.required]),
      selectedValue: new FormControl('', [Validators.required]),
    });
    this.id = this.route.snapshot.params['id'];
    this.getArticle();
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

  ngOnInit(): void {}

  getArticle() {
    const sub = this.http
      .get<Article>(API_URL + `/api/articles/getArticle/${this.id}`)
      .subscribe((article: Article) => {
        this.title?.setValue(article.title);
        this.imageURL?.setValue(article.image);
        this.articleContent?.setValue(article.body);
        this.selectedValue?.setValue(article.category);
      });
    this.subscription?.add(sub);
  }

  modifyArticle(): void {
    const sub = this.http
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
    this.subscription?.add(sub);
  }

  cancelChanges(): void {
    this.getArticle();
    this.form.reset();
  }

  return(): void {
    window.history.back();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
