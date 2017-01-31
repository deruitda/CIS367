/**
 * Starter code created by Hans Dulimarta.
 */

/* TODO: Add your name here */

var gl;
var sizeInput, outMessage, posAttr, canvas;
var NUM_CIRCLE_POINTS = 36;
/* TODO: Add more variable declarations here */

function main() {
  canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL (canvas, null);
  let button = document.getElementById("gen");
  sizeInput = document.getElementById("size");
  outMessage = document.getElementById("msg");
  button.addEventListener("click", buttonClicked);
  ShaderUtils.loadFromFile(gl, "vshader.glsl", "fshader.glsl")
  .then (prog => {
    gl.useProgram(prog);
    posAttr = gl.getAttribLocation(prog, "vertexPos");
    /* TODO: Add more code here */
    render();
  });
}

function drawScene() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.viewport(0, 0, 512, 512);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // set up the 2D view port (0,0) is upper left (512,512) is lower right corner
    gl.viewport(0, 0, canvas.width, canvas.height);

    // clear the color buffer
    gl.clear(gl.COLOR_BUFFER_BIT);

    var grid = [];
    var gridDist = .2;
    for (row = -1.0; row <= 1.0; row+=gridDist)
        for(col = -1.0; col <= 1.0; col+=gridDist)
          grid.push(row, col);

    let gridBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, gridBuff);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(grid), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(posAttr);


    gl.bindBuffer(gl.ARRAY_BUFFER, gridBuff);
    gl.vertexAttribPointer(posAttr,
        2,        /* number of components per attribute, in our case (x,y) */
        gl.FLOAT, /* type of each attribute */
        false,    /* does not require normalization */
        0,        /* stride: number of bytes between the beginning of consecutive attributes */
        0);       /* the offset (in bytes) to the first component in the attribute array */
    gl.drawArrays(gl.POINTS, 0, 100);
}

function render() {
  drawScene();
  requestAnimationFrame(render);
}

function buttonClicked() {
  let sz = sizeInput.valueAsNumber;
  if (!sz) {
    outMessage.innerHTML = "Must set size in the input box";
  } else {
    outMessage.innerHTML = "I have to generate a maze of size " + sz + "x" + sz;
  }

  /* TODO: Add more code here */
}

/* TODO: You may add more functions as needed */
