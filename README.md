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

#### FRONTEND:
##### 1. User Management System
**SignUp** , **Login**  & **Forgot Password** page try to capture all functionalities for a user to manage his account on the website

User can fill in Personal Details on the SignUp page and create his account on the website post input validation. Country code is accepted as well as part of input. 

##### 2. User Authorisation System
User can use password based authorisation to access his account on the platform.

Special Provision has been created for creating an admin user on platform. 

**Forgot password** functionality is built using OTP dispatch functionality via SMTP (Google account).

##### 3. User Slots Management System (Normal User)
As per problem statement, upon login normal user is taken to a dashboard showing his current month's planned meetings in the form of a calendar with current day cell being selected. 

##### 4. User Slots Management System (Admin User)
Admin user is taken to a dashboard, showing all normal users in a list format.

Upon clicking on any user, admin user is taken to user's current calendar with current date selected by default. 

Admin can add a new meeting by clicking on empty space in a cell. 

Meeting details for every user are saved in a database. 

##### 5. User Alerts Management System 
When any meeting is created or editted, all users are informed through email and an alert message is sent as well to all online users.

An alert is sent to online customers 1 minute prior to meeting as well.

##### 6. Planner Views
Planner view presents calendar in 3 formats - Day, Week, Month. All meetings of that period are shown in it.

Admin can navigate to previous/next month/week/day using left/right arrow keys.

A button to create new meeting is available on this page.

If a meeting is clicked - admin gets details of that meeting in non-editable form . He can use edit/delete buttons to edit or delete the meeting.

##### 7. Innovations
Some innovations to make the site more useful - being explained as following.

   - In meeting details view - invitees button is given . Admin can view invitees/non-invitees of this meeting.
   - He can include/exclude any user in a meeting as per his requirement.
   - A meeting list menu item has been created in navigation bar. Where in all upcoming/previous meetings are given in one page.

##BACKEND:
#### Features
1. Route Authorisation - Checked by Middleware for presence and validity.
2. Routing is handled within user and meeting modules.
3. Controllers to handle core functionality. 
4. Following DB Models have been created : 
	- 	user - To Store User Details
	- 	meeting - To store Meeting Details
	-	auth - To Store Auth Token Details
	-	invitation - To Store Invitation Details
	-	otp - To Store OTP Details
5. Generic functionalities/utility methods have been built using libraries eg:
	-	checkLib - to validate string value
	- 	emailLib - to send email messages
	- 	generatePasswordLib - to generate/match hash password 
	- 	loggerLib - to log error/info
	- 	reponseLib - to design reponse object of apiresponse
	- 	redisLib - to detail redis functions
	- 	socketLib - to set up socket connection , to listen/emit socket events.
	- 	tokenLib - to generate/match auth token
	- 	validationLib - to validate inputs like email , password
6. Configuration Details are contained in appConfig file


##Assumptions:
	Admin/Normal user have different privileges with respect to meeting creation and management
	
## Technical Specifications:
	Technologies used are as following-
	Frontend : HTML, CSS, Jquery, Javascript, Bootstrap
	Bakcend : Nodejs,ExpressJS, Socket.IO 
	Databases: MongoDB, Redis

## Installation:

    	Complete code of this api has been uploaded to my github page and address is :
 
		https://github.com/rameshkmunjal/MeetingScheduler
		
		Website Address: meet.bestbuddy.io
	
## Contributors:

    1. Ramesh Kumar Munjal
