import { getInitialState, save } from 'assets/js/state.js';
import { addLog, renderLog } from 'assets/js/log.js';
import { setupAddPlayerModal, setupFaqModal } from 'assets/js/modal.js';
import { render } from 'assets/js/render.js';
import { resetGame } from 'assets/js/player.js';

(function() {
	"use strict";
	const state = getInitialState();
	const $cards = document.getElementById('cards');
	const $log = document.getElementById('log');
	const $toplog = document.getElementById('toplog');
	const $panelToggle = document.getElementById('btn-toggle-panel');
	const $panelContent = document.getElementById('panel-content');
	const $addPlayerModal = document.getElementById('add-player-modal');
	const $addPlayerBtn = document.getElementById('btn-add-player');
	const $addPlayerCancel = document.getElementById('add-player-cancel');
	const $addPlayerSubmit = document.getElementById('add-player-submit');
	const $pname = document.getElementById('pname');
	const $pcolor = document.getElementById('pcolor');
	const $faq = document.getElementById('faq');
	const $btnFaq = document.getElementById('btn-faq');
	const $btnFaqCloseX = document.getElementById('btn-faq-close-x');
	const $faqClose = document.getElementById('faq-close');
	const $btnLog = document.getElementById('btn-log');

	document.getElementById('allowOver').checked = !!state.allowOverheal;
	document.getElementById('mode-drag').checked = state.mode === 'drag';
	document.getElementById('mode-input').checked = state.mode === 'input';

	function togglePanel() {
		state.panelCollapsed = !state.panelCollapsed;
		if (state.panelCollapsed) {
			$panelToggle.classList.add('collapsed');
			$panelContent.classList.add('collapsed');
			$panelToggle.title = 'Развернуть панель';
		} else {
			$panelToggle.classList.remove('collapsed');
			$panelContent.classList.remove('collapsed');
			$panelToggle.title = 'Свернуть панель';
			$panelContent.style.maxHeight = $panelContent.scrollHeight + 'px';
		}
		save(state);
	}

	$panelToggle.addEventListener('click', togglePanel);
	if (state.panelCollapsed) {
		$panelToggle.classList.add('collapsed');
		$panelContent.classList.add('collapsed');
		$panelToggle.title = 'Развернуть панель';
	} else {
		$panelContent.style.maxHeight = $panelContent.scrollHeight + 'px';
		$panelToggle.title = 'Свернуть панель';
	}

	if ($btnLog) {
		$btnLog.addEventListener('click', () => {
			console.log('Log button clicked');
			$toplog.classList.toggle('open');
			console.log('Toplog open class toggled:', $toplog.classList.contains('open'));
		});
	} else {
		console.error('Log button not found!');
	}

	document.getElementById('btn-log-close').addEventListener('click', () => {
		$toplog.classList.remove('open');
	});

	document.getElementById('mode-drag').addEventListener('change', (e) => {
		if (e.target.checked) {
			state.mode = 'drag';
			save(state);
			render(state, $cards, $panelContent);
		}
	});
	document.getElementById('mode-input').addEventListener('change', (e) => {
		if (e.target.checked) {
			state.mode = 'input';
			save(state);
			render(state, $cards, $panelContent);
		}
	});

	document.getElementById('allowOver').addEventListener('change', (e) => {
		state.allowOverheal = e.target.checked;
		save(state);
		render(state, $cards, $panelContent);
	});

	document.getElementById('btn-new').addEventListener('click', () => {
		const logMsg = resetGame(state);
		addLog(state, logMsg);
		render(state, $cards, $panelContent);
		save(state);
	});

	setupAddPlayerModal(state, $addPlayerModal, $addPlayerBtn, $addPlayerCancel, $addPlayerSubmit, $pname, $pcolor, $cards, $panelContent);
	setupFaqModal($faq, $btnFaq, $btnFaqCloseX, $faqClose);

	render(state, $cards, $panelContent);
	renderLog(state, $log);
})();
