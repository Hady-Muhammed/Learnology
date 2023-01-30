import { PictureDialog } from './../../modules/teacher/pages/teacher-account/teacher-account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { MaterialModule } from './../material/material.module';
import { TeacherRoutingModule } from './teacher-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherComponent } from './pages/teacher/teacher.component';
import { NavbarrComponent } from './components/navbarr/navbarr.component';
import { TeacherDashboardComponent } from './pages/teacher-dashboard/teacher-dashboard.component';
import { TeacherCoursesComponent } from './pages/teacher-courses/teacher-courses.component';
import { TeacherMessagesComponent } from './pages/teacher-messages/teacher-messages.component';
import { TeacherArticlesComponent } from './pages/teacher-articles/teacher-articles.component';
import { ChatComponent } from './pages/teacher-messages/subpages/chat/chat.component';
import { TeacherCreateArticleComponent } from './pages/teacher-articles/teacher-create-article/teacher-create-article.component';
import { TeacherCreateCourseComponent } from './pages/teacher-courses/teacher-create-course/teacher-create-course.component';
import { TeacherModifyCourseComponent } from './pages/teacher-courses/teacher-modify-course/teacher-modify-course.component';
import { TeacherModifyArticleComponent } from './pages/teacher-articles/teacher-modify-article/teacher-modify-article.component';
import { TeacherAccountComponent } from './pages/teacher-account/teacher-account.component';
import { TeacherQuizzesComponent } from './pages/teacher-quizzes/teacher-quizzes.component';
import { TeacherStatisticsComponent } from './pages/teacher-statistics/teacher-statistics.component';
import { TeacherModifyQuizComponent } from './pages/teacher-quizzes/teacher-modify-quiz/teacher-modify-quiz.component';
import { TeacherCreateQuizComponent } from './pages/teacher-quizzes/teacher-create-quiz/teacher-create-quiz.component';
@NgModule({
  declarations: [
    TeacherComponent,
    NavbarrComponent,
    TeacherDashboardComponent,
    TeacherCoursesComponent,
    TeacherMessagesComponent,
    TeacherArticlesComponent,
    ChatComponent,
    TeacherCreateArticleComponent,
    TeacherCreateCourseComponent,
    TeacherModifyCourseComponent,
    TeacherModifyArticleComponent,
    TeacherAccountComponent,
    PictureDialog,
    TeacherQuizzesComponent,
    TeacherStatisticsComponent,
    TeacherModifyQuizComponent,
    TeacherCreateQuizComponent,
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [ChatComponent],
})
export class TeacherModule {}
