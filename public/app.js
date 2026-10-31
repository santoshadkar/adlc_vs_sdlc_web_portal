/**
 * AiDLC vs SDLC Enterprise Knowledge & Decision Portal - Frontend Controller
 * Enterprise Edition with In-Depth 12 Dimensions, Interactive Visual Diagrams,
 * 12 Cross-Domain Case Studies, 5-Layer Guardrails, Governance & Cybersecurity.
 */

let appState = {
  activeTab: 'overview',
  dimensionViewMode: 'cards', // 'cards' or 'table'
  overviewData: null,
  phasesData: [],
  advantagesData: null,
  domainMatrix: [],
  hybridPatterns: [],
  rolesData: [],
  guardrailsData: null,
  governanceData: null,
  cybersecurityData: null,
  caseStudiesData: [],
  visualDiagramsData: [],
  finopsData: null,
  toolkitSnippets: [],
  selectedSnippetId: 'snippet_sandwich_ts',
  readinessCategories: [],
  checkedReadinessCriteria: new Set([
    'eval_golden_set', 'eval_statistical_gate',
    'guard_pii_sanitization', 'guard_prompt_injection',
    'bound_sandwich_pattern', 'bound_zero_direct_db_write', 'bound_zod_schema_assertion',
    'finops_monthly_spend_cap', 'finops_fallback_failover',
    'gov_eu_ai_act_classification', 'gov_distributed_tracing'
  ]),
  selectedPhaseIndex: 0,
  selectedDiagramId: 'diag_paradigm',
  matrixFilter: 'all',
  caseStudyFilter: 'all',
  radarChartInstance: null
};

// Initialize app on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
  await loadAllData();
  renderDimensions();
  renderDiagrams();
  renderPhases();
  renderAdvantages();
  renderMatrix();
  renderGuardrails();
  renderGovernance();
  renderCybersecurity();
  renderCaseStudies();
  renderHybridPatterns();
  renderRoles();
  initAssessmentChart();
  
  // Render new enterprise suite modules
  initFinOps();
  renderReadinessChecklist();
  renderToolkit();
  setupHashRouting();
  setupKeyboardShortcuts();

  // Initial tab resolution via URL hash or default to overview
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && document.getElementById(`tab-${initialHash}`)) {
    switchTab(initialHash, false);
  } else {
    switchTab('overview', false);
  }
  
  lucide.createIcons();
});

// Switch active tab
function switchTab(tabId, updateHash = true) {
  appState.activeTab = tabId;
  
  // Update URL hash
  if (updateHash && history.pushState) {
    history.pushState(null, null, `#${tabId}`);
  }
  
  // Hide all contents
  document.querySelectorAll('.tab-content').forEach(el => {
    el.classList.add('hidden');
  });

  // Show active
  const target = document.getElementById(`tab-${tabId}`);
  if (target) {
    target.classList.remove('hidden');
  }

  // Update navigation button styles with modern active pill highlighting
  document.querySelectorAll('.nav-btn').forEach(btn => {
    if (btn.dataset.tab === tabId) {
      btn.classList.add('bg-slate-800', 'text-white', 'shadow-sm', 'ring-1', 'ring-purple-500/40');
      btn.classList.remove('text-slate-300', 'text-slate-400');
      // Smoothly bring the active tab into view in horizontal nav
      try {
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } catch (e) {
        // Fallback for older engines
      }
    } else {
      btn.classList.remove('bg-slate-800', 'text-white', 'shadow-sm', 'ring-1', 'ring-purple-500/40');
      btn.classList.add('text-slate-300');
    }
  });

  // Re-trigger icon rendering
  setTimeout(() => lucide.createIcons(), 50);

  // Re-render chart if navigating to calculator
  if (tabId === 'calculator' && appState.radarChartInstance) {
    appState.radarChartInstance.resize();
  }
}

// Fetch all initial data from API
async function loadAllData() {
  try {
    const [
      overviewRes,
      phasesRes,
      advRes,
      matrixRes,
      hybridRes,
      rolesRes,
      guardrailsRes,
      governanceRes,
      securityRes,
      caseStudiesRes,
      diagramsRes,
      toolkitRes,
      readinessRes
    ] = await Promise.all([
      fetch('/api/overview').then(r => r.json()),
      fetch('/api/phases').then(r => r.json()),
      fetch('/api/advantages').then(r => r.json()),
      fetch('/api/matrix').then(r => r.json()),
      fetch('/api/hybrid-patterns').then(r => r.json()),
      fetch('/api/roles').then(r => r.json()),
      fetch('/api/guardrails').then(r => r.json()),
      fetch('/api/governance').then(r => r.json()),
      fetch('/api/security').then(r => r.json()),
      fetch('/api/case-studies').then(r => r.json()),
      fetch('/api/diagrams').then(r => r.json()),
      fetch('/api/toolkit').then(r => r.json()),
      fetch('/api/readiness-checklist').then(r => r.json())
    ]);

    appState.overviewData = overviewRes.data;
    appState.phasesData = phasesRes.data;
    appState.advantagesData = advRes.data;
    appState.domainMatrix = matrixRes.data;
    appState.hybridPatterns = hybridRes.data;
    appState.rolesData = rolesRes.data;
    appState.guardrailsData = guardrailsRes.data;
    appState.governanceData = governanceRes.data;
    appState.cybersecurityData = securityRes.data;
    appState.caseStudiesData = caseStudiesRes.data;
    appState.visualDiagramsData = diagramsRes.data;
    appState.toolkitSnippets = toolkitRes.data || [];
    appState.readinessCategories = readinessRes.data || [];
  } catch (error) {
    console.error('Failed to load data from API:', error);
    const pill = document.getElementById('api-status-pill');
    if (pill) {
      pill.innerHTML = `<span class="w-2 h-2 rounded-full bg-amber-400"></span><span>Offline Mode</span>`;
    }
  }
}

// ============================================================
// 12 CORE PARADIGM DIMENSIONS: DUAL VIEW (CARDS & TABLE)
// ============================================================

function setDimensionView(mode) {
  appState.dimensionViewMode = mode;
  
  const cardsContainer = document.getElementById('dimensions-cards-container');
  const tableContainer = document.getElementById('dimensions-table-container');
  const cardsBtn = document.getElementById('dim-view-cards-btn');
  const tableBtn = document.getElementById('dim-view-table-btn');

  if (mode === 'cards') {
    cardsContainer.classList.remove('hidden');
    tableContainer.classList.add('hidden');
    cardsBtn.className = 'px-3 py-1 text-xs rounded-md font-medium bg-slate-800 text-white flex items-center space-x-1';
    tableBtn.className = 'px-3 py-1 text-xs rounded-md font-medium text-slate-400 hover:text-white flex items-center space-x-1';
  } else {
    cardsContainer.classList.add('hidden');
    tableContainer.classList.remove('hidden');
    cardsBtn.className = 'px-3 py-1 text-xs rounded-md font-medium text-slate-400 hover:text-white flex items-center space-x-1';
    tableBtn.className = 'px-3 py-1 text-xs rounded-md font-medium bg-slate-800 text-white flex items-center space-x-1';
  }

  renderDimensions();
}

function renderDimensions(filterText = '') {
  renderDimensionsCards(filterText);
  renderDimensionsTable(filterText);
}

function filterDimensions() {
  const searchInput = document.getElementById('dimension-search');
  const query = searchInput ? searchInput.value : '';
  renderDimensions(query);
}

// Render 12 Deep-Dive Dimension Cards
function renderDimensionsCards(filterText = '') {
  const container = document.getElementById('dimensions-cards-container');
  if (!container || !appState.overviewData) return;

  const query = filterText.toLowerCase().trim();
  const filtered = appState.overviewData.core_dimensions.filter(dim => {
    return dim.dimension.toLowerCase().includes(query) ||
           (dim.tagline && dim.tagline.toLowerCase().includes(query)) ||
           dim.sdlc.toLowerCase().includes(query) ||
           dim.aidlc.toLowerCase().includes(query) ||
           (dim.deepDive && (
             dim.deepDive.definition.toLowerCase().includes(query) ||
             dim.deepDive.goldenRule.toLowerCase().includes(query)
           ));
  });

  container.innerHTML = filtered.map((dim, idx) => {
    const d = dim.deepDive || {};
    return `
      <div class="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6 hover:border-purple-500/40 transition">
        
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800 gap-3">
          <div class="flex items-center space-x-3">
            <span class="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-sm">
              ${idx + 1 < 10 ? '0' + (idx + 1) : idx + 1}
            </span>
            <div>
              <h3 class="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                <span>${dim.dimension}</span>
              </h3>
              <p class="text-xs text-purple-400 font-mono mt-0.5">${dim.tagline || ''}</p>
            </div>
          </div>
          <button onclick="openDimensionModal('${dim.id}')" class="px-3 py-1 text-xs rounded-lg bg-slate-900 border border-slate-700 text-purple-300 hover:text-white hover:bg-slate-800 transition flex items-center space-x-1 shrink-0">
            <i data-lucide="maximize-2" class="w-3.5 h-3.5"></i>
            <span>Full Dissection Modal</span>
          </button>
        </div>

        <div class="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3.5 rounded-xl border border-slate-800/80">
          <strong class="text-slate-100">Architectural Scope:</strong> ${d.definition || dim.impact}
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          <!-- SDLC Mechanics -->
          <div class="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center space-x-1.5">
                <i data-lucide="code" class="w-4 h-4"></i>
                <span>SDLC Technical Mechanics</span>
              </span>
              <span class="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300">Deterministic</span>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">${d.sdlcMechanics || dim.sdlc}</p>
            
            <div class="pt-2 border-t border-blue-900/30 text-xs">
              <strong class="text-blue-300">Concrete Example:</strong>
              <div class="mt-1 font-mono text-[11px] bg-slate-950/80 p-2 rounded text-blue-200 border border-blue-900/40">
                ${d.sdlcExample || dim.sdlc}
              </div>
            </div>

            <div class="text-[11px] text-slate-400 pt-1">
              <strong class="text-emerald-400">Core Strength:</strong> ${d.sdlcStrengths || 'Deterministic precision.'}<br>
              <strong class="text-rose-400">Core Weakness:</strong> ${d.sdlcWeaknesses || 'Inflexible with unstructured data.'}
            </div>
          </div>

          <!-- AiDLC Mechanics -->
          <div class="p-4 rounded-xl bg-purple-950/20 border border-purple-900/40 space-y-2.5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center space-x-1.5">
                <i data-lucide="sparkles" class="w-4 h-4"></i>
                <span>AiDLC Technical Mechanics</span>
              </span>
              <span class="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300">Probabilistic</span>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">${d.aidlcMechanics || dim.aidlc}</p>
            
            <div class="pt-2 border-t border-purple-900/30 text-xs">
              <strong class="text-purple-300">Concrete Example:</strong>
              <div class="mt-1 font-mono text-[11px] bg-slate-950/80 p-2 rounded text-purple-200 border border-purple-900/40">
                ${d.aidlcExample || dim.aidlc}
              </div>
            </div>

            <div class="text-[11px] text-slate-400 pt-1">
              <strong class="text-emerald-400">Core Strength:</strong> ${d.aidlcStrengths || 'Contextual semantic intelligence.'}<br>
              <strong class="text-rose-400">Core Weakness:</strong> ${d.aidlcWeaknesses || 'Probabilistic variance / hallucination risk.'}
            </div>
          </div>

        </div>

        <div class="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 flex items-start space-x-2.5">
          <i data-lucide="shield-alert" class="w-4 h-4 text-amber-400 shrink-0 mt-0.5"></i>
          <div class="text-xs">
            <strong class="text-amber-300 uppercase tracking-wide">Architectural Golden Rule:</strong>
            <span class="text-slate-300 ml-1">${d.goldenRule || dim.impact}</span>
          </div>
        </div>

      </div>
    `;
  }).join('');

  lucide.createIcons();
}

// Render Compact Table View
function renderDimensionsTable(filterText = '') {
  const tbody = document.getElementById('dimensions-table-body');
  if (!tbody || !appState.overviewData) return;

  const query = filterText.toLowerCase().trim();
  const filtered = appState.overviewData.core_dimensions.filter(dim => {
    return dim.dimension.toLowerCase().includes(query) ||
           (dim.tagline && dim.tagline.toLowerCase().includes(query)) ||
           dim.sdlc.toLowerCase().includes(query) ||
           dim.aidlc.toLowerCase().includes(query);
  });

  tbody.innerHTML = filtered.map((dim) => `
    <tr class="hover:bg-slate-900/60 transition">
      <td class="py-3.5 px-4 font-semibold text-slate-200">
        <div class="flex items-center space-x-2">
          <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
          <span>${dim.dimension}</span>
        </div>
        <div class="text-[11px] text-purple-400 font-normal mt-0.5 leading-snug">${dim.tagline || ''}</div>
        <div class="text-[11px] text-slate-400 font-normal mt-1 leading-snug">${dim.impact}</div>
      </td>
      <td class="py-3.5 px-4 text-slate-300 bg-blue-950/10 border-l border-blue-900/20 leading-relaxed">
        ${dim.sdlc}
      </td>
      <td class="py-3.5 px-4 text-slate-300 bg-purple-950/10 border-l border-purple-900/20 leading-relaxed">
        ${dim.aidlc}
      </td>
      <td class="py-3.5 px-4 text-center">
        <button onclick="openDimensionModal('${dim.id}')" class="px-2.5 py-1 text-xs rounded bg-slate-800 text-purple-300 hover:text-white hover:bg-slate-700 transition">
          Deep Dive
        </button>
      </td>
    </tr>
  `).join('');

  lucide.createIcons();
}

