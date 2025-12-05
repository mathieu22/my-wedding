// ============ GLOBAL STATE ============
let budgetChart = null;
let currentFilter = 'all';
let currentStatusFilter = 'all';
let currentTab = 'dashboard';
let taskToDelete = null;
let allTasks = [];

// ============ INITIALIZATION ============
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadTasks();
});

// ============ TAB MANAGEMENT ============
function switchTab(tab) {
    currentTab = tab;

    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('bg-mariage-500', 'text-white', 'shadow-lg');
        btn.classList.add('bg-white', 'text-gray-600');
    });

    const activeTab = document.getElementById(`tab-${tab}`);
    activeTab.classList.remove('bg-white', 'text-gray-600');
    activeTab.classList.add('bg-mariage-500', 'text-white', 'shadow-lg');

    // Show/hide content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    document.getElementById(`content-${tab}`).classList.remove('hidden');

    // Refresh chart when switching to dashboard
    if (tab === 'dashboard') {
        loadStats();
    }
}

// ============ API CALLS ============
async function loadStats() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();
        updateDashboard(stats);
    } catch (error) {
        console.error('Erreur chargement stats:', error);
    }
}

async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        allTasks = await response.json();
        renderTasks(allTasks);
        updateTasksStats(allTasks);
        updateTasksBadge(allTasks);
    } catch (error) {
        console.error('Erreur chargement tâches:', error);
    }
}

// ============ DASHBOARD UPDATE ============
function updateDashboard(stats) {
    // Countdown
    document.getElementById('days-left').textContent = stats.jours_restants;

    // Budget cards
    document.getElementById('budget-fixe').textContent = formatCurrency(stats.budget_fixe);
    document.getElementById('budget-depense').textContent = formatCurrency(stats.budget_depense);
    document.getElementById('budget-restant').textContent = formatCurrency(stats.budget_restant);
    document.getElementById('pourcentage-depense').textContent = stats.pourcentage_depense;
    document.getElementById('budget-progress').style.width = `${Math.min(stats.pourcentage_depense, 100)}%`;

    // Color based on percentage
    const progressBar = document.getElementById('budget-progress');
    const depenseDiv = document.getElementById('budget-depense');
    const restantDiv = document.getElementById('budget-restant');

    if (stats.pourcentage_depense > 90) {
        progressBar.className = 'bg-red-500 h-2 rounded-full progress-bar';
        depenseDiv.className = 'text-3xl font-bold text-red-600';
    } else if (stats.pourcentage_depense > 70) {
        progressBar.className = 'bg-orange-500 h-2 rounded-full progress-bar';
        depenseDiv.className = 'text-3xl font-bold text-orange-600';
    } else {
        progressBar.className = 'bg-green-500 h-2 rounded-full progress-bar';
        depenseDiv.className = 'text-3xl font-bold text-green-600';
    }

    // Budget restant color
    if (stats.budget_restant < 0) {
        restantDiv.className = 'text-3xl font-bold text-red-600';
    } else if (stats.budget_restant < stats.budget_fixe * 0.1) {
        restantDiv.className = 'text-3xl font-bold text-orange-600';
    } else {
        restantDiv.className = 'text-3xl font-bold text-green-600';
    }

    // Top dépense
    if (stats.top_depense) {
        document.getElementById('top-depense').textContent = `${stats.top_depense.nom} - ${formatCurrency(stats.top_depense.prix_reel)}`;
        const cat = CATEGORIES.find(c => c.id === stats.top_depense.categorie);
        document.getElementById('top-depense-details').textContent = cat ? `${cat.icone} ${cat.nom}` : stats.top_depense.categorie;
    } else {
        document.getElementById('top-depense').textContent = 'Aucune dépense';
        document.getElementById('top-depense-details').textContent = '-';
    }

    // Avancement global
    document.getElementById('avancement-global').textContent = `${stats.pourcentage_avancement}%`;
    document.getElementById('taches-count').textContent = `${stats.taches_terminees}/${stats.taches_total} tâches`;
    document.getElementById('avancement-progress').style.width = `${stats.pourcentage_avancement}%`;

    // Category progress
    renderCategoryProgress(stats.par_categorie);

    // Budget chart
    renderBudgetChart(stats.par_categorie);
}

