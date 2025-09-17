import { BASE_HP, save } from './assets/js/state.js';
import { escapeHtml, flash } from './assets/js/domUtils.js';
import { applyDamage, applyHeal, fmtHp, removePlayer } from './assets/js/player.js';
import { addLog } from './assets/js/log.js';

function render(state, $cards, $panelContent) {
	if (!$cards) return; // Prevent setting innerHTML on undefined
	$cards.innerHTML = '';
	state.players.forEach(p => {
		const shell = document.createElement('div');
		shell.className = 'card-shell' + (p.dead ? ' dead' : '');
		shell.style.setProperty('--glow', p.color);

		const card = document.createElement('div');
		card.className = 'card' + (p.dead ? ' dead' : '');
		card.style.setProperty('--glow', p.color);
		card.innerHTML = `
			<div class="neon neon-pulse"></div>
			<div class="neon-edge"></div>
			<div class="card-inner">
				<div class="card-header">
					<button class="btn btn-danger btn-small" data-act="del" title="Удалить">🗑</button>
					<div class="card-name">${escapeHtml(p.name)}</div>
					<div style="width:46px"></div>
				</div>
				<div class="hp-zone" data-act="drag">
					<div class="hp-number">${p.hp}</div>
					<div class="hp-sub">${fmtHp(state, p)}</div>
					<div class="delta-overlay" style="display:none"><span class="delta-badge"></span></div>
					${state.mode === 'drag' ? `<div class="muted" style="font-size:11px;text-align:center;margin-top:6px">Потяните по числу HP (влево/вниз — урон, вправо/вверх — хил)</div>` : ``}
				</div>
				${state.mode === 'input' ? `
				<div class="io">
					<div>
						<label>Урон</label>
						<div class="row">
							<input class="inp-dmg" inputmode="numeric" placeholder="напр. 5"/>
							<button class="btn btn-ghost btn-small btn-apply-dmg"><i class="fa-solid fa-square-minus"></i></button>
						</div>
					</div>
					<div>
						<label>Хил</label>
						<div class="row">
							<input class="inp-heal" inputmode="numeric" placeholder="напр. 8"/>
							<button class="btn btn-ghost btn-small btn-apply-heal"><i class="fa-solid fa-square-plus"></i></button>
						</div>
					</div>
				</div>` : ``}
			</div>`;

		card.querySelector('[data-act="del"]').addEventListener('click', () => {
			const logMsg = removePlayer(state, p.id);
			addLog(state, logMsg);
			render(state, $cards, $panelContent);
		});

		const hpNum = card.querySelector('.hp-number');
		const sub = card.querySelector('.hp-sub');
		p._hpEl = hpNum;

		if (state.mode === 'input') {
			const idmg = card.querySelector('.inp-dmg');
			const iheal = card.querySelector('.inp-heal');
			const bDmg = card.querySelector('.btn-apply-dmg');
			const bHeal = card.querySelector('.btn-apply-heal');
			idmg.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') {
					const v = +idmg.value || 0;
					idmg.value = '';
					const logMsg = applyDamage(state, p.id, v);
					if (logMsg) addLog(state, logMsg);
					render(state, $cards, $panelContent);
				}
			});
			iheal.addEventListener('keydown', (e) => {
				if (e.key === 'Enter') {
					const v = +iheal.value || 0;
					iheal.value = '';
					const logMsg = applyHeal(state, p.id, v);
					if (logMsg) addLog(state, logMsg);
					render(state, $cards, $panelContent);
				}
			});
			bDmg.addEventListener('click', () => {
				const v = +idmg.value || 0;
				idmg.value = '';
				const logMsg = applyDamage(state, p.id, v);
				if (logMsg) addLog(state, logMsg);
				render(state, $cards, $panelContent);
			});
			bHeal.addEventListener('click', () => {
				const v = +iheal.value || 0;
				iheal.value = '';
				const logMsg = applyHeal(state, p.id, v);
				if (logMsg) addLog(state, logMsg);
				render(state, $cards, $panelContent);
			});
		}

		if (state.mode === 'drag') {
			const zone = card.querySelector('.hp-zone');
			const overlay = card.querySelector('.delta-overlay');
			const badge = overlay.querySelector('.delta-badge');
			let dragging = null;
			const PX = 12;
			function start(ev) {
				if (p.dead) return;
				ev.preventDefault();
				const sx = ev.clientX ?? (ev.touches && ev.touches[0]?.clientX) ?? 0;
				const sy = ev.clientY ?? (ev.touches && ev.touches[0]?.clientY) ?? 0;
				dragging = { sx, sy, delta: 0 };
				overlay.style.display = 'flex';
				document.addEventListener('pointermove', move);
				document.addEventListener('pointerup', end);
				document.addEventListener('touchmove', move, { passive: false });
				document.addEventListener('touchend', end);
			}
			function move(ev) {
				if (!dragging) return;
				const x = ev.clientX ?? (ev.touches && ev.touches[0]?.clientX) ?? dragging.sx;
				const y = ev.clientY ?? (ev.touches && ev.touches[0]?.clientY) ?? dragging.sy;
				const dx = x - dragging.sx;
				const dy = dragging.sy - y;
				const primary = Math.abs(dx) >= Math.abs(dy) ? dx : dy;
				let d = Math.trunc(primary / PX);
				const min = -p.hp;
				const max = state.allowOverheal ? 999 : (BASE_HP - p.hp);
				if (d < min) d = min;
				if (d > max) d = max;
				dragging.delta = d;
				badge.textContent = d > 0 ? ('+' + d) : (d < 0 ? d : '0');
				badge.style.color = d > 0 ? '#34d399' : (d < 0 ? '#f87171' : '#9fb0c7');
				hpNum.textContent = Math.max(0, Math.min(p.hp + d, state.allowOverheal ? 9999 : BASE_HP));
				sub.innerHTML = fmtHp(state, p);
			}
			function end() {
				if (!dragging) return;
				const val = dragging.delta | 0;
				overlay.style.display = 'none';
				dragging = null;
				if (val > 0) {
					const logMsg = applyHeal(state, p.id, val);
					if (logMsg) addLog(state, logMsg);
				} else if (val < 0) {
					const logMsg = applyDamage(state, p.id, -val);
					if (logMsg) addLog(state, logMsg);
				}
				render(state, $cards, $panelContent);
			}
			zone.addEventListener('pointerdown', start);
			zone.addEventListener('touchstart', start, { passive: false });
		}

		shell.appendChild(card);
		$cards.appendChild(shell);
	});

	if (!state.panelCollapsed && $panelContent) {
		$panelContent.style.maxHeight = $panelContent.scrollHeight + 'px';
	}
}

export { render };
