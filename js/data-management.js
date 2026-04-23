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

if (document.getElementById('peopleList'))  renderPeople();
if (document.getElementById('projectList')) renderProjects();