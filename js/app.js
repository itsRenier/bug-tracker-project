// =============================================================
// app.js — Main JavaScript for BugTracker (Member 1: Dashboard)
// =============================================================
// This file powers the dashboard (index.html).
// It is also the SHARED UTILITY FILE for the whole project —
// the getData(), saveData(), and generateId() functions at the
// bottom are used by every other page (create, detail, edit, etc.)
//
// What this file does:
//   1. Sets up localStorage when the app first runs
//   2. Fills storage with 10 test issues (only on first run)
//   3. Reads issues and displays them as Bootstrap cards
//   4. Makes the status filter dropdown work
// =============================================================


// --- STORAGE KEY CONSTANTS ---
// localStorage is a key-value store (like a dictionary).
// We name our three lists here as constants so we never
// accidentally mistype a key name somewhere else in the project.
const DB_ISSUES   = 'bugTracker_issues';
const DB_PEOPLE   = 'bugTracker_people';
const DB_PROJECTS = 'bugTracker_projects';


// =============================================================
// ENTRY POINT — Runs once the browser has fully loaded the page
// =============================================================
// 'DOMContentLoaded' fires after the browser has parsed all HTML.
// We need this because our JavaScript tries to find HTML elements
// (like the #issuesContainer div). If the script ran immediately,
// those elements might not exist yet and the code would crash.
document.addEventListener('DOMContentLoaded', function () {

    // Always initialise storage, no matter which page we are on.
    initializeDatabase();

    // Only run the dashboard logic if we are on the main page.
    // Other pages (create-issue.html, people-management.html, etc.)
    // do NOT have #issuesContainer, so this check prevents errors
    // when app.js is loaded on those pages too.
    if (document.getElementById('issuesContainer')) {
        seedDummyData();   // Populate storage with test data (first run only)
        renderDashboard(); // Draw all issue cards on screen
        setupFilters();    // Connect the filter dropdown to the card display
    }
});


// =============================================================
// STEP 1: INITIALISE localStorage
// =============================================================
// localStorage only stores text strings. We store arrays as
// JSON text: JSON.stringify() converts array → text for saving,
// JSON.parse() converts text → array when reading.
//
// This function creates empty arrays for each data type if
// they don't exist yet (i.e., the very first time the app opens).
function initializeDatabase() {

    // If no issues list exists, create an empty one.
    if (!localStorage.getItem(DB_ISSUES)) {
        localStorage.setItem(DB_ISSUES, JSON.stringify([]));
    }

    // If no people list exists, create an empty one.
    if (!localStorage.getItem(DB_PEOPLE)) {
        localStorage.setItem(DB_PEOPLE, JSON.stringify([]));
    }

    // If no projects list exists, create an empty one.
    if (!localStorage.getItem(DB_PROJECTS)) {
        localStorage.setItem(DB_PROJECTS, JSON.stringify([]));
    }
}


