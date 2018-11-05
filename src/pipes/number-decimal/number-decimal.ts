import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the NumberDecimalPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'numberDecimal',
})
export class NumberDecimalPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string | number, decimalLength: number = 8, ...args) {
    if(isNaN(+value)) return value;
    let index: number = String(value).indexOf('.');
    value = index > -1 ? value : value + ".";
    value = value + (Array(decimalLength + 1).join("0"));
    index = value.indexOf('.');
    return value.substr(0, index + decimalLength + 1);
  }
}
