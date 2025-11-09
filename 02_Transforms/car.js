"use strict";
const canvas = document.getElementById("myCanvas");
const context = canvas.getContext("2d");

let clouds = [];
let cloudSpeed = parseInt(document.getElementById("speedSlider").value);
let pos = parseInt(document.getElementById("posSlider").value);
let cloudSpawnInterval = 2000;
let carX = 350;
let carY = 400;
let wheelRotation = 0;

function createCloud() {
    const yMin = 0;
    const yMax = canvas.height - 200;

    const numSemicircles = Math.floor(Math.random() * 5) + 3;
    const baseRadius = 20;

    let radii = [];
    for (let i = 0; i < numSemicircles; i++) {
        if (i <= Math.floor(numSemicircles / 2)) {
            radii.push(baseRadius + i * 10);
        } else {
            radii.push(baseRadius + (numSemicircles - i - 1) * 10);
        }
    }

    const x = -10;
    const y = Math.floor(Math.random() * (yMax - yMin)) + yMin;

    return { x, y, radii, numSemicircles, yOffset: Math.random() * 20 - 10 };
}

function drawClouds() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    createBG();

    for (let i = clouds.length - 1; i >= 0; i--) {
        let cloud = clouds[i];
        let currentX = cloud.x;

        context.fillStyle = "White";
        context.strokeStyle = "Grey";
        context.beginPath();

        for (let j = 0; j < cloud.numSemicircles; j++) {
            context.save();
            context.translate(currentX, cloud.y + cloud.yOffset);
            context.scale(1, 0.5);
            context.arc(0, 0, cloud.radii[j], Math.PI, 2 * Math.PI, false);
            context.restore();

            if (j < Math.floor(cloud.numSemicircles / 2)) {
                currentX += cloud.radii[j] * 2; // Increment for first half
            } else {
                currentX += (cloud.radii[j] * 1.5); // Reduce the increment for the second half
            }
        }

        context.closePath();
        context.stroke();
        context.fill();

        cloud.x += cloudSpeed;

        if (cloud.x > canvas.width) {
            clouds.splice(i, 1);
        }
    }
}

function createBG() {
    context.fillStyle = "LightCyan";
    context.fillRect(0, 0, canvas.width, canvas.height - 100);
    context.fillStyle = "GoldenRod";
    context.fillRect(0, canvas.height - 100, canvas.width, 100);
}

function generateClouds() {
    if (cloudSpeed > 0) {
        clouds.push(createCloud());
    }
    
    cloudSpawnInterval = Math.max(2000 / cloudSpeed, 200);
    setTimeout(generateClouds, cloudSpawnInterval);
}

function drawCar(x, y) {
    context.save();

    context.translate(x + 120, y);

    context.scale(-1, 1); // flip car

    // cars lower body
    context.fillStyle = "Purple";
    context.fillRect(-120, 30, 100, 20);

    //cars top
    context.fillStyle = "Blue"
    context.fillRect(-120, 10, 60, 20);

    //cars exhaust
    context.fillStyle = "Grey"
    context.fillRect(-142, 35, 22, 10)

    context.restore();
}

function drawWheels(x, y) {
    let wheelRadius = 8;

    // Left wheel
    context.save();
    context.translate(x - 30, y + 100);
    context.rotate(wheelRotation);
    
    context.fillStyle = "black";
    context.beginPath();
    context.arc(0, 0, wheelRadius, 0, Math.PI * 2);
    context.fill();

    for (let i = 0; i < 6; i++) {
        context.save();
        context.rotate((Math.PI / 3) * i);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, -wheelRadius);
        context.strokeStyle = "white";
        context.lineWidth = 2;
        context.stroke();
        context.restore();
    }

    context.restore();

    // Right wheel
    wheelRadius = 12;
    context.save();
    context.translate(x + 30, y + 97);
    context.rotate(wheelRotation);
    
    context.fillStyle = "black";
    context.beginPath();
    context.arc(0, 0, wheelRadius, 0, Math.PI * 2);
    context.fill();

    for (let i = 0; i < 6; i++) {
        context.save();
        context.rotate((Math.PI / 3) * i);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, -wheelRadius);
        context.strokeStyle = "white";
        context.lineWidth = 2;
        context.stroke();
        context.restore();
    }

    context.restore();
}

function animate() {
    drawClouds();
    drawCar(canvas.width - 290 + pos, canvas.height - 150);
    drawWheels(canvas.width - 100 + pos, canvas.height - 200);
    wheelRotation -= cloudSpeed * 0.02;
    requestAnimationFrame(animate);
}

document.getElementById("speedSlider").addEventListener("input", () => {
    cloudSpeed = parseInt(speedSlider.value);
});

document.getElementById("posSlider").addEventListener("input", () => {
    pos = parseInt(posSlider.value);
});

generateClouds();
animate();