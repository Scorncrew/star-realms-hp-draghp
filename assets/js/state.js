const BASE_HP = 50;
const LS = 'sr-html-hp-v32';

function save(state) {
	try {
		localStorage.setItem(LS, JSON.stringify(state));
	} catch (e) {}
}

function load() {
	try {
		return JSON.parse(localStorage.getItem(LS));
	} catch (e) {
		return null;
	}
}

function getInitialState() {
	return load() || { players: [], allowOverheal: true, log: [], mode: 'drag', panelCollapsed: false };
}

export { BASE_HP, save, load, getInitialState };