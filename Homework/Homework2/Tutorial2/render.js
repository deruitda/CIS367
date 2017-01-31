const NUM_CIRCLE_POINTS = 12;

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

            // clear the color buffer
            gl.clear(gl.COLOR_BUFFER_BIT);

            let hexVertices = [];
            let hexRad = 0.5;

            for(i = 0; i < 6; i++)
                    hexVertices.push(Math.cos(i/6.0*2*Math.PI), Math.sin(i/6.0*2*Math.PI));


            // create a buffer
            let hexBuff = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, hexBuff);

            // copy the vertices data
            gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(hexVertices), gl.STATIC_DRAW);

            let circVertices = [];
            let circleRad = 0.8;
            for (let k = 0; k < NUM_CIRCLE_POINTS; k++) {
                let angle = 2 * k * Math.PI / NUM_CIRCLE_POINTS;
                circVertices.push(circleRad * Math.cos(angle), circleRad * Math.sin(angle));
            }
            let circleBuff = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, circleBuff);
            gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(circVertices), gl.STATIC_DRAW);

            //second circle
            let circVertices2 = [];
            let circleRad2 = 0.4;
            for (let k = 0; k < NUM_CIRCLE_POINTS; k++) {
                let angle = 2 * k * Math.PI / NUM_CIRCLE_POINTS;
                circVertices2.push(circleRad2 * Math.cos(angle), circleRad2 * Math.sin(angle));
            }
            let circleBuff2 = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, circleBuff2);
            gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(circVertices2), gl.STATIC_DRAW);


            // obtain a reference to the shader variable (on the GPU)
            let posAttr = gl.getAttribLocation(prog, "vertexPos");
            gl.enableVertexAttribArray(posAttr);

            gl.bindBuffer(gl.ARRAY_BUFFER, hexBuff);
            gl.vertexAttribPointer(posAttr,
                2,        /* number of components per attribute, in our case (x,y) */
                gl.FLOAT, /* type of each attribute */
                false,    /* does not require normalization */
                0,        /* stride: number of bytes between the beginning of consecutive attributes */
                0);       /* the offset (in bytes) to the first component in the attribute array */
            gl.drawArrays(gl.LINE_LOOP,
                0,        /* starting index in the array */
                6);       /* we are drawing three vertices */

            gl.bindBuffer(gl.ARRAY_BUFFER, circleBuff);
            gl.vertexAttribPointer(posAttr,
                2,        /* number of components per attribute, in our case (x,y) */
                gl.FLOAT, /* type of each attribute */
                false,    /* does not require normalization */
                0,        /* stride: number of bytes between the beginning of consecutive attributes */
                0);       /* the offset (in bytes) to the first component in the attribute array */
            gl.drawArrays(gl.POINTS, 0, NUM_CIRCLE_POINTS);

            gl.bindBuffer(gl.ARRAY_BUFFER, circleBuff2);
            gl.vertexAttribPointer(posAttr,
                2,        /* number of components per attribute, in our case (x,y) */
                gl.FLOAT, /* type of each attribute */
                false,    /* does not require normalization */
                0,        /* stride: number of bytes between the beginning of consecutive attributes */
                0);       /* the offset (in bytes) to the first component in the attribute array */
            gl.drawArrays(gl.POINTS, 0, NUM_CIRCLE_POINTS);
        });
}