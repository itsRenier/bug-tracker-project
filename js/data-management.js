// =============================================================
// data-management.js — Member 3 (People & Projects)
// =============================================================

function displayPeople() {
  let people = getData(DB_PEOPLE);
  let container = document.getElementById("peopleList");
  if (!container) return;
  
  let htmlContent = ""; // Build string
  people.forEach(p => {
    htmlContent += `
      <div class="card p-3 mb-2 shadow-sm border-start border-4 border-secondary">
        <div class="fw-bold">${p.name} ${p.surname}</div>
        <div class="text-muted small">${p.email} | @${p.username}</div>
      </div>`;
  });
  container.innerHTML = htmlContent; // Inject once
}

document.getElementById("personForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  let people = getData(DB_PEOPLE);

  let newPerson = {
    id: generateId(), // FIXED: Using Member 1's generateId function
    name: document.getElementById("name").value,
    surname: document.getElementById("surname").value,
    email: document.getElementById("email").value,
    username: document.getElementById("username").value
  };

  people.push(newPerson);
  saveData(DB_PEOPLE, people); // FIXED: Using shared saveData

  displayPeople();
  e.target.reset(); // Clears form after submit
});

function displayProjects() {
  let projects = getData(DB_PROJECTS);
  let container = document.getElementById("projectList");
  if (!container) return;
  
  let htmlContent = ""; // Build string
  projects.forEach(p => {
    htmlContent += `
      <div class="card p-3 mb-2 shadow-sm border-start border-4 border-secondary">
        <div class="fw-bold">${p.name}</div>
        <div class="text-muted small">${p.description || 'No description provided'}</div>
      </div>`;
  });
  container.innerHTML = htmlContent; // Inject once
}

document.getElementById("projectForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  let projects = getData(DB_PROJECTS);

  let newProject = {
    id: generateId(),
    name: document.getElementById("projectName").value,
    // FIXED: Capturing the project description from the form (Issue 5)
    description: document.getElementById("projectDescription").value 
  };

  projects.push(newProject);
  saveData(DB_PROJECTS, projects);

  displayProjects();
  e.target.reset(); // Clears form after submit
});

// Initialise page functions
if (document.getElementById("peopleList")) displayPeople();
if (document.getElementById("projectList")) displayProjects();