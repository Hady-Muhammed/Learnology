import { AuthGuard } from '../../app/guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './pages/account/account.component';
import { AccountSettingsComponent } from './pages/account/subpages/account-settings/account-settings.component';
import { EnrolledCoursesComponent } from './pages/account/subpages/enrolled-courses/enrolled-courses.component';
import { ConversationComponent } from './pages/account/subpages/messages/conversation/conversation.component';
import { MessagesComponent } from './pages/account/subpages/messages/messages.component';
import { TakenExamsComponent } from './pages/account/subpages/taken-exams/taken-exams.component';
import { QuestionGuard } from 'src/app/guards/question.guard';
import { StudentGuard } from 'src/app/guards/student.guard';
import { AboutComponent } from './pages/about/about.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { BlogComponent } from './pages/blog/blog.component';
import { CommunityComponent } from './pages/community/community.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { HomeComponent } from './pages/home/home.component';
import { InstructorComponent } from './pages/instructor/instructor.component';
import { QuestionComponent } from './pages/quizzes/question/question.component';
import { QuizDetailComponent } from './pages/quizzes/quiz-detail/quiz-detail.component';
import { QuizResultsComponent } from './pages/quizzes/quiz-results/quiz-results.component';
import { QuizzesComponent } from './pages/quizzes/quizzes.component';
import { NotifiedPostComponent } from './pages/notified-post/notified-post.component';
import { PostsComponent } from './pages/account/subpages/posts/posts.component';
import { FriendsComponent } from './pages/account/subpages/friends/friends.component';
import { InboxComponent } from './pages/account/subpages/inbox/inbox.component';
import { InboxDetailComponent } from './pages/account/subpages/inbox-detail/inbox-detail.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    canActivate: [StudentGuard],
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
    path: 'notified-post/:id',
    pathMatch: 'full',
    component: NotifiedPostComponent,
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
      {
        path: 'posts',
        component: PostsComponent,
      },
      {
        path: 'friends',
        component: FriendsComponent,
      },
      {
        path: 'inbox',
        component: InboxComponent,
      },
      {
        path: 'inbox/:id',
        component: InboxDetailComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
