import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByCountry'
})
export class FilterByCountry implements PipeTransform {

	
  transform(value: any, args?: any): any {
  		if(!value)
  			return value
  		return value.filter((state)=>
  			state.country_id ===  args
  		);
  }

}