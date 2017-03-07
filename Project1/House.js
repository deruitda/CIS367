/**
 * Created by dannyd1221 on 3/6/2017.
 */
class House {
    constructor(gl){
        var coneX = 0;
        var coneY = .4;
        var coneZ = .6;
        var size = .9;
        var subDiv =20;
        var size = .9;
        var subDiv =20;
        var coneheight = .6;
        var coneRad = .5;
        var coneDiv = 30;
        var coneStax = 100;

        this.cone = new Cone(gl, coneRad,coneheight, coneDiv, coneStax);
        this.coneTrans = mat4.create();
        mat4.translate(this.coneTrans, this.coneTrans, vec3.fromValues(coneX, coneY, coneZ));
        mat4.rotateX(this.coneTrans, this.coneTrans, -(Math.PI/2));
        this.cube = new Cube(gl,size, subDiv);

        this.tmp = mat4.create();
    }

    draw(vertexAttr, colorAttr, modelUniform, coordFrame){
        gl.uniformMatrix4fv(modelUniform, false, coordFrame);

        this.tmp = mat4.create();
        this.cube.draw(vertexAttr, colorAttr, modelUniform, this.tmp);

        this.tmp = mat4.create();
        mat4.mul(this.tmp, coordFrame, this.coneTrans);
        this.cone.draw(vertexAttr, colorAttr, modelUniform, this.tmp);


    }
}