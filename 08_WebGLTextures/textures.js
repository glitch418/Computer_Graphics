function initializeTextures(gl) {
    const texture1 = gl.createTexture();
    const texture2 = gl.createTexture();

    function loadTexture(texture, color1, color2) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        const pixel = new Uint8Array([
            ...color1, 255, ...color2, 255,
            ...color1, 255, ...color2, 255,
        ]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    }

    loadTexture(texture1, [0, 0, 255], [255, 255, 255]); // Blue to White
    loadTexture(texture2, [128, 64, 0], [64, 128, 0]);  // Brown to Green

    return { texture1, texture2 };
}
