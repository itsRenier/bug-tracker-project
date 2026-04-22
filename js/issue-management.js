// Populating the dropdown
function fillSelect(selectId, items, valueKey, textKey) {
    const select = document.getElementById(selectId);
    if (!select) return;

    // Resets dropdown with default option
    select.innerHTML = '<option value="">Select</option>';

    // Loops through items (people/projects)
    items.forEach(function (item) {
        const option = document.createElement('option');

        // Set option value (which is the ID)
        option.value = item[valueKey];

        //Display full name if surname exists, otherwise just their name 
        option.textContent = item.surname ? item[textKey] + ' ' + item.surname : item[textKey];
        
        //Add option to dropdown
        select.appendChild(option);
    });
}


// Saves or updates issue 
function saveIssue(data, isEdit) {

    //Gets all issues from LocalStorage
    let issues = getData(DB_ISSUES);
    if (isEdit) {

        //Find index of existing issue
        const idx = issues.findIndex(i => i.id === data.id);
        if (idx !== -1) {

            // Updates existing issue
            issues[idx] = data;
        } else {

            // If not found, adds as new (fallback on)
            issues.push(data);
        }
    } else {
        issues.push(data);
    }

    //Save update issues array back to the localStorage
    saveData(DB_ISSUES, issues);
}

// Load Issue Data into Form(For editing)
function loadIssueIntoForm(issueId) {
    const issue = getData(DB_ISSUES).find(i => i.id === issueId);
    if (!issue) return null;


    // Populates form fields with existing issue data
    document.getElementById('summary').value           = issue.summary;
    document.getElementById('description').value       = issue.description;
    document.getElementById('identifiedBy').value      = issue.identifiedBy;
    document.getElementById('dateIdentified').value    = issue.dateIdentified;
    document.getElementById('project').value           = issue.project;
    document.getElementById('status').value            = issue.status;
    document.getElementById('priority').value          = issue.priority;
    document.getElementById('assignedTo').value        = issue.assignedTo;
    document.getElementById('targetResolution').value  = issue.targetResolution;
    document.getElementById('actualResolution').value  = issue.actualResolution || '';
    document.getElementById('resolutionSummary').value = issue.resolutionSummary || '';

    return issue;
}

// Render Issue Details Page
function renderIssueDetail(issueId) {

    // Get all data from localStorage
    const issues   = getData(DB_ISSUES);
    const people   = getData(DB_PEOPLE);
    const projects = getData(DB_PROJECTS);


    // Find the selected issue
    const issue   = issues.find(i => i.id === issueId);
    
     // If issue does not exist, show error
    if (!issue) {
        document.getElementById('issueDetails').textContent = 'Issue not found.';
        return;
    }

    // Finding related data (reporter, assignee, project)
    const reporter = people.find(p => p.id === issue.identifiedBy);
    const assignee = people.find(p => p.id === issue.assignedTo);
    const project  = projects.find(pr => pr.id === issue.project);

    const reporterHTML = reporter
        ? `${reporter.name} ${reporter.surname} <span class="text-muted small">(@${reporter.username})</span>`
        : 'Unknown';

    const assigneeHTML = assignee
        ? `${assignee.name} ${assignee.surname} <span class="text-muted small">(@${assignee.username})</span>`
        : 'Unassigned';


    // Insert issue details into page using HTML
    document.getElementById('issueDetails').innerHTML = `
        <h4 class="fw-bold">${escapeHTML(issue.summary)}</h4>
        <hr>
        <div class="row">
            <div class="col-md-8">
                <p class="mb-3"><strong>Description</strong><br>${escapeHTML(issue.description)}</p>
                <p class="mb-0"><strong>Resolution Summary</strong><br>
                    ${issue.resolutionSummary ? escapeHTML(issue.resolutionSummary) : '<span class="text-muted">Not resolved yet</span>'}
                </p>
            </div>
            <div class="col-md-4 bg-light p-3 rounded border">
                <p class="mb-2 small"><strong>Status:</strong>
                    <span class="badge bg-${getStatusColor(issue.status)} ms-1">${issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}</span>
                </p>
                <p class="mb-2 small"><strong>Priority:</strong> <span class="text-capitalize">${issue.priority}</span></p>
                <p class="mb-2 small"><strong>Project:</strong> ${project ? escapeHTML(project.name) : 'Unknown'}</p>
                <hr>
                <p class="mb-2 small"><strong>Reported By:</strong><br>${reporterHTML}</p>
                <p class="mb-2 small"><strong>Date Identified:</strong> ${escapeHTML(issue.dateIdentified)}</p>
                <p class="mb-2 small"><strong>Assigned To:</strong><br>${assigneeHTML}</p>
                <p class="mb-0 small"><strong>Target Date:</strong> ${escapeHTML(issue.targetResolution)}</p>
            </div>
        </div>`;

    // Set edit button link with issue ID
    const editBtn = document.getElementById('editBtn');
    if (editBtn) editBtn.href = `create-issue.html?id=${issue.id}`;
}


// Initialize Create/Edit Form
function initForm() {

    // loads people and projects 
    const people   = getData(DB_PEOPLE);
    const projects = getData(DB_PROJECTS);


    // pOPulate the dropdowns
    fillSelect('identifiedBy', people,   'id', 'name');
    fillSelect('assignedTo',   people,   'id', 'name');
    fillSelect('project',      projects, 'id', 'name');


    // Get issue ID from URL (if editing)

    const params  = new URLSearchParams(window.location.search);
    const issueId = params.get('id');

    // If editing, load issue data
    if (issueId) {
        const heading = document.querySelector('h2');
        if (heading) heading.textContent = 'Edit Issue';

        const issue = loadIssueIntoForm(issueId);
        if (!issue) {
            alert('Issue not found.');
            window.location.href = '../index.html';
        }
    }

    // Handle form submission
    const form = document.getElementById('issueForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault(); // Stop page reload
        
        // Validate form inputs
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

         // Collect form data into object
        const data = {
            id: issueId || generateId(), // Use existing ID or create new
            summary:           document.getElementById('summary').value.trim(),
            description:       document.getElementById('description').value.trim(),
            identifiedBy:      document.getElementById('identifiedBy').value,
            dateIdentified:    document.getElementById('dateIdentified').value,
            project:           document.getElementById('project').value,
            status:            document.getElementById('status').value,
            priority:          document.getElementById('priority').value,
            assignedTo:        document.getElementById('assignedTo').value,
            targetResolution:  document.getElementById('targetResolution').value,
            actualResolution:  document.getElementById('actualResolution').value || '',
            resolutionSummary: document.getElementById('resolutionSummary').value.trim() || ''
        };

        // Save issue (create or update)
        saveIssue(data, !!issueId);
        alert('Issue saved successfully!');

         // Redirect to dashboard
        window.location.href = '../index.html';
    });
}


// Initialize Issue Detail Page
function initDetail() {

    // Get issue ID from URL
    const params  = new URLSearchParams(window.location.search);
    const issueId = params.get('id');

    // If no ID, show error
    if (!issueId) {
        document.getElementById('issueDetails').textContent = 'No issue selected.';
        return;
    }

    // Render selected issue
    renderIssueDetail(issueId);
}


//Detect Page & Run Correct Logic
document.addEventListener('DOMContentLoaded', function () {
   
    // If form exists, run form logic
    if (document.getElementById('issueForm'))    initForm();
    
    // If detail container exists, run detail logic
    if (document.getElementById('issueDetails'))  initDetail();
});
