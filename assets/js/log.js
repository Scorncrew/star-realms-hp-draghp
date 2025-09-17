import { save } from './state.js';

function addLog(state, html) {
	state.log.unshift({ t: new Date().toLocaleTimeString(), html });
	save(state);
}

function renderLog(state, $log) {
	if ($log) {
		$log.innerHTML = state.log.map(x => `<li><time>[${x.t}]</time>${x.html}</li>`).join('');
	}
}

export { addLog, renderLog };