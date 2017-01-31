attribute vec2 vertexPos;
void main() {
        gl_Position = vec4(2.0 * vertexPos, 0.0, 2.0);
        gl_PointSize = 3.0;
}
