const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');
const aimSlider = document.getElementById('aimSlider');
const posSlider = document.getElementById('posSlider');

function drawFlower(petals, size) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < petals; i++) {
        const angle = (i * Math.PI * 2) / petals;
        const petalX = centerX + Math.cos(angle) * size;
        const petalY = centerY + Math.sin(angle) * size;

        context.beginPath();
        context.ellipse(petalX, petalY, size / 4, size / 2, angle, 0, Math.PI * 2);
        context.fillStyle = `hsl(${aimSlider.value}, 100%, 50%)`;
        context.fill();
        context.closePath();
    }

    context.beginPath();
    context.arc(centerX, centerY, size / 5, 0, Math.PI * 2, false);
    context.fillStyle = 'magenta';
    context.fill();
    context.closePath();
  
    const stemTopY = centerY + size / 2; 
    const stemBottomY = canvas.height - 50;
    context.beginPath();
    context.moveTo(centerX, stemTopY);
    context.lineTo(centerX, stemBottomY);
    context.lineWidth = 5;
    context.strokeStyle = 'green';
    context.stroke();
    context.closePath();

    context.beginPath();
    context.moveTo(centerX - 10, stemBottomY);
    context.lineTo(centerX + 10, stemBottomY); 
    context.lineTo(centerX, stemBottomY - 30); 
    context.closePath();
    context.strokeStyle = 'green';
    context.stroke(); 
}

function draw() {
    const petals = Math.floor(posSlider.value / 20) + 3;
    const size = (aimSlider.value / 100) * 100 + 10;

    drawFlower(petals, size);

    requestAnimationFrame(draw);
}

draw();