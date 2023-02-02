import { MaterialModule } from 'src/modules/material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../student/components/loader/loader.component';
import { LogoComponent } from '../student/components/logo/logo.component';


@NgModule({
  declarations: [LogoComponent, LoaderComponent],
  imports: [
    CommonModule,
  ],
  exports: [LogoComponent, LoaderComponent, MaterialModule],
})
export class SharedModule {}
