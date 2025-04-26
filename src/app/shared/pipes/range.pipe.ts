import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'range'
})
export class RangePipe implements PipeTransform {
  transform(value: number, start: number = 1): number[] {
    const result: number[] = [];
    for (let i = start; i <= value; i++) {
      result.push(i);
    }
    return result;
  }
}
