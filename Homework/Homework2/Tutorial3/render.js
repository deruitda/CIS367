const NUM_CIRCLE_POINTS = 36;

function main() {
    let canvas = document.getElementById("my-canvas");

    // setupWebGL is defined in webgl-utils.js, it returns a WebGLRenderingContext
    let gl = WebGLUtils.setupWebGL(canvas);

    // Load the shader pair. 2nd arg is vertex shader, 3rd arg is fragment shader
    ShaderUtils.loadFromFile(gl, "vshader.glsl", "fshader.glsl")
        .then((prog) => {

            gl.useProgram(prog);
            // Use black RGB=(0,0,0) for the clear color
            gl.clearColor(0.0, 0.0, 0.0, 1.0);

            // set up the 2D view port (0,0) is upper left (512,512) is lower right corner
            gl.viewport(0, 0, canvas.width, canvas.height);

            gl.lineWidth(3);
            // clear the color buffer
            gl.clear(gl.COLOR_BUFFER_BIT);

            let triangleBuff = makeTriangle(gl);

            let circleBuff = makeCircle (gl);

            // obtain a reference to the shader variable (on the GPU)
            let posAttr = gl.getAttribLocation(prog, "vertexPos");
            gl.enableVertexAttribArray(posAttr);
            let colAttr = gl.getAttribLocation(prog, "vertexCol");
            gl.enableVertexAttribArray(colAttr);

            gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuff.position);
            gl.vertexAttribPointer(posAttr,
                2,        /* number of components per attribute, in our case (x,y) */
                gl.FLOAT, /* type of each attribute */
                false,    /* does not require normalization */
                0,        /* stride: number of bytes between the beginning of consecutive attributes */
                0);       /* the offset (in bytes) to the first component in the attribute array */
            gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuff.color);
            gl.vertexAttribPointer(colAttr, 4, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLES,
                0,        /* starting index in the array */
                3);       /* we are drawing three vertices */


            gl.bindBuffer(gl.ARRAY_BUFFER, circleBuff.position);
            gl.vertexAttribPointer(posAttr,
                2,        /* number of components per attribute, in our case (x,y) */
                gl.FLOAT, /* type of each attribute */
                false,    /* does not require normalization */
                0,        /* stride: number of bytes between the beginning of consecutive attributes */
                0);       /* the offset (in bytes) to the first component in the attribute array */
            gl.bindBuffer(gl.ARRAY_BUFFER, circleBuff.color);
            gl.vertexAttribPointer(colAttr, 4, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.LINES, 0, NUM_CIRCLE_POINTS*2);
        });
}

function makeTriangle(gl) {
    let vertices = [];
    let rad = 0.5;
        /* the equilateral triangle is inscribed in a circle of a given radius */
    let yCoord = rad * Math.sin(Math.PI / 3);
    vertices.push(rad, 0.0);
    vertices.push(-rad / 2, yCoord);
    vertices.push(-rad / 2, -yCoord);

    // create a buffer
    let vBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuff);

    // copy the vertices data
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);

    let colors = [];
    colors.push (1.0, 0x57/255.0, 0x22/255.0, 1.0); // HexColor: #FF5722
    colors.push (0.0, 101.0/255.0, 164.0/255.0, 1.0); // RGB: 0, 101, 164
    colors.push (0.0, 101.0/255.0, 164.0/255.0, 1.0);
    let cBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuff);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(colors), gl.STATIC_DRAW);

    return {"position" : vBuff, "color" : cBuff};
}

function makeCircle (gl) {
    let vertices = [];
    let colors = [];
    let circleRad = 0.8;
    for (let k = 0; k < NUM_CIRCLE_POINTS*2; k++) {
        circleRad = 0.8;
        let angle = 2 * k * Math.PI / NUM_CIRCLE_POINTS;
        vertices.push(circleRad * Math.cos(angle), circleRad * Math.sin(angle));
        colors.push(1.0, 0x57/255.0, 0x22/255.0, 1.0);  // HexColor: #FF5722

        circleRad = 0.6;
        vertices.push(circleRad * Math.cos(angle), circleRad * Math.sin(angle));
        colors.push(1.0, 0x57/255.0, 0x22/255.0, 1.0);  // HexColor: #FF5722
    }

    let buff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buff);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);

    let cbuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cbuff);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(colors), gl.STATIC_DRAW);
    return {"position": buff, "color": cbuff};
}