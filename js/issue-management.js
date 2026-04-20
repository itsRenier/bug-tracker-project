// =============================================================
// issue-management.js — Member 2 (Create, Edit & Details)
// =============================================================

// Load people and projects for select dropdowns
function populateSelectOptions(selectId, array, valueKey, textKey) {
  const select = document.getElementById(selectId);
  if (!select) return;
  select.innerHTML = '<option value="">Select</option>';
  array.forEach((item) => {
    const option = document.createElement('option');
    option.value = item[valueKey];
    // FIXED: Appends surname if it exists (Issue 7)
    option.textContent = item.surname ? `${item[textKey]} ${item.surname}` : item[textKey];
    select.appendChild(option);
  });
}

// Form validation helper
function validateForm(form) {
  if (!form) return false;
  return form.checkValidity();
}

// Save new or update existing issue
function saveIssue(data, isEdit = false) {
  // FIXED: Replaced custom local storage calls with getData(DB_ISSUES)
  let issues = getData(DB_ISSUES); 
  if (isEdit) {
    const index = issues.findIndex((i) => i.id === data.id);
    if (index !== -1) {
      issues[index] = data;
    } else {
      issues.push(data);
    }
  } else {
    issues.push(data);
  }
  saveData(DB_ISSUES, issues); // FIXED: Used shared saveData function
}

// Load issue data into form for editing
function loadIssueIntoForm(issueId) {
  const issues = getData(DB_ISSUES);
  const issue = issues.find((i) => i.id === issueId);
  if (!issue) return null;

  // Fill out form fields
  document.getElementById('summary').value = issue.summary;
  document.getElementById('description').value = issue.description;
  document.getElementById('identifiedBy').value = issue.identifiedBy;
  document.getElementById('dateIdentified').value = issue.dateIdentified;
  document.getElementById('project').value = issue.project;
  document.getElementById('status').value = issue.status;
  document.getElementById('priority').value = issue.priority;
  document.getElementById('assignedTo').value = issue.assignedTo;
  document.getElementById('targetResolution').value = issue.targetResolution;
  document.getElementById('actualResolution').value = issue.actualResolution || '';
  document.getElementById('resolutionSummary').value = issue.resolutionSummary || '';

  return issue;
}

// Render issue detail page
function renderIssueDetails(issueId) {
  const issues = getData(DB_ISSUES);
  const people = getData(DB_PEOPLE);
  const projects = getData(DB_PROJECTS);

  const issue = issues.find(i => i.id === issueId);
  if (!issue) {
    document.getElementById('issueDetails').textContent = 'Issue not found.';
    return;
  }

  const personReporter = people.find(p => p.id === issue.identifiedBy);
  const personAssigned = people.find(p => p.id === issue.assignedTo);
  const project = projects.find(pr => pr.id === issue.project);

  const container = document.getElementById('issueDetails');
  container.innerHTML = `
    <h4>${issue.summary}</h4>
    <hr>
    <p><strong>Description:</strong> ${issue.description}</p>
    <p><strong>Identified By:</strong> ${personReporter ? personReporter.name + ' ' + personReporter.surname : 'Unknown'}</p>
    <p><strong>Date Identified:</strong> ${issue.dateIdentified}</p>
    <p><strong>Project:</strong> ${project ? project.name : 'Unknown'}</p>
    <p><strong>Status:</strong> ${issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}</p>
    <p><strong>Priority:</strong> ${issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}</p>
    <p><strong>Assigned To:</strong> ${personAssigned ? personAssigned.name + ' ' + personAssigned.surname : 'Unassigned'}</p>
    <p><strong>Target Resolution Date:</strong> ${issue.targetResolution}</p>
    <p><strong>Actual Resolution Date:</strong> ${issue.actualResolution || '-'}</p>
    <p><strong>Resolution Summary:</strong> ${issue.resolutionSummary || '-'}</p>
  `;

  // Set Edit button link with issue ID query param
  const editBtn = document.getElementById('editBtn');
  if (editBtn) {
    editBtn.href = `create-issue.html?id=${issue.id}`;
  }
}

// On page load logic for create/edit form
function initializeForm() {
  const people = getData(DB_PEOPLE);
  const projects = getData(DB_PROJECTS);

  // Populate selects
  populateSelectOptions('identifiedBy', people, 'id', 'name');
  populateSelectOptions('assignedTo', people, 'id', 'name');
  populateSelectOptions('project', projects, 'id', 'name');

  // Check if editing (URL param ?id=)
  const params = new URLSearchParams(window.location.search);
  const issueId = params.get('id');

  if (issueId) {
    // FIXED: Change page heading dynamically so user knows they are editing (Issue 10)
    const heading = document.querySelector('h2');
    if(heading) heading.textContent = 'Edit Issue';

    // Editing mode - load data into form
    const issue = loadIssueIntoForm(issueId);
    if (!issue) {
      alert('Issue not found.');
      window.location.href = '../index.html';
    }
  }

  // Form submission
  const form = document.getElementById('issueForm');
  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    if (!validateForm(form)) {
      evt.stopPropagation();
      form.classList.add('was-validated');
      return;
    }

    const formData = {
      id: issueId || generateId(), // FIXED: Use shared generateId()
      summary: document.getElementById('summary').value.trim(),
      description: document.getElementById('description').value.trim(),
      identifiedBy: document.getElementById('identifiedBy').value,
      dateIdentified: document.getElementById('dateIdentified').value,
      project: document.getElementById('project').value,
      status: document.getElementById('status').value,
      priority: document.getElementById('priority').value,
      assignedTo: document.getElementById('assignedTo').value,
      targetResolution: document.getElementById('targetResolution').value,
      actualResolution: document.getElementById('actualResolution').value || '',
      resolutionSummary: document.getElementById('resolutionSummary').value.trim() || ''
    };

    saveIssue(formData, !!issueId);
    alert('Issue saved successfully!');
    window.location.href = '../index.html';
  });
}

// On load for detail page
function initializeDetail() {
  const params = new URLSearchParams(window.location.search);
  const issueId = params.get('id');
  if (!issueId) {
    document.getElementById('issueDetails').textContent = 'No issue selected.';
    return;
  }
  renderIssueDetails(issueId);
}

// Determine which page and initialize appropriately
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('issueForm')) {
    initializeForm();
  } else if (document.getElementById('issueDetails')) {
    initializeDetail();
  }
});