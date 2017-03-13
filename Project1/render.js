/**
 * Created by Hans Dulimarta.
 */
var modelMat = mat4.create();
var canvas, paramGroup;
var posAttr, colAttr;
var gl;
var house;
var sun;
var tree;
var tree2;
var viewMat, sideViewMat, topViewMat;
var houseCF;
var projUnif, projUnif;
var orthoProjMat, persProjMat;
var viewDir;
function main() {
  canvas = document.getElementById("gl-canvas");

  /* setup window resize listener */
  //window.addEventListener('resize', resizeHandler);
  document.onkeydown = checkKey;
  viewDir = 0;
  gl = WebGLUtils.create3DContext(canvas, null);
  ShaderUtils.loadFromFile(gl, "vshader.glsl", "fshader.glsl")
  .then (prog => {

    /* put all one-time initialization logic here */
    gl.useProgram (prog);
    gl.clearColor (0.196, 0.5, 0.7, 1);
    gl.enable(gl.CULL_FACE);
    gl.enable (gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.cullFace(gl.BACK);

    /* the vertex shader defines TWO attribute vars and ONE uniform var */
    posAttr = gl.getAttribLocation (prog, "vertexPos");
    colAttr = gl.getAttribLocation (prog, "vertexCol");
    modelUnif = gl.getUniformLocation (prog, "modelCF");
    gl.enableVertexAttribArray (posAttr);
    gl.enableVertexAttribArray (colAttr);

    projUnif = gl.getUniformLocation(prog, "projection");
    viewUnif = gl.getUniformLocation(prog, "view");

    orthoProjMat = mat4.create();
    mat4.ortho(orthoProjMat, -1, 1, -1 * (canvas.height/canvas.width), 1 * (canvas.height/canvas.width), -3, 3);

    sideViewMat = mat4.create();
    mat4.lookAt(sideViewMat,
        vec3.fromValues(2, 0, 0),
        vec3.fromValues(0, 0, 0),
        vec3.fromValues(0, 1, 0));

    topViewMat = mat4.create();
    mat4.lookAt(topViewMat,
        vec3.fromValues(0, 2, 0),
        vec3.fromValues(0, 0, 0),
        vec3.fromValues(0, 0, 1));

    persProjMat = mat4.create();

    viewMat = mat4.create();
    mat4.lookAt(viewMat,
        vec3.fromValues(-2.5, 0, 0),
        vec3.fromValues(0, 0, 0),
        vec3.fromValues(0, 1, 0));

    houseCF = mat4.create();
    gl.uniformMatrix4fv(modelUnif, false, houseCF);


    /* calculate viewport */
    resizeHandler();

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
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
switch (viewDir){
    case 0:
        draw3D();
        break;
    case 1:
        drawTop();
        break;
    case 2:
        drawSide();
        break;
    case 3:
        drawSide();
        break;
}
    requestAnimationFrame(render);
}

function createObject() {
    mat4.identity(modelMat);
    house = new House(gl);
    sun = new Sun(gl);
    tree = new Tree(gl, -0.5, -0.6, .5);
    tree2 = new Tree(gl, -0.4, -0.6, -.5);
}

function draw3D() {
    /* We must update the projection and view matrices in the shader */
    gl.uniformMatrix4fv(projUnif, false, persProjMat);
    gl.uniformMatrix4fv(viewUnif, false, viewMat)
    gl.viewport(0, 0, canvas.width/2, canvas.height);
    drawScene();
}


function drawTop() {
    gl.uniformMatrix4fv(projUnif, false, orthoProjMat);
    gl.uniformMatrix4fv(viewUnif, false, topViewMat);
    gl.viewport(canvas.width, 0, canvas.width, canvas.height);
    drawScene();
}

function drawSide(){
    gl.uniformMatrix4fv(projUnif, false, orthoProjMat);
    gl.uniformMatrix4fv(viewUnif, false, sideViewMat);
    gl.viewport(0, 0, canvas.width, canvas.height);
    drawScene();
}

function resizeHandler() {
    canvas.width = window.innerWidth;
    canvas.height = 0.9 * window.innerHeight;
    if (canvas.width > canvas.height) { /* landscape */
        var ratio = 2 * canvas.height / canvas.width;
        console.log("Landscape mode, ratio is " + ratio);
        mat4.ortho(orthoProjMat, -3, 3, -3 * ratio, 3 * ratio, -5, 5);
        mat4.perspective(persProjMat,
            Math.PI/3,  /* 60 degrees vertical field of view */
            1/ratio,    /* must be width/height ratio */
            1,          /* near plane at Z=1 */
            20);        /* far plane at Z=20 */
    } else {
        alert ("Window is too narrow!");
    }
}

function checkKey(e){
    e = e || window.event;

    //up
    if (e.keyCode == '38') {
        viewDir = 1;
    }
    //down
    else if (e.keyCode == '40') {
        viewDir = 0;
    }
    //left
    else if (e.keyCode == '37') {
        viewDir = 2;
    }
    else if (e.keyCode == '39') {
        viewDir = 3;
    }

}