// Dimension Modal Handlers
function openDimensionModal(dimId) {
  const dim = appState.overviewData.core_dimensions.find(d => d.id === dimId);
  if (!dim) return;

  const d = dim.deepDive || {};
  document.getElementById('modal-dim-title').innerText = dim.dimension;
  document.getElementById('modal-dim-tagline').innerText = dim.tagline || dim.impact;

  const content = document.getElementById('modal-dim-content');
  content.innerHTML = `
    <div class="p-4 rounded-xl bg-slate-950 border border-slate-800 leading-relaxed text-xs">
      <strong class="text-white text-sm">Dimension Definition & Scope:</strong>
      <p class="text-slate-300 mt-1">${d.definition || dim.impact}</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-4 rounded-xl bg-blue-950/30 border border-blue-900/40 space-y-2">
        <div class="text-xs font-bold text-blue-400 uppercase">Traditional SDLC Execution</div>
        <p class="text-xs text-slate-300">${d.sdlcMechanics || dim.sdlc}</p>
        <div class="text-[11px] font-mono text-blue-200 bg-black/40 p-2 rounded">${d.sdlcExample || dim.sdlc}</div>
        <div class="text-[11px] text-slate-400 pt-1">
          <strong class="text-emerald-400">Strength:</strong> ${d.sdlcStrengths}<br>
          <strong class="text-rose-400">Weakness:</strong> ${d.sdlcWeaknesses}
        </div>
      </div>

      <div class="p-4 rounded-xl bg-purple-950/30 border border-purple-900/40 space-y-2">
        <div class="text-xs font-bold text-purple-400 uppercase">Modern AiDLC Execution</div>
        <p class="text-xs text-slate-300">${d.aidlcMechanics || dim.aidlc}</p>
        <div class="text-[11px] font-mono text-purple-200 bg-black/40 p-2 rounded">${d.aidlcExample || dim.aidlc}</div>
        <div class="text-[11px] text-slate-400 pt-1">
          <strong class="text-emerald-400">Strength:</strong> ${d.aidlcStrengths}<br>
          <strong class="text-rose-400">Weakness:</strong> ${d.aidlcWeaknesses}
        </div>
      </div>
    </div>

    <div class="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-1">
      <strong class="text-amber-400 uppercase text-xs">Architectural Golden Rule:</strong>
      <p class="text-xs text-slate-200">${d.goldenRule || dim.impact}</p>
    </div>
  `;

  document.getElementById('dimension-modal').classList.remove('hidden');
  lucide.createIcons();
}

function closeDimensionModal() {
  document.getElementById('dimension-modal').classList.add('hidden');
}

// ============================================================
// ARCHITECTURAL VISUAL DIAGRAMS & BLUEPRINT STUDIO
// ============================================================

function renderDiagrams() {
  const tabsContainer = document.getElementById('diagram-selector-tabs');
  if (!tabsContainer || !appState.visualDiagramsData) return;

  tabsContainer.innerHTML = appState.visualDiagramsData.map((d, idx) => `
    <button onclick="selectDiagram('${d.id}')" class="diagram-tab-btn px-3 py-1.5 text-xs rounded-lg font-medium transition flex items-center space-x-1.5 ${d.id === appState.selectedDiagramId ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-800'}">
      <span class="w-4 h-4 rounded-full bg-black/30 flex items-center justify-center text-[9px]">${idx + 1}</span>
      <span>${d.title.split(':')[0]}</span>
    </button>
  `).join('');

  renderActiveDiagram();
}

function selectDiagram(diagId) {
  appState.selectedDiagramId = diagId;
  renderDiagrams();
}

