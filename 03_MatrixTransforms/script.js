const stack = [];

function pushMatrix(matrix) {
    stack.push(matrix.slice());
}

function popMatrix() {
    return stack.pop();
}

function multMatrix(a, b) {
    const result = mat4.create();
    mat4.multiply(result, a, b);
    return result;
}

function setup() {
    const canvas = document.getElementById('myCanvas');
    const context = canvas.getContext('2d');
    const timeSlider = document.getElementById('timeSlider');

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    let currentTime = hours + minutes / 60;
    timeSlider.value = currentTime.toString();


    let isUserInteracting = false;
    let stars = [];

    function generateStars(numStars) {
        stars = [];
        for (let i = 0; i < numStars; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * (canvas.height - 100);
            const brightness = Math.random();
            stars.push({ x, y, brightness });
        }
    }
    generateStars(150);

    function drawSun(timeValue) {
        const sunRadius = 40;
        const orbitRadius = 600;
        
        // Create the identity matrix
        let matrix = mat4.create();
    
        // Translate to the center of the canvas
        const translationMatrix = mat4.create();
        mat4.translate(translationMatrix, translationMatrix, [canvas.width / 2, canvas.height, 0]);
        matrix = multMatrix(matrix, translationMatrix);
    
        // Rotate based on the time of day
        const sunAngle = ((timeValue - 7) / 12) * Math.PI;
        const rotationMatrix = mat4.create();
        mat4.rotateZ(rotationMatrix, rotationMatrix, -sunAngle);
        matrix = multMatrix(matrix, rotationMatrix);
    
        // Translate out to the orbit radius
        const orbitTranslation = mat4.create();
        mat4.translate(orbitTranslation, orbitTranslation, [orbitRadius, 0, 0]);
        matrix = multMatrix(matrix, orbitTranslation);
    
        // Get the sun's final position
        const sunX = matrix[12];  // Extract x
        const sunY = matrix[13];  // Extract y
    
        context.beginPath();
        context.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
        context.fillStyle = 'yellow';
        context.fill();
    }
    
    function drawMoon(timeValue) {
        const moonRadius = 40;
        const orbitRadius = 600;
        
        let matrix = mat4.create();
    
        const translationMatrix = mat4.create();
        mat4.translate(translationMatrix, translationMatrix, [canvas.width / 2, canvas.height, 0]);
        matrix = multMatrix(matrix, translationMatrix);
    
        const sunAngle = ((timeValue - 7) / 12) * Math.PI;
        const moonAngle = sunAngle + Math.PI;
        const rotationMatrix = mat4.create();
        mat4.rotateZ(rotationMatrix, rotationMatrix, -moonAngle);
        matrix = multMatrix(matrix, rotationMatrix);
    
        const orbitTranslation = mat4.create();
        mat4.translate(orbitTranslation, orbitTranslation, [orbitRadius, 0, 0]);
        matrix = multMatrix(matrix, orbitTranslation);

        const moonX = matrix[12];
        const moonY = matrix[13];
    
        context.beginPath();
        context.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        context.fillStyle = 'lightgray';
        context.fill();
    }
    

    function drawStars() {
        stars.forEach(star => {
            context.beginPath();
            context.arc(star.x, star.y, 2, 0, Math.PI * 2);
            context.fillStyle = `rgba(135, 206, 235, ${star.brightness})`;
            context.fill();
        });
    }

    function updateStars() {
        stars.forEach(star => {
            star.brightness += (Math.random() - 0.5) * 0.08;
            star.brightness = Math.min(Math.max(star.brightness, 0), 1);
        });
    }

    function drawClockFace(x, y) {
        context.beginPath();
        context.arc(x, y, 50, 0, Math.PI * 2);
        context.fillStyle = 'white';
        context.fill();
        context.strokeStyle = 'dimgray';
        context.lineWidth = 3;
        context.stroke();
    }

    function drawHand(x, y, length, angle, width, color) {
        context.save();
        context.translate(x, y);
        context.rotate(angle);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, -length);
        context.lineWidth = width;
        context.strokeStyle = color;
        context.stroke();
        context.restore();
    }

    function drawNumbers(x, y) {
        context.fillStyle = 'dimgray';
        context.font = 'bold 18px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        for (let i = 1; i <= 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const numX = x + Math.cos(angle - Math.PI / 2) * 40;
            const numY = y + Math.sin(angle - Math.PI / 2) * 40;
            context.fillText(i.toString(), numX, numY);
        }
    }

    function drawClockTower() {
        const towerX = canvas.width / 2 - 50;
        const towerY = canvas.height - 400;
        const towerWidth = 100;
        const towerHeight = 300;

        context.fillStyle = 'brown';
        context.fillRect(towerX, towerY, towerWidth, towerHeight);

        context.fillStyle = '#763808';
        context.beginPath();
        context.moveTo(towerX, towerY);
        context.lineTo(towerX + towerWidth / 2, towerY - 60);
        context.lineTo(towerX + towerWidth, towerY);
        context.closePath();
        context.fill();
    }

    function drawLand() {
        context.fillStyle = 'green';
        context.fillRect(0, canvas.height - 100, canvas.width, 100);
    }

    function drawClock() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        const timeValue = parseFloat(timeSlider.value);
        const hours = Math.floor(timeValue);
        const minutes = Math.floor((timeValue % 1) * 60);
        const seconds = new Date().getSeconds();

        if (timeValue >= 7 && timeValue < 19) {
            context.fillStyle = 'skyblue';
            context.fillRect(0, 0, canvas.width, canvas.height - 100);
            drawSun(timeValue);
        } else {
            context.fillStyle = '#001f3f';
            context.fillRect(0, 0, canvas.width, canvas.height - 100);
            drawMoon(timeValue);
            drawStars();
        }

        updateStars();
        drawStars();
        drawLand();
        drawClockTower();
        const clockX = canvas.width / 2;
        const clockY = canvas.height - 340;
        drawClockFace(clockX, clockY);
        drawNumbers(clockX, clockY);

        const secondAngle = (seconds / 60) * Math.PI * 2;
        const minuteAngle = (minutes / 60 + seconds / 3600) * Math.PI * 2;
        const hourAngle = (hours % 12 / 12 + minutes / 720) * Math.PI * 2;
        drawHand(clockX, clockY, 25, hourAngle - Math.PI / 2, 6, 'black');
        drawHand(clockX, clockY, 35, minuteAngle - Math.PI / 2, 4, 'blue');
        drawHand(clockX, clockY, 50, secondAngle - Math.PI / 2, 2, 'red');

        requestAnimationFrame(drawClock);
    }

    function updateTime() {
        if (!isUserInteracting) {
            currentTime += (1 / 3600);
            timeSlider.value = currentTime.toFixed(4);
        }
    }
    
    timeSlider.addEventListener('mousedown', () => {
        isUserInteracting = true;
    });
    timeSlider.addEventListener('mouseup', () => {
        isUserInteracting = false;
    });
    timeSlider.addEventListener('input', () => {
        currentTime = parseFloat(timeSlider.value);
    });
    

    drawClock();
    setInterval(updateTime, 1000);
}

setup();
