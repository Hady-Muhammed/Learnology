import { LoaderComponent } from './../../app/components/loader/loader.component';
import { LogoComponent } from './../../app/components/logo/logo.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [LogoComponent , LoaderComponent],
  imports: [
    CommonModule
  ],
  exports: [LogoComponent , LoaderComponent]
})
export class SharedModule { }
