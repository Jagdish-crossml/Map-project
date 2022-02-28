
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'normaliseGDP'})
export class NormaliseGDP implements PipeTransform {
  transform(value: string): string {
    return value.replace(/'billion'/g, 'B');
  }
}