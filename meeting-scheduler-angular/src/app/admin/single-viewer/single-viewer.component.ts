//import angular packages
import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-single-viewer',
  templateUrl: './single-viewer.component.html',
  styleUrls: ['./single-viewer.component.css']
})

export class SingleViewerComponent implements OnInit  {//
  public userId:string;

  constructor(private _route:ActivatedRoute){
    console.log("Single Viewer Component ::: Constructor")
  }
  ngOnInit(){    
    this.userId=this._route.snapshot.paramMap.get('viewerId');    
  }

  //function to decide period of calendar to be shown
  public periodSelected:string='monthly'
  onNavigate(period){
    this.periodSelected=period;    
  }
//-----------------------end of class defintion -------------------------------------------
}

