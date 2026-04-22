// =============================================================
// app.js — Main Logic & Shared Database
// =============================================================

// AVOIDING "MAGIC STRINGS"
// We store our local storage keys as constants. If we ever need to change the database 
// name, we only change it here. It also prevents typos across the rest of our files.
const DB_ISSUES   = 'bugTracker_issues';
const DB_PEOPLE   = 'bugTracker_people';
const DB_PROJECTS = 'bugTracker_projects';

// THE "DRY" PRINCIPLE
// Instead of writing JSON.parse() and localStorage.getItem() dozens of times, 
// we abstracted the database calls into these two helper functions. 
function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Utility function to simulate database primary keys. 
// Generates a random alphanumeric string for new records.
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// SECURITY & XSS PREVENTION
// Since we are injecting user data into the DOM, we pass all text fields through this 
// sanitizer. It converts HTML tags into safe string characters, completely preventing 
// Cross-Site Scripting (XSS) attacks.
function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Maps our database status strings to Bootstrap's native color utility classes.
function getStatusColor(status) {
    if (status === 'open')     return 'primary';
    if (status === 'resolved') return 'success';
    if (status === 'overdue')  return 'danger';
    return 'secondary';
}

// ROUTE PROTECTION
// This function acts as our frontend security gate. If the auth token isn't found 
// in local storage, it immediately redirects the user back to the login screen.
function requireAuth() {
    if (localStorage.getItem('bt_auth') !== 'true') {
        window.location.href = (window.location.pathname.includes('/pages/') ? '../' : '') + 'login.html';
    }
}

// Initializes the empty database arrays if this is the user's first time loading the app.
function initDB() {
    if (!localStorage.getItem(DB_ISSUES))   saveData(DB_ISSUES, []);
    if (!localStorage.getItem(DB_PEOPLE))   saveData(DB_PEOPLE, []);
    if (!localStorage.getItem(DB_PROJECTS)) saveData(DB_PROJECTS, []);
}

// DUMMY DATA SEEDING
// To make the prototype testable, this function injects sample data. We use conditional 
// checks (.length === 0) so we only seed data if the database is currently empty.
function seedData() {
    // 1. Seed 4 People
    if (getData(DB_PEOPLE).length === 0) {
        saveData(DB_PEOPLE, [
            { id: 'p1', name: 'Alice', surname: 'Brown',  email: 'alice@mail.com', username: 'alice' },
            { id: 'p2', name: 'Bob',   surname: 'Smith',  email: 'bob@mail.com',   username: 'bob'   },
            { id: 'p3', name: 'Charlie', surname: 'Davis', email: 'charlie@mail.com', username: 'charlie' },
            { id: 'p4', name: 'Diana', surname: 'Evans', email: 'diana@mail.com', username: 'diana' }
        ]);
    }

    // 2. Seed 4 Projects 
    if (getData(DB_PROJECTS).length === 0) {
        saveData(DB_PROJECTS, [
            { id: 'pr1', name: 'Website Redesign',   description: 'Overhaul of the main corporate site' },
            { id: 'pr2', name: 'Bug Tracker System', description: 'Internal tool for the engineering team' },
            { id: 'pr3', name: 'Ubuntu Community Clinic', description: 'POPIA compliant clinic management system' },
            { id: 'pr4', name: 'Database Migration', description: 'T-SQL query optimization and migration' }
        ]);
    }

    // 3. Seed 10 Issues covering all statuses and priorities
    // Notice how we link data using IDs (like identifiedBy: 'p1'), simulating a relational database.
    if (getData(DB_ISSUES).length === 0) {
        saveData(DB_ISSUES, [
            { id: generateId(), summary: 'Login button unresponsive', description: 'No console errors are thrown when clicking the main login button.', status: 'open', priority: 'high', identifiedBy: 'p1', assignedTo: 'p2', dateIdentified: '2026-04-01', targetResolution: '2026-04-28', project: 'pr1' },
            { id: generateId(), summary: 'Navbar breaks on mobile', description: 'Hamburger menu overlaps with logo on screens under 768px.', status: 'open', priority: 'medium', identifiedBy: 'p3', assignedTo: 'p1', dateIdentified: '2026-04-02', targetResolution: '2026-04-30', project: 'pr1' },
            { id: generateId(), summary: 'Database timeout on load', description: 'Query takes too long when retrieving more than 1000 records.', status: 'overdue', priority: 'high', identifiedBy: 'p4', assignedTo: 'p3', dateIdentified: '2026-04-05', targetResolution: '2026-04-15', project: 'pr4' },
            { id: generateId(), summary: 'Typo in welcome email', description: 'Spelled "Welcome" as "Welcom".', status: 'resolved', priority: 'low', identifiedBy: 'p2', assignedTo: 'p4', dateIdentified: '2026-04-10', targetResolution: '2026-04-20', project: 'pr2' },
            { id: generateId(), summary: 'System request failing', description: 'POPIA compliance checks failing on patient ingestion.', status: 'open', priority: 'high', identifiedBy: 'p1', assignedTo: 'p3', dateIdentified: '2026-04-12', targetResolution: '2026-05-02', project: 'pr3' },
            { id: generateId(), summary: 'Missing padding on footer', description: 'Footer text touches the edge of the screen.', status: 'resolved', priority: 'low', identifiedBy: 'p4', assignedTo: 'p2', dateIdentified: '2026-04-14', targetResolution: '2026-04-18', project: 'pr1' },
            { id: generateId(), summary: 'COMMIT command dropping', description: 'Transactions failing to commit under heavy load.', status: 'overdue', priority: 'high', identifiedBy: 'p2', assignedTo: 'p1', dateIdentified: '2026-04-08', targetResolution: '2026-04-10', project: 'pr4' },
            { id: generateId(), summary: 'Dark mode colors inverted', description: 'Text is unreadable on the settings page when dark mode is toggled.', status: 'open', priority: 'medium', identifiedBy: 'p3', assignedTo: 'p4', dateIdentified: '2026-04-15', targetResolution: '2026-05-05', project: 'pr3' },
            { id: generateId(), summary: 'Session token not clearing', description: 'Logout button does not clear the auth token from local storage.', status: 'resolved', priority: 'high', identifiedBy: 'p1', assignedTo: 'p2', dateIdentified: '2026-04-18', targetResolution: '2026-04-21', project: 'pr2' },
            { id: generateId(), summary: 'Update documentation', description: 'Need to add the new API endpoints to the wiki.', status: 'open', priority: 'low', identifiedBy: 'p4', assignedTo: 'p3', dateIdentified: '2026-04-20', targetResolution: '2026-05-10', project: 'pr2' }
        ]);
    }
}

