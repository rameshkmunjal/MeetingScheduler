import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  //year should be current year
  public year:string=JSON.stringify(new Date().getFullYear());
  //days of week
  public weekDays:any=["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  //months in a year
  public monthArray:any=[
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
//days in months of current year
  public days:any=[];
//hours in a day 
  public hours=["00","01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12",
  "13", "14", "15", "16", "17", "18", "19", "20", "21", "22","23"];
//minutes in a hour
  public minutesArray=["00", "01", "02", "03", "04", "05", "06", "07","08", "09", 
  "10", "11", "12", "13", "14", "15", "16", "17","18", "19",
  "20", "21", "22", "23", "24", "25", "26", "27","28", "29",
  "30", "31", "32", "33", "34", "35", "36", "37","38", "39",
  "40", "41", "42", "43", "44", "45", "46", "47","48", "49",
  "50", "51", "52", "53", "54", "55", "56", "57","58", "59",
];
//colors 
public colors=[
  "green", "indianred", "orange", "crimson",
  "lightseagreen", "blue", "red", "black", 
  "grey", "darkslategray", "darkgray", "indigo",
  "purple", "darkmagenta", "darkorchid", "darkviolet",
  "darkred", "firebrick", "deeppink", "orangered",
  "darkkhaki", "magenta", "blueviolet", "limegreen",
  "forestgreen", "darkgreen"
 ]

constructor() { }
//to return array of colors
public getColors=()=>{
    return this.colors;
}
//-------------------------Year related utility functions-----------------------------------
//to return current year
public getCurrentYear=()=>{
  return this.year;
}
//check whether it is leap year - change number of days in february
public checkLeapYear=(year)=>{
  let leapYear;

  if(year%100===0){
    if(year%400===0){
      leapYear=true;
    } else {
      leapYear=false;			
    }
  } else{
    if(year%4 !== 0){
      leapYear=false;
    }else{
      leapYear=true;
    }	
  }
  console.log(leapYear);
  return leapYear;
}
//-------------------------Month related utility functions-----------------------------------
//to return months array
public getMonths=()=>{
    return this.monthArray;
  }
//to return name of a month - as per index
public getMonthName=(index)=>{
  return this.monthArray[index];
}
//to return index position of a month - in months array
public getMonthIndex=(index)=>{
  return this.monthArray.indexOf(index);
}
//to get days in a particular month
public getDaysInAMonth=(month)=>{
    let days=[];
    let totalDays;
    
    console.log("decideDays function called");
    if(month==="Jan" || month==="Mar" ||
        month==="May" || month==="Jul" ||
        month==="Aug" || month==="Oct" ||
        month==="Dec" ){
          totalDays=31;
    } else if(month==="Apr" || month==="Jun" ||
              month==="Sep" || month==="Nov" ){
          totalDays=30;
    }else if(month==="Feb"){
      let lpFlag=this.checkLeapYear(this.year);
      if(lpFlag){
        totalDays=29;
      } else{
        totalDays=28;
      }          
    }
    for(let i=1; i<=totalDays; i++){
        days.push(i);
    }
    return days;
  }
//to return days array
public getMonthDaysInYear=()=>{
  let leapFlag=this.checkLeapYear(this.year);
  if(leapFlag){
    this.days=[31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  }else{
    this.days=[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  }
  return this.days;
}
//to return days in a month - as per index
public getDayInAMonth=(index)=>{
  return this.days[index];
}
//-------------------------Week related utility functions-----------------------------------
//to return array of week days
public getWeekDays=()=>{
  return this.weekDays;
}
//----------------------------------utility functions for Hours, minutes-----------------------

//to return hours
  public getHours=()=>{
    return this.hours;
  }
//to return array of minutes
  public getMinutes=()=>{    
    return this.minutesArray;    
  }
  public findMinutesInArray(minutes){
    for(let i=0; i<this.minutesArray.length; i++){
      if(Number(this.minutesArray[i])=== minutes){
        return this.minutesArray[i];
      }
    }
  }
  
//---------------------------Date related utility functions-----------------------------------

  public prepareDate=(year, month,day, hour, minutes)=>{    
    let meetingDate;        
    meetingDate=new Date(year, month, day, hour, minutes, 0 , 0);
    return meetingDate;       
  }

  public formatDate(value){
    let month=new Date(value).getMonth()+1;     
    return new Date(value).getDate() + "/" + month + "/" +  new Date(value).getFullYear() ;
  }
//---------------------------time related utility functions-----------------------------------------
  public prepareMeetingTime=(dateObj)=>{
    let obj=new Date(dateObj);
    let hours=dateObj.getHours();
    let minutes=dateObj.getMinutes();
    let ampm;
    if(hours < 12){ ampm="A.M."}
    else if(hours==12 && minutes ==  0){       
      ampm="Noon";
    }
    else if(hours==12 && minutes > 0){ 
      ampm="P.M.";
    }
    else { hours=hours-12; ampm=  " P.M."} 

    minutes=this.findMinutesInArray(minutes);
    
    let meetingTime=hours+":"+minutes+" "+ampm;
    return meetingTime;
}

//--------------------validate form inputs ------------------------------
  public validateInputs=(d)=>{  
    let errorMessage;
      
    if(!d.name){
      errorMessage="Fill in meeting name";
      return errorMessage;
    } else if(!d.year || !d.month || !d.day){
      errorMessage="Fill in meeting date";
      return errorMessage;
    } else if(!d.starthour || !d.startminutes){
      console.log("minutes : "+ d.startminutes);
      errorMessage="Fill in meeting start time";
      return errorMessage;
    } else if(!d.endhour || !d.endminutes){
      console.log("minutes : "+ d.endminutes);
      errorMessage="Fill in meeting end time";
      return errorMessage;
    } else if(!d.venue){
      errorMessage="Fill in meeting venue";
      return errorMessage;
    }      
      return "";         
  }

//---------------------validate dates and form inputs----------------------
public validateDateInput(date1, date2):any{
  console.log(date1 + " :  "+date2);    
    if(new Date(date1) > new Date(date2)){
      return "";
    } else {      
      return "check start date or end date";
    }
}

public checkIfEmpty(input){  
  if(input===undefined || input===null || input===""){
    return true;
  }
}
//----------------------------------------------------------------------------------------------------
}//class definition ended



