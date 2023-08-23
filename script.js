import { pair } from './key-pairs.js';

const container = document.querySelector('.container');
const pageHeading = document.querySelector('#page-heading');
const hero = document.querySelector('#hero-text');
const eventKey = document.querySelector('#event-key');
const eventLocation = document.querySelector('#event-location');
const eventCode = document.querySelector('#event-code');
const eventWhich = document.querySelector('#event-which');
const eventDescription = document.querySelector('#event-description');
const eventDump = document.querySelector('#event-dump');
const metaKeyLogo = document.querySelector(
	'.meta-keys-card_meta-key:nth-child(1)'
);
const shiftKeyLogo = document.querySelector(
	'.meta-keys-card_meta-key:nth-child(2)'
);
const altKeyLogo = document.querySelector(
	'.meta-keys-card_meta-key:nth-child(3)'
);
const ctrlKeyLogo = document.querySelector(
	'.meta-keys-card_meta-key:nth-child(4)'
);
const similarValuesTxt = document.querySelector('#similar-values');
const unicodeTxt = document.querySelector('#unicode');
const historyCard = document.querySelector('.history-card_content');
const darkModeSwitch = document.querySelector('input[type=checkbox]');

let isMetaKeyPressed = false;
let isCardNotRemoved = true;
const inputHistory = [];

const getDescription = (event) => {
	let desc;

	switch (event.key) {
		case 'Control':
			desc = 'ctrl';
			break;
		case 'Alt':
			desc = 'Alt / Option';
			break;
		case 'Shift':
			desc = 'shift';
			break;
		case 'Meta':
			desc = 'Windows Key / Left ⌘ / Chromebook Search key';
			break;
		default:
			desc = event.key;
	}

	return desc;
};

const toggleMetaKeysOn = (event) => {
	if (event.metaKey) {
		if (darkModeSwitch.checked) {
			metaKeyLogo.classList.add('meta-keys-card_pressed__dark-mode');
		} else {
			metaKeyLogo.classList.add('meta-keys-card_pressed');
		}
		isMetaKeyPressed = true;
	}
	if (event.shiftKey) {
		if (darkModeSwitch.checked) {
			shiftKeyLogo.classList.add('meta-keys-card_pressed__dark-mode');
		} else {
			shiftKeyLogo.classList.add('meta-keys-card_pressed');
		}
		isMetaKeyPressed = true;
	}
	if (event.altKey) {
		if (darkModeSwitch.checked) {
			altKeyLogo.classList.add('meta-keys-card_pressed__dark-mode');
		} else {
			altKeyLogo.classList.add('meta-keys-card_pressed');
		}
		isMetaKeyPressed = true;
	}
	if (event.ctrlKey) {
		if (darkModeSwitch.checked) {
			ctrlKeyLogo.classList.add('meta-keys-card_pressed__dark-mode');
		} else {
			ctrlKeyLogo.classList.add('meta-keys-card_pressed');
		}
		isMetaKeyPressed = true;
	}
};

const toggleMetaKeysOff = (metaKeysCard) => {
	if (darkModeSwitch.checked) {
		metaKeysCard.forEach((metaKey) => {
			metaKey.classList.remove('meta-keys-card_pressed__dark-mode');
		});
		return;
	}
	metaKeysCard.forEach((metaKey) => {
		metaKey.classList.remove('meta-keys-card_pressed');
	});
};

const getUnicodeChar = (event) => {
	if (event.metaKey) {
		return '⌘ / ⊞';
	}
	if (event.shiftKey) {
		return '⇧';
	}
	if (event.altKey) {
		return '⎇ / ⌥';
	}
	if (event.ctrlKey) {
		return '^';
	}
	if (event.key === 'Escape') {
		return '⎋';
	}
	if (event.key === 'Tab') {
		return '↹';
	}
	if (event.key === 'CapsLock') {
		return '⇪';
	}
	if (event.key === 'Backspace') {
		return '⌫';
	}
};

const binarySearch = (arr, target, start, end) => {
	if (start > end) return -1;
	let mid = Math.floor((start + end) / 2);

	if (arr[mid].key === target) return mid;
	if (arr[mid].key > target) return binarySearch(arr, target, start, mid - 1);
	else return binarySearch(arr, target, mid + 1, end);
};

const setSimilarTxt = (eventKeyCode) => {
	const index = binarySearch(pair, eventKeyCode, 0, pair.length - 1);
	if (index === -1) {
		similarValuesTxt.textContent = '';
		return;
	}
	if (index === 0) {
		similarValuesTxt.textContent = `${pair[index + 1].value}(${
			pair[index + 1].key
		})\n${pair[index + 2].value}(${pair[index + 2].key})\n${
			pair[index + 3].value
		}(${pair[index + 3].key})`;
	} else {
		similarValuesTxt.textContent = `${pair[index - 1].value}(${
			pair[index - 1].key
		})\n${pair[index + 1].value}(${pair[index + 1].key})\n${
			pair[index + 2].value
		}(${pair[index + 2].key})`;
	}
};

