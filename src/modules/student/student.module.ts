import { SwiperModule } from 'swiper/angular';
import { SharedModule } from 'src/modules/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgToastModule } from 'ng-angular-popup';
import { CourseCardComponent } from './components/cards/course-card/course-card.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { StudentRoutingModule } from './student-routing.module';
import { AboutComponent } from './pages/about/about.component';
import { AccountComponent } from './pages/account/account.component';
import { AccountSettingsComponent, PictureDialog } from './pages/account/subpages/account-settings/account-settings.component';
import { EnrolledCoursesComponent } from './pages/account/subpages/enrolled-courses/enrolled-courses.component';
import { MessagesComponent } from './pages/account/subpages/messages/messages.component';
import { TakenExamsComponent } from './pages/account/subpages/taken-exams/taken-exams.component';
import { ConversationComponent } from './pages/account/subpages/messages/conversation/conversation.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { BlogComponent } from './pages/blog/blog.component';
import { CommunityComponent } from './pages/community/community.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { InstructorComponent } from './pages/instructor/instructor.component';
import { QuizzesComponent } from './pages/quizzes/quizzes.component';
import { QuestionComponent } from './pages/quizzes/question/question.component';
import { QuizDetailComponent } from './pages/quizzes/quiz-detail/quiz-detail.component';
import { QuizResultsComponent } from './pages/quizzes/quiz-results/quiz-results.component';
import { ArticleCardComponent } from './components/cards/article-card/article-card.component';
import { QuizCardComponent } from './components/cards/quiz-card/quiz-card.component';
import { TeacherCardComponent } from './components/cards/teacher-card/teacher-card.component';
import { CommentComponent } from './components/comment/comment.component';
import { PannerComponent } from './components/panner/panner.component';
import { PostComponent } from './components/post/post.component';
import { ReactsListComponent } from './components/reacts-list/reacts-list.component';
import { ReactsPopupComponent } from './components/reacts-popup/reacts-popup.component';
import { ReplyComponent } from './components/reply/reply.component';
import { ArticleSkeletonComponent } from './components/skeletons/article-skeleton/article-skeleton.component';
import { CourseSkeletonComponent } from './components/skeletons/course-skeleton/course-skeleton.component';
import { PostSkeletonComponent } from './components/skeletons/post-skeleton/post-skeleton.component';



@NgModule({
  declarations: [
    CourseCardComponent,
    NavbarComponent,
    HomeComponent,
    AboutComponent,
    AccountComponent,
    AccountSettingsComponent,
    EnrolledCoursesComponent,
    MessagesComponent,
    TakenExamsComponent,
    ConversationComponent,
    ArticleDetailComponent,
    BlogComponent,
    CommunityComponent,
    ContactComponent,
    CourseDetailComponent,
    CoursesComponent,
    InstructorComponent,
    QuizzesComponent,
    QuestionComponent,
    QuizDetailComponent,
    QuizResultsComponent,
    PictureDialog,
    ArticleCardComponent,
    CourseCardComponent,
    QuizCardComponent,
    TeacherCardComponent,
    CommentComponent,
    FooterComponent,
    PannerComponent,
    PostComponent,
    ReactsListComponent,
    ReactsPopupComponent,
    ReplyComponent,
    ArticleSkeletonComponent,
    CourseSkeletonComponent,
    PostSkeletonComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgToastModule,
    SwiperModule,
    StudentRoutingModule,
    FontAwesomeModule,
  ]
})
export class StudentModule { }
