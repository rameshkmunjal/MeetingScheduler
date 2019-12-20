import { Injectable } from '@angular/core';
import {LibraryService} from './library.service';


@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  //days in months of 2019
  public days=[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  //week days 
  public weekDays=[
    "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"
  ]
  //months 
  public months=[
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  //calendar - of 2019 to be used again and again - 
  //hence stored in this variable array
  public dailyCalendar:any=[];

  constructor(//instance
    private library:LibraryService
  ) {}
//calendar of year 2019 created
  public getDailyCalendar(){
    let calendar=this.getCalendar(2019);
    this.dailyCalendar=calendar;
    return calendar;
  }
//month wise calendar created
  public getMonthlyCalendar(){
    let calendar=this.getCalendar(2019);    
    let monthlyCalendar=[];
    for(let j=0; j<this.months.length; j++){
      let temp={ index:undefined, monthArr:[] };
      for(let i=0; i<calendar.length; i++){      
          temp.index=j; 
        if(calendar[i].monthIndex==j){
          temp.monthArr.push(calendar[i]);
        }
      }
      monthlyCalendar.push(temp);
    }
    return monthlyCalendar;
  }
//function - as per index param - respective month calendar returned
  public getSelectedMonthCalendar(monthlyCalendar, monthIndex){
    for(let i=0; i<monthlyCalendar.length; i++){
      if(monthlyCalendar[i].index==monthIndex){
        return monthlyCalendar[i];
      }
    }    
  }
//function used in above function-getDailyCalendar
  public  getCalendar=(year)=>{
    let firstDayNumberOfYear=new Date('January 1, '+ year).getDay();    
    let dayNumber=firstDayNumberOfYear;
    let calenderObjArray=[];
    let dayIndex=0;    
	
	  for(let i=0; i < 12; i++){
		
    let limit=this.days[i];
    		
		for(let j=1; j<= limit; j++){
			//console.log("inner loop");
												
			if(dayNumber > 7){
				dayNumber=dayNumber%7;
			}
			if(dayNumber === 7){
				dayNumber= 0;
			}
			let weekDay = this.weekDays[dayNumber];
      //console.log(weekDay);
      let temp={
        year:year,
        dayIndex:dayIndex++,
        month:this.months[i] ,
        monthIndex:i,
        weekDay:weekDay,
        date:j,
        mtgs:[]
      }			
			calenderObjArray.push(temp);			
			dayNumber++;
		}		
    }
    return calenderObjArray;
  }
//----------------------------------------------------------------------------------------------
//function - when a particular day calendar object is returned
public getSelectedDayCalendar(cal, day, month){
  for(let i=0; i<cal.length; i++){
    if(cal[i].date==day && cal[i].month==month){
      return cal[i];
    }
  }
}
//-----------------------------------------------------------------------------------------------
//to add 24 hours objects - to use later
public add24Objects(dayObj){ 
  let mtgArr=[]; 
  let hours=this.library.getHours();
  for(let i=0; i < hours.length; i++){
      let obj={
        hour:hours[i],
        dayObj:[]
      }
    mtgArr.push(obj);     
  }

  for(let i=0; i < mtgArr.length; i++){              
        let obj={
          index:dayObj.dayIndex,
          month:dayObj.month,
          date:dayObj.date,
          day:dayObj.weekDay,
          mtgs:[]
        }
        
        mtgArr[i].dayObj=obj;
      }
    
  //console.log(weeklyMtgArr);
  return mtgArr;
} 
//--------------------------------------------------------------------------------------------------------
//function - to add meeting data in a day calendar
public appendMeetingData( mtgArr, newArr){
  for(let i=0; i < mtgArr.length; i++){           
      for(let j=0; j < newArr.length; j++){
          let mtgHour=new Date(mtgArr[i].startDate).getHours();      
          let mtgDate=new Date(mtgArr[i].startDate).getDate();
          let num=new Date(mtgArr[i].startDate).getMonth();
          let mtgMonth=this.months[num];
          console.log(mtgHour + " : "+ mtgDate+ " : "+mtgMonth); 
                    
          if(mtgMonth==newArr[j].dayObj.month && mtgDate==newArr[j].dayObj.date && mtgHour==Number(newArr[j].hour)){            
          //  console.log("Matched");        
            newArr[j].dayObj.mtgs.push(mtgArr[i]); 
            console.log(newArr[j].dayObj.mtgs);  
          }
      }
  }
  //console.log(newArr);
  return newArr;    
} 
//---------------------------------------------------------------------------------------------------------------------
public getDayObj(dayNumber):any{
  let dayObj=this.dailyCalendar[dayNumber];
  return dayObj;
}
//----------------------------------------------------------------------------------------------------
//function - to fill meeting data in a month calendar
public feedMeetingData( mtgArr, newArr){
  for(let i=0; i < mtgArr.length; i++){           
      for(let j=0; j < newArr.length; j++){                
          let mtgDate=new Date(mtgArr[i].startDate).getDate();
          let num=new Date(mtgArr[i].startDate).getMonth();
          let mtgMonth=this.months[num];           
                    
          if(mtgMonth==newArr[j].month && mtgDate==newArr[j].date){                 
            newArr[j].mtgs.push(mtgArr[i]);   
          }
      }
  }
  //console.log(newArr);
  return newArr;    
}
//-----------------------------------------------------------------------------------------------------------
//function to make 35 boxes in cases of a month
public make35Boxes(mtgData):any{
  let firstDayOfMonth=this.weekDays.indexOf(mtgData[0].weekDay);
  for(let i=0; i<firstDayOfMonth; i++){
    let temp={
      date: null,
      dayIndex: null,
      month: null,
      monthIndex: null,
      mtgs:null,
      weekDay: null,
      year: null
    }
    mtgData.unshift(temp); 
  }
  //return mtgData;
  for(let j=mtgData.length; j<35; j++){
    let temp={
      date: null,
      dayIndex: null,
      month: null,
      monthIndex: null,
      mtgs:null,
      weekDay: null,
      year: null
    }
    mtgData.push(temp); 

  }
  //return mtgData;
  if(mtgData.length==36){
    let a=mtgData.pop();
    mtgData.shift();
    mtgData.unshift(a);
    
  } else if(mtgData.length==37){
    let a=mtgData.pop();
    let b=mtgData.pop();
    mtgData.shift();
    mtgData.shift();
    mtgData.unshift(a);
    mtgData.unshift(b);
  }
  return mtgData;
} 
//------------------------------------------------------------------------------------------------
//function to make 5 week arrays of a month
public make5Weeks(mtgData):any{
  //Entire month is being divided into five arrays of weeks
  let anArr=[];
  let x=0;
  for(let i=0; i<5; i++){
      let tempArr=[];  
      for(let j=0; j<7; j++){                                        
          tempArr.push(mtgData[x]);                      
          x++;         
      }     
      anArr.push(tempArr);
  } 
  return anArr;
}
//-----------------------------------------------------------------------------------------------------------
//function to make 371 objects of a year 53x7
public create371Objects(dailyCalendar){
  let day=dailyCalendar[0].weekDay;
  let firstDayNumberOfYear=this.weekDays.indexOf(day);

  for(let i=0; i < firstDayNumberOfYear; i++){
    let temp={
      date: null,
      dayIndex: null,
      month: null,
      monthIndex: null,
      mtgs: null,
      weekDay: null,
      year: null
    }
    dailyCalendar.unshift(temp);    
  }
  //return dailyCalendar;
  for(let j=dailyCalendar.length; j < 371; j++){
    let temp={
      date: null,
      dayIndex: null,
      month: null,
      monthIndex: null,
      mtgs: null,
      weekDay: null,
      year: null
    }
    dailyCalendar.push(temp);    
  }
  return dailyCalendar;
}
//------------------------------------------------------------------------------------------------------------
//function to make 53 weeks out of a calendar
public make53Weeks(dailyCalendar){
  let weeklyArr=[];       
            
    let count=0;
    for(let m=0; m<53; m++){
        let temp={
          weekIndex:m,
          weekArr:[]
        }
        
        for(let k=0; k < 7; k++){
            if(count < dailyCalendar.length){
                temp.weekArr.push(dailyCalendar[count]);                
                count++;
            }            
        }        
        weeklyArr.push(temp);              
    }    
    return weeklyArr;
}
//-------------------------------------------------------------------------------------------------------------
//function to find current week 
public findCurrentWeek(date, month, weeklyCalendar):any{
  //console.log(date+ " : "+month+" : "+weeklyCalendar);
  for(let i=0; i<weeklyCalendar.length; i++){
    let weekArr=weeklyCalendar[i].weekArr;
    for(let j=0; j<weekArr.length; j++){
      if(weekArr[j].date==date && weekArr[j].month==month){
        return weeklyCalendar[i];
      }
    }
  }
}
//------------------------------------
//to make 24 hours objects - to use later
public make24Objects(currentWeek){ 
  let weeklyMtgArr=[]; 
  let hours=this.library.getHours();
  for(let i=0; i < hours.length; i++){
      let obj={
        hour:hours[i],
        weekObj:[]
      }
    weeklyMtgArr.push(obj);     
  }

  for(let i=0; i < weeklyMtgArr.length; i++){
      for(let j=0; j < currentWeek.weekArr.length; j++){
        weeklyMtgArr[i].index=currentWeek.weekIndex;      
        let obj={
          index:currentWeek.weekIndex,
          month:currentWeek.weekArr[j].month,
          date:currentWeek.weekArr[j].date,
          day:currentWeek.weekArr[j].weekDay,
          mtgs:[]
        }
        
        weeklyMtgArr[i].weekObj.push(obj);
      }
    }
  //console.log(weeklyMtgArr);
  return weeklyMtgArr;
} 
//-------------------------------------------------------------------------------------------
//function to fill meeting data in a week
public fillMeetingData(meetingArray, weeklyArr){
  console.log(meetingArray);
  console.log(weeklyArr);
  for(let i=0; i<weeklyArr.length; i++){
    for(let k=0; k< weeklyArr[i].weekObj.length; k++){
      for(let j=0; j< meetingArray.length; j++){       
         let mtgHour=new Date(meetingArray[j].startDate).getHours();      
         let mtgDate=new Date(meetingArray[j].startDate).getDate();
         let monthNumber=new Date(meetingArray[j].startDate).getMonth(); 
         let mtgMonth=this.months[monthNumber]; 
                 
         if( mtgMonth==weeklyArr[i].weekObj[k].month && 
              mtgDate==weeklyArr[i].weekObj[k].date && 
              mtgHour==Number(weeklyArr[i].hour)          
          ){        
            weeklyArr[i].weekObj[k].mtgs.push(meetingArray[j]);       
          } //if block ended
        }//for loop j counter ended     
      } //for loop k counter ended   
  }//for loop i counter ended
  //console.log(weeklyArr);
  return weeklyArr;
  
} 
//-----------------------------------------------------------------------------------------


}