$(document).ready(function () {
  const hero = $('#hero')
  const obstacles = $('.obstacle')
  const bush = $('.bush')
  const floor = $('.floor')
  const object = $('.object')
  const finishLine = $('#finishLine')
  let gameRunning = true
  let timerStarted = false
  let startTime, intervalId
  let highestScore = 0
  const scrollSpeed = 20 // Increased speed for scrolling
  let isJumping = false
  let lastScrollTime = 0
  let isRunningRight = false
  let isRunningLeft = false
  let lastDirection = 'idle-right' // Start with idle-right
  let touchStartX = 0
  let touchStartY = 0

  function setHeroState(state) {
    hero.removeClass('idle-right idle-left running-right running-left')
    hero.addClass(state)
  }

  function handleIdleState() {
    if (lastDirection === 'running-right') {
      setHeroState('idle-right')
    } else if (lastDirection === 'running-left') {
      setHeroState('idle-left')
    } else {
      setHeroState('idle-right')
    }
  }

  setHeroState('idle-left')

  function startTimer() {
    startTime = Date.now()
    intervalId = setInterval(updateTimer, 100)
  }

  function updateTimer() {
    const now = Date.now()
    const elapsed = now - startTime

    const minutes = Math.floor(elapsed / (1000 * 60))
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000)
    const milliseconds = Math.floor((elapsed % 1000) / 100)

    $('#chronometer, .chronometer').text(
      `${pad(minutes, 2)}:${pad(seconds, 2)}`,
    )
  }

  function pad(number,length){
	return number.toString().padStart(length, "0");
  }
  function handleScroll(scrollDirection){
	$(".start").fadeOut();

	const now = Date.now();
	if(!gameRunning || now - lastScrollTime <16)return;
	lastScrollTime = now;

	if(!timerStarted){
		startTimer();
		timerStarted = true;
	}

	if(scrollDirection<0 && !isRunningRight){
		isRunningRight = true;
		isRunningLeft = false;
		lastDirection = "running-right";
		setHeroState("runnig-right")
	}else if (scrollDirection > 0 && !isRunningLeft){
		isRunningLeft = true;
		isRunningRight = false;
		lastDirection = "runnig-right";
		setHeroState("running-left")
	}

	clearTimeout(hero.data("scrollTimeout"));
	hero.data(
		"scrollTimeout",
		setTimeout(() =>{
			isRunningLeft=false;
			isRunningRight = false;
			handleIdleState();
		},200)
	);

	requestAnimationFrame(()=>{
		$(".obstacle, .bush,.floor,.object,#finishLine").each(function(){
			const left= parseInt($(this).css("left"));
			$(this).css("left", left - scrollDirection * scrollSpeed + "px")
		});
		checkWin();
		checkHeroSilhouetteOverlap()
	})
  }
  $(window).on("mousewhell DOMMouseScroll" , function(e){
	const delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
	const scrollDirection = delta <0 ?1 : -1;
	handleScroll(scrollDirection);
  })

  $(documnet).on("touchstart", function(e){
	touchStartX = e.originalEvent.touches[0].pageX;
	touchStartY = e.originalEvent.touches[0].pageY;
  })

  $(document).on("touchmove", function(e){
	const touchEndX = e.originalEvent.touches[0].pageX;
	const touchEndY = e.originalEvent.touches[0].pageY;
	const deltaX = touchEndX - touchStartX;
	const deltaY = touchEndY - touchStartY;

	if (Math.abs(deltaX)> Math.abs(deltaY)){
		const scrollDirection = deltaX< 0?1 :-1;
		handleScroll(scrollDirection)
	}
  })

  $(document).on("touchstart", function(e){
	if (!gameRunning || isJumping)return;

	if(e.key ==="ArrowUp"){
		handleJump()
	}
  })

  $(document).on("touchstart", function(e){
	const touchEndY = e.originalEvent.touches[0].pageY;

	if(touchStartY - touchEndY> 50){
		handleJump()
	}
  })

  function handleJump(){
	if (!gameRunning || isJumping)return;

	isJumping = true;
	hero.addClass("jump");
	setTimeout(()=>{
		hero.removeClass("jump");
		isJumping = false;
	}, 500);
  }

  function checkCollision(){
	const tolerance = 10;
	const heroPos = hero[0].getBoundingClientRect();

	$(".obstacle").each(function(){
		const obstaclePos = this.getBoundingClientRect();

		if (
			!(
				heroPos.right<obstaclePos.left + tolerance ||
				heroPos.left > obstaclePos.right - tolerance ||
				heroPos.bottom < obstaclePos.top ||
				heroPos.top>obstaclePos.bottom
			)
		){
			gameOver();
		}
	})
  }
  function gameOver(){
	if(!gameRunning)return;
	gameRunning = false;
	clearInterval(intervalId);
	$(".start").fadeOut();
	$(".game-over").fadeIn();
  }
  function gameWin(){
	if(!gameRunning) return;
	gameRunning = false;
	clearInterval(intervalId);
	const now = Date.now();

	const elapsed = now -startTime;
	if(eşapsed < highestScore || highestScore ===0){
		highestScore = elapsed;
		const minutes = Math.floor(highestScore / (1000* 60));
		const seconds = Math.floor ((highestScore % (1000* 60 )) / 1000)
		const milliseconds = Math.floor((highestScore % 1000) / 10);
		$("#highestScore, .highestScore").text(
			`${pad(minutes, 2)}:${pad(seconds, 2)}`
		)
	}
	$(".win").fadeIn();
	$(".bestTime").fadeIn();
  }

  $(".restartButton").click(function(){
	resetGame();
	$(".game-over,").fadeOut();
  })

  function resetGame(){
	gameRunning = true;
	timerStarted = false;
	clearInterval(invervalId);
	$("#chronometer,. choronometer").text("00:00");

	hero.css("top", "calc(50% + 200px)");
	hero.removeClass("invert");

	$(".obstacle, .bush, .floor, object, #finishLine").each(function(){
		$(this).data("initialLeft", $(this).css("left"))
	})
  }
  $(".bush").each(function (index){
	var $bush = $(this);

	function toggleObstacle(){
		$bush.toggleObstacle("obstacle monster");
		setTimeout(
			toggleObstacle,
			$bush.hasClass("obstacle monster")
						? getToogleTime(index, true)
						: getToogleTime(index, false)
		)
	}
	toggleObstacle()
  })

  function getToogleTime(index,isObstacle){
	var toggleTimes=[
		[3000,4000],
		[4000,5000],
		[5000,6500],
		[3500,4000],
		[6000,7000]
	];
	return isObstacle ? toggleTimes[index][0] : toggleTimes[index][1];
  }

  function checkHeroSilhouetteOverlap(){
	const heroPos = hero[0].getBoundingClientRect();
	let heroInFrontOfEyes = false;

	$(".silhouette").each(function(){
		const bushPos = this.getBoundingClientRect();

		if(
			!(
				heroPos.right< bushPos.left ||
				heroPos.left > bushPos.right ||
				heroPos.bottom < bushPos.top ||
				heroPos.top > bushPos.bottom
			)
		){
			heroInFrontOfEyes = true;
		}
	})

	if (herInFrontOfEyes){
		hero.addClass("invert");
	}else{
		hero.removeClass("invert")
	}
  }
});
