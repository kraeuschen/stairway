var width    = 320,  
    height   = 500,
    gLoop,
    points   = 0,
    state    = true;
    c        = document.getElementById('c');
	ctx      = c.getContext('2d');
	c.width  = width;
	c.height = height;  

var clear = function() {
	ctx.fillStyle = '#d0e7f9';  
	ctx.beginPath();  
	ctx.rect(0, 0, width, height);  
	ctx.closePath();  
	ctx.fill();  
};

var howManyCircles = 10,
    circles = [];  

for (var i = 0; i < howManyCircles; i++) {
	circles.push([
		Math.random() * width,
		Math.random() * height,
		Math.random() * 100,
		Math.random() / 2
	]);
}

var DrawCircles = function() {  
	for (var i = 0; i < howManyCircles; i++) {  
		ctx.fillStyle = 'rgba(255, 255, 255, ' + circles[i][3] + ')';  
		ctx.beginPath();  
		ctx.arc(
			circles[i][0],
			circles[i][1],
			circles[i][2],
			0, 
			Math.PI * 2,
			true
		);  
		ctx.closePath();  
		ctx.fill();  
	}  
};  

var MoveCircles = function(deltaY) {  
	for (var i = 0; i < howManyCircles; i++) {  
		if (circles[i][1] - circles[i][2] > height) {  
			circles[i][0] = Math.random() * width;  
			circles[i][2] = Math.random() * 100;  
			circles[i][1] = 0 - circles[i][2];  
			circles[i][3] = Math.random() / 2;  
		} else {  
			circles[i][1] += deltaY;  
		}  
	}  
};

var checkCollision = function() {
    platforms.forEach(function(e, ind) {
        
        if ((player.isFalling) && 
            (player.X < e.x + platformWidth) && 
            (player.X + player.width > e.x) && 
            (player.Y + player.height > e.y) && 
            (player.Y + player.height < e.y + platformHeight)
        ) {
            e.onCollide();
        }
    })
}

var GameOver = function() {
    state = false;
    clearTimeout(gLoop);
    setTimeout(function() {
        clear(); 
        ctx.fillStyle = "Black";
        ctx.font = "10pt Arial";
        ctx.fillText("GAME OVER", width / 2 - 60, height / 2 - 50);
        ctx.fillText("YOUR RESULT:" + points, width / 2 - 60, height / 2 - 30);
    }, 100);
};

var GameLoop = function() {
    clear();  
    MoveCircles(5);
    DrawCircles();

    checkCollision();
    
    if (player.isJumping) player.checkJump();  
    if (player.isFalling) player.checkFall();

    player.draw();  

    platforms.forEach(function(platform, index) {
        if (platform.isMoving) {
            if (platform.x < 0) {
                platform.direction = 1;
            } else if (platform.x > width - platformWidth) {
                platform.direction = -1;
            }
            platform.x += platform.direction * (index / 2) * ~~(points / 100);
        }
        platform.draw();
    });

    ctx.fillStyle = "Black";  
    ctx.fillText("POINTS:" + points, 10, height-10);
  
    if (state) { 
        gLoop = setTimeout(GameLoop, 1000 / 50);
    }
}

var nrOfPlatforms = 7, 
    platforms = [],
    platformWidth = 70,
    platformHeight = 20;

// global (so far) variables are not the best place for storing platform size information,
// but in case it will be needed to calculate collisions I put it here, not as a Platform attributes
var generatePlatforms = function() {
    var position = 0,
        type;

    for (var i = 0; i < nrOfPlatforms; i++) {
        type = ~~(Math.random()*5);
        
        if (type == 0) type = 1;
        else type = 0;

        platforms[i] = new Platform(
            Math.random()*(width-platformWidth),
            position,
            type
        );

        if (position < height - platformHeight) {
            position += ~~(height / nrOfPlatforms);
        }
    }
}();


//'~~' returns nearest lower integer from  
//given float, equivalent of Math.floor()  
player.setPosition(
    ~~((width-player.width) / 2),
    ~~((height - player.height) / 2)
);

player.jump();

document.onmousemove = function(e) {
    if (player.X + c.offsetLeft > e.pageX) {
        player.moveLeft();
    } else if (player.X + c.offsetLeft < e.pageX) {
        player.moveRight();
    }
};

GameLoop();