const setEventHistory = (item) => {
	if (item === inputHistory[inputHistory.length - 1]) {
		return false;
	}
	if (inputHistory.length >= 4) {
		inputHistory.shift();
		inputHistory.push(item);
		return true;
	}
	inputHistory.push(item);
	return true;
};

const setHistoryCard = () => {
	if (historyCard.children.length >= 4) {
		historyCard.children[0].remove();
	}
	const wrapper = document.createElement('div');
	wrapper.className = 'history-card_history-chip';
	if (darkModeSwitch.checked) {
		wrapper.classList.add('history-card_history-chip__dark-mode');
	}

	const span = document.createElement('span');

	switch (inputHistory[inputHistory.length - 1]) {
		case 'Meta':
			span.textContent = '⌘';
			break;
		case 'Shift':
			span.textContent = '⇧';
			break;
		case 'Alt':
			span.textContent = '⌥';
			break;
		case 'Control':
			span.textContent = '^';
			break;
		case 'Escape':
			span.textContent = '⎋';
			break;
		case 'Tab':
			span.textContent = '↹';
			break;
		case 'CapsLock':
			span.textContent = '⇪';
			break;
		case 'Backspace':
			span.textContent = '⌫';
			break;
		default:
			span.textContent = inputHistory[inputHistory.length - 1];
	}

	wrapper.appendChild(span);
	historyCard.appendChild(wrapper);
};

const onKeyDown = (e) => {
	let location =
		e.location === 0
			? 'General Keys'
			: e.location === 1
			? 'Left-side modifier keys'
			: 'Right-side modifier keys';

	if (isCardNotRemoved) {
		document.querySelector('.pre-event-card').remove();
		document.querySelector('.container').removeAttribute('style');
		isCardNotRemoved = false;
	}
	pageHeading.textContent = `JavaScript Key Code ${e.keyCode}`;
	hero.textContent = eventCode.textContent = e.keyCode;
	eventKey.textContent = e.keyCode === 32 ? '(blank space)' : e.key;
	eventLocation.textContent = location;
	eventWhich.textContent = e.which;
	eventDescription.textContent = getDescription(e);
	toggleMetaKeysOn(e);
	eventDump.textContent = `{
    "key": ${e.key},
    "keyCode": ${e.keyCode},
    "which": ${e.which},
    "code": ${e.code},
    "location": ${e.location},
    "altKey": ${e.altKey},
    "ctrlKey": ${e.ctrlKey},
    "metaKey": ${e.metaKey},
    "shiftKey": ${e.shiftKey},
    "repeat": ${e.repeat}
}`;
	setSimilarTxt(e.keyCode);
	unicodeTxt.textContent = getUnicodeChar(e);
	if (setEventHistory(e.key)) setHistoryCard();
};

const onKeyUp = (e) => {
	if (isMetaKeyPressed) {
		toggleMetaKeysOff(
			document.querySelectorAll('.meta-keys-card_meta-key')
		);
	}
};

const toggleDarkMode = (e) => {
	const historyChips = document.querySelectorAll(
		'.history-card_history-chip'
	);
	if (darkModeSwitch.checked) {
		if (historyChips) {
			historyChips.forEach((historyChip) => {
				historyChip.classList.add(
					'history-card_history-chip__dark-mode'
				);
			});
		}
		if (isCardNotRemoved) {
			document.querySelector('.pre-event-card').style.backgroundColor =
				'#252526';
		}
		document.body.style.backgroundColor = '#202023';
		document.body.style.color = 'white';
		document.querySelectorAll('.card-text').forEach((item) => {
			item.style.backgroundColor = '#252526';
		});
	} else {
		if (historyChips) {
			historyChips.forEach((historyChip) => {
				historyChip.classList.remove(
					'history-card_history-chip__dark-mode'
				);
			});
		}
		if (isCardNotRemoved) {
			document.querySelector('.pre-event-card').style.backgroundColor =
				'#fff';
		}
		document.body.style.backgroundColor = '#f3f4f6';
		document.body.style.color = 'black';
		document.querySelectorAll('.card-text').forEach((item) => {
			item.style.backgroundColor = 'white';
		});
	}
};

document.body.addEventListener('keydown', onKeyDown);
document.body.addEventListener('keyup', onKeyUp);
darkModeSwitch.addEventListener('change', toggleDarkMode);
