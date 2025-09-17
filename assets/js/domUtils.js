function escapeHtml(s) {
	return s.replace(/[&<>\"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', '\'': '&#39;' }[c]));
}

function flash(el, kind) {
	if (!el) return;
	el.classList.remove('flash-heal', 'flash-dmg');
	void el.offsetWidth;
	el.classList.add(kind === 'heal' ? 'flash-heal' : 'flash-dmg');
}

export { escapeHtml, flash };