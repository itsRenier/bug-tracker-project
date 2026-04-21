<pre>
#WPR281 Group: FPretoriaPM - Bug Tracking System Project

This project aims to create a website that can be used to log issues that typically occur in assignments, track their status, 
priority level and progress, and allow their details to be edited. It will also allow for member management for projects with 
multiple members as well as project management, for multiple projects.


##Features:
• Issue Management
  o	Create new issues with 11 required fields
  o	Edit/update existing issues
  o	View all issues in a dashboard
  o	View single issue details
• People Management
  o	Add and manage people (ID, name, surname, email, username)
  o	People can be assigned to issues
• Project Management
  o	Add and manage projects (ID, name, description)
  o	Issues are linked to projects
• Dashboard
  o	Filter issues by status (open, resolved, overdue) 
  o	Priority badges and status borders for quick visual cues
• Data Persistence
  o	All entities (issues, people, projects) stored in localStorag
  o	Data persists across browser refresh
• Responsive Design
  o	Built with Bootstrap 5 for mobile, tablet, and desktop compatibility


##File Structure
/login.html: Login page
/index.html: Dashboard
/pages/create-issue.html: Issue creation and editing
/pages/issue-detail.html: Issue detail view
/pages/people-management.html: Manage people
/pages/project-management.html: Manage projects
/css/styles.css: Custom styles
/js/app.js: Shared utilities + dashboard logic
/js/data-management.js: People and project management
/js/issue-management.js: Issue creation, editing, and detail rendering


##Architecture
• HTML pages provide UI.
• CSS (Bootstrap + custom styles) provides layout and visual cues.
• JavaScript modules handle logic and persistence.
• localStorage stores issues, people, and projects.


##Data Schema:
• Issue: {id, summary, description, identifiedBy, dateIdentified, project, status, priority, assignedTo, targetResolution, 
  actualResolution, resolutionSummary}
• Person: {id, name, surname, email, username
• Project: {id, name, description}


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

Use case:
• Login-
The first page will be the login page where the user will have to enter the right username and password.

• View Dashboard-
All issues appear in the dashboard with status and priority badges. A filter can also be applied here to only show certain statuses 
(Open, Resolved, Overdue). 
From here either one of 3 options can commence:

1) Create Issue-
   The user is taken to the “Create New Issue” screen where the user can:
      a. Return to the dashboard
      b. Enter Issue Details-
         Enter all the required information for the issue (summary, description, identifiedBy, dateIdentified, project, status, 
	     priority, assignedTo, targetResolution, actualResolution, resolutionSummary).

2) View Issue Details-
   Displays all the information for a certain issue. The user can then either:
      a. Return to the dashboard
      b. Edit/Update Details-
         Issues can be modified and any of the information can be updated.

3) View People/Projects-
   There is a list of all the people that are working on a project, as well as a list of all the projects that can be viewed under 
   the People and Projects tabs respectively. When the user is either on the Person or Projects tabs, they can:
      a. Return to the dashboard
      b. Add New Entries-
         Enter all the required information for a new person (name, surname, email, username). Or enter all the required information 
	     for a new project (name, description).

• When either one of the 3 options is complete, or backed out from, the user will be back on the Dashboard.


##Requirements and Installation
The only requirements are a stable internet connection and a computing device with a web browser. The system is a fully online 
website that can be used across all devices. Therefore, there is also no installation required.


##Project Team Acknowledgement
Aden Gouws 604061
Gontlafetse Maseng 604485
Lourens Jonck 603246
Renier van Rooyen 604214
</pre>
