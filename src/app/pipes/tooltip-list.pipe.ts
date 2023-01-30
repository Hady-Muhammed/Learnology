import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tooltipList'
})
export class TooltipListPipe implements PipeTransform {

  transform(lines: string[]): string {
    let list: string = '';

    lines.forEach(line => {
      list += '\n• ' + line + '\n'; 
    });

    return list;
  }

}
