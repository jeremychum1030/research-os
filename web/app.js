let registry = window.SciFlowRegistry || { phases: [], nodes: [] };
let state = JSON.parse(localStorage.getItem('sciflow-state') || '{}');
state.selectedId ||= 'W21';
state.activePhase ||= 'evidence';
state.paused ||= false;
state.zoom ||= 1;
let currentView = 'canvas';

const $ = (selector) => document.querySelector(selector);
const nodeById = (id) => registry.nodes.find((node) => node.id === id);
const phaseById = (id) => registry.phases.find((phase) => phase.id === id);
const saveState = () => localStorage.setItem('sciflow-state', JSON.stringify(state));
const toast = (message) => {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => element.classList.remove('show'), 2200);
};

function phaseForNode(node) { return phaseById(node.phase) || registry.phases[0]; }

function renderPhaseNav() {
  $('#phaseNav').innerHTML = registry.phases.map((phase) => {
    const count = registry.nodes.filter((node) => node.phase === phase.id).length;
    return `<button class="phase-item ${state.activePhase === phase.id ? 'active' : ''}" data-phase="${phase.id}">
      <span class="phase-icon">${phase.icon}</span><span><b>${phase.label}</b><small>${phase.range}</small></span><em>${count}</em>
    </button>`;
  }).join('');
  document.querySelectorAll('[data-phase]').forEach((button) => button.addEventListener('click', () => {
    state.activePhase = button.dataset.phase;
    saveState(); renderPhaseNav(); renderNodes();
  }));
}

function renderNodes() {
  const nodes = registry.nodes.filter((node) => node.phase === state.activePhase);
  const layer = $('#nodeLayer');
  layer.style.transform = `scale(${state.zoom})`;
  layer.innerHTML = nodes.map((node) => {
    const status = node.status === 'completed' ? 'completed' : (node.id === 'W23' ? 'warning' : 'pending');
    const selected = state.selectedId === node.id ? 'selected' : '';
    return `<article class="node-card status-${status} ${selected}" data-node="${node.id}" style="left:${node.position.x}px;top:${node.position.y}px">
      <div class="node-top"><span class="node-id">${node.id}</span><span class="node-status">${status === 'completed' ? 'COMPLETED' : status === 'warning' ? 'QC REVIEW' : 'WAITING'}</span></div>
      <div class="node-name">${node.name}</div><div class="node-summary">${node.summary}</div>
      <div class="node-gate"><b>GATE</b><span>${node.gate.replace('完整性', '')}</span><i>${status === 'completed' ? '✓' : status === 'warning' ? '!' : '·'}</i></div>
    </article>`;
  }).join('');
  document.querySelectorAll('[data-node]').forEach((card) => card.addEventListener('click', () => selectNode(card.dataset.node)));
  renderEdges(nodes);
}

function renderEdges(nodes) {
  const svg = $('#edges');
  const visible = new Set(nodes.map((node) => node.id));
  svg.innerHTML = nodes.flatMap((node) => node.requires.filter((parent) => visible.has(parent)).map((parent) => {
    const source = nodeById(parent); const x1 = source.position.x + 205; const y1 = source.position.y + 49;
    const x2 = node.position.x; const y2 = node.position.y + 49; const curve = Math.max(35, (x2 - x1) / 2);
    const completed = source.status === 'completed' && node.status === 'completed' ? 'completed' : '';
    return `<path class="${completed}" d="M ${x1} ${y1} C ${x1 + curve} ${y1}, ${x2 - curve} ${y2}, ${x2} ${y2}"/>`;
  })).join('');
}

function renderKanban() {
  const columns = [{ key: 'completed', label: 'COMPLETED' }, { key: 'warning', label: 'QC REVIEW' }, { key: 'pending', label: 'WAITING INPUT' }, { key: 'locked', label: 'LOCKED' }];
  $('#kanbanView').innerHTML = columns.map((column) => `<div class="kanban-column"><h3>${column.label}</h3>${registry.nodes.filter((node) => {
    const status = node.status === 'completed' ? 'completed' : node.id === 'W23' ? 'warning' : 'pending';
    return status === column.key;
  }).map((node) => `<article class="node-card status-${column.key}" data-node="${node.id}"><div class="node-top"><span class="node-id">${node.id}</span><span class="node-status">${column.label}</span></div><div class="node-name">${node.name}</div><div class="node-summary">${node.summary}</div></article>`).join('')}</div>`).join('');
  document.querySelectorAll('#kanbanView [data-node]').forEach((card) => card.addEventListener('click', () => selectNode(card.dataset.node)));
}