function renderActiveDiagram() {
  const container = document.getElementById('active-diagram-display');
  const diag = appState.visualDiagramsData.find(d => d.id === appState.selectedDiagramId);
  if (!container || !diag) return;

  let diagramVisualSvg = '';

  if (diag.id === 'diag_paradigm') {
    diagramVisualSvg = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <!-- Classical SDLC Procedural Engine -->
        <div class="p-5 rounded-2xl bg-blue-950/30 border border-blue-500/40 space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-blue-400 uppercase">1. Classical SDLC Deductive Machine</span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">Boolean Determinism</span>
          </div>
          <svg viewBox="0 0 500 240" class="w-full h-auto text-xs font-mono">
            <!-- Input Node -->
            <rect x="20" y="30" width="130" height="60" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
            <text x="85" y="55" fill="#93c5fd" text-anchor="middle" font-weight="bold">Input Data</text>
            <text x="85" y="73" fill="#64748b" text-anchor="middle" font-size="10">Typed Structs</text>

            <!-- Rules Node -->
            <rect x="20" y="140" width="130" height="60" rx="8" fill="#1e293b" stroke="#3b82f6" stroke-width="2"/>
            <text x="85" y="165" fill="#93c5fd" text-anchor="middle" font-weight="bold">Hardcoded Code</text>
            <text x="85" y="183" fill="#64748b" text-anchor="middle" font-size="10">If-Else / ASTs</text>

            <!-- Arrows to Compiler/CPU -->
            <path d="M 150 60 L 220 115" stroke="#3b82f6" stroke-width="2" marker-end="url(#arrow)"/>
            <path d="M 150 170 L 220 125" stroke="#3b82f6" stroke-width="2"/>

            <!-- Execution Engine -->
            <rect x="220" y="90" width="120" height="60" rx="8" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>
            <text x="280" y="118" fill="#ffffff" text-anchor="middle" font-weight="bold">CPU Engine</text>
            <text x="280" y="135" fill="#93c5fd" text-anchor="middle" font-size="10">Step-by-Step</text>

            <!-- Arrow to Output -->
            <path d="M 340 120 L 390 120" stroke="#10b981" stroke-width="2"/>

            <!-- Output Node -->
            <rect x="390" y="90" width="95" height="60" rx="8" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
            <text x="437" y="118" fill="#6ee7b7" text-anchor="middle" font-weight="bold">Answers</text>
            <text x="437" y="135" fill="#a7f3d0" text-anchor="middle" font-size="10">100% Certain</text>
          </svg>
          <div class="text-[11px] text-slate-300">
            <strong>Key Mechanism:</strong> Humans author the explicit rules line by line. The compiler translates statements into CPU opcodes. Every execution path is provably deterministic.
          </div>
        </div>

        <!-- Modern AiDLC Inductive Engine -->
        <div class="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/40 space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-purple-400 uppercase">2. Modern AiDLC Inductive Synthesis</span>
            <span class="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Statistical Weights</span>
          </div>
          <svg viewBox="0 0 500 240" class="w-full h-auto text-xs font-mono">
            <!-- Training / Input Data -->
            <rect x="20" y="30" width="130" height="60" rx="8" fill="#1e293b" stroke="#8b5cf6" stroke-width="2"/>
            <text x="85" y="55" fill="#c4b5fd" text-anchor="middle" font-weight="bold">Unstructured Data</text>
            <text x="85" y="73" fill="#64748b" text-anchor="middle" font-size="10">PDFs, Voice, Code</text>

            <!-- Golden Outputs -->
            <rect x="20" y="140" width="130" height="60" rx="8" fill="#1e293b" stroke="#8b5cf6" stroke-width="2"/>
            <text x="85" y="165" fill="#c4b5fd" text-anchor="middle" font-weight="bold">Golden Outputs</text>
            <text x="85" y="183" fill="#64748b" text-anchor="middle" font-size="10">Eval Benchmarks</text>

            <!-- Arrows to Neural Engine -->
            <path d="M 150 60 L 220 115" stroke="#8b5cf6" stroke-width="2"/>
            <path d="M 150 170 L 220 125" stroke="#8b5cf6" stroke-width="2"/>

            <!-- GPU / Neural Matrix -->
            <rect x="220" y="90" width="120" height="60" rx="8" fill="#4c1d95" stroke="#a78bfa" stroke-width="2"/>
            <text x="280" y="118" fill="#ffffff" text-anchor="middle" font-weight="bold">GPU / Weights</text>
            <text x="280" y="135" fill="#c4b5fd" text-anchor="middle" font-size="10">Probability Field</text>

            <!-- Arrow to Rules/Agent -->
            <path d="M 340 120 L 390 120" stroke="#a855f7" stroke-width="2"/>

            <!-- Emergent Agent -->
            <rect x="390" y="90" width="95" height="60" rx="8" fill="#581c87" stroke="#d8b4fe" stroke-width="2"/>
            <text x="437" y="118" fill="#f3e8ff" text-anchor="middle" font-weight="bold">Learned Rules</text>
            <text x="437" y="135" fill="#d8b4fe" text-anchor="middle" font-size="10">Emergent Agent</text>
          </svg>
          <div class="text-[11px] text-slate-300">
            <strong>Key Mechanism:</strong> Humans provide datasets and evaluation targets. The neural training and prompt optimization derive the high-dimensional transformation weights.
          </div>
        </div>
      </div>
    `;
  } else if (diag.id === 'diag_sandwich') {
    diagramVisualSvg = `
      <div class="space-y-4 pt-2">
        <svg viewBox="0 0 900 320" class="w-full h-auto text-xs font-mono">
          <!-- Background Zones -->
          <rect x="20" y="30" width="240" height="260" rx="12" fill="#0f172a" stroke="#3b82f6" stroke-width="2" stroke-dasharray="4 2"/>
          <text x="140" y="55" fill="#60a5fa" font-weight="bold" text-anchor="middle">LAYER 1: PRE-FLIGHT (SDLC)</text>

          <rect x="320" y="30" width="260" height="260" rx="12" fill="#1e1035" stroke="#a855f7" stroke-width="2"/>
          <text x="450" y="55" fill="#c084fc" font-weight="bold" text-anchor="middle">LAYER 2: AI REASONING (AiDLC)</text>

          <rect x="640" y="30" width="240" height="260" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="2" stroke-dasharray="4 2"/>
          <text x="760" y="55" fill="#6ee7b7" font-weight="bold" text-anchor="middle">LAYER 3: POST-FLIGHT (SDLC)</text>

          <!-- Layer 1 Nodes -->
          <rect x="40" y="80" width="200" height="45" rx="6" fill="#1e293b" stroke="#3b82f6"/>
          <text x="140" y="102" fill="#ffffff" text-anchor="middle" font-size="11">Schema & Auth Validation</text>
          <text x="140" y="117" fill="#93c5fd" text-anchor="middle" font-size="9">Zod / JWT / RBAC Check</text>

          <rect x="40" y="140" width="200" height="45" rx="6" fill="#1e293b" stroke="#3b82f6"/>
          <text x="140" y="162" fill="#ffffff" text-anchor="middle" font-size="11">PII Masking & Scrubbing</text>
          <text x="140" y="177" fill="#93c5fd" text-anchor="middle" font-size="9">Presidio / Tokenizer</text>

          <rect x="40" y="200" width="200" height="45" rx="6" fill="#1e293b" stroke="#3b82f6"/>
          <text x="140" y="222" fill="#ffffff" text-anchor="middle" font-size="11">Prompt Injection Shield</text>
          <text x="140" y="237" fill="#93c5fd" text-anchor="middle" font-size="9">Llama Guard / Rate Limiter</text>

          <!-- Arrow to Layer 2 -->
          <path d="M 260 160 L 320 160" stroke="#94a3b8" stroke-width="3" stroke-dasharray="5 3"/>

          <!-- Layer 2 Nodes -->
          <rect x="340" y="80" width="220" height="45" rx="6" fill="#3b0764" stroke="#a855f7"/>
          <text x="450" y="102" fill="#ffffff" text-anchor="middle" font-size="11">Vector RAG Retrieval</text>
          <text x="450" y="117" fill="#d8b4fe" text-anchor="middle" font-size="9">Tenant Filter & Rerank</text>

          <rect x="340" y="140" width="220" height="45" rx="6" fill="#3b0764" stroke="#a855f7"/>
          <text x="450" y="162" fill="#ffffff" text-anchor="middle" font-size="11">Low-Temp LLM Inference</text>
          <text x="450" y="177" fill="#d8b4fe" text-anchor="middle" font-size="9">Constrained Outlines Decoding</text>

          <rect x="340" y="200" width="220" height="45" rx="6" fill="#3b0764" stroke="#a855f7"/>
          <text x="450" y="222" fill="#ffffff" text-anchor="middle" font-size="11">Structured Tool Call JSON</text>
          <text x="450" y="237" fill="#d8b4fe" text-anchor="middle" font-size="9">JSON Object Candidate</text>

          <!-- Arrow to Layer 3 -->
          <path d="M 580 160 L 640 160" stroke="#94a3b8" stroke-width="3" stroke-dasharray="5 3"/>

          <!-- Layer 3 Nodes -->
          <rect x="660" y="80" width="200" height="45" rx="6" fill="#064e3b" stroke="#10b981"/>
          <text x="760" y="102" fill="#ffffff" text-anchor="middle" font-size="11">JSON Schema Strict Parse</text>
          <text x="760" y="117" fill="#a7f3d0" text-anchor="middle" font-size="9">Zod Boundary Enforcement</text>

          <rect x="660" y="140" width="200" height="45" rx="6" fill="#064e3b" stroke="#10b981"/>
          <text x="760" y="162" fill="#ffffff" text-anchor="middle" font-size="11">Business Rule Assertions</text>
          <text x="760" y="177" fill="#a7f3d0" text-anchor="middle" font-size="9">Limit Checks, Balance Checks</text>

          <rect x="660" y="200" width="200" height="45" rx="6" fill="#064e3b" stroke="#10b981"/>
          <text x="760" y="222" fill="#ffffff" text-anchor="middle" font-size="11">ACID Transaction Commit</text>
          <text x="760" y="237" fill="#a7f3d0" text-anchor="middle" font-size="9">PostgreSQL / Kafka Event</text>
        </svg>
        <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <strong>Architectural Insight:</strong> The Deterministic Sandwich Pattern ensures that an untrusted probabilistic model is NEVER connected directly to an authoritative database, external payment gateway, or physical actuator. Layer 1 sanitizes, Layer 2 reasons, Layer 3 verifies.
        </div>
      </div>
    `;
  } else if (diag.id === 'diag_lifecycle') {
    diagramVisualSvg = `
      <div class="space-y-4 pt-2">
        <svg viewBox="0 0 920 340" class="w-full h-auto text-xs font-mono">
          <!-- 7 Phases Header -->
          <text x="460" y="25" fill="#f8fafc" font-weight="bold" text-anchor="middle" font-size="13">7-Phase Comparative Lifecycle Pipeline</text>
          
          <!-- SDLC Pipeline Row -->
          <rect x="20" y="50" width="880" height="120" rx="10" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="40" y="75" fill="#60a5fa" font-weight="bold">Traditional SDLC Pipeline</text>

          <!-- SDLC Stages -->
          <g transform="translate(40, 90)">
            <rect x="0" y="0" width="105" height="60" rx="6" fill="#1e293b" stroke="#3b82f6"/>
            <text x="52" y="25" fill="#ffffff" text-anchor="middle" font-size="10" font-weight="bold">1. PRD & Specs</text>
            <text x="52" y="42" fill="#94a3b8" text-anchor="middle" font-size="8">Jira Stories</text>

            <rect x="120" y="0" width="105" height="60" rx="6" fill="#1e293b" stroke="#3b82f6"/>
            <text x="172" y="25" fill="#ffffff" text-anchor="middle" font-size="10" font-weight="bold">2. Architecture</text>
            <text x="172" y="42" fill="#94a3b8" text-anchor="middle" font-size="8">ERD & APIs</text>

            <rect x="240" y="0" width="105" height="60" rx="6" fill="#1e293b" stroke="#3b82f6"/>
            <text x="292" y="25" fill="#ffffff" text-anchor="middle" font-size="10" font-weight="bold">3. Code Build</text>
            <text x="292" y="42" fill="#94a3b8" text-anchor="middle" font-size="8">Clean Code</text>

            <rect x="360" y="0" width="105" height="60" rx="6" fill="#1e293b" stroke="#3b82f6"/>
            <text x="412" y="25" fill="#ffffff" text-anchor="middle" font-size="10" font-weight="bold">4. Unit QA</text>
            <text x="412" y="42" fill="#94a3b8" text-anchor="middle" font-size="8">Jest & Coverage</text>

            <rect x="480" y="0" width="105" height="60" rx="6" fill="#1e293b" stroke="#3b82f6"/>
            <text x="532" y="25" fill="#ffffff" text-anchor="middle" font-size="10" font-weight="bold">5. Release</text>
            <text x="532" y="42" fill="#94a3b8" text-anchor="middle" font-size="8">CI/CD Docker</text>

            <rect x="600" y="0" width="105" height="60" rx="6" fill="#1e293b" stroke="#3b82f6"/>
            <text x="652" y="25" fill="#ffffff" text-anchor="middle" font-size="10" font-weight="bold">6. Monitoring</text>
            <text x="652" y="42" fill="#94a3b8" text-anchor="middle" font-size="8">CPU/APM Latency</text>

            <rect x="720" y="0" width="105" height="60" rx="6" fill="#1e293b" stroke="#3b82f6"/>
            <text x="772" y="25" fill="#ffffff" text-anchor="middle" font-size="10" font-weight="bold">7. Patching</text>
            <text x="772" y="42" fill="#94a3b8" text-anchor="middle" font-size="8">Bug Fix / CVE</text>
          </g>

          <!-- AiDLC Pipeline Row -->
          <rect x="20" y="190" width="880" height="120" rx="10" fill="#1e1035" stroke="#a855f7" stroke-width="1.5"/>
          <text x="40" y="215" fill="#c084fc" font-weight="bold">Modern AiDLC Continuous Evaluation Pipeline</text>

          <!-- AiDLC Stages -->
          <g transform="translate(40, 230)">
            <rect x="0" y="0" width="105" height="60" rx="6" fill="#3b0764" stroke="#a855f7"/>
            <text x="52" y="25" fill="#ffffff" text-anchor="middle" font-size="10" font-weight="bold">1. Golden Sets</text>
            <text x="52" y="42" fill="#d8b4fe" text-anchor="middle" font-size="8">500+ Test Evals</text>

            <rect x="120" y="0" width="105" height="60" rx="6" fill="#3b0764" stroke="#a855f7"/>
            <text x="172" y="25" fill="#ffffff" text-anchor="middle" font-size="10" font-weight="bold">2. Compound Sys</text>
            <text x="172" y="42" fill="#d8b4fe" text-anchor="middle" font-size="8">RAG & SLM/LLM</text>

            <rect x="240" y="0" width="105" height="60" rx="6" fill="#3b0764" stroke="#a855f7"/>
            <text x="292" y="25" fill="#ffffff" text-anchor="middle" font-size="10" font-weight="bold">3. Alignment</text>
            <text x="292" y="42" fill="#d8b4fe" text-anchor="middle" font-size="8">Prompts / LoRA</text>

            <rect x="360" y="0" width="105" height="60" rx="6" fill="#3b0764" stroke="#a855f7"/>
            <text x="412" y="25" fill="#ffffff" text-anchor="middle" font-size="10" font-weight="bold">4. Prob Evals</text>
            <text x="412" y="42" fill="#d8b4fe" text-anchor="middle" font-size="8">Ragas / Red-Team</text>

            <rect x="480" y="0" width="105" height="60" rx="6" fill="#3b0764" stroke="#a855f7"/>
            <text x="532" y="25" fill="#ffffff" text-anchor="middle" font-size="10" font-weight="bold">5. Serving</text>
            <text x="532" y="42" fill="#d8b4fe" text-anchor="middle" font-size="8">vLLM / Quant FP8</text>

            <rect x="600" y="0" width="105" height="60" rx="6" fill="#3b0764" stroke="#a855f7"/>
            <text x="652" y="25" fill="#ffffff" text-anchor="middle" font-size="10" font-weight="bold">6. Drift Telemetry</text>
            <text x="652" y="42" fill="#d8b4fe" text-anchor="middle" font-size="8">Tokens & Halluc.</text>

            <rect x="720" y="0" width="105" height="60" rx="6" fill="#3b0764" stroke="#a855f7"/>
            <text x="772" y="25" fill="#ffffff" text-anchor="middle" font-size="10" font-weight="bold">7. Flywheel</text>
            <text x="772" y="42" fill="#d8b4fe" text-anchor="middle" font-size="8">Active Learning</text>
          </g>
        </svg>
      </div>
    `;
  } else if (diag.id === 'diag_dual_loop') {
    diagramVisualSvg = `
      <div class="space-y-4 pt-2">
        <svg viewBox="0 0 900 280" class="w-full h-auto text-xs font-mono">
          <!-- Outer Loop (SDLC) -->
          <rect x="30" y="30" width="840" height="220" rx="16" fill="#0f172a" stroke="#3b82f6" stroke-width="2"/>
          <text x="60" y="60" fill="#60a5fa" font-weight="bold" font-size="12">OUTER SDLC GOVERNANCE SPRINT LOOP (2-Week Cadence)</text>
          <text x="60" y="80" fill="#94a3b8" font-size="10">API Contracts, Docker Deployments, Kubernetes Scaling, Statutory CAB Audits</text>

          <!-- Inner Loop (AiDLC) -->
          <rect x="180" y="100" width="540" height="130" rx="12" fill="#1e1035" stroke="#a855f7" stroke-width="2"/>
          <text x="450" y="125" fill="#c084fc" font-weight="bold" text-anchor="middle" font-size="11">INNER AiDLC EVALUATION FLYWHEEL (Daily Iterations)</text>
          
          <g transform="translate(200, 140)">
            <rect x="0" y="0" width="110" height="65" rx="6" fill="#3b0764" stroke="#a855f7"/>
            <text x="55" y="28" fill="#ffffff" text-anchor="middle" font-size="10" font-weight="bold">Prompt Tuning</text>
            <text x="55" y="45" fill="#d8b4fe" text-anchor="middle" font-size="8">DSPy / Few-Shot</text>

            <path d="M 110 32 L 130 32" stroke="#a855f7" stroke-width="2"/>

            <rect x="130" y="0" width="110" height="65" rx="6" fill="#3b0764" stroke="#a855f7"/>
            <text x="185" y="28" fill="#ffffff" text-anchor="middle" font-size="10" font-weight="bold">Golden Evals</text>
            <text x="185" y="45" fill="#d8b4fe" text-anchor="middle" font-size="8">Ragas Benchmarks</text>

            <path d="M 240 32 L 260 32" stroke="#a855f7" stroke-width="2"/>

            <rect x="260" y="0" width="110" height="65" rx="6" fill="#3b0764" stroke="#a855f7"/>
            <text x="315" y="28" fill="#ffffff" text-anchor="middle" font-size="10" font-weight="bold">Red-Teaming</text>
            <text x="315" y="45" fill="#d8b4fe" text-anchor="middle" font-size="8">Promptfoo / Garak</text>

            <path d="M 370 32 L 390 32" stroke="#a855f7" stroke-width="2"/>

            <rect x="390" y="0" width="110" height="65" rx="6" fill="#064e3b" stroke="#10b981"/>
            <text x="445" y="28" fill="#6ee7b7" text-anchor="middle" font-size="10" font-weight="bold">Promote Config</text>
            <text x="445" y="45" fill="#a7f3d0" text-anchor="middle" font-size="8">Semantic Registry</text>
          </g>
        </svg>
      </div>
    `;
  } else if (diag.id === 'diag_guardrails') {
    diagramVisualSvg = `
      <div class="space-y-4 pt-2">
        <svg viewBox="0 0 900 240" class="w-full h-auto text-xs font-mono">
          <!-- 5 Layers as Connected Pipeline Blocks -->
          <g transform="translate(15, 30)">
            <rect x="0" y="0" width="160" height="150" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
            <text x="80" y="25" fill="#fbbf24" font-weight="bold" text-anchor="middle">LAYER 1: INPUT</text>
            <text x="80" y="55" fill="#ffffff" text-anchor="middle" font-size="10">PII Masking</text>
            <text x="80" y="75" fill="#ffffff" text-anchor="middle" font-size="10">Prompt Injection</text>
            <text x="80" y="95" fill="#ffffff" text-anchor="middle" font-size="10">Topical Boundary</text>
            <text x="80" y="115" fill="#ffffff" text-anchor="middle" font-size="10">Rate Limiting</text>
            <text x="80" y="135" fill="#94a3b8" text-anchor="middle" font-size="9">Llama Guard / Presidio</text>

            <path d="M 160 75 L 180 75" stroke="#f59e0b" stroke-width="2"/>

            <rect x="180" y="0" width="160" height="150" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
            <text x="260" y="25" fill="#fbbf24" font-weight="bold" text-anchor="middle">LAYER 2: RETRIEVAL</text>
            <text x="260" y="55" fill="#ffffff" text-anchor="middle" font-size="10">Tenant ACL Filter</text>
            <text x="260" y="75" fill="#ffffff" text-anchor="middle" font-size="10">Score Threshold (>0.7)</text>
            <text x="260" y="95" fill="#ffffff" text-anchor="middle" font-size="10">Anti-Poison Scans</text>
            <text x="260" y="115" fill="#ffffff" text-anchor="middle" font-size="10">Context Window Cap</text>
            <text x="260" y="135" fill="#94a3b8" text-anchor="middle" font-size="9">Cohere / Pinecone ACLs</text>

            <path d="M 340 75 L 360 75" stroke="#f59e0b" stroke-width="2"/>

            <rect x="360" y="0" width="160" height="150" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
            <text x="440" y="25" fill="#fbbf24" font-weight="bold" text-anchor="middle">LAYER 3: MODEL</text>
            <text x="440" y="55" fill="#ffffff" text-anchor="middle" font-size="10">Grammar Decoding</text>
            <text x="440" y="75" fill="#ffffff" text-anchor="middle" font-size="10">Temp Clamping (0.0)</text>
            <text x="440" y="95" fill="#ffffff" text-anchor="middle" font-size="10">Canary Tokens</text>
            <text x="440" y="115" fill="#ffffff" text-anchor="middle" font-size="10">System Prompt Lock</text>
            <text x="440" y="135" fill="#94a3b8" text-anchor="middle" font-size="9">Outlines / Guidance</text>

            <path d="M 520 75 L 540 75" stroke="#f59e0b" stroke-width="2"/>

            <rect x="540" y="0" width="160" height="150" rx="10" fill="#0f172a" stroke="#f59e0b" stroke-width="2"/>
            <text x="620" y="25" fill="#fbbf24" font-weight="bold" text-anchor="middle">LAYER 4: OUTPUT</text>
            <text x="620" y="55" fill="#ffffff" text-anchor="middle" font-size="10">Faithfulness NLI</text>
            <text x="620" y="75" fill="#ffffff" text-anchor="middle" font-size="10">JSON Schema Check</text>
            <text x="620" y="95" fill="#ffffff" text-anchor="middle" font-size="10">Toxicity Scanner</text>
            <text x="620" y="115" fill="#ffffff" text-anchor="middle" font-size="10">Business Assertions</text>
            <text x="620" y="135" fill="#94a3b8" text-anchor="middle" font-size="9">Guardrails AI / Zod</text>

            <path d="M 700 75 L 720 75" stroke="#f59e0b" stroke-width="2"/>

            <rect x="720" y="0" width="150" height="150" rx="10" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
            <text x="795" y="25" fill="#6ee7b7" font-weight="bold" text-anchor="middle">LAYER 5: OPS</text>
            <text x="795" y="55" fill="#ffffff" text-anchor="middle" font-size="10">Semantic Cache</text>
            <text x="795" y="75" fill="#ffffff" text-anchor="middle" font-size="10">Token Quota Caps</text>
            <text x="795" y="95" fill="#ffffff" text-anchor="middle" font-size="10">Circuit Breakers</text>
            <text x="795" y="115" fill="#ffffff" text-anchor="middle" font-size="10">Model Fallback</text>
            <text x="795" y="135" fill="#a7f3d0" text-anchor="middle" font-size="9">Redis / Portkey</text>
          </g>
        </svg>
      </div>
    `;
  } else if (diag.id === 'diag_cybersecurity') {
    diagramVisualSvg = `
      <div class="space-y-4 pt-2">
        <svg viewBox="0 0 920 360" class="w-full h-auto text-xs font-mono">
          <defs>
            <marker id="arrow-red" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444"/>
            </marker>
            <marker id="arrow-emerald" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981"/>
            </marker>
            <marker id="arrow-blue" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6"/>
            </marker>
          </defs>

          <!-- Title / Header -->
          <text x="460" y="24" fill="#f8fafc" font-weight="bold" text-anchor="middle" font-size="13">Enterprise AI Threat Interception & OWASP LLM Kill-Chain Defense</text>

          <!-- Threat Vector Zone (Red) -->
          <rect x="20" y="45" width="220" height="250" rx="12" fill="#450a0a" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4 2"/>
          <text x="130" y="70" fill="#fca5a5" font-weight="bold" text-anchor="middle">THREAT VECTORS</text>
          <text x="130" y="86" fill="#f87171" font-size="9" text-anchor="middle">Adversarial Exploitation</text>

          <rect x="35" y="100" width="190" height="42" rx="6" fill="#1e1b2e" stroke="#dc2626"/>
          <text x="130" y="118" fill="#ffffff" font-weight="bold" text-anchor="middle" font-size="10">LLM01: Prompt Injection</text>
          <text x="130" y="132" fill="#f87171" text-anchor="middle" font-size="8">Direct & Indirect Jailbreaks</text>

          <rect x="35" y="150" width="190" height="42" rx="6" fill="#1e1b2e" stroke="#dc2626"/>
          <text x="130" y="168" fill="#ffffff" font-weight="bold" text-anchor="middle" font-size="10">LLM04: RAG Data Poison</text>
          <text x="130" y="182" fill="#f87171" text-anchor="middle" font-size="8">Tainted Corpus & Web URLs</text>

          <rect x="35" y="200" width="190" height="42" rx="6" fill="#1e1b2e" stroke="#dc2626"/>
          <text x="130" y="218" fill="#ffffff" font-weight="bold" text-anchor="middle" font-size="10">LLM06: Excessive Agency</text>
          <text x="130" y="232" fill="#f87171" text-anchor="middle" font-size="8">Unchecked Destructive Tools</text>

          <rect x="35" y="250" width="190" height="36" rx="6" fill="#1e1b2e" stroke="#dc2626"/>
          <text x="130" y="267" fill="#ffffff" font-weight="bold" text-anchor="middle" font-size="10">LLM07: System Leakage</text>
          <text x="130" y="279" fill="#f87171" text-anchor="middle" font-size="8">Canary Token & Secrets Exfil</text>

          <!-- Red Attack Paths -->
          <path d="M 225 121 L 285 121" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow-red)"/>
          <path d="M 225 171 L 285 171" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow-red)"/>
          <path d="M 225 221 L 285 221" stroke="#ef4444" stroke-width="2" marker-end="url(#arrow-red)"/>

          <!-- Threat Interception Firewalls (Amber / Blue) -->
          <rect x="290" y="45" width="340" height="250" rx="12" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5"/>
          <text x="460" y="70" fill="#93c5fd" font-weight="bold" text-anchor="middle">DEFENSE-IN-DEPTH FIREWALLS</text>
          <text x="460" y="86" fill="#64748b" font-size="9" text-anchor="middle">Multi-Stage Inspection & Neutralization</text>

          <rect x="305" y="100" width="310" height="42" rx="6" fill="#1e293b" stroke="#60a5fa"/>
          <text x="460" y="118" fill="#ffffff" font-weight="bold" text-anchor="middle" font-size="10">Dual-LLM Semantic Guard & Classifier</text>
          <text x="460" y="132" fill="#93c5fd" text-anchor="middle" font-size="8">Perplexity Filter + Adversarial Llama Guard (LLM01 neutralized)</text>

          <rect x="305" y="150" width="310" height="42" rx="6" fill="#1e293b" stroke="#60a5fa"/>
          <text x="460" y="168" fill="#ffffff" font-weight="bold" text-anchor="middle" font-size="10">Corpus Integrity & Cryptographic Hashes</text>
          <text x="460" y="182" fill="#93c5fd" text-anchor="middle" font-size="8">SHA-256 Signatures & Isolation Enclaves (LLM04 neutralized)</text>

          <rect x="305" y="200" width="310" height="42" rx="6" fill="#1e293b" stroke="#60a5fa"/>
          <text x="460" y="218" fill="#ffffff" font-weight="bold" text-anchor="middle" font-size="10">Least-Privilege Agentic Broker & HITL</text>
          <text x="460" y="232" fill="#93c5fd" text-anchor="middle" font-size="8">Strict RBAC, Read-Only Scopes, Human Sign-Off (LLM06 neutralized)</text>

          <rect x="305" y="250" width="310" height="36" rx="6" fill="#1e293b" stroke="#60a5fa"/>
          <text x="460" y="267" fill="#ffffff" font-weight="bold" text-anchor="middle" font-size="10">Canary Traps & Output Entropy Auditing</text>
          <text x="460" y="279" fill="#93c5fd" text-anchor="middle" font-size="8">Synthetic token probes catch leakage before client egress (LLM07)</text>

          <!-- Pass-Through to Secure Enclave -->
          <path d="M 630 170 L 680 170" stroke="#10b981" stroke-width="3" marker-end="url(#arrow-emerald)"/>

          <!-- Secure Enterprise Core Enclave (Green) -->
          <rect x="690" y="45" width="210" height="250" rx="12" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
          <text x="795" y="70" fill="#6ee7b7" font-weight="bold" text-anchor="middle">SECURE ENCLAVE</text>
          <text x="795" y="86" fill="#a7f3d0" font-size="9" text-anchor="middle">Zero-Trust Enterprise</text>

          <rect x="705" y="105" width="180" height="45" rx="6" fill="#042f2e" stroke="#10b981"/>
          <text x="795" y="125" fill="#ffffff" font-weight="bold" text-anchor="middle" font-size="10">Authoritative Ledger</text>
          <text x="795" y="140" fill="#6ee7b7" text-anchor="middle" font-size="8">Immutable SQL / PostgreSQL</text>

          <rect x="705" y="160" width="180" height="45" rx="6" fill="#042f2e" stroke="#10b981"/>
          <text x="795" y="180" fill="#ffffff" font-weight="bold" text-anchor="middle" font-size="10">Sanitized AI Output</text>
          <text x="795" y="195" fill="#6ee7b7" text-anchor="middle" font-size="8">Verified JSON Schema</text>

          <rect x="705" y="215" width="180" height="45" rx="6" fill="#042f2e" stroke="#10b981"/>
          <text x="795" y="235" fill="#ffffff" font-weight="bold" text-anchor="middle" font-size="10">SIEM & Audit Trail</text>
          <text x="795" y="250" fill="#6ee7b7" text-anchor="middle" font-size="8">Splunk / MITRE ATLAS Log</text>

          <!-- Bottom Status -->
          <rect x="20" y="310" width="880" height="35" rx="8" fill="#1e293b" stroke="#475569"/>
          <text x="460" y="332" fill="#cbd5e1" font-size="10" text-anchor="middle">
            🛡️ Enterprise AI Security Gate: 0 Untrusted Tokens Reach Core Infrastructure Without Cryptographic & Semantic Inspection
          </text>
        </svg>
        <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <strong>Cybersecurity Architecture Insight:</strong> Traditional Web Application Firewalls (WAFs) inspect SQLi and XSS via regex patterns, but cannot parse semantic adversarial jailbreaks. The AI Threat Defense pipeline deploys an independent Llama Guard / NeMo inspection gateway, enforces strict tool execution bounds to neutralize Excessive Agency (LLM06), and mandates cryptographic document verification before RAG vector indexing.
        </div>
      </div>
    `;
  } else if (diag.id === 'diag_flywheel') {
    diagramVisualSvg = `
      <div class="space-y-4 pt-2">
        <svg viewBox="0 0 920 370" class="w-full h-auto text-xs font-mono">
          <defs>
            <marker id="arrow-purple" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#a855f7"/>
            </marker>
            <marker id="arrow-teal" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#14b8a6"/>
            </marker>
            <marker id="arrow-blue2" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#3b82f6"/>
            </marker>
          </defs>

          <!-- Title -->
          <text x="460" y="24" fill="#f8fafc" font-weight="bold" text-anchor="middle" font-size="13">Active Learning & Continuous Model Evaluation Flywheel</text>

          <!-- Step 1: Production Inference & Telemetry -->
          <g transform="translate(40, 50)">
            <rect x="0" y="0" width="240" height="90" rx="10" fill="#1e1035" stroke="#a855f7" stroke-width="2"/>
            <text x="120" y="25" fill="#d8b4fe" font-weight="bold" text-anchor="middle">1. PROD TRAFFIC & DRIFT</text>
            <text x="120" y="45" fill="#ffffff" text-anchor="middle" font-size="10">Telemetry & Confidence Scoring</text>
            <text x="120" y="62" fill="#c084fc" text-anchor="middle" font-size="9">Flags queries where confidence &lt; 0.85</text>
            <text x="120" y="76" fill="#94a3b8" text-anchor="middle" font-size="8">Langfuse / Arize / OpenTelemetry</text>
          </g>

          <!-- Arrow 1 to 2 -->
          <path d="M 280 95 L 335 95" stroke="#a855f7" stroke-width="2.5" marker-end="url(#arrow-purple)"/>

          <!-- Step 2: Semantic Shadow Sampling -->
          <g transform="translate(340, 50)">
            <rect x="0" y="0" width="240" height="90" rx="10" fill="#1e1035" stroke="#a855f7" stroke-width="2"/>
            <text x="120" y="25" fill="#d8b4fe" font-weight="bold" text-anchor="middle">2. SHADOW ANOMALY CLUSTERING</text>
            <text x="120" y="45" fill="#ffffff" text-anchor="middle" font-size="10">Latent Vector Density Triage</text>
            <text x="120" y="62" fill="#c084fc" text-anchor="middle" font-size="9">Groups uncategorized customer edge cases</text>
            <text x="120" y="76" fill="#94a3b8" text-anchor="middle" font-size="8">HDBSCAN / UMAP Embedding Probing</text>
          </g>

          <!-- Arrow 2 to 3 -->
          <path d="M 580 95 L 635 95" stroke="#a855f7" stroke-width="2.5" marker-end="url(#arrow-purple)"/>

          <!-- Step 3: HITL SME Curation -->
          <g transform="translate(640, 50)">
            <rect x="0" y="0" width="240" height="90" rx="10" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
            <text x="120" y="25" fill="#6ee7b7" font-weight="bold" text-anchor="middle">3. HUMAN-IN-THE-LOOP (HITL)</text>
            <text x="120" y="45" fill="#ffffff" text-anchor="middle" font-size="10">Domain Expert Labeling & Golden Sets</text>
            <text x="120" y="62" fill="#a7f3d0" text-anchor="middle" font-size="9">Resolves hallucination & edge ambiguities</text>
            <text x="120" y="76" fill="#6ee7b7" text-anchor="middle" font-size="8">Argilla / Label Studio / DVC Datasets</text>
          </g>

          <!-- Downward Loop Arrow -->
          <path d="M 760 140 L 760 205" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrow-teal)"/>

          <!-- Step 4: DSPy Prompting & LoRA Alignment -->
          <g transform="translate(640, 210)">
            <rect x="0" y="0" width="240" height="90" rx="10" fill="#0f172a" stroke="#14b8a6" stroke-width="2"/>
            <text x="120" y="25" fill="#5eead4" font-weight="bold" text-anchor="middle">4. RETRAINING & TUNING</text>
            <text x="120" y="45" fill="#ffffff" text-anchor="middle" font-size="10">DSPy Optimization & LoRA Adapters</text>
            <text x="120" y="62" fill="#2dd4bf" text-anchor="middle" font-size="9">Auto-tunes few-shot prompts & safetensors</text>
            <text x="120" y="76" fill="#94a3b8" text-anchor="middle" font-size="8">Unsloth / Axolotl / Hugging Face</text>
          </g>

          <!-- Leftward Arrow 4 to 5 -->
          <path d="M 640 255 L 585 255" stroke="#14b8a6" stroke-width="2.5" marker-end="url(#arrow-teal)"/>

          <!-- Step 5: Regression & Safety Benchmarking -->
          <g transform="translate(340, 210)">
            <rect x="0" y="0" width="240" height="90" rx="10" fill="#0f172a" stroke="#14b8a6" stroke-width="2"/>
            <text x="120" y="25" fill="#5eead4" font-weight="bold" text-anchor="middle">5. STATISTICAL EVALUATION GATE</text>
            <text x="120" y="45" fill="#ffffff" text-anchor="middle" font-size="10">Ragas Faithfulness & Red-Teaming</text>
            <text x="120" y="62" fill="#2dd4bf" text-anchor="middle" font-size="9">Gating Criteria: Faithfulness &gt;= 96%</text>
            <text x="120" y="76" fill="#94a3b8" text-anchor="middle" font-size="8">Promptfoo / Garak / DeepEval CI Gate</text>
          </g>

          <!-- Leftward Arrow 5 to 6 -->
          <path d="M 340 255 L 285 255" stroke="#14b8a6" stroke-width="2.5" marker-end="url(#arrow-teal)"/>

          <!-- Step 6: Canary Release & Production Promotion -->
          <g transform="translate(40, 210)">
            <rect x="0" y="0" width="240" height="90" rx="10" fill="#1e3a8a" stroke="#3b82f6" stroke-width="2"/>
            <text x="120" y="25" fill="#93c5fd" font-weight="bold" text-anchor="middle">6. CANARY SHADOW RELEASE</text>
            <text x="120" y="45" fill="#ffffff" text-anchor="middle" font-size="10">Zero-Downtime Traffic Promotion</text>
            <text x="120" y="62" fill="#60a5fa" text-anchor="middle" font-size="9">10% Canary split -&gt; 100% rollout</text>
            <text x="120" y="76" fill="#bfdbfe" text-anchor="middle" font-size="8">vLLM / Kubernetes Envoy Routing</text>
          </g>

          <!-- Flywheel Completion Arrow Back to Step 1 -->
          <path d="M 160 210 L 160 145" stroke="#3b82f6" stroke-width="2.5" marker-end="url(#arrow-blue2)"/>
          
          <!-- Central Flywheel Badge -->
          <circle cx="460" cy="175" r="26" fill="#1e293b" stroke="#a855f7" stroke-width="2"/>
          <text x="460" y="181" fill="#c084fc" font-size="16" text-anchor="middle">⟳</text>

          <!-- Bottom Legend -->
          <rect x="40" y="320" width="840" height="34" rx="8" fill="#1e293b" stroke="#334155"/>
          <text x="460" y="342" fill="#cbd5e1" font-size="10" text-anchor="middle">
            Continuous Active Learning: Production failures become tomorrow's golden benchmark test cases.
          </text>
        </svg>
        <div class="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
          <strong>MLOps Flywheel Insight:</strong> Unlike SDLC software which stays static once compiled until a developer writes a code patch, AiDLC applications continuously learn from production feedback. The flywheel isolates production queries where model confidence was low or where users flagged a thumbs-down, sends them to human SMEs to expand the Golden Evaluation Dataset, auto-optimizes prompts with DSPy or fine-tunes LoRA weights, runs automated safety evals, and deploys via zero-downtime canary traffic splits.
        </div>
      </div>
    `;
  } else {
    // Default Fallback
    diagramVisualSvg = `
      <div class="p-6 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-3">
        <i data-lucide="shield-check" class="w-12 h-12 text-emerald-400 mx-auto"></i>
        <h4 class="text-base font-bold text-white">${diag.title}</h4>
        <p class="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed">${diag.description}</p>
        <div class="text-xs font-mono text-emerald-400">Category: ${diag.category} | Operational Architecture Verified</div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800 gap-2">
      <div>
        <span class="text-xs font-bold uppercase tracking-wider text-emerald-400">${diag.category}</span>
        <h3 class="text-xl font-bold text-white mt-1">${diag.title}</h3>
      </div>
      <div class="text-xs text-slate-400 font-mono">Interactive Blueprint</div>
    </div>

    <p class="text-xs text-slate-300 leading-relaxed max-w-3xl">
      ${diag.description}
    </p>

    <!-- Visual SVG Graphic -->
    <div class="p-4 rounded-xl bg-slate-950/70 border border-slate-800 overflow-x-auto">
      ${diagramVisualSvg}
    </div>
  `;

  lucide.createIcons();
}

// ============================================================
// 7-PHASE COMPARATIVE LIFECYCLE
// ============================================================

function renderPhases() {
  const btnContainer = document.getElementById('phase-buttons-container');
  if (!btnContainer || !appState.phasesData) return;

  btnContainer.innerHTML = appState.phasesData.map((p, idx) => `
    <button onclick="selectPhase(${idx})" class="phase-btn px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center space-x-2 ${idx === appState.selectedPhaseIndex ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}">
      <span class="w-5 h-5 rounded-full bg-black/30 flex items-center justify-center text-[10px]">${p.phaseNumber}</span>
      <span>${p.phaseName}</span>
    </button>
  `).join('');

  renderActivePhaseDetail();
}

function selectPhase(index) {
  appState.selectedPhaseIndex = index;
  renderPhases();
}

function renderActivePhaseDetail() {
  const container = document.getElementById('active-phase-container');
  const phase = appState.phasesData[appState.selectedPhaseIndex];
  if (!container || !phase) return;

  container.innerHTML = `
    <div class="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-800 gap-4">
      <div>
        <div class="flex items-center space-x-2">
          <span class="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wide bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Phase 0${phase.phaseNumber}</span>
          <h3 class="text-xl sm:text-2xl font-extrabold text-white">${phase.phaseName}</h3>
        </div>
      </div>
      <div class="text-xs text-slate-400 flex items-center space-x-2">
        <span>Lifecycle Step ${phase.phaseNumber} of 7</span>
      </div>
    </div>

    <!-- Integrated Security & Governance Gate -->
    <div class="mt-4 p-4 rounded-xl bg-slate-900/90 border border-indigo-500/30 flex items-start space-x-3">
      <div class="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
        <i data-lucide="shield-check" class="w-4 h-4"></i>
      </div>
      <div>
        <span class="text-xs font-bold uppercase tracking-wider text-indigo-300">Phase Security & Compliance Gate:</span>
        <p class="text-xs text-slate-300 mt-1 leading-relaxed">${phase.securityGate || 'Standard enterprise audit checklist applied.'}</p>
      </div>
    </div>

    <!-- Side-by-Side Dual Column -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      
      <!-- SDLC Details -->
      <div class="glass-card rounded-xl p-5 border-t-4 border-t-blue-500 space-y-4">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-bold text-blue-400 uppercase tracking-wider flex items-center space-x-1.5">
            <i data-lucide="code" class="w-4 h-4"></i>
            <span>SDLC Execution</span>
          </h4>
          <span class="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300">Deterministic</span>
        </div>
        
        <div>
          <div class="text-xs font-semibold text-slate-300">Core Focus:</div>
          <p class="text-xs text-slate-300 mt-1 leading-relaxed">${phase.sdlcFocus}</p>
        </div>

        <div>
          <div class="text-xs font-semibold text-slate-300">Key Deliverables:</div>
          <div class="flex flex-wrap gap-1.5 mt-1.5">
            ${phase.sdlcDeliverables.map(d => `<span class="px-2 py-0.5 rounded text-[11px] bg-slate-900 text-blue-300 border border-blue-900/40">${d}</span>`).join('')}
          </div>
        </div>

        <div>
          <div class="text-xs font-semibold text-slate-300">Industry Toolchain:</div>
          <div class="flex flex-wrap gap-1.5 mt-1.5">
            ${phase.sdlcTools.map(t => `<span class="px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-300 border border-slate-800">${t}</span>`).join('')}
          </div>
        </div>

        <div class="p-3 rounded-lg bg-rose-950/20 border border-rose-900/30">
          <div class="text-xs font-bold text-rose-400 flex items-center space-x-1">
            <i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>
            <span>Primary Failure Mode</span>
          </div>
          <p class="text-xs text-rose-200/90 mt-1">${phase.sdlcFailureMode}</p>
        </div>
      </div>

      <!-- AiDLC Details -->
      <div class="glass-card rounded-xl p-5 border-t-4 border-t-purple-500 space-y-4">
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center space-x-1.5">
            <i data-lucide="sparkles" class="w-4 h-4"></i>
            <span>AiDLC Execution</span>
          </h4>
          <span class="text-[11px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300">Probabilistic</span>
        </div>
        
        <div>
          <div class="text-xs font-semibold text-slate-300">Core Focus:</div>
          <p class="text-xs text-slate-300 mt-1 leading-relaxed">${phase.aidlcFocus}</p>
        </div>

        <div>
          <div class="text-xs font-semibold text-slate-300">Key Deliverables:</div>
          <div class="flex flex-wrap gap-1.5 mt-1.5">
            ${phase.aidlcDeliverables.map(d => `<span class="px-2 py-0.5 rounded text-[11px] bg-slate-900 text-purple-300 border border-purple-900/40">${d}</span>`).join('')}
          </div>
        </div>

        <div>
          <div class="text-xs font-semibold text-slate-300">AI / LLMOps Toolchain:</div>
          <div class="flex flex-wrap gap-1.5 mt-1.5">
            ${phase.aidlcTools.map(t => `<span class="px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-300 border border-slate-800">${t}</span>`).join('')}
          </div>
        </div>

        <div class="p-3 rounded-lg bg-rose-950/20 border border-rose-900/30">
          <div class="text-xs font-bold text-rose-400 flex items-center space-x-1">
            <i data-lucide="alert-circle" class="w-3.5 h-3.5"></i>
            <span>Primary Failure Mode</span>
          </div>
          <p class="text-xs text-rose-200/90 mt-1">${phase.aidlcFailureMode}</p>
        </div>
      </div>

    </div>
  `;

  lucide.createIcons();
}

// Render Advantages & Limitations
function renderAdvantages() {
  if (!appState.advantagesData) return;

  const sdlcAdv = document.getElementById('sdlc-advantages-list');
  const sdlcDis = document.getElementById('sdlc-disadvantages-list');
  const aidlcAdv = document.getElementById('aidlc-advantages-list');
  const aidlcDis = document.getElementById('aidlc-disadvantages-list');

  if (sdlcAdv) {
    sdlcAdv.innerHTML = appState.advantagesData.sdlc.advantages.map(a => `
      <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition">
        <div class="text-xs font-bold text-white">${a.title}</div>
        <p class="text-xs text-slate-400 mt-1 leading-relaxed">${a.desc}</p>
      </div>
    `).join('');
  }

  if (sdlcDis) {
    sdlcDis.innerHTML = appState.advantagesData.sdlc.disadvantages.map(d => `
      <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition">
        <div class="text-xs font-bold text-slate-200">${d.title}</div>
        <p class="text-xs text-slate-400 mt-1 leading-relaxed">${d.desc}</p>
      </div>
    `).join('');
  }

  if (aidlcAdv) {
    aidlcAdv.innerHTML = appState.advantagesData.aidlc.advantages.map(a => `
      <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition">
        <div class="text-xs font-bold text-white">${a.title}</div>
        <p class="text-xs text-slate-400 mt-1 leading-relaxed">${a.desc}</p>
      </div>
    `).join('');
  }

  if (aidlcDis) {
    aidlcDis.innerHTML = appState.advantagesData.aidlc.disadvantages.map(d => `
      <div class="p-3 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition">
        <div class="text-xs font-bold text-slate-200">${d.title}</div>
        <p class="text-xs text-slate-400 mt-1 leading-relaxed">${d.desc}</p>
      </div>
    `).join('');
  }
}

// Render Domain Decision Matrix
function renderMatrix() {
  const container = document.getElementById('domain-matrix-grid');
  if (!container || !appState.domainMatrix) return;

  const filtered = appState.domainMatrix.filter(item => {
    if (appState.matrixFilter === 'all') return true;
    return item.recommendedApproach.includes(appState.matrixFilter);
  });

  container.innerHTML = filtered.map(item => {
    const isSDLC = item.recommendedApproach.includes('SDLC') && !item.recommendedApproach.includes('Compound');
    const isAiDLC = item.recommendedApproach.includes('AiDLC');
    const isCompound = item.recommendedApproach.includes('Compound');

    let badgeClass = 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (isCompound) badgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    else if (isAiDLC) badgeClass = 'bg-purple-500/20 text-purple-300 border-purple-500/30';

    return `
      <div class="glass-card rounded-xl p-5 border border-slate-800 flex flex-col justify-between space-y-4">
        <div>
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <span class="text-xs font-bold text-white tracking-wide">${item.domain}</span>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}">
              ${item.recommendedApproach}
            </span>
          </div>
          <div class="text-xs text-slate-400 mt-1 font-mono">${item.useCase}</div>
          
          ${item.complianceFramework ? `
            <div class="mt-2 inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-sky-300">
              <i data-lucide="scale" class="w-3 h-3"></i>
              <span>Mandate: ${item.complianceFramework}</span>
            </div>
          ` : ''}

          <p class="text-xs text-slate-300 mt-3 leading-relaxed">
            <strong class="text-slate-100">Architectural Rationale:</strong> ${item.rationale}
          </p>
        </div>
        <div class="pt-3 border-t border-slate-800/80 text-[11px] text-amber-300/90 flex items-start space-x-1.5">
          <i data-lucide="shield-alert" class="w-4 h-4 text-amber-400 shrink-0 mt-0.5"></i>
          <span><strong>Risk Factor:</strong> ${item.keyRisks}</span>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function filterMatrix(type) {
  appState.matrixFilter = type;
  document.querySelectorAll('.matrix-filter-btn').forEach(btn => {
    if (btn.dataset.filter === type) {
      btn.classList.add('bg-slate-800', 'text-white');
      btn.classList.remove('text-slate-400');
    } else {
      btn.classList.remove('bg-slate-800', 'text-white');
      btn.classList.add('text-slate-400');
    }
  });
  renderMatrix();
}

