import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  public weekDays=[
    "SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"
  ]
  public monthArray=[
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  public days=[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  public hours=["00","01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12",
  "13", "14", "15", "16", "17", "18", "19", "20", "21", "22","23"];

  public minutesArray=["00", "01", "02", "03", "04", "05", "06", "07","08", "09", 
  "10", "11", "12", "13", "14", "15", "16", "17","18", "19",
  "20", "21", "22", "23", "24", "25", "26", "27","28", "29",
  "30", "31", "32", "33", "34", "35", "36", "37","38", "39",
  "40", "41", "42", "43", "44", "45", "46", "47","48", "49",
  "50", "51", "52", "53", "54", "55", "56", "57","58", "59",
];

  constructor() { }

  public getMonths=()=>{
    return this.monthArray;
  }

  public getHours=()=>{
    return this.hours;
  }
  public getWeekDays=()=>{
    return this.weekDays;
  }
  public getMonthName=(index)=>{
    return this.monthArray[index];
  }

  public getDayInAMonth=(index)=>{
    return this.days[index];
  }

  public getMonthIndex=(index)=>{
    return this.monthArray.indexOf(index);
  }

  public getMinutes=(hour)=>{
    console.log(hour);
    if(hour==="24"){
      return ["00"];
    } else{
      return this.minutesArray;
    }
  }

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
          totalDays=28;
    }
    for(let i=1; i<=totalDays; i++){
        days.push(i);
    }
    return days;
  }


  public prepareDate=(year, month,day, hour, minutes)=>{    
    let meetingDate;        
    meetingDate=new Date(year, month, day, hour, minutes, 0 , 0);
    return meetingDate;       
  }

  public formatDate(value){
    let month=new Date(value).getMonth()+1;     
    return new Date(value).getDate() + "/" + month + "/" +  new Date(value).getFullYear() ;
  }

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

public findMinutesInArray(minutes){
  for(let i=0; i<this.minutesArray.length; i++){
    if(Number(this.minutesArray[i])=== minutes){
      return this.minutesArray[i];
    }
  }
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

//---------------------validate dates----------------------
public validateDateInput(date1, date2):any{    
    if(new Date(date1) > date2){
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