function selectNode(id) {
  const node = nodeById(id); if (!node) return;
  state.selectedId = id; state.activePhase = node.phase; saveState(); renderPhaseNav(); renderNodes();
  $('#inspectorTitle').textContent = node.name;
  $('#inspectorId').textContent = `${node.id} · ${(phaseForNode(node).label || '').toUpperCase()}`;
  $('#inspectorStatus').textContent = node.status === 'completed' ? 'QC PASSED' : 'WAITING INPUT';
  $('#artifactName').textContent = `${node.artifact_type}.json`;
  $('#artifactVersion').textContent = node.status === 'completed' ? 'v0.4' : '—';
  $('#artifactHash').textContent = node.status === 'completed' ? 'a7c4…9f21' : 'not-created';
  toast(`已選取 ${node.id} · ${node.name}`);
}

function action(message, mutate) { mutate(); saveState(); renderNodes(); renderKanban(); toast(message); }

document.querySelectorAll('.view-tab').forEach((button) => button.addEventListener('click', () => {
  currentView = button.dataset.view;
  document.querySelectorAll('.view-tab').forEach((item) => item.classList.toggle('active', item === button));
  $('#canvasView').classList.toggle('hidden', currentView !== 'canvas');
  $('#kanbanView').classList.toggle('hidden', currentView !== 'kanban');
  if (currentView === 'kanban') renderKanban();
}));
$('#zoomIn').addEventListener('click', () => { state.zoom = Math.min(1.4, state.zoom + .1); $('#zoomLabel').textContent = `${Math.round(state.zoom * 100)}%`; renderNodes(); });
$('#zoomOut').addEventListener('click', () => { state.zoom = Math.max(.7, state.zoom - .1); $('#zoomLabel').textContent = `${Math.round(state.zoom * 100)}%`; renderNodes(); });
$('#fitButton').addEventListener('click', () => { state.zoom = 1; $('#zoomLabel').textContent = '100%'; renderNodes(); toast('畫布已重置到適合視圖'); });
$('#closeInspector').addEventListener('click', () => toast('Inspector 保持固定，方便連續核驗節點'));
$('#pauseButton').addEventListener('click', () => action(state.paused ? '主流程已恢復' : '主流程已暫停', () => { state.paused = !state.paused; $('#pauseButton').textContent = state.paused ? '▶' : 'Ⅱ'; }));
$('#rerunButton').addEventListener('click', () => action(`已標記 ${state.selectedId} 及下游節點重跑`, () => { registry.nodes.find((node) => node.id === state.selectedId).status = 'pending'; }));
$('#branchButton').addEventListener('click', () => toast(`已建立 ${state.selectedId} 的平行研究分支`));
$('#rollbackButton').addEventListener('click', () => toast('Rollback 需要選擇一個已保存的 Quality Gate snapshot'));
$('#logButton').addEventListener('click', () => toast('Run log：8 個 gate passed · 2 個人工確認'));
$('#gateButton').addEventListener('click', () => toast('Quality Gate：還有 1 項出版版本需要確認'));
$('#runButton').addEventListener('click', () => action('主流程已繼續：下一個可執行節點為 W22', () => {}));
$('#saveButton').addEventListener('click', () => { saveState(); toast('Workflow snapshot 已保存到本機狀態'); });
$('#projectButton').addEventListener('click', () => toast('項目切換器：目前只有 1 個 active project'));
$('#settingsButton').addEventListener('click', () => toast('Workflow settings 即將接入 Hermes API'));

renderPhaseNav(); renderNodes(); renderKanban(); selectNode(state.selectedId);