// Render Guardrails Stack
function renderGuardrails() {
  const container = document.getElementById('guardrails-layers-container');
  if (!container || !appState.guardrailsData) return;

  container.innerHTML = appState.guardrailsData.layers.map((layer, idx) => `
    <div class="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-800 gap-2">
        <div class="flex items-center space-x-3">
          <span class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
            0${idx + 1}
          </span>
          <h3 class="text-base font-bold text-white">${layer.layer}</h3>
        </div>
        <span class="text-xs px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-mono">
          Defense-in-Depth
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div class="text-xs font-semibold text-slate-400">Layer Objective:</div>
          <p class="text-xs text-slate-200 mt-1 leading-relaxed">${layer.purpose}</p>
        </div>
        <div>
          <div class="text-xs font-semibold text-rose-400">Key Vulnerabilities Addressed:</div>
          <p class="text-xs text-slate-300 mt-1 leading-relaxed">${layer.keyRisksAddressed}</p>
        </div>
      </div>

      <div class="space-y-2 pt-2">
        <div class="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Safeguard Mechanisms:</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          ${layer.mechanisms.map(m => `
            <div class="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div class="text-xs font-bold text-amber-300">${m.name}</div>
              <p class="text-xs text-slate-400 mt-1 leading-relaxed">${m.detail}</p>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="pt-3 border-t border-slate-800/80 flex items-center space-x-2 flex-wrap">
        <span class="text-[11px] font-semibold text-slate-400">Industry Tooling:</span>
        ${layer.recommendedTools.map(tool => `
          <span class="px-2 py-0.5 rounded text-[11px] bg-slate-900 text-amber-200 border border-amber-900/40">${tool}</span>
        `).join('')}
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

// Render Governance Frameworks & Mechanisms
function renderGovernance() {
  const frameworksContainer = document.getElementById('governance-frameworks-grid');
  const mechanismsContainer = document.getElementById('governance-mechanisms-grid');
  if (!appState.governanceData) return;

  if (frameworksContainer) {
    frameworksContainer.innerHTML = appState.governanceData.frameworks.map(f => `
      <div class="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 flex flex-col justify-between">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">${f.type}</span>
          </div>
          <h4 class="text-base font-bold text-white">${f.name}</h4>
          <p class="text-xs text-slate-300 leading-relaxed">${f.description}</p>
          
          <div class="space-y-1.5 pt-2 border-t border-slate-800">
            <div class="text-[11px] font-bold text-sky-400 uppercase tracking-wider">Core Requirements:</div>
            <ul class="text-xs text-slate-400 space-y-1 list-disc list-inside">
              ${f.corePillars.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
          <strong class="text-slate-300">Enterprise Relevance:</strong> ${f.relevance}
        </div>
      </div>
    `).join('');
  }

  if (mechanismsContainer) {
    mechanismsContainer.innerHTML = appState.governanceData.governanceMechanisms.map(m => `
      <div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5">
        <div class="text-xs font-bold text-white flex items-center space-x-1.5">
          <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-400"></i>
          <span>${m.name}</span>
        </div>
        <p class="text-xs text-slate-400 leading-relaxed">${m.description}</p>
      </div>
    `).join('');
  }

  lucide.createIcons();
}

// Render Cybersecurity Data
function renderCybersecurity() {
  const appsecList = document.getElementById('appsec-threats-list');
  const aisecList = document.getElementById('aisec-threats-list');
  const owaspGrid = document.getElementById('owasp-llm-grid');
  const lifecycleGrid = document.getElementById('threat-defense-lifecycle-grid');

  if (!appState.cybersecurityData) return;

  if (appsecList) {
    appsecList.innerHTML = appState.cybersecurityData.comparison.traditionalAppSec.map(t => `
      <div class="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
        <div class="text-xs font-bold text-blue-300">${t.threat}</div>
        <p class="text-xs text-slate-400 mt-0.5"><strong>Defense:</strong> ${t.defense}</p>
      </div>
    `).join('');
  }

  if (aisecList) {
    aisecList.innerHTML = appState.cybersecurityData.comparison.aiCybersecurity.map(t => `
      <div class="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
        <div class="text-xs font-bold text-rose-300">${t.threat}</div>
        <p class="text-xs text-slate-400 mt-0.5"><strong>Defense:</strong> ${t.defense}</p>
      </div>
    `).join('');
  }

  if (owaspGrid) {
    owaspGrid.innerHTML = appState.cybersecurityData.owaspTop10LLM.map(o => `
      <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-rose-500/40 transition">
        <div class="flex items-center justify-between">
          <span class="text-xs font-mono font-bold text-rose-400">${o.code}</span>
          <span class="text-[10px] px-1.5 py-0.5 rounded font-semibold ${o.severity === 'Critical' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'}">${o.severity}</span>
        </div>
        <div class="text-xs font-bold text-white leading-tight">${o.name}</div>
        <p class="text-[11px] text-slate-400 leading-snug">${o.desc}</p>
      </div>
    `).join('');
  }

  if (lifecycleGrid) {
    lifecycleGrid.innerHTML = appState.cybersecurityData.threatDefenseLifecycle.map((stage, idx) => `
      <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
        <div class="text-xs font-bold text-purple-300">Phase 0${idx + 1}: ${stage.phase}</div>
        <p class="text-xs text-slate-400 leading-relaxed">${stage.detail}</p>
      </div>
    `).join('');
  }

  lucide.createIcons();
}

// ============================================================
// 12 REAL-WORLD CROSS-DOMAIN CASE STUDIES
// ============================================================

function filterCaseStudies(category) {
  appState.caseStudyFilter = category;
  document.querySelectorAll('.cs-filter-btn').forEach(btn => {
    if (btn.dataset.filter === category) {
      btn.classList.add('bg-slate-800', 'text-white');
      btn.classList.remove('text-slate-400');
    } else {
      btn.classList.remove('bg-slate-800', 'text-white');
      btn.classList.add('text-slate-400');
    }
  });
  renderCaseStudies();
}

function renderCaseStudies() {
  const container = document.getElementById('case-studies-container');
  if (!container || !appState.caseStudiesData) return;

  const filtered = appState.caseStudiesData.filter(cs => {
    if (appState.caseStudyFilter === 'all') return true;
    return cs.domainCategory === appState.caseStudyFilter || cs.industry.includes(appState.caseStudyFilter);
  });

  container.innerHTML = filtered.map(cs => `
    <div class="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
      
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-800 gap-2">
        <div>
          <span class="px-2.5 py-0.5 rounded text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">${cs.industry}</span>
          <h3 class="text-lg sm:text-xl font-bold text-white mt-1.5">${cs.title}</h3>
        </div>
        <div class="text-xs text-slate-400 font-mono">Case Study Artifact</div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
          <strong class="text-slate-200">Business Challenge:</strong>
          <p class="text-slate-400 mt-1 leading-relaxed">${cs.challenge}</p>
        </div>
        <div class="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/40">
          <strong class="text-indigo-300">Architectural Decision:</strong>
          <p class="text-slate-300 mt-1 leading-relaxed">${cs.architecturalDecision}</p>
        </div>
      </div>

      <!-- Comparative breakdown inside the case study -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        
        <!-- SDLC Module -->
        <div class="p-4 rounded-xl bg-blue-950/20 border border-blue-900/40 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-blue-400 uppercase">Deterministic SDLC Subsystem</span>
            <i data-lucide="database" class="w-4 h-4 text-blue-400"></i>
          </div>
          <div class="text-xs font-bold text-white">${cs.sdlcComponent.domain}</div>
          <div class="text-[11px] font-mono text-blue-300">${cs.sdlcComponent.pattern}</div>
          <p class="text-xs text-slate-400">${cs.sdlcComponent.rationale}</p>
          <div class="text-xs text-emerald-400 font-semibold pt-1 border-t border-slate-800">
            Outcome: ${cs.sdlcComponent.outcome}
          </div>
        </div>

        <!-- AiDLC Module -->
        <div class="p-4 rounded-xl bg-purple-950/20 border border-purple-900/40 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-purple-400 uppercase">Probabilistic AiDLC Subsystem</span>
            <i data-lucide="sparkles" class="w-4 h-4 text-purple-400"></i>
          </div>
          <div class="text-xs font-bold text-white">${cs.aidlcComponent.domain}</div>
          <div class="text-[11px] font-mono text-purple-300">${cs.aidlcComponent.pattern}</div>
          <p class="text-xs text-slate-400">${cs.aidlcComponent.rationale}</p>
          <p class="text-[11px] text-amber-300"><strong>Guardrails:</strong> ${cs.aidlcComponent.guardrails}</p>
          <div class="text-xs text-emerald-400 font-semibold pt-1 border-t border-slate-800">
            Outcome: ${cs.aidlcComponent.outcome}
          </div>
        </div>

      </div>

      <!-- Core Lesson Learned -->
      <div class="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs flex items-start space-x-2">
        <i data-lucide="lightbulb" class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"></i>
        <span><strong class="text-white">Enterprise Architectural Lesson:</strong> <span class="text-slate-300">${cs.lessonLearned}</span></span>
      </div>

    </div>
  `).join('');

  lucide.createIcons();
}

// Render Hybrid Patterns
function renderHybridPatterns() {
  const container = document.getElementById('hybrid-patterns-grid');
  if (!container || !appState.hybridPatterns) return;

  const patterns = appState.hybridPatterns.filter(p => p.id !== 'sandwich');

  container.innerHTML = patterns.map(p => `
    <div class="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
      <div class="flex items-center justify-between">
        <h4 class="text-base font-bold text-white">${p.name}</h4>
        <span class="px-2.5 py-0.5 rounded text-[11px] font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">Hybrid Model</span>
      </div>
      <p class="text-xs text-purple-300 font-semibold">${p.tagline}</p>
      <p class="text-xs text-slate-300 leading-relaxed">${p.description}</p>
      <div class="space-y-2 pt-2 border-t border-slate-800/80">
        ${p.steps.map(s => `
          <div class="text-xs">
            <span class="font-bold text-slate-200">${s.step}:</span>
            <span class="text-slate-400 ml-1">${s.detail}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  lucide.createIcons();
}

// Render Roles
function renderRoles() {
  const container = document.getElementById('roles-grid');
  if (!container || !appState.rolesData) return;

  container.innerHTML = appState.rolesData.map(role => `
    <div class="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
      <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Traditional SDLC</div>
      <div class="text-sm font-bold text-blue-400">${role.traditionalRole}</div>
      <div class="flex items-center space-x-1.5 text-xs text-purple-400 py-1">
        <i data-lucide="arrow-down" class="w-4 h-4"></i>
        <span>Transforms into</span>
      </div>
      <div class="text-xs font-semibold text-purple-300 uppercase tracking-wider">AiDLC Evolution</div>
      <div class="text-sm font-bold text-white">${role.aiRole}</div>
      <p class="text-xs text-slate-400 pt-2 border-t border-slate-800 leading-relaxed">
        ${role.shift}
      </p>
    </div>
  `).join('');

  lucide.createIcons();
}

// Chart.js Radar Initialization & Update
function initAssessmentChart(scores = { determinismNeed: 50, generativePower: 50, costEfficiency: 70, explainability: 65, speedToMarket: 85 }) {
  const ctx = document.getElementById('assessmentChart');
  if (!ctx) return;

  if (appState.radarChartInstance) {
    appState.radarChartInstance.destroy();
  }

  appState.radarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Determinism', 'Generative Power', 'Cost Efficiency', 'Explainability', 'Speed to Market'],
      datasets: [{
        label: 'Project Architectural Profile',
        data: [
          scores.determinismNeed,
          scores.generativePower,
          scores.costEfficiency,
          scores.explainability,
          scores.speedToMarket
        ],
        backgroundColor: 'rgba(139, 92, 246, 0.25)',
        borderColor: 'rgba(139, 92, 246, 0.9)',
        borderWidth: 2,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#ffffff',
        pointRadius: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: { display: false, stepSize: 20 },
          grid: { color: 'rgba(255, 255, 255, 0.08)' },
          angleLines: { color: 'rgba(255, 255, 255, 0.08)' },
          pointLabels: {
            color: '#94a3b8',
            font: { size: 10, family: "'Plus Jakarta Sans', sans-serif" }
          }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Handle Assessment Submit
async function handleAssessmentSubmit(event) {
  event.preventDefault();
  
  const payload = {
    problemNature: document.getElementById('param-problemNature').value,
    explainabilityNeed: document.getElementById('param-explainabilityNeed').value,
    dataMaturity: document.getElementById('param-dataMaturity').value,
    errorTolerance: document.getElementById('param-errorTolerance').value,
    budgetScale: document.getElementById('param-budgetScale').value
  };

  try {
    const res = await fetch('/api/assess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const json = await res.json();
    if (json.status === 'success') {
      const data = json.data;

      // Update UI
      document.getElementById('verdict-title').innerText = data.verdict;
      document.getElementById('verdict-confidence').innerText = `${data.confidenceScore}% Match`;
      document.getElementById('verdict-pattern').innerText = `Pattern: ${data.architecturalPattern}`;
      document.getElementById('verdict-recommendation').innerText = data.recommendation;

      // Colorize title
      const titleEl = document.getElementById('verdict-title');
      if (data.verdict.includes('SDLC')) {
        titleEl.className = 'text-2xl font-extrabold text-blue-400';
      } else if (data.verdict.includes('AiDLC')) {
        titleEl.className = 'text-2xl font-extrabold text-purple-400';
      } else {
        titleEl.className = 'text-2xl font-extrabold text-emerald-400';
      }

      // Guardrails
      const guardrailsEl = document.getElementById('verdict-guardrails');
      guardrailsEl.innerHTML = data.guardrailRecommendations.map(g => `<li>${g}</li>`).join('');

      // Tools
      const toolsEl = document.getElementById('verdict-tools');
      toolsEl.innerHTML = data.suggestedToolchain.map(t => `
        <span class="px-2 py-0.5 rounded text-[11px] bg-slate-900 text-purple-300 border border-slate-700">${t}</span>
      `).join('');

      // Update chart
      initAssessmentChart(data.breakdownScores);
    }
  } catch (err) {
    console.error('Assessment API error:', err);
  }
}

// ============================================================
// SECTION 12: ENTERPRISE FINOPS TCO & LATENCY SIMULATOR
// ============================================================

let finopsDebounceTimer = null;

function initFinOps() {
  onFinOpsInputChange();
}

function onFinOpsInputChange() {
  const qSlider = document.getElementById('slider-queries');
  const pSlider = document.getElementById('slider-prompt');
  const cSlider = document.getElementById('slider-completion');
  const cacheSlider = document.getElementById('slider-cache');
  const tierSelect = document.getElementById('finops-model-tier');

  if (!qSlider || !pSlider || !cSlider || !cacheSlider) return;

  const queries = Number(qSlider.value);
  const promptTokens = Number(pSlider.value);
  const completionTokens = Number(cSlider.value);
  const cacheHitRate = Number(cacheSlider.value) / 100;
  const modelTier = tierSelect ? tierSelect.value : 'flagship';

  // Update label displays
  document.getElementById('slider-queries-val').innerText = `${queries.toLocaleString()} req/day`;
  document.getElementById('slider-prompt-val').innerText = `${promptTokens.toLocaleString()} tokens`;
  document.getElementById('slider-completion-val').innerText = `${completionTokens.toLocaleString()} tokens`;
  document.getElementById('slider-cache-val').innerText = `${Math.round(cacheHitRate * 100)}%`;

  clearTimeout(finopsDebounceTimer);
  finopsDebounceTimer = setTimeout(async () => {
    try {
      const res = await fetch('/api/finops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dailyQueries: queries,
          promptTokens,
          completionTokens,
          cacheHitRate,
          modelTier
        })
      });
      const json = await res.json();
      if (json.status === 'success') {
        renderFinOps(json.data);
      }
    } catch (err) {
      console.error('FinOps API error:', err);
    }
  }, 100);
}

function resetFinOpsDefaults() {
  document.getElementById('slider-queries').value = 50000;
  document.getElementById('slider-prompt').value = 800;
  document.getElementById('slider-completion').value = 300;
  document.getElementById('slider-cache').value = 35;
  document.getElementById('finops-model-tier').value = 'flagship';
  onFinOpsInputChange();
}

function renderFinOps(data) {
  if (!data || !data.metrics) return;
  const { metrics, recommendation } = data;

  // Recommendation text
  const recEl = document.getElementById('finops-recommendation-text');
  if (recEl) {
    recEl.innerText = recommendation;
  }

  // 4 Cards Grid
  const grid = document.getElementById('finops-cards-grid');
  if (grid) {
    grid.innerHTML = `
      <!-- Pure SDLC -->
      <div class="p-5 rounded-2xl bg-slate-900 border border-blue-500/30 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-blue-400 uppercase">1. Pure SDLC</span>
          <span class="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">Microservices</span>
        </div>
        <div class="space-y-1">
          <div class="text-2xl font-black text-white font-mono">$${metrics.pureSdlc.monthlyCostUsd.toLocaleString()} <span class="text-xs text-slate-400 font-normal">/mo</span></div>
          <div class="text-xs text-slate-400 font-mono">$${metrics.pureSdlc.annualCostUsd.toLocaleString()} / year</div>
        </div>
        <div class="pt-2 border-t border-slate-800 space-y-1 text-xs text-slate-300">
          <div class="flex justify-between"><span>Unit Cost:</span><span class="font-mono text-blue-400">$${metrics.pureSdlc.costPer1kQueriesUsd} / 1k</span></div>
          <div class="flex justify-between"><span>P95 Latency:</span><span class="font-mono text-emerald-400">${metrics.pureSdlc.latencyP95Ms} ms</span></div>
          <div class="flex justify-between"><span>Carbon Footprint:</span><span class="font-mono text-slate-400">${metrics.pureSdlc.carbonKgCo2eYear} kg CO2e</span></div>
        </div>
      </div>

      <!-- Pure AiDLC -->
      <div class="p-5 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-purple-400 uppercase">2. Pure AiDLC</span>
          <span class="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">Frontier API</span>
        </div>
        <div class="space-y-1">
          <div class="text-2xl font-black text-white font-mono">$${metrics.pureAidlc.monthlyCostUsd.toLocaleString()} <span class="text-xs text-slate-400 font-normal">/mo</span></div>
          <div class="text-xs text-slate-400 font-mono">$${metrics.pureAidlc.annualCostUsd.toLocaleString()} / year</div>
        </div>
        <div class="pt-2 border-t border-slate-800 space-y-1 text-xs text-slate-300">
          <div class="flex justify-between"><span>Unit Cost:</span><span class="font-mono text-purple-400">$${metrics.pureAidlc.costPer1kQueriesUsd} / 1k</span></div>
          <div class="flex justify-between"><span>P95 Latency:</span><span class="font-mono text-amber-400">${metrics.pureAidlc.latencyP95Ms} ms</span></div>
          <div class="flex justify-between"><span>Carbon Footprint:</span><span class="font-mono text-slate-400">${metrics.pureAidlc.carbonKgCo2eYear} kg CO2e</span></div>
        </div>
      </div>

      <!-- Compound AI (Best ROI) -->
      <div class="p-5 rounded-2xl bg-emerald-950/30 border-2 border-emerald-500/60 shadow-lg shadow-emerald-500/10 space-y-3 relative overflow-hidden">
        <div class="absolute -right-10 top-3 bg-emerald-500 text-slate-950 text-[9px] font-bold py-0.5 px-10 rotate-45 uppercase tracking-wider">
          Best Unit ROI
        </div>
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-emerald-400 uppercase">3. Compound AI</span>
          <span class="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Cached + SLM + Guardrails</span>
        </div>
        <div class="space-y-1">
          <div class="text-2xl font-black text-emerald-300 font-mono">$${metrics.compoundAi.monthlyCostUsd.toLocaleString()} <span class="text-xs text-slate-400 font-normal">/mo</span></div>
          <div class="text-xs text-emerald-400/90 font-mono font-semibold">Saves $${metrics.compoundAi.annualSavingsUsd.toLocaleString()}/yr (${metrics.compoundAi.savingsPercent}% OFF)</div>
        </div>
        <div class="pt-2 border-t border-emerald-500/30 space-y-1 text-xs text-slate-300">
          <div class="flex justify-between"><span>Unit Cost:</span><span class="font-mono text-emerald-400">$${metrics.compoundAi.costPer1kQueriesUsd} / 1k</span></div>
          <div class="flex justify-between"><span>P95 Latency:</span><span class="font-mono text-emerald-400">${metrics.compoundAi.latencyP95Ms} ms</span></div>
          <div class="flex justify-between"><span>Carbon Footprint:</span><span class="font-mono text-slate-400">${metrics.compoundAi.carbonKgCo2eYear} kg CO2e</span></div>
        </div>
      </div>

      <!-- Self-Hosted Open Weights -->
      <div class="p-5 rounded-2xl bg-slate-900 border border-teal-500/30 space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-teal-400 uppercase">4. Private GPU Cluster</span>
          <span class="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20">${metrics.selfHosted.requiredGpuNodes}x 8-GPU Node</span>
        </div>
        <div class="space-y-1">
          <div class="text-2xl font-black text-white font-mono">$${metrics.selfHosted.monthlyCostUsd.toLocaleString()} <span class="text-xs text-slate-400 font-normal">/mo</span></div>
          <div class="text-xs text-slate-400 font-mono">$${metrics.selfHosted.annualCostUsd.toLocaleString()} / year</div>
        </div>
        <div class="pt-2 border-t border-slate-800 space-y-1 text-xs text-slate-300">
          <div class="flex justify-between"><span>Unit Cost:</span><span class="font-mono text-teal-400">$${metrics.selfHosted.costPer1kQueriesUsd} / 1k</span></div>
          <div class="flex justify-between"><span>P95 Latency:</span><span class="font-mono text-teal-400">${metrics.selfHosted.latencyP95Ms} ms</span></div>
          <div class="flex justify-between"><span>Infrastructure:</span><span class="font-mono text-slate-400 text-[10px]">H100 + vLLM</span></div>
        </div>
      </div>
    `;
  }

  // Table rows
  const tbody = document.getElementById('finops-table-body');
  if (tbody) {
    tbody.innerHTML = `
      <tr class="hover:bg-slate-900/50">
        <td class="py-2.5 px-3 font-semibold text-blue-300">${metrics.pureSdlc.architecture}</td>
        <td class="py-2.5 px-3 text-white">$${metrics.pureSdlc.monthlyCostUsd.toLocaleString()}</td>
        <td class="py-2.5 px-3 text-white">$${metrics.pureSdlc.annualCostUsd.toLocaleString()}</td>
        <td class="py-2.5 px-3 text-blue-400">$${metrics.pureSdlc.costPer1kQueriesUsd}</td>
        <td class="py-2.5 px-3 text-emerald-400">${metrics.pureSdlc.latencyP95Ms}ms</td>
        <td class="py-2.5 px-3 text-slate-400">${metrics.pureSdlc.carbonKgCo2eYear} kg</td>
      </tr>
      <tr class="hover:bg-slate-900/50">
        <td class="py-2.5 px-3 font-semibold text-purple-300">${metrics.pureAidlc.architecture}</td>
        <td class="py-2.5 px-3 text-white">$${metrics.pureAidlc.monthlyCostUsd.toLocaleString()}</td>
        <td class="py-2.5 px-3 text-white">$${metrics.pureAidlc.annualCostUsd.toLocaleString()}</td>
        <td class="py-2.5 px-3 text-purple-400">$${metrics.pureAidlc.costPer1kQueriesUsd}</td>
        <td class="py-2.5 px-3 text-amber-400">${metrics.pureAidlc.latencyP95Ms}ms</td>
        <td class="py-2.5 px-3 text-slate-400">${metrics.pureAidlc.carbonKgCo2eYear} kg</td>
      </tr>
      <tr class="bg-emerald-950/20 hover:bg-emerald-950/40">
        <td class="py-2.5 px-3 font-semibold text-emerald-300">${metrics.compoundAi.architecture}</td>
        <td class="py-2.5 px-3 text-emerald-300 font-bold">$${metrics.compoundAi.monthlyCostUsd.toLocaleString()}</td>
        <td class="py-2.5 px-3 text-emerald-300 font-bold">$${metrics.compoundAi.annualCostUsd.toLocaleString()}</td>
        <td class="py-2.5 px-3 text-emerald-400 font-bold">$${metrics.compoundAi.costPer1kQueriesUsd}</td>
        <td class="py-2.5 px-3 text-emerald-400 font-bold">${metrics.compoundAi.latencyP95Ms}ms</td>
        <td class="py-2.5 px-3 text-slate-400">${metrics.compoundAi.carbonKgCo2eYear} kg</td>
      </tr>
      <tr class="hover:bg-slate-900/50">
        <td class="py-2.5 px-3 font-semibold text-teal-300">${metrics.selfHosted.architecture}</td>
        <td class="py-2.5 px-3 text-white">$${metrics.selfHosted.monthlyCostUsd.toLocaleString()}</td>
        <td class="py-2.5 px-3 text-white">$${metrics.selfHosted.annualCostUsd.toLocaleString()}</td>
        <td class="py-2.5 px-3 text-teal-400">$${metrics.selfHosted.costPer1kQueriesUsd}</td>
        <td class="py-2.5 px-3 text-teal-400">${metrics.selfHosted.latencyP95Ms}ms</td>
        <td class="py-2.5 px-3 text-slate-400">Amortized GPU</td>
      </tr>
    `;
  }
}

// ============================================================
// SECTION 13: CAB PRODUCTION READINESS AUDIT GATE
// ============================================================

function renderReadinessChecklist() {
  const container = document.getElementById('readiness-categories-container');
  if (!container || !appState.readinessCategories) return;

  container.innerHTML = appState.readinessCategories.map((cat, catIdx) => `
    <div class="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 class="text-sm font-bold text-white flex items-center space-x-2">
          <span class="w-2 h-2 rounded-full bg-amber-400"></span>
          <span>${cat.category}</span>
        </h3>
        <span class="text-xs font-mono text-amber-400/80">Weight: ${cat.weight}%</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        ${cat.criteria.map(crit => {
          const isChecked = appState.checkedReadinessCriteria.has(crit.id);
          return `
            <div onclick="toggleReadinessCriteria('${crit.id}')" class="p-4 rounded-xl border transition cursor-pointer select-none ${isChecked ? 'bg-amber-950/30 border-amber-500/50 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'}">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center space-x-2">
                  <input type="checkbox" ${isChecked ? 'checked' : ''} class="accent-amber-500 rounded cursor-pointer pointer-events-none">
                  <span class="text-xs font-bold leading-tight ${isChecked ? 'text-white' : 'text-slate-300'}">${crit.title}</span>
                </div>
                ${crit.critical ? '<span class="text-[9px] uppercase px-1.5 py-0.5 rounded font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">Critical</span>' : ''}
              </div>
              <p class="text-[11px] text-slate-400 mt-2 leading-relaxed">${crit.description}</p>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `).join('');

  auditReadinessState();
}

async function toggleReadinessCriteria(critId) {
  if (appState.checkedReadinessCriteria.has(critId)) {
    appState.checkedReadinessCriteria.delete(critId);
  } else {
    appState.checkedReadinessCriteria.add(critId);
  }
  renderReadinessChecklist();
}

function selectAllReadinessCriteria() {
  appState.readinessCategories.forEach(cat => {
    cat.criteria.forEach(crit => {
      appState.checkedReadinessCriteria.add(crit.id);
    });
  });
  renderReadinessChecklist();
}

async function auditReadinessState() {
  try {
    const res = await fetch('/api/readiness-audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checkedCriteriaIds: Array.from(appState.checkedReadinessCriteria)
      })
    });
    const json = await res.json();
    if (json.status === 'success') {
      const data = json.data;
      
      const scoreEl = document.getElementById('readiness-score-display');
      if (scoreEl) scoreEl.innerText = `${data.readinessScore}%`;

      const badgeEl = document.getElementById('readiness-status-badge');
      if (badgeEl) {
        badgeEl.className = `px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${data.statusBadge}`;
        badgeEl.innerText = data.status.replace(/_/g, ' ');
      }

      const critCountEl = document.getElementById('readiness-critical-count');
      if (critCountEl) {
        critCountEl.innerText = `${11 - data.criticalFailures.length}`;
      }
    }
  } catch (err) {
    console.error('Readiness audit error:', err);
  }
}

function exportCabCertificate() {
  const modal = document.getElementById('cab-certificate-modal');
  const content = document.getElementById('cab-certificate-content');
  if (!modal || !content) return;

  const score = document.getElementById('readiness-score-display')?.innerText || '0%';
  const status = document.getElementById('readiness-status-badge')?.innerText || 'PENDING';
  const timestamp = new Date().toISOString();

  content.innerHTML = `
# CHANGE ADVISORY BOARD (CAB) AUDIT CERTIFICATE
===========================================================
APPLICATION: AiDLC vs SDLC Enterprise Decision Platform
AUDIT STATUS: ${status}
READINESS SCORE: ${score}
EVALUATION STANDARD: ISO 42001 / NIST AI RMF / SAFe Release Gate
AUDIT DATE: ${timestamp}
LEAD AUDITOR: Change Advisory Board Committee

## 1. GATING VERIFICATION CHECKLIST
${Array.from(appState.checkedReadinessCriteria).map((c, i) => `[X] GATE-${i + 1}: ${c.toUpperCase()}`).join('\n')}

## 2. GOVERNANCE ARCHITECTURE ATTESTATION
- Zero untrusted tokens granted direct database write access.
- Layer 1 Pre-Flight Sanitization and Layer 3 Post-Flight Schema Assertions verified.
- Faithfulness evaluation benchmark requirement >= 96% in CI/CD pipeline.
- Production canary rollout capped at 10% until 48-hour drift analysis completes.

AUTHORIZATION: SIGNED OFF FOR DEPLOYMENT GATING.
===========================================================
  `.trim();

  modal.classList.remove('hidden');
  lucide.createIcons();
}

function closeCabModal() {
  document.getElementById('cab-certificate-modal')?.classList.add('hidden');
}

function copyCabCertificateText() {
  const content = document.getElementById('cab-certificate-content')?.innerText;
  if (!content) return;
  navigator.clipboard.writeText(content).then(() => {
    const btnText = document.getElementById('btn-copy-cert-text');
    if (btnText) {
      btnText.innerText = 'Copied!';
      setTimeout(() => { btnText.innerText = 'Copy Markdown'; }, 2000);
    }
  });
}

// ============================================================
// SECTION 14: PRODUCTION CODE STARTER TOOLKIT
// ============================================================

function renderToolkit() {
  const tabs = document.getElementById('toolkit-snippet-tabs');
  if (!tabs || !appState.toolkitSnippets.length) return;

  tabs.innerHTML = appState.toolkitSnippets.map(snippet => `
    <button onclick="selectSnippet('${snippet.id}')" class="px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${snippet.id === appState.selectedSnippetId ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30' : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'}">
      <i data-lucide="file-code" class="w-3.5 h-3.5"></i>
      <span>${snippet.title.split('(')[0]}</span>
    </button>
  `).join('');

  renderActiveSnippet();
  lucide.createIcons();
}

function selectSnippet(id) {
  appState.selectedSnippetId = id;
  renderToolkit();
}

function renderActiveSnippet() {
  const snippet = appState.toolkitSnippets.find(s => s.id === appState.selectedSnippetId);
  if (!snippet) return;

  document.getElementById('active-snippet-title').innerText = snippet.title;
  document.getElementById('active-snippet-lang').innerText = snippet.language;
  document.getElementById('active-snippet-code').innerText = snippet.code;
}

function copyActiveSnippet() {
  const snippet = appState.toolkitSnippets.find(s => s.id === appState.selectedSnippetId);
  if (!snippet) return;
  navigator.clipboard.writeText(snippet.code).then(() => {
    const btnText = document.getElementById('btn-copy-snippet-text');
    if (btnText) {
      btnText.innerText = 'Copied to Clipboard!';
      setTimeout(() => { btnText.innerText = 'Copy Code'; }, 2000);
    }
  });
}

// ============================================================
// SPOTLIGHT QUICK SEARCH (Ctrl+K)
// ============================================================

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSpotlightSearch();
    }
    if (e.key === 'Escape') {
      closeSpotlightSearch();
      closeDimensionModal();
      closeCabModal();
    }
  });
}

function openSpotlightSearch() {
  const modal = document.getElementById('spotlight-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  const input = document.getElementById('spotlight-input');
  if (input) {
    input.value = '';
    input.focus();
  }
  runSpotlightSearch();
  lucide.createIcons();
}

function closeSpotlightSearch(e) {
  const modal = document.getElementById('spotlight-modal');
  if (modal) modal.classList.add('hidden');
}

function runSpotlightSearch() {
  const input = document.getElementById('spotlight-input');
  const resultsContainer = document.getElementById('spotlight-results');
  if (!input || !resultsContainer) return;

  const query = input.value.toLowerCase().trim();
  if (!query) {
    resultsContainer.innerHTML = `
      <div class="text-center py-8 text-slate-500">
        Type a keyword like <span class="text-emerald-400 font-mono">"sandwich"</span>, <span class="text-emerald-400 font-mono">"ISO 42001"</span>, <span class="text-emerald-400 font-mono">"FinTech"</span>, <span class="text-emerald-400 font-mono">"FinOps"</span>...
      </div>
    `;
    return;
  }

  const matches = [];

  // 1. Search Core Dimensions
  if (appState.overviewData?.core_dimensions) {
    appState.overviewData.core_dimensions.forEach(dim => {
      if (dim.dimension.toLowerCase().includes(query) || dim.tagline.toLowerCase().includes(query)) {
        matches.push({
          category: "12 Dimensions",
          title: dim.dimension,
          subtitle: dim.tagline,
          tabId: "overview",
          action: () => openDimensionModal(dim.id)
        });
      }
    });
  }

  // 2. Search Blueprints
  if (appState.visualDiagramsData) {
    appState.visualDiagramsData.forEach(diag => {
      if (diag.title.toLowerCase().includes(query) || diag.description.toLowerCase().includes(query)) {
        matches.push({
          category: "Visual Architecture",
          title: diag.title,
          subtitle: diag.category,
          tabId: "diagrams",
          action: () => selectDiagram(diag.id)
        });
      }
    });
  }

  // 3. Search Case Studies
  if (appState.caseStudiesData) {
    appState.caseStudiesData.forEach(cs => {
      if (cs.title.toLowerCase().includes(query) || cs.industry.toLowerCase().includes(query) || cs.challenge.toLowerCase().includes(query)) {
        matches.push({
          category: `Case Study (${cs.domainCategory})`,
          title: cs.title,
          subtitle: cs.industry,
          tabId: "casestudies",
          action: null
        });
      }
    });
  }

  // 4. Search Code Snippets
  if (appState.toolkitSnippets) {
    appState.toolkitSnippets.forEach(snippet => {
      if (snippet.title.toLowerCase().includes(query) || snippet.description.toLowerCase().includes(query)) {
        matches.push({
          category: "Code Toolkit",
          title: snippet.title,
          subtitle: snippet.description,
          tabId: "toolkit",
          action: () => selectSnippet(snippet.id)
        });
      }
    });
  }

  // 5. Keyword direct jumps
  if ("finops cost latency units tco".includes(query)) {
    matches.push({
      category: "FinOps Simulator",
      title: "Enterprise FinOps TCO & Latency Calculator",
      subtitle: "Simulate unit costs, caching savings, and GPU cluster requirements",
      tabId: "finops",
      action: null
    });
  }

  if ("cab readiness audit checklist gate".includes(query)) {
    matches.push({
      category: "Governance Gate",
      title: "Production Go/No-Go Readiness Audit Gate",
      subtitle: "15 enterprise compliance criteria across 5 categories",
      tabId: "readiness",
      action: null
    });
  }

  if (matches.length === 0) {
    resultsContainer.innerHTML = `<div class="text-center py-6 text-slate-500">No matching architectural concepts found for "${query}".</div>`;
    return;
  }

  resultsContainer.innerHTML = matches.slice(0, 8).map((m, idx) => `
    <div onclick="executeSpotlightMatch(${idx})" class="p-3 rounded-xl hover:bg-slate-800 transition cursor-pointer flex items-center justify-between group">
      <div>
        <div class="flex items-center space-x-2">
          <span class="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">${m.category}</span>
          <span class="text-xs font-bold text-white group-hover:text-emerald-300 transition">${m.title}</span>
        </div>
        <p class="text-[11px] text-slate-400 mt-1 line-clamp-1">${m.subtitle}</p>
      </div>
      <i data-lucide="chevron-right" class="w-4 h-4 text-slate-500 group-hover:text-white transition"></i>
    </div>
  `).join('');

  window._currentSpotlightMatches = matches;
  lucide.createIcons();
}

function executeSpotlightMatch(idx) {
  const matches = window._currentSpotlightMatches;
  if (!matches || !matches[idx]) return;
  const match = matches[idx];
  
  closeSpotlightSearch();
  switchTab(match.tabId);
  if (match.action) {
    setTimeout(() => { match.action(); }, 150);
  }
}

// ============================================================
// URL HASH ROUTING & DOWNLOAD PACK
// ============================================================

function setupHashRouting() {
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(`tab-${hash}`) && hash !== appState.activeTab) {
      switchTab(hash, false);
    }
  });
}

function downloadArchitecturePack() {
  const content = `# AiDLC vs SDLC: Enterprise Architecture & Decision Blueprint
===================================================================
Authoritative Reference Guide for Software Development Life Cycle (SDLC)
vs. Artificial Intelligence Development Life Cycle (AiDLC) & Compound AI Systems.

Verified across SAFe Governance, ISO 42001, NIST AI RMF, and OWASP LLM Top 10.

## 1. Executive Summary
Traditional SDLC guarantees 100% mathematical repeatability through deductive deterministic logic (Code + Input = Output).
AiDLC enables probabilistic cognitive capabilities through high-dimensional latent space representations (Input + Target Data = Learned Weights).
The enterprise gold standard is the **Deterministic Sandwich Pattern (Compound AI)**: wrapping untrusted probabilistic models between deterministic SDLC pre-flight and post-flight validation boundaries.

## 2. 12 Core Paradigm Dimensions Summary
1. Logic: Deductive Boolean Rules vs Probabilistic Latent Weights
2. Artifacts: Source Code vs Datasets, SafeTensors & Prompts
3. Verification: Unit Test Assertions vs Statistical Evaluation Harnesses (Evals)
4. Debugging: Breakpoints & Call Stacks vs Semantic Drift Observability
5. Deployment: Immutable Binaries vs Model Serving & Shadow Canaries
6. Monitoring: CPU/RAM/APM vs Token Drift, Hallucination & Perplexity
7. Failure Modes: Crash / Stack Trace vs Silent Semantic Hallucination
8. Iteration Cadence: 2-Week Sprints vs Continuous Active Learning Flywheels
9. Team Composition: Software Engineers vs Applied AI Engineers & Data Curators
10. Hardware: General Purpose x86/ARM CPUs vs High-Density GPU/TPU Clusters
11. Security Threat Model: SQLi/XSS/Buffer Overflow vs Prompt Injection/Data Poisoning (OWASP LLM Top 10)
12. Governance & Compliance: SOX/SOC2/HIPAA vs ISO 42001, NIST AI RMF & EU AI Act

## 3. Production Go/No-Go Gate Checklist
- Golden Benchmark Dataset >= 500 cases with version control.
- Statistical CI/CD Eval Gate requiring Faithfulness >= 96%.
- Deterministic Sandwich Pattern: Zero direct database write access for AI models.
- 5-Layer Guardrails: Input PII scrubbing, Prompt Injection Shield, JSON Schema boundary.
- Monthly Hard Cost Caps and Semantic Cache hit rates >= 25%.

Downloaded from AiDLC vs SDLC Enterprise Portal (http://localhost:3000)
`;

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'AiDLC_vs_SDLC_Enterprise_Architecture_Pack.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
