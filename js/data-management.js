function renderPeople() {
    const container = document.getElementById('person-list');
    if (!container) return;

    const people = getData(DB_PEOPLE);
    container.innerHTML = people.map(p => `
        <div class="entry-card">
            <div class="name">${escapeHTML(p.name)} ${escapeHTML(p.surname)}</div>
            <div class="detail">${escapeHTML(p.email)} &bull; @${escapeHTML(p.username)}</div>
        </div>`).join('');
}

function renderProjects() {
    const container = document.getElementById('project-list');
    if (!container) return;

    const projects = getData(DB_PROJECTS);
    container.innerHTML = projects.map(p => `
        <div class="entry-card">
            <div class="name">${escapeHTML(p.name)}</div>
            <div class="detail">${escapeHTML(p.description || 'No description provided')}</div>
        </div>`).join('');
}

document.getElementById('form-person')?.addEventListener('submit', function (e) {
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

document.getElementById('form-project')?.addEventListener('submit', function (e) {
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

if (document.getElementById('person-list'))  renderPeople();
if (document.getElementById('project-list')) renderProjects();
