// Displays all saved people.
function renderPeople() {
    const container = document.getElementById('peopleList');
    if (!container) return;

    const people = getData(DB_PEOPLE);
    container.innerHTML = people.map(p => `
        <div class="entry-card">
            <div class="name">${escapeHTML(p.name)} ${escapeHTML(p.surname)}</div>
            <div class="detail">${escapeHTML(p.email)} &bull; @${escapeHTML(p.username)}</div>
        </div>`).join('');
}

// Displays all saved projects.
function renderProjects() {
    const container = document.getElementById('projectList');
    if (!container) return;

    const projects = getData(DB_PROJECTS);
    container.innerHTML = projects.map(p => `
        <div class="entry-card">
            <div class="name">${escapeHTML(p.name)}</div>
            <div class="detail">${escapeHTML(p.description || 'No description provided')}</div>
        </div>`).join('');
}

// Handle the people form submission.
// Adds a person to localStorage.
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('personForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        const people = getData(DB_PEOPLE);
        people.push({
            id:       generateId(),
            name:     document.getElementById('name').value,
            surname:  document.getElementById('surname').value,
            email:    document.getElementById('email').value,
            username: document.getElementById('username').value
        });
        saveData(DB_PEOPLE, people);
        renderPeople();
        e.target.reset();
    });
    
    // Handle the project form submission.
    // Adds a project to localStorage.
    document.getElementById('projectForm')?.addEventListener('submit', function (e) {
        e.preventDefault();
        const projects = getData(DB_PROJECTS);
        projects.push({
            id:          generateId(),
            name:        document.getElementById('projectName').value,
            description: document.getElementById('projectDescription').value
        });
        saveData(DB_PROJECTS, projects);
        renderProjects();
        e.target.reset();
    });

    // Initial rendering
    if (document.getElementById('peopleList'))  renderPeople();
    if (document.getElementById('projectList')) renderProjects();
});
