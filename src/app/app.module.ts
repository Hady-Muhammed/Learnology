// import { SocketioService } from 'src/app/services/socketio.service';
import { SocketioService } from './services/socketio.service';
import { SharedModule } from './../modules/shared/shared.module';
import { TeacherModule } from './../modules/teacher/teacher.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  SignUpComponent,
  DialogComponent,
} from './pages/sign-up/sign-up.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/modules/material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { HttpClientModule } from '@angular/common/http';
import { NgToastModule } from 'ng-angular-popup';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { SwiperModule } from 'swiper/angular';
import { Page404Component } from './pages/page404/page404.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PannerComponent } from './components/panner/panner.component';
import { BlogComponent } from './pages/blog/blog.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { CourseDetailComponent } from './pages/course-detail/course-detail.component';
import { ArticleDetailComponent } from './pages/article-detail/article-detail.component';
import { AccountComponent } from './pages/account/account.component';
import { ArticleSkeletonComponent } from './components/skeletons/article-skeleton/article-skeleton.component';
import { CourseSkeletonComponent } from './components/skeletons/course-skeleton/course-skeleton.component';
import {
  AccountSettingsComponent,
  PictureDialog,
} from './pages/account/subpages/account-settings/account-settings.component';
import { EnrolledCoursesComponent } from './pages/account/subpages/enrolled-courses/enrolled-courses.component';
import { TakenExamsComponent } from './pages/account/subpages/taken-exams/taken-exams.component';
import { MessagesComponent } from './pages/account/subpages/messages/messages.component';
import { ConversationComponent } from './pages/account/subpages/messages/conversation/conversation.component';
import { CommunityComponent } from './pages/community/community.component';
import { QuizzesComponent } from './pages/quizzes/quizzes.component';
import { InstructorComponent } from './pages/instructor/instructor.component';
import { QuizDetailComponent } from './pages/quizzes/quiz-detail/quiz-detail.component';
import { QuestionComponent } from './pages/quizzes/question/question.component';
import { QuizResultsComponent } from './pages/quizzes/quiz-results/quiz-results.component';
import { PostSkeletonComponent } from './components/skeletons/post-skeleton/post-skeleton.component';
import { TooltipListPipe } from './pipes/tooltip-list.pipe';
import { ReactsListComponent } from './components/reacts-list/reacts-list.component';
import { PostComponent } from './components/post/post.component';
import { CommentComponent } from './components/comment/comment.component';
import { ReplyComponent } from './components/reply/reply.component';
import { ReactsPopupComponent } from './components/reacts-popup/reacts-popup.component';
import { CourseCardComponent } from './components/cards/course-card/course-card.component';
import { ArticleCardComponent } from './components/cards/article-card/article-card.component';
import { QuizCardComponent } from './components/cards/quiz-card/quiz-card.component';
import { TeacherCardComponent } from './components/cards/teacher-card/teacher-card.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignInComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    Page404Component,
    AboutComponent,
    ContactComponent,
    PannerComponent,
    BlogComponent,
    CoursesComponent,
    CourseDetailComponent,
    ArticleDetailComponent,
    DialogComponent,
    AccountComponent,
    ArticleSkeletonComponent,
    CourseSkeletonComponent,
    AccountSettingsComponent,
    EnrolledCoursesComponent,
    TakenExamsComponent,
    MessagesComponent,
    ConversationComponent,
    PictureDialog,
    CommunityComponent,
    QuizzesComponent,
    InstructorComponent,
    QuizDetailComponent,
    QuestionComponent,
    QuizResultsComponent,
    PostSkeletonComponent,
    TooltipListPipe,
    ReactsListComponent,
    PostComponent,
    CommentComponent,
    ReplyComponent,
    ReactsPopupComponent,
    CourseCardComponent,
    ArticleCardComponent,
    QuizCardComponent,
    TeacherCardComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
    NgToastModule,
    FontAwesomeModule,
    SwiperModule,
    TeacherModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [SocketioService],
  bootstrap: [AppComponent],
})
export class AppModule {}
