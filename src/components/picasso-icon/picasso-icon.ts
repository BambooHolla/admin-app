import { Component, Input, ChangeDetectionStrategy } from "@angular/core";

/**
 * Generated class for the PicassoIconComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'picasso-icon',
  templateUrl: 'picasso-icon.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PicassoIconComponent {
  @Input() name?: string;
}
