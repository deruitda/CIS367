/**
 * Created by Hans Dulimarta.
 */
var modelMat = mat4.create();
var canvas, paramGroup;
var posAttr, colAttr, modelUnif;
var gl;
var house;
var sun;
var tree;
var tree2;
function main() {
  canvas = document.getElementById("gl-canvas");

  /* setup window resize listener */
  window.addEventListener('resize', resizeWindow);

  gl = WebGLUtils.create3DContext(canvas, null);
  ShaderUtils.loadFromFile(gl, "vshader.glsl", "fshader.glsl")
  .then (prog => {

    /* put all one-time initialization logic here */
    gl.useProgram (prog);
    gl.clearColor (0, 0, 0, 1);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    /* the vertex shader defines TWO attribute vars and ONE uniform var */
    posAttr = gl.getAttribLocation (prog, "vertexPos");
    colAttr = gl.getAttribLocation (prog, "vertexCol");
    modelUnif = gl.getUniformLocation (prog, "modelCF");
    gl.enableVertexAttribArray (posAttr);
    gl.enableVertexAttribArray (colAttr);

    /* calculate viewport */
    resizeWindow();

    //object creation
    createObject();

    /* initiate the render loop */
    render();
  });
}

function drawScene() {
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    if (house) {
        house.draw(posAttr, colAttr, modelUnif, modelMat);
    }

    if(sun){
        sun.draw(posAttr, colAttr, modelUnif, modelMat);
    }

    if(tree2){
        tree2.draw(posAttr, colAttr, modelUnif, modelMat);
    }

    if(tree){
        tree.draw(posAttr, colAttr, modelUnif, modelMat);
    }
}

function render() {
  drawScene();
  requestAnimationFrame(render);
}

function createObject() {
    mat4.identity(modelMat);
    house = new House(gl);
    sun = new Sun(gl);
    tree = new Tree(gl, -0.7, -0.7, 1);
    tree2 = new Tree(gl, -0.4, -0.6, 1);
}

function resizeWindow() {
  var w = 0.98 * window.innerWidth;
  var h = 0.6 * window.innerHeight;
  var size = Math.min(0.98 * window.innerWidth, 0.65 * window.innerHeight);
  /* keep a square viewport */
  canvas.width = size;
  canvas.height = size;
  gl.viewport(0, 0, size, size);
}
