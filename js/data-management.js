console.log("Data management loaded");
function getPeople() {
  return JSON.parse(localStorage.getItem('people')) || [];
}

function savePeople(people) {
  localStorage.setItem('people', JSON.stringify(people));
}

function getProjects() {
  return JSON.parse(localStorage.getItem('projects')) || [];
}

function saveProjects(projects) {
  localStorage.setItem('projects', JSON.stringify(projects));
}

function displayPeople() {
  let people = getPeople();
  let container = document.getElementById("peopleList");

  if (!container) return;

  container.innerHTML = "";

  people.forEach(p => {
    container.innerHTML += `
      <div class="card p-2 mb-2">
        ${p.name} ${p.surname} - ${p.email}
      </div>
    `;
  });
}

document.getElementById("personForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  let people = getPeople();

  let newPerson = {
    id: generateId(),
    name: document.getElementById("name").value,
    surname: document.getElementById("surname").value,
    email: document.getElementById("email").value,
    username: document.getElementById("username").value
  };

  people.push(newPerson);
  savePeople(people);

  displayPeople();
});

displayPeople();

function displayProjects() {
  let projects = getProjects();
  let container = document.getElementById("projectList");

  if (!container) return;

  container.innerHTML = "";

  projects.forEach(p => {
    container.innerHTML += `
      <div class="card p-3 mb-2">
        ${p.name}
      </div>
    `;
  });
}

document.getElementById("projectForm")?.addEventListener("submit", function(e) {
  e.preventDefault();

  let projects = getProjects();

  let newProject = {
    id: Date.now().toString(),
    name: document.getElementById("projectName").value
  };

  projects.push(newProject);
  saveProjects(projects);

  displayProjects();
});

displayProjects();

function seedData() {
  if (getPeople().length === 0) {
    savePeople([
      { id: "1", name: "Alice", surname: "Brown", email: "alice@mail.com", username: "alice" },
      { id: "2", name: "Bob", surname: "Smith", email: "bob@mail.com", username: "bob" }
    ]);
  }

  if (getProjects().length === 0) {
    saveProjects([
      { id: "1", name: "Website Redesign" },
      { id: "2", name: "Bug Tracker System" }
    ]);
  }
}

seedData();

container.innerHTML += `
  <div class="card p-3 mb-2">
    <strong>${p.name} ${p.surname}</strong><br>
    <small>Email: ${p.email}</small><br>
    <small>Username: @${p.username}</small>
  </div>
`;

container.innerHTML += `
  <div class="card p-3 mb-2">
    <strong>${p.name}</strong>
  </div>
`;

function checkOverdue(issue) {
  let today = new Date();
  let target = new Date(issue.targetResolution);

  if (issue.status !== "resolved" && today > target) {
    return "overdue";
  }

  return issue.status;
}