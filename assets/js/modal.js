import { addPlayer } from './player.js';
import { addLog, renderLog } from './log.js';
import { render } from './render.js';
import { escapeHtml } from './domUtils.js';

function setupAddPlayerModal(state, $addPlayerModal, $addPlayerBtn, $addPlayerCancel, $addPlayerSubmit, $pname, $pcolor, $cards, $panelContent, $log) {
	function openAddPlayerModal() {
		$addPlayerModal.classList.add('open');
		$addPlayerModal.setAttribute('aria-hidden', 'false');
		$pname.focus();
	}

	function closeAddPlayerModal() {
		$addPlayerModal.classList.remove('open');
		$addPlayerModal.setAttribute('aria-hidden', 'true');
		$pname.value = '';
	}

	function handleAddPlayer() {
		const name = ($pname.value || 'Игрок').trim();
		const color = $pcolor.value;
		if (name) {
			const logMsg = addPlayer(state, name, color);
			addLog(state, logMsg);
			render(state, $cards, $panelContent, $log);
			renderLog(state, $log);
			closeAddPlayerModal();
		}
	}

	$addPlayerBtn.addEventListener('click', openAddPlayerModal);
	$addPlayerCancel.addEventListener('click', closeAddPlayerModal);
	$addPlayerSubmit.addEventListener('click', handleAddPlayer);
	$pname.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') handleAddPlayer();
	});
	$addPlayerModal.addEventListener('click', (e) => {
		if (e.target === $addPlayerModal) closeAddPlayerModal();
	});
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && $addPlayerModal.classList.contains('open')) closeAddPlayerModal();
	});
}

function setupFaqModal($faq, $btnFaq, $btnFaqCloseX, $faqClose) {
	function openFaq() {
		$faq.classList.add('open');
		$faq.setAttribute('aria-hidden', 'false');
	}

	function closeFaq() {
		$faq.classList.remove('open');
		$faq.setAttribute('aria-hidden', 'true');
	}

	$btnFaq.addEventListener('click', openFaq);
	$btnFaqCloseX.addEventListener('click', closeFaq);
	$faqClose.addEventListener('click', closeFaq);
	$faq.addEventListener('click', (e) => {
		if (e.target === $faq) closeFaq();
	});
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && $faq.classList.contains('open')) closeFaq();
	});
}

function setupFirstTurnModal(state, $modal, $btn, $closeX, $close, $nameEl, $log) {  // Новая функция
	function openModal() {
		if (state.players.length < 2) {
			alert('Нужны минимум 2 игрока для выбора первого хода!');
			return;
		}
		const randomIndex = Math.floor(Math.random() * state.players.length);
		const player = state.players[randomIndex];
		$nameEl.innerHTML = `<b>${escapeHtml(player.name)}</b> ходит первым!`;  // Отображаем имя
		const logMsg = `Первый ход: <b>${escapeHtml(player.name)}</b>`;
		addLog(state, logMsg);  // Добавляем в лог
		renderLog(state, $log);  // Обновляем лог сразу
		$modal.classList.add('open');
		$modal.setAttribute('aria-hidden', 'false');
	}

	function closeModal() {
		$modal.classList.remove('open');
		$modal.setAttribute('aria-hidden', 'true');
	}

	$btn.addEventListener('click', openModal);
	$closeX.addEventListener('click', closeModal);
	$close.addEventListener('click', closeModal);
	$modal.addEventListener('click', (e) => {
		if (e.target === $modal) closeModal();
	});
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && $modal.classList.contains('open')) closeModal();
	});
}

export { setupAddPlayerModal, setupFaqModal, setupFirstTurnModal };