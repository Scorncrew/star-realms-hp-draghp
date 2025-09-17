import { addPlayer } from './assets/js/player.js';
import { addLog } from './assets/js/log.js';
import { render } from './assets/js/render.js';

function setupAddPlayerModal(state, $addPlayerModal, $addPlayerBtn, $addPlayerCancel, $addPlayerSubmit, $pname, $pcolor, $cards, $panelContent) {
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
			render(state, $cards, $panelContent);
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

export { setupAddPlayerModal, setupFaqModal };
