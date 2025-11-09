function createShaderProgram(gl, vertexSource, fragmentSource) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Shader program creation failed:", gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

function createTerrainVertices() {
    // Simplified terrain generation
    const vertices = new Float32Array([
        -1, 0, -1,  1, 0, -1,  1, 0, 1,  -1, 0, 1
    ]);
    const texCoords = new Float32Array([
        0, 0,  1, 0,  1, 1,  0, 1
    ]);
    const indices = new Uint16Array([
        0, 1, 2,  0, 2, 3
    ]);

    return { vertices, texCoords, indices };
}

function start() {
    const canvas = document.getElementById("mycanvas");
    const gl = canvas.getContext("webgl");
    canvas.width = 800;
    canvas.height = 600;

    const slider1 = document.getElementById("slider1");
    const slider2 = document.getElementById("slider2");

    const vertexShaderSource = `
        attribute vec3 vPosition;
        attribute vec3 vNormal;
        attribute vec2 vTexCoord;

        uniform mat4 uMVP;
        uniform mat4 uMV;
        uniform mat3 uMVn;

        varying vec2 fTexCoord;
        varying vec3 fNormal;
        varying vec3 fPosition;

        void main() {
            fTexCoord = vTexCoord;
            fNormal = normalize(uMVn * vNormal);
            fPosition = (uMV * vec4(vPosition, 1.0)).xyz;
            gl_Position = uMVP * vec4(vPosition, 1.0);
        }
    `;

    const fragmentShaderSource = `
        precision mediump float;

        uniform sampler2D texSampler1;
        uniform sampler2D texSampler2;

        uniform vec3 uLightPosition;

        varying vec2 fTexCoord;
        varying vec3 fNormal;
        varying vec3 fPosition;

        void main() {
            vec3 lightDirection = normalize(uLightPosition - fPosition);
            float diffuse = max(dot(fNormal, lightDirection), 0.0);

            vec4 mountainTexture = texture2D(texSampler1, fTexCoord);
            vec4 groundTexture = texture2D(texSampler2, fTexCoord);

            float blend = smoothstep(0.3, 0.7, fNormal.y);
            vec4 finalColor = mix(groundTexture, mountainTexture, blend);

            finalColor.rgb *= (0.3 + 0.7 * diffuse);
            gl_FragColor = finalColor;
        }
    `;

    const shaderProgram = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
    gl.useProgram(shaderProgram);

    const terrain = createTerrainVertices();

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, terrain.vertices, gl.STATIC_DRAW);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, terrain.texCoords, gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, terrain.indices, gl.STATIC_DRAW);

    const textures = initializeTextures(gl);

    function draw() {
        const angle1 = slider1.value * 0.01 * Math.PI;
        const angle2 = slider2.value * 0.01 * Math.PI;

        const eye = [400 * Math.sin(angle1), 250, 400 * Math.cos(angle1)];
        const target = [0, 0, 0];
        const up = [0, 1, 0];

        const tCamera = glMatrix.mat4.create();
        const tProjection = glMatrix.mat4.create();
        const tMV = glMatrix.mat4.create();
        const tMVn = glMatrix.mat3.create();
        const tMVP = glMatrix.mat4.create();

        glMatrix.mat4.lookAt(tCamera, eye, target, up);
        glMatrix.mat4.perspective(tProjection, Math.PI / 4, canvas.width / canvas.height, 1, 1000);

        glMatrix.mat4.multiply(tMV, tCamera, glMatrix.mat4.create());
        glMatrix.mat3.normalFromMat4(tMVn, tMV);
        glMatrix.mat4.multiply(tMVP, tProjection, tMV);

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0.529, 0.808, 0.922, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.DEPTH_TEST);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        const positionLocation = gl.getAttribLocation(shaderProgram, "vPosition");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
        const texCoordLocation = gl.getAttribLocation(shaderProgram, "vTexCoord");
        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

        const mvpLocation = gl.getUniformLocation(shaderProgram, "uMVP");
        const mvLocation = gl.getUniformLocation(shaderProgram, "uMV");
        const mvnLocation = gl.getUniformLocation(shaderProgram, "uMVn");

        gl.uniformMatrix4fv(mvpLocation, false, tMVP);
        gl.uniformMatrix4fv(mvLocation, false, tMV);
        gl.uniformMatrix3fv(mvnLocation, false, tMVn);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textures.texture1);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, textures.texture2);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, terrain.indices.length, gl.UNSIGNED_SHORT, 0);
    }

    slider1.addEventListener("input", draw);
    slider2.addEventListener("input", draw);

    draw();
}

window.onload = start;
