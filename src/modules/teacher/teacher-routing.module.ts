import { TeacherInboxComponent } from './pages/teacher-inbox/teacher-inbox.component';
import { TeacherModifyQuizComponent } from './pages/teacher-quizzes/teacher-modify-quiz/teacher-modify-quiz.component';
import { TeacherCreateQuizComponent } from './pages/teacher-quizzes/teacher-create-quiz/teacher-create-quiz.component';
import { TeacherStatisticsComponent } from './pages/teacher-statistics/teacher-statistics.component';
import { TeacherQuizzesComponent } from './pages/teacher-quizzes/teacher-quizzes.component';
import { TeacherAccountComponent } from './pages/teacher-account/teacher-account.component';
import { TeacherModifyArticleComponent } from './pages/teacher-articles/teacher-modify-article/teacher-modify-article.component';
import { TeacherModifyCourseComponent } from './pages/teacher-courses/teacher-modify-course/teacher-modify-course.component';
import { TeacherCreateCourseComponent } from './pages/teacher-courses/teacher-create-course/teacher-create-course.component';
import { TeacherCreateArticleComponent } from './pages/teacher-articles/teacher-create-article/teacher-create-article.component';
import { TeacherGuard } from './../../app/guards/teacher.guard';
import { ChatComponent } from './pages/teacher-messages/subpages/chat/chat.component';
import { TeacherArticlesComponent } from './pages/teacher-articles/teacher-articles.component';
import { TeacherMessagesComponent } from './pages/teacher-messages/teacher-messages.component';
import { TeacherCoursesComponent } from './pages/teacher-courses/teacher-courses.component';
import { TeacherDashboardComponent } from './pages/teacher-dashboard/teacher-dashboard.component';
import { TeacherComponent } from './pages/teacher/teacher.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherInboxDetailComponent } from './pages/teacher-inbox-detail/teacher-inbox-detail.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 't/dashboard',
  },
  {
    path: 't',
    component: TeacherComponent,
    canActivate: [TeacherGuard],
    children: [
      {
        path: 'dashboard',
        component: TeacherDashboardComponent,
        canActivate: [TeacherGuard],
      },
      {
        path: 'courses',
        component: TeacherCoursesComponent,
        canActivate: [TeacherGuard],
      },
      {
        path: 'courses/new-course',
        component: TeacherCreateCourseComponent,
        canActivate: [TeacherGuard],
      },
      {
        path: 'courses/:id',
        component: TeacherModifyCourseComponent,
        canActivate: [TeacherGuard],
      },
      {
        path: 'messages',
        component: TeacherMessagesComponent,
        canActivate: [TeacherGuard],
        children: [
          {
            path: ':id',
            component: ChatComponent,
            canActivate: [TeacherGuard],
          },
        ],
      },
      {
        path: 'articles',
        component: TeacherArticlesComponent,
        canActivate: [TeacherGuard],
      },
      {
        path: 'articles/new-article',
        component: TeacherCreateArticleComponent,
        canActivate: [TeacherGuard],
      },
      {
        path: 'articles/:id',
        component: TeacherModifyArticleComponent,
        canActivate: [TeacherGuard],
      },
      {
        path: 'account',
        component: TeacherAccountComponent,
        canActivate: [TeacherGuard],
      },
      {
        path: 'quizzes',
        component: TeacherQuizzesComponent,
        canActivate: [TeacherGuard],
      },
      {
        path: 'quizzes/new-quiz',
        component: TeacherCreateQuizComponent,
        canActivate: [TeacherGuard],
      },
      {
        path: 'quizzes/:id',
        component: TeacherModifyQuizComponent,
        canActivate: [TeacherGuard],
      },
      {
        path: 'statistics',
        component: TeacherStatisticsComponent,
        canActivate: [TeacherGuard],
      },
      {
        path: 'inbox',
        component: TeacherInboxComponent,
        canActivate: [TeacherGuard],
      },
      {
        path: 'inbox/:id',
        component: TeacherInboxDetailComponent,
        canActivate: [TeacherGuard],
      },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherRoutingModule {}
