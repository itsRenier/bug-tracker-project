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
function renderDashboard(filterStatus = 'all') {

    // Get a reference to the div that will hold all the cards.
    const container = document.getElementById('issuesContainer');

    // Load every issue from localStorage into a JavaScript array.
    const allIssues = getData(DB_ISSUES);

    // Clear the container so we start fresh every time.
    // (This removes the "Loading issues..." placeholder text,
    //  and also clears old cards when the filter changes.)
    container.innerHTML = '';

    // --- FILTER THE ISSUES ---
    // If the user wants all issues, use the full array.
    // Otherwise, use .filter() to keep only matching issues.
    // .filter() loops through the array and returns a NEW array
    // containing only items where the condition returns true.
    let issuesToDisplay;

    if (filterStatus === 'all') {
        issuesToDisplay = allIssues;
    } else {
        issuesToDisplay = allIssues.filter(function (issue) {
            return issue.status === filterStatus;
        });
    }

    // --- HANDLE EMPTY RESULTS ---
    // If there are no issues to show, display a friendly message.
    // 'return' exits the function early — there is nothing more to do.
    if (issuesToDisplay.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center text-muted py-5">
                <p>No issues found for this filter.</p>
            </div>`;
        return;
    }

    // --- BUILD A CARD FOR EACH ISSUE ---
    // .forEach() runs the function once for every item in the array.
    // 'issue' refers to the current item in each loop iteration.
    issuesToDisplay.forEach(function (issue) {

        // Capitalise the first letter for display.
        // e.g. 'open' → 'Open',  'high' → 'High'
        // .charAt(0).toUpperCase() gets the first letter and uppercases it.
        // .slice(1) gets everything from the second character onwards.
        const displayStatus   = issue.status.charAt(0).toUpperCase()   + issue.status.slice(1);
        const displayPriority = issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1);

        // Build the HTML for one Bootstrap card.
        // We use a TEMPLATE LITERAL (backtick string) so we can
        // write multi-line HTML and insert JavaScript values with ${...}.
        const cardHTML = `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card issue-card status-${issue.status} h-100 shadow-sm">

                    <div class="card-body pb-2">

                        <!-- Top row: coloured priority badge + target date -->
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="badge badge-priority-${issue.priority} px-2 py-1">
                                ${displayPriority} Priority
                            </span>
                            <small class="text-muted fw-bold">${issue.targetDate}</small>
                        </div>

                        <!-- Issue title -->
                        <h5 class="card-title fw-bold text-dark mb-2">${issue.summary}</h5>

                        <!-- Short description (truncated if too long) -->
                        <p class="card-text text-secondary small text-truncate mb-3"
                           style="max-height: 40px;">
                            ${issue.description}
                        </p>

                        <!-- Info box showing assignee and status -->
                        <div class="bg-light rounded p-2 mb-2 border">
                            <div class="d-flex justify-content-between small mb-1">
                                <span class="text-muted">Assignee:</span>
                                <span class="fw-semibold">${issue.assignee}</span>
                            </div>
                            <div class="d-flex justify-content-between small">
                                <span class="text-muted">Status:</span>
                                <!-- getStatusColor() returns a Bootstrap colour class name -->
                                <span class="fw-semibold text-${getStatusColor(issue.status)}">
                                    ${displayStatus}
                                </span>
                            </div>
                        </div>

                    </div>

                    <!-- Card footer: link to the full detail page.
                         We pass the issue's unique ID in the URL (?id=...)
                         so the detail page knows which issue to load. -->
                    <div class="card-footer bg-white border-top-0 pt-0 pb-3">
                        <a href="pages/issue-detail.html?id=${issue.id}"
                           class="btn btn-sm btn-outline-secondary w-100 fw-bold">
                            View Details
                        </a>
                    </div>

                </div>
            </div>
        `;

        // Append this card's HTML to the container div.
        // += means "add to what's already there" so cards stack up.
        container.innerHTML += cardHTML;
    });
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
function seedDummyData() {

    const existingIssues = getData(DB_ISSUES);

    // Exit immediately if issues already exist — do not overwrite.
    if (existingIssues.length > 0) {
        return;
    }

    const dummyIssues = [
        {
            id: generateId(),
            summary: 'Login button unresponsive on mobile Safari',
            description: 'When users try to tap the login button on iOS 15, nothing happens. No console errors are thrown.',
            status: 'open',
            priority: 'high',
            assignee: 'Sarah Jenkins',
            targetDate: '2026-04-18',
            project: 'Mobile App'
        },
        {
            id: generateId(),
            summary: 'Database timeout during heavy load',
            description: 'The reporting queries are timing out when more than 50 users generate PDF reports simultaneously.',
            status: 'overdue',
            priority: 'high',
            assignee: 'Michael Chang',
            targetDate: '2026-04-10',
            project: 'Backend API'
        },
        {
            id: generateId(),
            summary: 'Typo in welcome email template',
            description: 'The word "receive" is spelled as "recieve" in the automated welcome email sent to new signups.',
            status: 'resolved',
            priority: 'low',
            assignee: 'Emma Watson',
            targetDate: '2026-04-12',
            project: 'Marketing Site'
        },
        {
            id: generateId(),
            summary: 'Profile picture upload fails for PNGs > 5MB',
            description: 'The system rejects PNG files larger than 5MB but the UI says the limit is 10MB.',
            status: 'open',
            priority: 'medium',
            assignee: 'David Osei',
            targetDate: '2026-04-20',
            project: 'Web Dashboard'
        },
        {
            id: generateId(),
            summary: 'Dark mode toggle resets on page refresh',
            description: 'User preference for dark mode is not being saved to localStorage, causing it to revert to light mode on refresh.',
            status: 'open',
            priority: 'medium',
            assignee: 'Sarah Jenkins',
            targetDate: '2026-04-19',
            project: 'Web Dashboard'
        },
        {
            id: generateId(),
            summary: 'Payment gateway API keys exposed in logs',
            description: 'CRITICAL: Stripe API test keys are being printed to the console log during checkout.',
            status: 'resolved',
            priority: 'high',
            assignee: 'Michael Chang',
            targetDate: '2026-04-14',
            project: 'Backend API'
        },
        {
            id: generateId(),
            summary: 'Footer links overlap on small screens',
            description: 'The Terms of Service and Privacy Policy links overlap each other when viewport width is below 320px.',
            status: 'overdue',
            priority: 'low',
            assignee: 'Emma Watson',
            targetDate: '2026-04-11',
            project: 'Marketing Site'
        },
        {
            id: generateId(),
            summary: 'Export to CSV returns empty file',
            description: 'Clicking the export button downloads a CSV file, but it contains only headers and no data rows.',
            status: 'open',
            priority: 'medium',
            assignee: 'David Osei',
            targetDate: '2026-04-22',
            project: 'Web Dashboard'
        },
        {
            id: generateId(),
            summary: 'Push notifications not delivering to Android',
            description: 'FCM tokens are failing validation on the backend resulting in failed delivery to Android clients.',
            status: 'open',
            priority: 'high',
            assignee: 'Michael Chang',
            targetDate: '2026-04-17',
            project: 'Mobile App'
        },
        {
            id: generateId(),
            summary: 'Missing padding on pricing cards',
            description: 'The new pricing tier cards are lacking internal padding, making text touch the borders.',
            status: 'resolved',
            priority: 'low',
            assignee: 'Emma Watson',
            targetDate: '2026-04-15',
            project: 'Marketing Site'
        }
    ];

    saveData(DB_ISSUES, dummyIssues);
    console.log('Seeded 10 dummy issues for testing.');
}