function updateTasksStats(tasks) {
    const terminees = tasks.filter(t => t.statut).length;
    const enCours = tasks.filter(t => !t.statut).length;
    const tokyTasks = tasks.filter(t => t.assigne_a === PARTENAIRE_1).length;
    const hanjaTasks = tasks.filter(t => t.assigne_a === PARTENAIRE_2).length;

    document.getElementById('stat-terminees').textContent = terminees;
    document.getElementById('stat-en-cours').textContent = enCours;
    document.getElementById('stat-toky').textContent = tokyTasks;
    document.getElementById('stat-hanja').textContent = hanjaTasks;
}

function updateTasksBadge(tasks) {
    const enCours = tasks.filter(t => !t.statut).length;
    document.getElementById('tasks-badge').textContent = enCours;
}

function renderCategoryProgress(parCategorie) {
    const container = document.getElementById('category-progress');
    container.innerHTML = '';

    for (const cat of CATEGORIES) {
        const data = parCategorie[cat.id];
        if (!data || data.total === 0) continue;

        const colorClasses = {
            'orange': 'bg-orange-500',
            'purple': 'bg-purple-500',
            'pink': 'bg-pink-500',
            'blue': 'bg-blue-500',
            'green': 'bg-green-500',
            'gray': 'bg-gray-500',
            'yellow': 'bg-yellow-500'
        };

        const html = `
            <div class="flex items-center gap-3">
                <span class="text-xl w-8">${cat.icone}</span>
                <div class="flex-1">
                    <div class="flex justify-between text-sm mb-1">
                        <span class="font-medium text-gray-700">${cat.nom}</span>
                        <span class="text-gray-500">${data.terminees}/${data.total}</span>
                    </div>
                    <div class="bg-gray-200 rounded-full h-2">
                        <div class="${colorClasses[cat.couleur] || 'bg-gray-500'} h-2 rounded-full progress-bar" style="width: ${data.pourcentage}%"></div>
                    </div>
                </div>
                <span class="text-sm font-semibold text-gray-600 w-12 text-right">${Math.round(data.pourcentage)}%</span>
            </div>
        `;
        container.innerHTML += html;
    }

    if (container.innerHTML === '') {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">Ajoutez des tâches pour voir la progression</p>';
    }
}

