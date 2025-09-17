import { BASE_HP, save } from '/assets/js/state.js';
import { escapeHtml, flash } from '/assets/js/domUtils.js';

function addPlayer(state, name, color) {
	const id = crypto.randomUUID();
	state.players.push({ id, name: name || 'Игрок', color, hp: BASE_HP, overTotal: 0, dead: false });
	return `Создана карточка: <b>${escapeHtml(name)}</b>`;
}

function removePlayer(state, id) {
	const p = state.players.find(x => x.id === id);
	state.players = state.players.filter(x => x.id !== id);
	return `Удалена карточка: <b>${escapeHtml(p?.name || id)}</b>`;
}

function applyDamage(state, id, v) {
	if (!v || v <= 0) return null;
	const p = state.players.find(x => x.id === id);
	if (!p || p.dead) return null;
	const before = p.hp;
	p.hp = Math.max(0, p.hp - v);
	if (p.hp === 0) p.dead = true;
	flash(p._hpEl, 'dmg');
	return `<b>${escapeHtml(p.name)}</b> получил урон на <span class="v-red">-${v}</span> (было ${before}) → ${fmtHp(state, p)}`;
}

function applyHeal(state, id, v) {
	if (!v || v <= 0) return null;
	const p = state.players.find(x => x.id === id);
	if (!p || p.dead) return null;
	const before = p.hp;
	let after = p.hp + v;
	let addOver = 0;
	if (!state.allowOverheal) {
		after = Math.min(BASE_HP, after);
	} else {
		const overBefore = Math.max(0, before - BASE_HP);
		const overAfter = Math.max(0, after - BASE_HP);
		addOver = Math.max(0, overAfter - overBefore);
	}
	p.hp = after;
	p.overTotal += addOver;
	flash(p._hpEl, 'heal');
	return `<b>${escapeHtml(p.name)}</b> исцелился на <span class="v-green">+${v}</span> (было ${before}) → ${fmtHp(state, p)}${addOver > 0 ? ` <span class="muted">(+оверхил ${addOver})</span>` : ''}`;
}

function fmtHp(state, p) {
	const cur = p.hp;
	const base = BASE_HP;
	const over = Math.max(0, p.hp - BASE_HP);
	return `${cur}/${base}${state.allowOverheal && (p.overTotal > 0 || over > 0) ? ` <span class="muted">(+${p.overTotal})</span>` : ''}`;
}

function resetGame(state) {
	state.players = state.players.map(p => ({ ...p, hp: BASE_HP, overTotal: 0, dead: false }));
	state.log = [];
	return 'Новая партия — все восстановлены до 50 HP';
}

export { addPlayer, removePlayer, applyDamage, applyHeal, fmtHp, resetGame };