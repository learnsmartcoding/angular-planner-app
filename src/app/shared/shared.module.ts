import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from './spinner/spinner.component';
import { DisplayErrorsComponent } from './display-errors/display-errors.component';
import { LabelErrorComponent } from './label-error/label-error.component';
import { ReplaceStringPipe } from './pipes/string-replace.pipe';
import { ToPascalPipe } from './pipes/to-pascal.pipe';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule    
  ],
  exports: [ SpinnerComponent,DisplayErrorsComponent, LabelErrorComponent, ReplaceStringPipe,ToPascalPipe],
  declarations: [ SpinnerComponent,DisplayErrorsComponent, LabelErrorComponent, ReplaceStringPipe,ToPascalPipe],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