// DYNAMIC DOM RENDERING
function renderDashboard(filterStatus = 'all') {
    const container = document.getElementById('issue-list');
    const issues = getData(DB_ISSUES);
    const people = getData(DB_PEOPLE);

    // Applies the filter based on the dropdown selection
    const list = filterStatus === 'all' ? issues : issues.filter(i => i.status === filterStatus);

    // GUARD CLAUSES
    // By handling the empty state immediately and returning out of the function, 
    // we keep the main logic flat and avoid massive nested 'if' statements.
    if (list.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-muted py-5"><p>No issues found.</p></div>';
        return;
    }

    let html = '';

    // Loops through the array and constructs the HTML card for each issue.
    list.forEach(function (issue) {
        // Relational lookup: Finding the assigned person's name using their ID
        const person = people.find(p => p.id === issue.assignedTo);
        const assignee = person ? person.name + ' ' + person.surname : 'Unassigned';
        
        // Capitalizes the first letter for the UI labels
        const statusLabel = issue.status.charAt(0).toUpperCase() + issue.status.slice(1);
        const priorityLabel = issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1);

        // TEMPLATE LITERALS
        // Using backticks allows us to write multi-line HTML directly in JS, securely 
        // injecting our data variables using the escapeHTML sanitizer.
        html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card card-issue is-${issue.status} h-100">
                    <div class="card-body pb-2">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="badge priority-${issue.priority}">${priorityLabel} Priority</span>
                            <small class="text-muted fw-semibold">${escapeHTML(issue.targetResolution || 'No date')}</small>
                        </div>
                        <h5 class="fw-bold mb-2" style="font-size:1rem;">${escapeHTML(issue.summary)}</h5>
                        <p class="text-secondary small mb-3" style="overflow:hidden;max-height:40px;">${escapeHTML(issue.description)}</p>
                        <div class="meta-box mb-2">
                            <div class="d-flex justify-content-between small mb-1">
                                <span class="text-muted">Assignee</span>
                                <span class="fw-semibold">${escapeHTML(assignee)}</span>
                            </div>
                            <div class="d-flex justify-content-between small">
                                <span class="text-muted">Status</span>
                                <span class="fw-semibold text-${getStatusColor(issue.status)}">${statusLabel}</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-white border-top-0 pt-0 pb-3">
                        <a href="pages/issue-detail.html?id=${issue.id}" class="btn btn-sm btn-outline-secondary w-100">View Details</a>
                    </div>
                </div>
            </div>`;
    });

    // Pushes the fully constructed string into the DOM in one single operation for performance.
    container.innerHTML = html;
}

// Binds the HTML dropdown menu to our render function
function setupFilter() {
    const filter = document.getElementById('filter-status');
    if (filter) {
        filter.addEventListener('change', function (e) {
            renderDashboard(e.target.value);
        });
    }
}

// EVENT DRIVEN ARCHITECTURE
// DOMContentLoaded ensures our JavaScript only runs after the browser has finished 
// reading the HTML structure, preventing "element not found" errors.
document.addEventListener('DOMContentLoaded', function () {
    requireAuth();
    initDB();

    // Context Check: Only runs the dashboard rendering logic if the user is actually on the dashboard.
    if (document.getElementById('issue-list')) {
        seedData();
        renderDashboard();
        setupFilter();
    }

    // Attaches the logout logic dynamically so it applies to every page cleanly.
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('bt_auth');
            window.location.href = (window.location.pathname.includes('/pages/') ? '../' : '') + 'login.html';
        });
    }
});