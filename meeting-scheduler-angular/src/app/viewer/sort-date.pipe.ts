import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortDate'
})
export class SortDatePipe implements PipeTransform {

  transform(records: Array<any>, args?: any): any {
    if(!records || records.length<=0){
      return records;
    }
    let sortedRecords =  records.sort(function(a, b){
      let aDate = new Date(a["startDate"]);
      let bDate = new Date(b["startDate"]);
      if(aDate < bDate){
        return -1;
      }
      else if( aDate > bDate){
          return 1 ;
      }
      else{
          return 0;
      }
  });

    return sortedRecords;

  }

}
