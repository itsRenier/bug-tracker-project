// Database Keys
const DB_ISSUES = 'bugTracker_issues';
const DB_PEOPLE = 'bugTracker_people';
const DB_PROJECTS = 'bugTracker_projects';

// Initialize System on Load
document.addEventListener('DOMContentLoaded', () => {
    initializeDatabase();
    
    // Only run dashboard logic if we are on the index page
    if (document.getElementById('issuesContainer')) {
        seedDummyData(); // Temporary function to populate UI for Member 1
        renderDashboard();
        setupFilters();
    }
});

/**
 * Initializes localStorage arrays if they don't exist
 */
function initializeDatabase() {
    if (!localStorage.getItem(DB_ISSUES)) {
        localStorage.setItem(DB_ISSUES, JSON.stringify([]));
    }
    if (!localStorage.getItem(DB_PEOPLE)) {
        localStorage.setItem(DB_PEOPLE, JSON.stringify([]));
    }
    if (!localStorage.getItem(DB_PROJECTS)) {
        localStorage.setItem(DB_PROJECTS, JSON.stringify([]));
    }
}

// ==========================================
// DASHBOARD UI LOGIC (Member 1)
// ==========================================

/**
 * Reads issues from localStorage and renders them as Bootstrap cards
 */
function renderDashboard(filterStatus = 'all') {
    const container = document.getElementById('issuesContainer');
    const issues = getData(DB_ISSUES);
    
    container.innerHTML = ''; // Clear loading text

    // Filter issues based on dropdown selection
    const filteredIssues = filterStatus === 'all' 
        ? issues 
        : issues.filter(issue => issue.status === filterStatus);

    if (filteredIssues.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center text-muted py-5">
                <p>No issues found for this view.</p>
            </div>`;
        return;
    }

    // Generate HTML for each issue card
    filteredIssues.forEach(issue => {
        // Capitalize first letter of status and priority for UI
        const displayStatus = issue.status.charAt(0).toUpperCase() + issue.status.slice(1);
        const displayPriority = issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1);
        
        const cardHTML = `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card issue-card status-${issue.status} h-100 shadow-sm">
                    <div class="card-body pb-2">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="badge badge-priority-${issue.priority} px-2 py-1">${displayPriority} Priority</span>
                            <small class="text-muted fw-bold">${issue.targetDate}</small>
                        </div>
                        <h5 class="card-title fw-bold text-dark mb-2">${issue.summary}</h5>
                        <p class="card-text text-secondary small text-truncate mb-3" style="max-height: 40px;">${issue.description}</p>
                        
                        <div class="bg-light rounded p-2 mb-2 border">
                            <div class="d-flex justify-content-between small mb-1">
                                <span class="text-muted">Assignee:</span>
                                <span class="fw-semibold">${issue.assignee}</span>
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
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}

/**
 * Wires up the dropdown filter to trigger re-rendering
 */
function setupFilters() {
    const filterSelect = document.getElementById('statusFilter');
    filterSelect.addEventListener('change', (e) => {
        renderDashboard(e.target.value);
    });
}

/**
 * Helper to map status to Bootstrap text colors
 */
function getStatusColor(status) {
    if (status === 'open') return 'primary';
    if (status === 'resolved') return 'success';
    if (status === 'overdue') return 'danger';
    return 'secondary';
}

// ==========================================
// UTILITY & SEED DATA 
// ==========================================

function getData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, dataArray) {
    localStorage.setItem(key, JSON.stringify(dataArray));
}

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Temporary function to inject 10+ varied test issues.
 * Member 3 will eventually replace this with the real Create forms.
 */
function seedDummyData() {
    const existingIssues = getData(DB_ISSUES);
    if (existingIssues.length > 0) return; // Don't overwrite if data exists

    const dummyIssues = [
        { id: generateId(), summary: 'Login button unresponsive on mobile Safari', description: 'When users try to tap the login button on iOS 15, nothing happens. No console errors are thrown.', status: 'open', priority: 'high', assignee: 'Sarah Jenkins', targetDate: '2026-04-18', project: 'Mobile App' },
        { id: generateId(), summary: 'Database timeout during heavy load', description: 'The reporting queries are timing out when more than 50 users generate PDF reports simultaneously.', status: 'overdue', priority: 'high', assignee: 'Michael Chang', targetDate: '2026-04-10', project: 'Backend API' },
        { id: generateId(), summary: 'Typo in welcome email template', description: 'The word "receive" is spelled as "recieve" in the automated welcome email sent to new signups.', status: 'resolved', priority: 'low', assignee: 'Emma Watson', targetDate: '2026-04-12', project: 'Marketing Site' },
        { id: generateId(), summary: 'Profile picture upload fails for PNGs > 5MB', description: 'The system rejects PNG files larger than 5MB but the UI says the limit is 10MB.', status: 'open', priority: 'medium', assignee: 'David Osei', targetDate: '2026-04-20', project: 'Web Dashboard' },
        { id: generateId(), summary: 'Dark mode toggle resets on page refresh', description: 'User preference for dark mode is not being saved to localStorage, causing it to revert to light mode on refresh.', status: 'open', priority: 'medium', assignee: 'Sarah Jenkins', targetDate: '2026-04-19', project: 'Web Dashboard' },
        { id: generateId(), summary: 'Payment gateway API keys exposed in logs', description: 'CRITICAL: Stripe API test keys are being printed to the console log during checkout.', status: 'resolved', priority: 'high', assignee: 'Michael Chang', targetDate: '2026-04-14', project: 'Backend API' },
        { id: generateId(), summary: 'Footer links overlap on small screens', description: 'The Terms of Service and Privacy Policy links overlap each other when viewport width is below 320px.', status: 'overdue', priority: 'low', assignee: 'Emma Watson', targetDate: '2026-04-11', project: 'Marketing Site' },
        { id: generateId(), summary: 'Export to CSV returns empty file', description: 'Clicking the export button downloads a CSV file, but it contains only headers and no data rows.', status: 'open', priority: 'medium', assignee: 'David Osei', targetDate: '2026-04-22', project: 'Web Dashboard' },
        { id: generateId(), summary: 'Push notifications not delivering to Android', description: 'FCM tokens are failing validation on the backend resulting in failed delivery to Android clients.', status: 'open', priority: 'high', assignee: 'Michael Chang', targetDate: '2026-04-17', project: 'Mobile App' },
        { id: generateId(), summary: 'Missing padding on pricing cards', description: 'The new pricing tier cards are lacking internal padding, making text touch the borders.', status: 'resolved', priority: 'low', assignee: 'Emma Watson', targetDate: '2026-04-15', project: 'Marketing Site' }
    ];

    saveData(DB_ISSUES, dummyIssues);
    console.log("Seeded 10 dummy issues for testing.");
}