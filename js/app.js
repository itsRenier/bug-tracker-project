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
    if (getData(DB_PEOPLE).length === 0) {
        saveData(DB_PEOPLE, [
            { id: 'p1', name: 'Alice', surname: 'Brown',  email: 'alice@mail.com', username: 'alice' },
            { id: 'p2', name: 'Bob',   surname: 'Smith',  email: 'bob@mail.com',   username: 'bob'   }
        ]);
    }

    if (getData(DB_PROJECTS).length === 0) {
        saveData(DB_PROJECTS, [
            { id: 'pr1', name: 'Website Redesign',   description: 'Overhaul of the main corporate site' },
            { id: 'pr2', name: 'Bug Tracker System', description: 'Internal tool for the engineering team' }
        ]);
    }

    if (getData(DB_ISSUES).length === 0) {
        saveData(DB_ISSUES, [{
            id: generateId(),
            summary: 'Login button unresponsive',
            description: 'No console errors are thrown when clicking the main login button.',
            status: 'open',
            priority: 'high',
            identifiedBy: 'p1',
            assignedTo: 'p2',
            dateIdentified: '2026-04-01',
            targetResolution: '2026-04-18',
            project: 'pr1'
        }]);
    }
}

function renderDashboard(filterStatus = 'all') {
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
