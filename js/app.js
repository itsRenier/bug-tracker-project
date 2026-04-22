// =============================================================
// app.js — Main Logic & Shared Database
// =============================================================

const DB_ISSUES   = 'bugTracker_issues';
const DB_PEOPLE   = 'bugTracker_people';
const DB_PROJECTS = 'bugTracker_projects';

function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function getStatusColor(status) {
    if (status === 'open')     return 'primary';
    if (status === 'resolved') return 'success';
    if (status === 'overdue')  return 'danger';
    return 'secondary';
}

function requireAuth() {
    if (localStorage.getItem('bt_auth') !== 'true') {
        window.location.href = (window.location.pathname.includes('/pages/') ? '../' : '') + 'login.html';
    }
}

function initDB() {
    if (!localStorage.getItem(DB_ISSUES))   saveData(DB_ISSUES, []);
    if (!localStorage.getItem(DB_PEOPLE))   saveData(DB_PEOPLE, []);
    if (!localStorage.getItem(DB_PROJECTS)) saveData(DB_PROJECTS, []);
}

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

function renderDashboard(filterStatus = 'all') {
    // Looks for 'issue-list' matching our index.html exactly
    const container = document.getElementById('issue-list');
    const issues = getData(DB_ISSUES);
    const people = getData(DB_PEOPLE);

    const list = filterStatus === 'all' ? issues : issues.filter(i => i.status === filterStatus);

    if (list.length === 0) {
        container.innerHTML = '<div class="col-12 text-center text-muted py-5"><p>No issues found.</p></div>';
        return;
    }

    let html = '';

    list.forEach(function (issue) {
        const person = people.find(p => p.id === issue.assignedTo);
        const assignee = person ? person.name + ' ' + person.surname : 'Unassigned';
        const statusLabel = issue.status.charAt(0).toUpperCase() + issue.status.slice(1);
        const priorityLabel = issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1);

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

    container.innerHTML = html;
}

function setupFilter() {
    // Looks for 'filter-status' matching our index.html exactly
    const filter = document.getElementById('filter-status');
    if (filter) {
        filter.addEventListener('change', function (e) {
            renderDashboard(e.target.value);
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    requireAuth();
    initDB();

    // Runs dashboard code ONLY if the 'issue-list' ID is found on the page
    if (document.getElementById('issue-list')) {
        seedData();
        renderDashboard();
        setupFilter();
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            localStorage.removeItem('bt_auth');
            window.location.href = (window.location.pathname.includes('/pages/') ? '../' : '') + 'login.html';
        });
    }
});