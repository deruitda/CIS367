// in vshader.glsl

/* attributes are supplied by JSCode */
attribute vec2 vertexPos;
attribute vec4 vertexCol;

/* varying variables are passed to rasterizer */
varying vec4 vColor;

void main() {
  gl_PointSize = 3.0;
  gl_Position = vec4 (vertexPos, 0.0, 1.0);
  vColor = vertexCol;
}