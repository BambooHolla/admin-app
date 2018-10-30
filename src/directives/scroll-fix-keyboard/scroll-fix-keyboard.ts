import { Directive, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { Keyboard } from '@ionic-native/keyboard';
import { Content } from "ionic-angular";
/**
 * Generated class for the ScrollFixKeyboardDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[scroll-fix-keyboard]' // Attribute selector
})
export class ScrollFixKeyboardDirective implements OnInit, OnDestroy {

    constructor(
        private el: ElementRef,
        private keyboard: Keyboard,
        private renderer2: Renderer2,
        public content: Content,
    ) {
        console.log('Hello ScrollFixKeyboardDirective Directive');
    }

    private _sub$?: Subscription;
    ngOnInit() {
        console.log("Hello ScrollFixKeyboardDirective Directive", this.content);
        this._sub$ = this.keyboard.onKeyboardShow().subscribe(e => {
            let position_y = (this.el.nativeElement as HTMLElement).offsetTop;
            const scroll_parent = (this.el.nativeElement as HTMLElement)
                .offsetParent;
            // this.content.scrollTo(undefined, position_y, 300)
            this.content.scrollTo(0, position_y);
        });
    }
    
    ngOnDestroy() {
        this._sub$ && this._sub$.unsubscribe();
    }
}
