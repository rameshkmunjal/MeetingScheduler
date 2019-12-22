# MeetingScheduler
##Problem Statement:
	This Project should be ready to deploy meeting scheduling system. It must have 
	all the features mentioned below and it must be deployed on a server before 
	submission. There should be two parts of the application. A frontend developed 
	and deployed using the technologies mentioned below and a  REST API (using Real
	Time functionalities) created using the technologies mentioned below.
	
	Frontend Technologies Allowed - HTML5 , CSS3, JS , Bootstrap and Angular
	Backend Technologies Allowed - Nodejs,ExpressJS, Socket.IO
	Databases Allowed - MongoDB, Redis
	
	Features of Application - 
		1. User Management System - Signup , Login , Forgot Password
		2. User Authrisation System - User can be of two roles - normal and admin.
		3. User Slots Management System ( Flow for Normal User ) - upon login 
			use should be taken to showing his current month's planned meetings 
			in form of a calendar.
		4. User Slots Management System (Flow for Admin User) - Admin User should 
			be taken to a dashboard showing all noraml users in a list format. Upon
			clicking on any user , admin should be taken to user's current calendar.
			Admin should be able to add/delete/update meetings on any day.
		5. User Alerts Management System - A Normal user should be notified in time 
		    i   A meeting is created by Admin
			ii  A meeting is changed by Admin
			iii 1 minute before meeting - with an option to snooze or dismiss
		6. Planner Views -
				a) similar to Google calendars
				b) The view must follow following guidelines-
					i) Planner should show only current year
					ii) User should be able to change months using arrow buttons.
					iii) Day cells should be kept filled with some design.
					iv) Upon clicking the Day Cell - a view should pop - showing all
						meetings along a 24-hours timeline.
					v) Upon clicking a meeting - its details should pop up in another 
						view.
				c) i) For admin a create button should be there in calendar view.
					ii) Upon clicking create button, a details view should open.
					iii) Once created - it should appear on calendar view.
					iv) Upon clicking created meeting - same details view should open.
					v) Details should be a form 
					vi) Admin should be able to make changes in meeting details form.
					vii) Admin should be able to delete a meeting as well.
					viii) Meeting details should cover when , where and purpose.
					ix) Admin name should appear in non-editable form.
## Synopsis:
	FRONTEND:
	1) We have created user management system having 3 pages - Signup , Login , Forgot Password.
	2) In Signup page - we have used country code and names in user details.
	3) Signup code ensures that normal users can not use admin in their username. 
	4) Signp as admin is allowed only for role - AGM Controller and we have removed this option in second deployment.
	5) In Forgot Password - an OTP is sent to user email address. Using this OTP , user can reset his password 
	6) Admin Flow - has three menu items to navigate - Home , Meeting-List , Planner
	7) As per project requirement - upon login admin lands at a page , having list of all normal users.
	8) Upon clicking any user - he gets current month meeting calendar of that user, current day-cell selected by default.
	9) If Admin clicks any meeting - he gets meetings details in form and he can update/delete it.
   10) If Admin clicks any empty space in cell - he gets create meeting form and he can add a new meeting. 
   11) When a normal user is logged in , he also get current month meeting calendar but he cannot make any addition/change.
   12) When a meeting is created or edited - all users are informed through email and alert message is sent 
       to all online users.
   13) Planner view presents calendar in 3 formats - Day, Week , Month . All meetings of that period are shown in it.
   14) Admin can navigate to previous/next month/week/day using left/right arrow keys.
   15) A button to create new meeting is available on this page.
   16) If a meeting is clicked - admin gets details of that meeting in non-editable form . He can use edit/delete buttons 
		to edit or delete the meeting.
   17) Some innovations have been made by us to make the site more useful - being explained as following.
   18) In meeting details view - invitees button is given . Admin can view invitees/non-invitees of this meeting.
   19) He can include/exclude any user in a meeting as per his requirement.
   20) We have created a meeting list menu item. Where in all upcoming/previous meetings are given in one page.
   
   BACKEND:
    1) Backend code is broadly divided in to two categories - user and meeting.
	2) api call made by client are handled by files inside route folder- user and meeting. 
	3) routes requiring authorisation - checked  by middleware whether authToken is present in the route or not. 
	4) If a route is matched - function call is made and functions are defined in controller folder files 
		- userController and meetingController.
	5) To populate data in database mongoDB files -  following models have been created
		user - to store user details
		meeting - to store meeting details
		auth - to store auth token details
		invitation - to store invitation details
		otp - to store otp details
	6) Some library files have been created to assist controller functions as following -
		checkLib - to validate string value
		emailLib - to send email messages
		generatePasswordLib - to generate/match hash password 
		loggerLib - to log error/info
		reponseLib - to design reponse object of apiresponse
		redisLib - to detail redis functions
		socketLib - to set up socket connection , to listen/emit socket events.
		tokenLib - to generate/match auth token
		validationLib - to validate inputs like email , password	
	7) appConfig file in config folder defines configurations of app.
	8) 
	9) 
   10) 

##Assumptions:
	
	
## Technical Specifications:
	Technologies used are as following-
	Frontend : HTML, CSS, Jquery, Javascript.
	Bakcend : Nodejs,ExpressJS, Socket.IO 
	Databases: MongoDB, Redis

## Installation:

    	Complete code of this api has been uploaded to my github page and address is :
 
		https://github.com/rameshkmunjal/MeetingScheduler

	
## Contributors:

    1. Ramesh Kumar Munjal
