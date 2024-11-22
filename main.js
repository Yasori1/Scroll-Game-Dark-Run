$(document).ready(function () {
	const hero = $("#hero");
	const obstacles = $(".obstacle");
	const bush = $(".bush");
	const floor = $(".floor");
	const object = $(".object");
	const finishLine = $("#finishLine");
	let gameRunning = true;
	let timerStarted = false;
	let startTime, intervalId;
	let highestScore = 0;
	const scrollSpeed = 20; // Increased speed for scrolling
	let isJumping = false;
	let lastScrollTime = 0;
	let isRunningRight = false;
	let isRunningLeft = false;
	let lastDirection = "idle-right"; // Start with idle-right
	let touchStartX = 0;
	let touchStartY = 0;

	function setHeroState(state) {
		hero.removeClass("idle-right idle-left running-right running-left");
		hero.addClass(state);
	}

	function handleIdleState() {
		if (lastDirection === "running-right") {
			setHeroState("idle-right");
		} else if (lastDirection === "running-left") {
			setHeroState("idle-left");
		} else {
			setHeroState("idle-right");
		}
	}

	setHeroState("idle-left");

	function startTimer() {
		startTime = Date.now();
		intervalId = setInterval(updateTimer, 100);
	}

	function updateTimer() {
		const now = Date.now();
		const elapsed = now - startTime;

		const minutes = Math.floor(elapsed / (1000 * 60));
		const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
		const milliseconds = Math.floor((elapsed % 1000) / 100);

		$("#chronometer, .chronometer").text(`${pad(minutes, 2)}:${pad(seconds, 2)}`);
	}