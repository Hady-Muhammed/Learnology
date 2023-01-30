import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent, DialogComponent } from './pages/sign-up/sign-up.component';
import { SharedModule } from './../modules/shared/shared.module';
import { TeacherModule } from 'src/modules/teacher/teacher.module';
import { StudentModule } from './../modules/student/student.module';
import { SocketioService } from './services/socketio.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { NgToastModule } from 'ng-angular-popup';
import { SwiperModule } from 'swiper/angular';
import { TooltipListPipe } from './pipes/tooltip-list.pipe';
import { Page404Component } from './pages/page404/page404.component';

@NgModule({
  declarations: [
    AppComponent,
    TooltipListPipe,
    SignInComponent,
    SignUpComponent,
    DialogComponent,
    Page404Component
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgToastModule,
    FontAwesomeModule,
    SwiperModule,
    AppRoutingModule,
    StudentModule,
    TeacherModule,
    SharedModule,
  ],
  providers: [SocketioService],
  bootstrap: [AppComponent],
})
export class AppModule {}
