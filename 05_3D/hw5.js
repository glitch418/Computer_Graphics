function setup() {
    const cameraCanvas = document.getElementById('cameraCanvas');
    const cameraContext = cameraCanvas.getContext('2d');
    const slider1 = document.getElementById('slider1');
    const slider2 = document.getElementById('slider2');
    slider1.value = 0;
    slider2.value = 0;

    function drawLand(Tx) {
        cameraContext.fillStyle = 'green';
        
        const landPoints = [
            [-300, 0, -300],
            [600, 0, -300],
            [600, 0, 300],
            [-300, 0, 300]
        ];
    
        cameraContext.beginPath();
        for (let i = 0; i < landPoints.length; i++) {
            const point = vec3.create();
            vec3.transformMat4(point, landPoints[i], Tx);
            
            if (i === 0) {
                cameraContext.moveTo(point[0], point[1]);
            } else {
                cameraContext.lineTo(point[0], point[1]);
            }
        }
        cameraContext.closePath();
        cameraContext.fill();
    }

    function moveToTx(loc, Tx) {
        const res = vec3.create();
        vec3.transformMat4(res, loc, Tx);
        cameraContext.moveTo(res[0], res[1]);
    }

    function lineToTx(loc, Tx) {
        const res = vec3.create();
        vec3.transformMat4(res, loc, Tx);
        cameraContext.lineTo(res[0], res[1]);
    }

    function drawSoccer(color, Tx) {
        cameraContext.fillStyle = color;
        cameraContext.strokeStyle = "black";
        cameraContext.beginPath();
        const headCenter = vec3.create();
        vec3.transformMat4(headCenter, [0, 0.6, 0], Tx);
        cameraContext.arc(headCenter[0], headCenter[1], 11, 0, 2 * Math.PI);
        cameraContext.stroke();
        cameraContext.fill();
    }

    function drawSoccerNet(color, Tx) {
        cameraContext.fillStyle = color;
        cameraContext.strokeStyle = "lightgrey";
        cameraContext.lineWidth = 2;
        const postPoints = [
            [0, 0, 0],
            [0, 2.4, 0],
            [7.32, 2.4, 0],
            [7.32, 0, 0]
        ];
        cameraContext.beginPath();
        for (let i = 0; i < postPoints.length; i++) {
            const point = vec3.create();
            vec3.transformMat4(point, postPoints[i], Tx);
            
            if (i === 0) {
                cameraContext.moveTo(point[0], point[1]);
            } else {
                cameraContext.lineTo(point[0], point[1]);
            }
        }
        cameraContext.stroke();
    
        const depthPoints = [
            [0, 0, 2.44],
            [0, 2.4, 2.44],
            [7.32, 2.4, 2.44],
            [7.32, 0, 2.44]
        ];
    
        cameraContext.beginPath();
        cameraContext.strokeStyle = "white";
        for (let i = 0; i < depthPoints.length; i++) {
            const point = vec3.create();
            vec3.transformMat4(point, depthPoints[i], Tx);
            
            if (i === 0) {
                cameraContext.moveTo(point[0], point[1]);
            } else {
                cameraContext.lineTo(point[0], point[1]);
            }
        }
        cameraContext.stroke();
        
        for (let i = 0; i < postPoints.length; i++) {
            cameraContext.beginPath();
            let frontPoint = vec3.create();
            let backPoint = vec3.create();
            vec3.transformMat4(frontPoint, postPoints[i], Tx);
            vec3.transformMat4(backPoint, depthPoints[i], Tx);
            cameraContext.moveTo(frontPoint[0], frontPoint[1]);
            cameraContext.lineTo(backPoint[0], backPoint[1]);
            cameraContext.stroke();
        }
        
        cameraContext.strokeStyle = "lightblue";
        const verticalSpacing = 0.5;
        for (let x = verticalSpacing; x < 7.32; x += verticalSpacing) {    
            let backTop = vec3.create();
            let backBottom = vec3.create();
            vec3.transformMat4(backTop, [x, 2.4, 2.44], Tx);
            vec3.transformMat4(backBottom, [x, 0, 2.44], Tx);
            cameraContext.beginPath();
            cameraContext.moveTo(backTop[0], backTop[1]);
            cameraContext.lineTo(backBottom[0], backBottom[1]);
            cameraContext.stroke();
        }

        const sideNetSpacing = 0.8;
        for (let z = sideNetSpacing; z < 2.44; z += sideNetSpacing) {
            let rightTop = vec3.create();
            let rightBottom = vec3.create();
            vec3.transformMat4(rightTop, [7.32, 2.4, z], Tx);
            vec3.transformMat4(rightBottom, [7.32, 0, z], Tx);
            cameraContext.beginPath();
            cameraContext.moveTo(rightTop[0], rightTop[1]);
            cameraContext.lineTo(rightBottom[0], rightBottom[1]);
            cameraContext.stroke();

            let leftTop = vec3.create();
            let leftBottom = vec3.create();
            vec3.transformMat4(leftTop, [0, 2.4, z], Tx);
            vec3.transformMat4(leftBottom, [0, 0, z], Tx);
            cameraContext.beginPath();
            cameraContext.moveTo(leftTop[0], leftTop[1]);
            cameraContext.lineTo(leftBottom[0], leftBottom[1]);
            cameraContext.stroke();
        }
        
        const horizontalSpacing = 0.4;
        for (let y = horizontalSpacing - 0.4; y < 2.4; y += horizontalSpacing) {
            let backLeft = vec3.create();
            let backRight = vec3.create();
            vec3.transformMat4(backLeft, [0, y, 2.44], Tx);
            vec3.transformMat4(backRight, [7.32, y, 2.44], Tx);
            cameraContext.beginPath();
            cameraContext.moveTo(backLeft[0], backLeft[1]);
            cameraContext.lineTo(backRight[0], backRight[1]);
            cameraContext.stroke();

            let leftFront = vec3.create();
            let leftBack = vec3.create();
            vec3.transformMat4(leftFront, [0, y, 0], Tx);
            vec3.transformMat4(leftBack, [0, y, 2.44], Tx);
            cameraContext.beginPath();
            cameraContext.moveTo(leftFront[0], leftFront[1]);
            cameraContext.lineTo(leftBack[0], leftBack[1]);
            cameraContext.stroke();

            let rightFront = vec3.create();
            let rightBack = vec3.create();
            vec3.transformMat4(rightFront, [7.32, y, 0], Tx);
            vec3.transformMat4(rightBack, [7.32, y, 2.44], Tx);
            cameraContext.beginPath();
            cameraContext.moveTo(rightFront[0], rightFront[1]);
            cameraContext.lineTo(rightBack[0], rightBack[1]);
            cameraContext.stroke();
        }

        for (let x = verticalSpacing; x < 7.32; x += verticalSpacing) {
            let topFront = vec3.create();
            let topBack = vec3.create();
            vec3.transformMat4(topFront, [x, 2.4, 0], Tx);
            vec3.transformMat4(topBack, [x, 2.4, 2.44], Tx);
            cameraContext.beginPath();
            cameraContext.moveTo(topFront[0], topFront[1]);
            cameraContext.lineTo(topBack[0], topBack[1]);
            cameraContext.stroke();
        }
        
        for (let z = sideNetSpacing; z < 2.44; z += sideNetSpacing) {
            let topLeft = vec3.create();
            let topRight = vec3.create();
            vec3.transformMat4(topLeft, [0, 2.4, z], Tx);
            vec3.transformMat4(topRight, [7.32, 2.4, z], Tx);
            cameraContext.beginPath();
            cameraContext.moveTo(topLeft[0], topLeft[1]);
            cameraContext.lineTo(topRight[0], topRight[1]);
            cameraContext.stroke();
        }

    }









    function drawFieldLines(Tx) {
        cameraContext.strokeStyle = "white";
        cameraContext.lineWidth = 2;
        
        const fieldLength = 600;
        const fieldWidth = 400;
        const penaltyBoxLength = 40;
        const penaltyBoxWidth = 165;
        const goalBoxLength = 20;
        const goalBoxWidth = 110;
        
        cameraContext.beginPath();
        const fieldCorners = [
            [-fieldLength/2, 0, -fieldWidth/2],
            [fieldLength/2, 0, -fieldWidth/2],
            [fieldLength/2, 0, fieldWidth/2],
            [-fieldLength/2, 0, fieldWidth/2]
        ];
        
        for (let i = 0; i < fieldCorners.length; i++) {
            const point = vec3.create();
            vec3.transformMat4(point, fieldCorners[i], Tx);
            
            if (i === 0) {
                cameraContext.moveTo(point[0], point[1]);
            } else {
                cameraContext.lineTo(point[0], point[1]);
            }
        }
        cameraContext.closePath();
        cameraContext.stroke();
        
        cameraContext.beginPath();
        let halfLineStart = vec3.create();
        let halfLineEnd = vec3.create();
        vec3.transformMat4(halfLineStart, [0, 0, -fieldWidth/2], Tx);
        vec3.transformMat4(halfLineEnd, [0, 0, fieldWidth/2], Tx);
        cameraContext.moveTo(halfLineStart[0], halfLineStart[1]);
        cameraContext.lineTo(halfLineEnd[0], halfLineEnd[1]);
        cameraContext.stroke();
        
        cameraContext.beginPath();
        const centerPoint = vec3.create();
        vec3.transformMat4(centerPoint, [0, 0, 0], Tx);
        const radius = 50;
        cameraContext.arc(centerPoint[0], centerPoint[1], radius, 0, 2 * Math.PI);
        cameraContext.stroke();
        
        drawPenaltyArea(-1);
        drawPenaltyArea(1);
        
        function drawPenaltyArea(side) {
            cameraContext.beginPath();
            const penaltyBox = [
                [side * (fieldLength/2 - penaltyBoxLength), 0, -penaltyBoxWidth/2],
                [side * fieldLength/2, 0, -penaltyBoxWidth/2],
                [side * fieldLength/2, 0, penaltyBoxWidth/2],
                [side * (fieldLength/2 - penaltyBoxLength), 0, penaltyBoxWidth/2]
            ];
            
            for (let i = 0; i < penaltyBox.length; i++) {
                const point = vec3.create();
                vec3.transformMat4(point, penaltyBox[i], Tx);
                
                if (i === 0) {
                    cameraContext.moveTo(point[0], point[1]);
                } else {
                    cameraContext.lineTo(point[0], point[1]);
                }
            }
            cameraContext.closePath();
            cameraContext.stroke();
            
            cameraContext.beginPath();
            const goalBox = [
                [side * (fieldLength/2 - goalBoxLength), 0, -goalBoxWidth/2],
                [side * fieldLength/2, 0, -goalBoxWidth/2],
                [side * fieldLength/2, 0, goalBoxWidth/2],
                [side * (fieldLength/2 - goalBoxLength), 0, goalBoxWidth/2]
            ];
            
            for (let i = 0; i < goalBox.length; i++) {
                const point = vec3.create();
                vec3.transformMat4(point, goalBox[i], Tx);
                
                if (i === 0) {
                    cameraContext.moveTo(point[0], point[1]);
                } else {
                    cameraContext.lineTo(point[0], point[1]);
                }
            }
            cameraContext.closePath();
            cameraContext.stroke();
            
            const penaltySpot = vec3.create();
            vec3.transformMat4(penaltySpot, [side * (fieldLength/2 - 36), 0, 0], Tx);
            cameraContext.beginPath();
            cameraContext.arc(penaltySpot[0], penaltySpot[1], 2, 0, 2 * Math.PI);
            cameraContext.fill();
            
        }
    }
    
















    //>>>>>>>>>>>>>>>>>>>>>>>>> HUMAN HEIRARCHY MODEL <<<<<<<<<<<<<<<<<<<<<<<<
    function drawHead(Tx) {
        cameraContext.fillStyle = "#f1c27d";
        cameraContext.beginPath();
        const headCenter = vec3.create();
        vec3.transformMat4(headCenter, [0, 0.6, 0], Tx);
        cameraContext.arc(headCenter[0], headCenter[1], 7, 0, 2 * Math.PI);
        cameraContext.fill();
    }
    
    function drawBody(Tx) {
        cameraContext.beginPath();
        moveToTx([0, 0.5, 0], Tx);
        lineToTx([0, 0, 0], Tx);
        cameraContext.stroke();
    }
    
    function drawArm(left, Tx, angle = 0) {
        cameraContext.beginPath();
        const armTx = mat4.clone(Tx);
        const rotationTx = mat4.create();
        //mat4.rotateZ(rotationTx, rotationTx, angle * (left ? -1 : 1));
        mat4.multiply(armTx, armTx, rotationTx);
        if (left) {
            moveToTx([0, 0.4, 0], armTx);
            lineToTx([-0.2, 0.1, 0], armTx);
        } else {
            moveToTx([0, 0.4, 0], armTx);
            lineToTx([0.2, 0.1, 0], armTx);
        }
        cameraContext.stroke();
    }
    
    function drawLeg(left, Tx, angle = 0) {
        cameraContext.beginPath();
        const legTx = mat4.clone(Tx);
        const rotationTx = mat4.create();
        //mat4.rotateZ(rotationTx, rotationTx, angle * (left ? -1 : 1));
        mat4.multiply(legTx, legTx, rotationTx);
        if (left) {
            moveToTx([0, 0, 0], legTx);
            lineToTx([-0.2, -0.5, 0], legTx);
        } else {
            moveToTx([0, 0, 0], legTx);
            lineToTx([0.2, -0.5, 0], legTx);
        }
        cameraContext.stroke();
    }
    
    function drawStickFigure(color, Tx, scale = 1, translation = [0, 0, 0]) {
        const armAngle = 0;
        const legAngle = 0;
        
        const figureTx = mat4.clone(Tx);
        
        // Apply translation before scaling
        mat4.translate(figureTx, figureTx, translation);
        mat4.scale(figureTx, figureTx, [scale, scale, scale]);
        
        cameraContext.fillStyle = color;
        cameraContext.strokeStyle = color;
        cameraContext.lineWidth = 2;
        
        drawHead(figureTx);
        drawBody(figureTx);
        drawArm(true, figureTx, armAngle);
        drawArm(false, figureTx, -armAngle);
        drawLeg(true, figureTx, legAngle);
        drawLeg(false, figureTx, -legAngle);
    }
    //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> END <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


    const pathPoints = {
        p0: [0, 0, 0],                    // Starting point
        d0: [100, 300, 50],               // Initial tangent with upward and forward motion
        p1: [100, 100, 100],              // Mid-point with peak height and some forward motion
        d1: [-100, 200, 50],              // Mid tangent continuing the arc
        p2: [200, 50, 0],                 // End point coming back down
        d2: [0, 100, -50]                 // Final tangent descending
    };

    const P0 = [pathPoints.p0, pathPoints.d0, pathPoints.p1, pathPoints.d1];
    const P1 = [pathPoints.p1, pathPoints.d1, pathPoints.p2, pathPoints.d2];

    function Hermite(t) {
        return [
            2*t*t*t - 3*t*t + 1,
            t*t*t - 2*t*t + t,
            -2*t*t*t + 3*t*t,
            t*t*t - t*t
        ];
    }

    function HermiteDerivative(t) {
        return [
            6*t*t - 6*t,
            3*t*t - 4*t + 1,
            -6*t*t + 6*t,
            3*t*t - 2*t
        ];
    }

    function Cubic(basis, P, t) {
        const b = basis(t);
        const result = vec3.create();
        vec3.scale(result, P[0], b[0]);
        vec3.scaleAndAdd(result, result, P[1], b[1]);
        vec3.scaleAndAdd(result, result, P[2], b[2]);
        vec3.scaleAndAdd(result, result, P[3], b[3]);
        return result;
    }

    const C0 = (t) => Cubic(Hermite, P0, t);
    const C1 = (t) => Cubic(Hermite, P1, t);
    const C0prime = (t) => Cubic(HermiteDerivative, P0, t);
    const C1prime = (t) => Cubic(HermiteDerivative, P1, t);

    function Ccomp(t) {
        if (t < 1) return C0(t);
        return C1(t - 1.0);
    }

    function Ccomp_tangent(t) {
        if (t < 1) return C0prime(t);
        return C1prime(t - 1.0);
    }

    function drawTrajectory(t_begin, t_end, intervals, C, Tx, color) {
        cameraContext.strokeStyle = color;
        cameraContext.beginPath();
        moveToTx(C(t_begin), Tx);
        for (let i = 1; i <= intervals; i++) {
            const t = ((intervals-i)/intervals)*t_begin + (i/intervals)*t_end;
            lineToTx(C(t), Tx);
        }
        cameraContext.stroke();
    }

    function draw() {
        cameraCanvas.width = cameraCanvas.width;
        const tParam = slider1.value * 0.01;
        const viewAngle = slider2.value * 0.02 * Math.PI;

        // Camera setup
        const eyeCamera = vec3.fromValues(
            120 * Math.sin(viewAngle),
            100,
            120 * Math.cos(viewAngle)
        );
        const targetCamera = vec3.fromValues(0, 0, 0);
        const upCamera = vec3.fromValues(0, 100, 0);

        // Create transforms
        const TlookAtCamera = mat4.create();
        mat4.lookAt(TlookAtCamera, eyeCamera, targetCamera, upCamera);

        const Tviewport = mat4.create();
        mat4.fromTranslation(Tviewport, [200, 300, 0]);
        mat4.scale(Tviewport, Tviewport, [100, -100, 1]);

        const TprojectionCamera = mat4.create();
        mat4.ortho(TprojectionCamera, -100, 100, -100, 100, -1, 1);

        // Combine transforms
        const tVP_PROJ_VIEW_Camera = mat4.create();
        mat4.multiply(tVP_PROJ_VIEW_Camera, Tviewport, TprojectionCamera);
        mat4.multiply(tVP_PROJ_VIEW_Camera, tVP_PROJ_VIEW_Camera, TlookAtCamera);

        // Model transform for the stick figure
        const Tmodel = mat4.create();
        mat4.fromTranslation(Tmodel, Ccomp(tParam));
        const tangent = Ccomp_tangent(tParam);
        const angle = Math.atan2(tangent[1], tangent[0]);
        mat4.rotateZ(Tmodel, Tmodel, angle);

        const tVP_PROJ_VIEW_MOD_Camera = mat4.create();
        mat4.multiply(tVP_PROJ_VIEW_MOD_Camera, tVP_PROJ_VIEW_Camera, Tmodel);

        //Tranform for soccernet
        const soccerNet_Camera = mat4.create();
        let translationVector = [550, 120, 80];
        let scaleVector = [20,20,20]
        mat4.translate(soccerNet_Camera, tVP_PROJ_VIEW_Camera, translationVector);
        mat4.scale(soccerNet_Camera, soccerNet_Camera, scaleVector)
        mat4.rotateY(soccerNet_Camera, soccerNet_Camera, Math.PI/2)

        //Tranform second soccernet
        const soccerNet2_Camera = mat4.create();
        translationVector = [-48, 120, -80];
        scaleVector = [20,20,20]
        mat4.translate(soccerNet2_Camera, tVP_PROJ_VIEW_Camera, translationVector);
        mat4.scale(soccerNet2_Camera, soccerNet2_Camera, scaleVector)
        mat4.rotateY(soccerNet2_Camera, soccerNet2_Camera, -Math.PI/2)

        //Tranform for land
        const land_Camera = mat4.create();
        translationVector = [100, 100, 0];
        mat4.translate(land_Camera, tVP_PROJ_VIEW_Camera, translationVector);

        translationVector = [150,0,0]
        field_Camera = mat4.clone(land_Camera)
        mat4.translate(field_Camera, field_Camera, translationVector);



        // Draw scene
        drawLand(land_Camera);
        drawTrajectory(0.0, 1.0, 100, C0, tVP_PROJ_VIEW_Camera, "#cccccc");
        drawTrajectory(0.0, 1.0, 100, C1, tVP_PROJ_VIEW_Camera, "#cccccc");
        drawStickFigure("Blue", tVP_PROJ_VIEW_Camera, 50, [-10,30,0]);
        drawStickFigure("Red", tVP_PROJ_VIEW_Camera, 50, [350,30,-100]);
        drawSoccer("lightgrey", tVP_PROJ_VIEW_MOD_Camera)
        drawSoccerNet("black", soccerNet_Camera)
        drawSoccerNet("black", soccerNet2_Camera)
        drawFieldLines(field_Camera);
        //drawStadium(land_Camera);
    }

    slider1.addEventListener("input", draw);
    slider2.addEventListener("input", draw);
    draw();
}

window.onload = setup;