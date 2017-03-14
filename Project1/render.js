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
var grass;
var viewMat, sideViewMat, topViewMat, frontViewMat;
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
        vec3.fromValues(2.5, 0, 0),
        vec3.fromValues(0, 0, 0),
        vec3.fromValues(0, 1, 0));

    topViewMat = mat4.create();
    mat4.lookAt(topViewMat,
        vec3.fromValues(0, 2, 0),
        vec3.fromValues(0, 0, 0),
        vec3.fromValues(0, 0, 1));

    frontViewMat = mat4.create();
    mat4.lookAt(frontViewMat,
        vec3.fromValues(-2.5, 0, 0),
        vec3.fromValues(0, 0, 0),
        vec3.fromValues(0, 1, 0));

    persProjMat = mat4.create();

    viewMat = mat4.create();
    mat4.lookAt(viewMat,
        vec3.fromValues(0, 0, 3),
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
    if(grass){
        var grassTrans = mat4.create();
        mat4.scale(grassTrans, grassTrans, vec3.fromValues(6, .3, 6));
        mat4.translate(grassTrans, grassTrans, vec3.fromValues(0, -3, 0));
        var tmp = mat4.create();

        mat4.mul(tmp, modelMat, grassTrans);
        this.grass.draw(posAttr, colAttr, modelUnif, tmp);
    }
}

function render() {
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
switch (viewDir){
    case 0:
        drawRealSide();
        break;
    case 1:
        drawTop();
        break;
    case 2:
        drawFront();
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

    var green1 = vec3.fromValues(0.184314, 0.309804, 0.184314);
    var green2 = vec4.fromValues(0.137255, 0.556863, 0.137255);
    grass = new Cube(gl, .8, 50, green1, green2);
}

function drawRealSide() {
    /* We must update the projection and view matrices in the shader */
    gl.uniformMatrix4fv(projUnif, false, persProjMat);
    gl.uniformMatrix4fv(viewUnif, false, viewMat)
    gl.viewport(0, 0, canvas.width, canvas.height);
    drawScene();
}


function drawTop() {
    gl.uniformMatrix4fv(projUnif, false, persProjMat);
    gl.uniformMatrix4fv(viewUnif, false, topViewMat)
    gl.viewport(0, 0, canvas.width, canvas.height);
    drawScene();
}

function drawSide(){
    gl.uniformMatrix4fv(projUnif, false, orthoProjMat);
    gl.uniformMatrix4fv(viewUnif, false, sideViewMat);
    gl.viewport(0, 0, canvas.width, canvas.height);
    drawScene();
}

function drawFront(){
    gl.uniformMatrix4fv(projUnif, false, orthoProjMat);
    gl.uniformMatrix4fv(viewUnif, false, frontViewMat);
    gl.viewport(0, 0, canvas.width, canvas.height);
    drawScene();
}

function resizeHandler() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var orthoRatio = canvas.height / canvas.width;
    var perspectiveRatio = 1/orthoRatio; // must be width/height ratio
    var perspectiveRad = Math.PI/5; // 60 degrees vertical field of view

    // Set orthographic view (for front, top, and side view)
    mat4.ortho(orthoProjMat, -1, 1, -1 * orthoRatio, 1 * orthoRatio, -3, 3);
    // Set perspective 3D view
    mat4.perspective(persProjMat,
        perspectiveRad,    // Angle to view at
        perspectiveRatio,  // Aspect Ratio
        1,                 // near plane at Z=1
        20);
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
