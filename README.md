#WPR281 Group: FPretoriaPM - Bug Tracking System Project <br>
<br>
This project aims to create a website that can be used to log issues that typically occur in assignments, track their status, priority level and progress, and allow their details to be edited. It will also allow for member management for projects with multiple members as well as project management, for multiple projects. <br>
<br>
<br>
##Features: <br>
• Issue Management <br>
  o	Create new issues with 11 required fields <br>
  o	Edit/update existing issues <br>
  o	View all issues in a dashboard <br>
  o	View single issue details <br>
• People Management <br>
  o	Add and manage people (ID, name, surname, email, username) <br>
  o	People can be assigned to issues <br>
• Project Management <br>
  o	Add and manage projects (ID, name, description) <br>
  o	Issues are linked to projects <br>
• Dashboard <br>
  o	Filter issues by status (open, resolved, overdue) <br>
  o	Priority badges and status borders for quick visual cues <br>
• Data Persistence <br>
  o	All entities (issues, people, projects) stored in localStorage <br>
  o	Data persists across browser refresh <br>
• Responsive Design <br>
  o	Built with Bootstrap 5 for mobile, tablet, and desktop compatibility <br>
<br>
<br>
##File Structure <br>
/login.html: Login page <br>
/index.html: Dashboard <br>
/pages/create-issue.html: Issue creation and editing <br>
/pages/issue-detail.html: Issue detail view <br>
/pages/people-management.html: Manage people <br>
/pages/project-management.html: Manage projects <br>
/css/styles.css: Custom styles <br>
/js/app.js: Shared utilities + dashboard logic <br>
/js/data-management.js: People and project management <br>
/js/issue-management.js: Issue creation, editing, and detail rendering <br>
<br>
<br>
##Architecture <br>
•	HTML pages provide UI. <br>
•	CSS (Bootstrap + custom styles) provides layout and visual cues. <br>
•	JavaScript modules handle logic and persistence. <br>
•	localStorage stores issues, people, and projects. <br>
<br>
<br>
##Data Schema: <br>
•	Issue: {id, summary, description, identifiedBy, dateIdentified, project, status, priority, assignedTo, targetResolution, actualResolution, resolutionSummary} <br>
•	Person: {id, name, surname, email, username} <br>
•	Project: {id, name, description} <br>
<br>
<br>
##Use Case
                            +------------------+
                            |       Login      |
                            +------------------+
	                                	 |
                                		 v
                            +------------------+
                            |  View Dashboard  |
                            +------------------+
          |--------------------------|-------------------------|
          v                          v                         v
+------------------+        +------------------+     +--------------------+
|   Create Issue   |        |View Issue Details|     |View People/Projects|
+------------------+        +------------------+     +--------------------+
        |                           |                       |
        v                           v                           v
+------------------+       +--------------------+       +-----------------+
|Enter Issue Detail|       | Edit/Update Details|       | Add New Entries | 
+------------------+       +--------------------+       +-----------------+

Use case: <br>
 <br>
•	Login- <br>
The first page will be the login page where the user will have to enter the right username and password. <br>
 <br>
•	View Dashboard-  <br>
All issues appear in the dashboard with status and priority badges. A filter can also be applied here to only show certain statuses (Open, Resolved, Overdue). 
From here either one of 3 options can commence: <br>
<br>
1)	Create Issue-  <br>
    The user is taken to the “Create New Issue” screen where the user can: <br>
      a.	Return to the dashboard  <br>
      b.	Enter Issue Details-  <br>
          Enter all the required information for the issue (summary, description, identifiedBy, dateIdentified, project, status, priority, assignedTo, targetResolution, actualResolution, resolutionSummary). <br>
 <br>
2)	View Issue Details-  <br>
    Displays all the information for a certain issue. The user can then either: <br>
      a.	Return to the dashboard <br>
      b.	Edit/Update Details-  <br>
          Issues can be modified and any of the information can be updated. <br>
 <br>
3)	View People/Projects-  <br>
    There is a list of all the people that are working on a project, as well as a list of all the projects that can be viewed under the People and Projects tabs respectively. When the user is either on the Person or           Projects tabs, they can: <br>
      a.	Return to the dashboard  <br>
      b.	Add New Entries-  <br>
          Enter all the required information for a new person (name, surname, email, username). Or enter all the required information for a new project (name, description). <br>
 <br>
•	When either one of the 3 options is complete, or backed out from, the user will be back on the Dashboard. <br>
 <br>
 <br>
##Requirements and Installation <br>
The only requirements are a stable internet connection and a computing device with a web browser. The system is a fully online website that can be used across all devices. Therefore, there is also no installation required. <br>
 <br>
 <br>
##Project Team Acknowledgement<br>
Aden Gouws 604061 <br>
Gontlafetse Maseng 604485 <br>
Lourens Jonck 603246 <br>
Renier van Rooyen 604214