function renderBudgetChart(parCategorie) {
    const ctx = document.getElementById('budget-chart').getContext('2d');

    const labels = [];
    const data = [];
    const colors = {
        'orange': '#f97316',
        'purple': '#a855f7',
        'pink': '#ec4899',
        'blue': '#3b82f6',
        'green': '#22c55e',
        'gray': '#6b7280',
        'yellow': '#eab308'
    };
    const backgroundColors = [];

    for (const cat of CATEGORIES) {
        const catData = parCategorie[cat.id];
        if (catData && catData.depense > 0) {
            labels.push(`${cat.icone} ${cat.nom}`);
            data.push(catData.depense);
            backgroundColors.push(colors[cat.couleur] || '#6b7280');
        }
    }

    if (budgetChart) {
        budgetChart.destroy();
    }

    if (data.length === 0) {
        // No data yet
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = '14px Arial';
        ctx.fillStyle = '#9ca3af';
        ctx.textAlign = 'center';
        ctx.fillText('Aucune dépense enregistrée', ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }

    budgetChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${formatCurrency(context.raw)}`;
                        }
                    }
                }
            }
        }
    });
}

// ============ TASKS RENDERING ============
function renderTasks(tasks) {
    const grid = document.getElementById('tasks-grid');
    const noTasks = document.getElementById('no-tasks');

    // Filter tasks by category
    let filteredTasks = tasks;
    if (currentFilter !== 'all') {
        filteredTasks = filteredTasks.filter(t => t.categorie === currentFilter);
    }

    // Filter tasks by status
    if (currentStatusFilter === 'pending') {
        filteredTasks = filteredTasks.filter(t => !t.statut);
    } else if (currentStatusFilter === 'done') {
        filteredTasks = filteredTasks.filter(t => t.statut);
    }

    if (filteredTasks.length === 0) {
        grid.innerHTML = '';
        noTasks.classList.remove('hidden');
        return;
    }

    noTasks.classList.add('hidden');
    grid.innerHTML = filteredTasks.map(task => renderTaskCard(task)).join('');
}

function renderTaskCard(task) {
    const cat = CATEGORIES.find(c => c.id === task.categorie) || { icone: '📌', nom: task.categorie, couleur: 'gray' };

    const colorClasses = {
        'orange': 'bg-orange-100 text-orange-800',
        'purple': 'bg-purple-100 text-purple-800',
        'pink': 'bg-pink-100 text-pink-800',
        'blue': 'bg-blue-100 text-blue-800',
        'green': 'bg-green-100 text-green-800',
        'gray': 'bg-gray-100 text-gray-800',
        'yellow': 'bg-yellow-100 text-yellow-800'
    };

    const statusClass = task.statut ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200';
    const statusIcon = task.statut ? '✅' : '⏳';

    return `
        <div class="border-2 ${statusClass} rounded-xl p-4 card-hover fade-in" data-task-id="${task.id}">
            <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-2">
                    <button onclick="toggleTaskStatus(${task.id}, ${!task.statut})" class="text-2xl hover:scale-110 transition-transform" title="Changer le statut">
                        ${statusIcon}
                    </button>
                    <h4 class="font-semibold text-gray-800 ${task.statut ? 'line-through opacity-60' : ''}">${escapeHtml(task.nom)}</h4>
                </div>
                <div class="flex gap-1">
                    <button onclick="editTask(${task.id})" class="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all" title="Modifier">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                        </svg>
                    </button>
                    <button onclick="confirmDeleteTask(${task.id})" class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Supprimer">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>

            <span class="inline-block px-2 py-1 rounded-full text-xs font-medium ${colorClasses[cat.couleur] || 'bg-gray-100 text-gray-800'} mb-3">
                ${cat.icone} ${cat.nom}
            </span>

            <div class="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                    <span class="text-gray-500">Estimé:</span>
                    <span class="font-medium">${formatCurrency(task.prix_estimatif)}</span>
                </div>
                <div>
                    <span class="text-gray-500">Réel:</span>
                    <span class="font-medium ${task.prix_reel > task.prix_estimatif ? 'text-red-600' : 'text-green-600'}">${task.prix_reel > 0 ? formatCurrency(task.prix_reel) : '-'}</span>
                </div>
            </div>

            <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500 flex items-center gap-1">
                    <span class="text-base">👤</span> ${escapeHtml(task.assigne_a)}
                </span>
                ${task.commentaires ? `<span class="text-gray-400 cursor-help" title="${escapeHtml(task.commentaires)}">💬</span>` : ''}
            </div>
        </div>
    `;
}

// ============ TASK ACTIONS ============
async function toggleTaskStatus(taskId, newStatus) {
    try {
        await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statut: newStatus })
        });
        await refreshAll();
    } catch (error) {
        console.error('Erreur changement statut:', error);
    }
}

function editTask(taskId) {
    const task = allTasks.find(t => t.id === taskId);
    if (task) {
        document.getElementById('task-modal-title').textContent = 'Modifier la tâche';
        document.getElementById('task-id').value = task.id;
        document.getElementById('task-nom').value = task.nom;
        document.getElementById('task-categorie').value = task.categorie;
        document.getElementById('task-prix-estimatif').value = task.prix_estimatif;
        document.getElementById('task-prix-reel').value = task.prix_reel;
        document.getElementById('task-assigne').value = task.assigne_a;
        document.getElementById('task-commentaires').value = task.commentaires || '';
        document.getElementById('task-statut').checked = task.statut;
        openTaskModal();
    }
}

function confirmDeleteTask(taskId) {
    taskToDelete = taskId;
    document.getElementById('delete-modal').classList.remove('hidden');
    document.getElementById('confirm-delete-btn').onclick = () => deleteTask(taskId);
}

async function deleteTask(taskId) {
    try {
        await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
        closeDeleteModal();
        await refreshAll();
    } catch (error) {
        console.error('Erreur suppression:', error);
    }
}

async function saveTask() {
    const taskId = document.getElementById('task-id').value;
    const data = {
        nom: document.getElementById('task-nom').value,
        categorie: document.getElementById('task-categorie').value,
        prix_estimatif: parseFloat(document.getElementById('task-prix-estimatif').value) || 0,
        prix_reel: parseFloat(document.getElementById('task-prix-reel').value) || 0,
        assigne_a: document.getElementById('task-assigne').value,
        commentaires: document.getElementById('task-commentaires').value,
        statut: document.getElementById('task-statut').checked
    };

    if (!data.nom) {
        alert('Le nom de la tâche est requis');
        return;
    }

    try {
        const url = taskId ? `/api/tasks/${taskId}` : '/api/tasks';
        const method = taskId ? 'PUT' : 'POST';

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        closeTaskModal();
        await refreshAll();
    } catch (error) {
        console.error('Erreur sauvegarde:', error);
    }
}

// ============ FILTERS ============
function filterTasks(filter) {
    currentFilter = filter;

    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.remove('bg-gray-100', 'text-gray-600');
            btn.classList.add('bg-mariage-500', 'text-white', 'shadow-md');
        } else {
            btn.classList.remove('bg-mariage-500', 'text-white', 'shadow-md');
            btn.classList.add('bg-gray-100', 'text-gray-600');
        }
    });

    renderTasks(allTasks);
}

function filterByStatus(status) {
    currentStatusFilter = status;

    // Update status filter buttons
    document.querySelectorAll('.status-filter-btn').forEach(btn => {
        if (btn.dataset.status === status) {
            btn.classList.remove('bg-gray-100', 'text-gray-600');
            btn.classList.add('bg-gray-800', 'text-white');
        } else {
            btn.classList.remove('bg-gray-800', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-600');
        }
    });

    renderTasks(allTasks);
}

// ============ CONFIG ============
function openConfigModal() {
    fetch('/api/config')
        .then(res => res.json())
        .then(config => {
            document.getElementById('config-date').value = config.date_mariage;
            document.getElementById('config-budget').value = config.budget_total;
            document.getElementById('config-partenaire1').value = config.nom_partenaire_1;
            document.getElementById('config-partenaire2').value = config.nom_partenaire_2;
            document.getElementById('config-modal').classList.remove('hidden');
        });
}

function closeConfigModal() {
    document.getElementById('config-modal').classList.add('hidden');
}

async function saveConfig() {
    const data = {
        date_mariage: document.getElementById('config-date').value,
        budget_total: parseFloat(document.getElementById('config-budget').value) || 0,
        nom_partenaire_1: document.getElementById('config-partenaire1').value,
        nom_partenaire_2: document.getElementById('config-partenaire2').value
    };

    try {
        await fetch('/api/config', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        closeConfigModal();
        await refreshAll();
        // Reload page to update partner names in form
        location.reload();
    } catch (error) {
        console.error('Erreur sauvegarde config:', error);
    }
}

// ============ MODALS ============
function openTaskModal() {
    document.getElementById('task-modal').classList.remove('hidden');
}

function closeTaskModal() {
    document.getElementById('task-modal').classList.add('hidden');
    // Reset form
    document.getElementById('task-form').reset();
    document.getElementById('task-id').value = '';
    document.getElementById('task-modal-title').textContent = 'Nouvelle tâche';
}

function closeDeleteModal() {
    document.getElementById('delete-modal').classList.add('hidden');
    taskToDelete = null;
}

// ============ RESET DATA ============
function openResetModal() {
    document.getElementById('reset-modal').classList.remove('hidden');
}

function closeResetModal() {
    document.getElementById('reset-modal').classList.add('hidden');
}

async function confirmReset() {
    try {
        await fetch('/api/reset', { method: 'POST' });
        closeResetModal();
        closeConfigModal();
        await refreshAll();
    } catch (error) {
        console.error('Erreur réinitialisation:', error);
    }
}

// ============ UTILITIES ============
function formatCurrency(amount) {
    return new Intl.NumberFormat('fr-MG', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount || 0) + ' Ar';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function refreshAll() {
    await Promise.all([loadStats(), loadTasks()]);
}

// Close modals on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeTaskModal();
        closeConfigModal();
        closeDeleteModal();
        closeResetModal();
    }
});

// Close modals on backdrop click
document.getElementById('task-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeTaskModal();
});
document.getElementById('config-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeConfigModal();
});
document.getElementById('delete-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeDeleteModal();
});
document.getElementById('reset-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeResetModal();
});
