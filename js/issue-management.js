function fillSelect(selectId, items, valueKey, textKey) {
    const select = document.getElementById(selectId);
    if (!select) return;
    select.innerHTML = '<option value="">Select</option>';
    items.forEach(function (item) {
        const option = document.createElement('option');
        option.value = item[valueKey];
        option.textContent = item.surname ? item[textKey] + ' ' + item.surname : item[textKey];
        select.appendChild(option);
    });
}

function saveIssue(data, isEdit) {
    let issues = getData(DB_ISSUES);
    if (isEdit) {
        const idx = issues.findIndex(i => i.id === data.id);
        if (idx !== -1) {
            issues[idx] = data;
        } else {
            issues.push(data);
        }
    } else {
        issues.push(data);
    }
    saveData(DB_ISSUES, issues);
}

function loadIssueIntoForm(issueId) {
    const issue = getData(DB_ISSUES).find(i => i.id === issueId);
    if (!issue) return null;

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

function renderIssueDetail(issueId) {
    const issues   = getData(DB_ISSUES);
    const people   = getData(DB_PEOPLE);
    const projects = getData(DB_PROJECTS);

    const issue   = issues.find(i => i.id === issueId);
    if (!issue) {
        document.getElementById('issue-detail').textContent = 'Issue not found.';
        return;
    }

    const reporter = people.find(p => p.id === issue.identifiedBy);
    const assignee = people.find(p => p.id === issue.assignedTo);
    const project  = projects.find(pr => pr.id === issue.project);

    const reporterHTML = reporter
        ? `${reporter.name} ${reporter.surname} <span class="text-muted small">(@${reporter.username})</span>`
        : 'Unknown';

    const assigneeHTML = assignee
        ? `${assignee.name} ${assignee.surname} <span class="text-muted small">(@${assignee.username})</span>`
        : 'Unassigned';

    document.getElementById('issue-detail').innerHTML = `
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

    const editBtn = document.getElementById('edit-btn');
    if (editBtn) editBtn.href = `create-issue.html?id=${issue.id}`;
}

function initForm() {
    const people   = getData(DB_PEOPLE);
    const projects = getData(DB_PROJECTS);

    fillSelect('identifiedBy', people,   'id', 'name');
    fillSelect('assignedTo',   people,   'id', 'name');
    fillSelect('project',      projects, 'id', 'name');

    const params  = new URLSearchParams(window.location.search);
    const issueId = params.get('id');

    if (issueId) {
        const heading = document.querySelector('h2');
        if (heading) heading.textContent = 'Edit Issue';

        const issue = loadIssueIntoForm(issueId);
        if (!issue) {
            alert('Issue not found.');
            window.location.href = '../index.html';
        }
    }

    const form = document.getElementById('form-issue');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const data = {
            id: issueId || generateId(),
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

        saveIssue(data, !!issueId);
        alert('Issue saved successfully!');
        window.location.href = '../index.html';
    });
}

function initDetail() {
    const params  = new URLSearchParams(window.location.search);
    const issueId = params.get('id');
    if (!issueId) {
        document.getElementById('issue-detail').textContent = 'No issue selected.';
        return;
    }
    renderIssueDetail(issueId);
}

document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('form-issue'))    initForm();
    if (document.getElementById('issue-detail'))  initDetail();
});
