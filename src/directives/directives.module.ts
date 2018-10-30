import { NgModule } from '@angular/core';
import { SetInputStatusDirective } from './set-input-status/set-input-status';
import { ScrollFixKeyboardDirective } from './scroll-fix-keyboard/scroll-fix-keyboard';
@NgModule({
	declarations: [SetInputStatusDirective,
    ScrollFixKeyboardDirective],
	imports: [],
	exports: [SetInputStatusDirective,
    ScrollFixKeyboardDirective]
})
export class DirectivesModule {}
