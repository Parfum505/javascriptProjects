/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/
var diceImg = document.querySelector('.dice'),
	btnRoll = document.querySelector('.btn-roll'),
	btnHold = document.querySelector('.btn-hold'),
	btnNew = document.querySelector('.btn-new'),
	scores,
	gamePlaying,
	roundScore,
	activePlayer;

btnRoll.addEventListener('click', function () {
	if (gamePlaying) {
		var dice = Math.floor(Math.random() * 6 + 1);
		diceImg.src = 'img/dice-' + dice + '.png';
		diceImg.style.display = 'block';
		if (dice !== 1) {
			roundScore += dice;
			document.getElementById('current-' + activePlayer).textContent = roundScore;
		} else {
			nextPlayer();
		}
	}


});
btnHold.addEventListener('click', function () {
	if (gamePlaying) {
		scores[activePlayer] += roundScore;
		document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];
		if (scores[activePlayer] >= 100) {
			gamePlaying = false;
			document.getElementById('name-' + activePlayer).textContent ='Winner!';
			document.querySelector('.player-'+ activePlayer +'-panel').classList.remove('active');
			document.querySelector('.player-'+ activePlayer +'-panel').classList.add('winner');
			diceImg.style.display = 'none';
		} else {
			nextPlayer();
		}
	}


});
btnNew.addEventListener('click', newGame);
function nextPlayer() {
	roundScore = 0;
	diceImg.style.display = 'none';
	document.querySelector('.player-0-panel').classList.toggle('active');
	document.querySelector('.player-1-panel').classList.toggle('active');
	document.getElementById('current-0').textContent = '0';
	document.getElementById('current-1').textContent = '0';
	activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
}
function newGame() {
	gamePlaying = true;
	diceImg.style.display = 'none';
	scores = [0,0];
	roundScore = 0;
	activePlayer = 0;
	document.querySelector('.player-0-panel').classList.remove('winner');
	document.querySelector('.player-1-panel').classList.remove('winner');
	document.querySelector('.player-1-panel').classList.remove('active');
	document.querySelector('.player-0-panel').classList.add('active');
	document.getElementById('score-0').textContent = '0';
	document.getElementById('score-1').textContent = '0';
	document.getElementById('current-0').textContent = '0';
	document.getElementById('current-1').textContent = '0';
	document.getElementById('name-0').textContent = 'PLAYER 1';
	document.getElementById('name-1').textContent = 'PLAYER 2';
}
newGame();