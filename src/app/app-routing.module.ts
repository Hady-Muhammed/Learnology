import { TeacherGuard } from './guards/teacher.guard';
import { StudentGuard } from './guards/student.guard';
import { LoggedInGuard } from './guards/logged-in.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { Page404Component } from './pages/page404/page404.component';
import { HomeComponent } from 'src/modules/student/pages/home/home.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [StudentGuard],
    loadChildren: () =>
      import('../modules/student/student.module').then((m) => m.StudentModule),
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
    path: 'teacher',
    canActivate: [TeacherGuard],
    loadChildren: () =>
      import('../modules/teacher/teacher.module').then((m) => m.TeacherModule),
  },
  { path: '**', pathMatch: 'full', component: Page404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
