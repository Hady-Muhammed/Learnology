import { QuestionGuard } from './guards/question.guard';
import { QuizResultsComponent } from './pages/quizzes/quiz-results/quiz-results.component';
import { QuestionComponent } from './pages/quizzes/question/question.component';
import { QuizDetailComponent } from './pages/quizzes/quiz-detail/quiz-detail.component';
import { QuizzesComponent } from './pages/quizzes/quizzes.component';
import { InstructorComponent } from './pages/instructor/instructor.component';
import { TeacherGuard } from './guards/teacher.guard';
import { StudentGuard } from './guards/student.guard';
import { CommunityComponent } from './pages/community/community.component';
import { ConversationComponent } from './pages/account/subpages/messages/conversation/conversation.component';
import { MessagesComponent } from './pages/account/subpages/messages/messages.component';
import { TakenExamsComponent } from './pages/account/subpages/taken-exams/taken-exams.component';
import { EnrolledCoursesComponent } from './pages/account/subpages/enrolled-courses/enrolled-courses.component';
import { AccountSettingsComponent } from './pages/account/subpages/account-settings/account-settings.component';
import { AccountComponent } from './pages/account/account.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { AuthGuard } from './guards/auth.guard';
import { Page404Component } from './pages/page404/page404.component';
import { LoggedInGuard } from './guards/logged-in.guard';
import { HomeComponent } from './pages/home/home.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './pages/sign-up/sign-up.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    canActivate: [StudentGuard],
  },
  {
    path: 'signup',
    pathMatch: 'full',
    component: SignUpComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: 'signin',
    pathMatch: 'full',
    component: SignInComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: 'about',
    pathMatch: 'full',
    component: AboutComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'blog',
    pathMatch: 'full',
    component: BlogComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'courses',
    pathMatch: 'full',
    component: CoursesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'course-details/:id',
    pathMatch: 'full',
    component: CourseDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'article-details/:id',
    pathMatch: 'full',
    component: ArticleDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'contact',
    pathMatch: 'full',
    component: ContactComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'community',
    pathMatch: 'full',
    component: CommunityComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'quizzes',
    pathMatch: 'full',
    component: QuizzesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'quiz-detail/:id',
    pathMatch: 'full',
    component: QuizDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'quiz-results/:id',
    pathMatch: 'full',
    component: QuizResultsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'quiz/:quizID/:qnum',
    pathMatch: 'full',
    component: QuestionComponent,
    canActivate: [AuthGuard],
    canDeactivate: [QuestionGuard],
  },
  {
    path: 'instructor/:id',
    pathMatch: 'full',
    component: InstructorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'teacherr',
    canActivate: [TeacherGuard],
    loadChildren: () =>
      import('../modules/teacher/teacher.module').then((m) => m.TeacherModule),
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'settings',
      },
      {
        path: 'settings',
        component: AccountSettingsComponent,
      },
      {
        path: 'enrolled',
        component: EnrolledCoursesComponent,
      },
      {
        path: 'exams',
        component: TakenExamsComponent,
      },
      {
        path: 'messages',
        component: MessagesComponent,
      },
      {
        path: 'messages/:id',
        component: ConversationComponent,
      },
    ],
  },
  { path: '**', pathMatch: 'full', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