// =============================================================
// STEP 2: DISPLAY ISSUES — The main dashboard function
// =============================================================
// renderDashboard(filterStatus)
//   Reads all issues from localStorage, optionally filters them,
//   then builds a Bootstrap card for each one and injects it
//   into the #issuesContainer div in index.html.
//
// Parameter:
//   filterStatus — the status to filter by ('open', 'resolved',
//                  'overdue'). Defaults to 'all' (show everything)
//                  if no argument is passed in.
// =============================================================
// REPLACEMENT FOR renderDashboard() in app.js
// =============================================================
function renderDashboard(filterStatus = 'all') {
    const container = document.getElementById('issuesContainer');
    const allIssues = getData(DB_ISSUES);
    const people = getData(DB_PEOPLE); // Fetch people to map IDs to Names
    
    container.innerHTML = '';

    let issuesToDisplay = filterStatus === 'all' ? allIssues : allIssues.filter(issue => issue.status === filterStatus);

    if (issuesToDisplay.length === 0) {
        container.innerHTML = `<div class="col-12 text-center text-muted py-5"><p>No issues found for this filter.</p></div>`;
        return;
    }

    // FIX: Create a string to hold all HTML instead of updating the DOM inside the loop
    let htmlContent = ''; 

    issuesToDisplay.forEach(function (issue) {
        const displayStatus = issue.status.charAt(0).toUpperCase() + issue.status.slice(1);
        const displayPriority = issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1);
        
        // FIX: Data Model Consistency - map the assignedTo ID to the actual person's name
        const personAssigned = people.find(p => p.id === issue.assignedTo);
        const assigneeName = personAssigned ? `${personAssigned.name} ${personAssigned.surname}` : 'Unassigned';
        
        // FIX: Use escapeHTML to prevent XSS vulnerabilities
        htmlContent += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card issue-card status-${issue.status} h-100 shadow-sm">
                    <div class="card-body pb-2">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="badge badge-priority-${issue.priority} px-2 py-1">${displayPriority} Priority</span>
                            <small class="text-muted fw-bold">${escapeHTML(issue.targetResolution || 'No date')}</small>
                        </div>
                        <h5 class="card-title fw-bold text-dark mb-2">${escapeHTML(issue.summary)}</h5>
                        <p class="card-text text-secondary small text-truncate mb-3" style="max-height: 40px;">${escapeHTML(issue.description)}</p>
                        <div class="bg-light rounded p-2 mb-2 border">
                            <div class="d-flex justify-content-between small mb-1">
                                <span class="text-muted">Assignee:</span>
                                <span class="fw-semibold">${escapeHTML(assigneeName)}</span>
                            </div>
                            <div class="d-flex justify-content-between small">
                                <span class="text-muted">Status:</span>
                                <span class="fw-semibold text-${getStatusColor(issue.status)}">${displayStatus}</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-white border-top-0 pt-0 pb-3">
                        <a href="pages/issue-detail.html?id=${issue.id}" class="btn btn-sm btn-outline-secondary w-100 fw-bold">View Details</a>
                    </div>
                </div>
            </div>`;
    });
    
    // Inject all the HTML at once (Massive performance boost)
    container.innerHTML = htmlContent;
}

// =============================================================
// ADD THIS SECURITY HELPER ANYWHERE IN app.js
// =============================================================
function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =============================================================
// STEP 3: CONNECT THE FILTER DROPDOWN
// =============================================================
// setupFilters()
//   Attaches an event listener to the status dropdown in index.html.
//   Whenever the user picks a new option, it calls renderDashboard()
//   again with the new value, refreshing the displayed cards.
function setupFilters() {
    const filterDropdown = document.getElementById('statusFilter');

    // 'change' fires whenever the selected option changes.
    filterDropdown.addEventListener('change', function (event) {
        // event.target = the dropdown element that was interacted with.
        // event.target.value = the value of the currently selected option
        //   (matches the 'value' attributes in the <select> in index.html).
        renderDashboard(event.target.value);
    });
}


// =============================================================
// HELPER: MAP STATUS TO A BOOTSTRAP COLOUR CLASS NAME
// =============================================================
// getStatusColor(status)
//   Returns the Bootstrap text-colour class suffix for a given status.
//   This string is inserted into the card HTML as 'text-primary' etc.
//
//   Bootstrap colour classes used:
//     text-primary   = blue
//     text-success   = green
//     text-danger    = red
//     text-secondary = grey
function getStatusColor(status) {
    if (status === 'open')     return 'primary';  // blue
    if (status === 'resolved') return 'success';  // green
    if (status === 'overdue')  return 'danger';   // red
    return 'secondary';                           // grey (safe fallback)
}


// =============================================================
// SHARED UTILITY FUNCTIONS — Used by ALL pages in the project
// =============================================================
// Members 2 and 3: use these functions on your pages too!
//   • getData()    — to read issues/people/projects from storage
//   • saveData()   — to write updated data back to storage
//   • generateId() — to create a unique ID for new records


// getData(key)
//   Reads data from localStorage and converts it from a JSON
//   string back into a JavaScript array.
//   The '|| []' is a safety fallback: if the key doesn't exist,
//   getItem() returns null, and we return [] instead of crashing.
function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}


// saveData(key, dataArray)
//   Converts a JavaScript array into a JSON string and writes
//   it to localStorage under the given key name.
function saveData(key, dataArray) {
    localStorage.setItem(key, JSON.stringify(dataArray));
}


// generateId()
//   Creates a short, random unique ID string. Example: '_k7f2m9x3q'
//   Used when creating a new issue, person, or project.
//
//   How it works step by step:
//     Math.random()      → random decimal, e.g. 0.73289...
//     .toString(36)      → converts to base-36 (uses 0-9 and a-z)
//                          result looks like '0.p5f3k9x2q'
//     .substr(2, 9)      → skips '0.' and takes the next 9 characters
//     '_' +              → prefix so the ID never starts with a digit
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}


// =============================================================
// TEMPORARY TEST DATA — Remove once the Create form is built
// =============================================================
// seedDummyData()
//   Adds 10 sample issues to localStorage so the dashboard has
//   real-looking content to display during development.
//
//   Safety: the 'if (existingIssues.length > 0) return;' check
//   means this function does NOTHING if any data already exists.
//   It will never overwrite issues entered through the create form.
//
//   The data covers all three statuses, all three priorities,
//   four different assignees, and four different projects —
//   meeting the project brief's variation requirements.
// =============================================================
// REPLACEMENT FOR seedDummyData() in app.js
// =============================================================
function seedDummyData() {
    const people = getData(DB_PEOPLE);
    const projects = getData(DB_PROJECTS);
    const issues = getData(DB_ISSUES);

    // 1. Seed People
    if (people.length === 0) {
        saveData(DB_PEOPLE, [
            { id: "p1", name: "Alice", surname: "Brown", email: "alice@mail.com", username: "alice" },
            { id: "p2", name: "Bob", surname: "Smith", email: "bob@mail.com", username: "bob" }
        ]);
    }

    // 2. Seed Projects
    if (projects.length === 0) {
        saveData(DB_PROJECTS, [
            { id: "pr1", name: "Website Redesign", description: "Overhaul of the main corporate site" },
            { id: "pr2", name: "Bug Tracker System", description: "Internal tool for software engineering team" }
        ]);
    }

    // 3. Seed Issues (Now using actual foreign key IDs linking to the people/projects above)
    if (issues.length === 0) {
        saveData(DB_ISSUES, [
            { 
                id: generateId(), 
                summary: 'Login button unresponsive', 
                description: 'No console errors are thrown when clicking the main login button.', 
                status: 'open', 
                priority: 'high', 
                identifiedBy: 'p1', // Links to Alice
                assignedTo: 'p2',   // Links to Bob
                targetResolution: '2026-04-18', 
                project: 'pr1'      // Links to Website Redesign
            }
        ]);
    }
}