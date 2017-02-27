class Ring {
    constructor (gl, innerRadius, outerRadius, height, stacks = 1, div, col1, col2) {
        /* if colors are undefined, generate random colors */
        if (typeof col1 === "undefined") col1 = vec3.fromValues(Math.random(), Math.random(), Math.random());
        if (typeof col2 === "undefined") col2 = vec3.fromValues(Math.random(), Math.random(), Math.random());
        let randColor = vec3.create();
        let vertices = [];
        this.vbuff = gl.createBuffer();

        /* Instead of allocating two separate JS arrays (one for position and one for color),
         in the following loop we pack both position and color
         so each tuple (x,y,z,r,g,b) describes the properties of a vertex
         */
        for(let i = 0; i <= stacks; i ++) {
            let stackHeight = height * (i/stacks);
            //let innerStackRadius = innerRadius - (i * ((radiusBottom - radiusTop) / stacks));
            //let outerStackRadius =
            //if(i === 0 || i === stacks) {
                //vertices.push(0, 0, stackHeight);
                //vec3.lerp (randColor, col1, col2, Math.random()); /* linear interpolation between two colors */
                //vertices.push(randColor[0], randColor[1], randColor[2]);
            //}

            for (let k = 0; k < div; k++) {
                //inner circle
                let angle = k * 2 * Math.PI / div;
                let x = innerRadius * Math.cos (angle);
                let y = innerRadius * Math.sin (angle);

                /* the first three floats are 3D (x,y,z) position */
                vertices.push (x, y, stackHeight);
                vec3.lerp (randColor, col1, col2, Math.random()); /* linear interpolation between two colors */
                /* the next three floats are RGB */
                vertices.push(randColor[0], randColor[1], randColor[2]);

                //outer circle
                x = outerRadius * Math.cos(angle);
                y = outerRadius * Math.sin(angle);
                vertices.push(x, y, stackHeight);
                vertices.push(randColor[0], randColor[1], randColor[2]);

            }
        }

        /* copy the (x,y,z,r,g,b) sixtuplet into GPU buffer */
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuff);
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);


        //top index
        let topIndex = [];
        for(let i = 0; i < div*2; i=i+2) {
            topIndex.push(i+1,i);
        }

        topIndex.push(1,0);

        this.topIdxBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.topIdxBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(topIndex), gl.STATIC_DRAW);



        //bottom index
        let bottomIndex = [];
        let end = (div*2) * stacks;
        let start = end - (div*2);
        for(let i = start; i < end; i=i+2) {
            bottomIndex.push(i,i+1);
        }

        bottomIndex.push(start,start+1);

        this.botIdxBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.botIdxBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(bottomIndex), gl.STATIC_DRAW);
        
        //index for the stacks
        this.stacks = {};

        for(let i = 0; i < stacks - 1; i++) {
            // Generate outer side
            let outerIndexArray = [];

            let outStart = (2 * div * i);
            let outEnd = outStart + (div * 2);

            for (let k = outStart; k < outEnd-2; k=k+2) {
                //divs
                outerIndexArray.push(k);
                outerIndexArray.push((div*2) + k);
                outerIndexArray.push(k+2);
                outerIndexArray.push((div*2) + k+2);
            }

            //complete the ring
            outerIndexArray.push(outStart + (div*2-2));
            outerIndexArray.push(outEnd + (div*2-2));
            outerIndexArray.push(outStart);
            outerIndexArray.push(outStart+(div*2));

            let buff = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buff);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(outerIndexArray), gl.STATIC_DRAW);

            this.stacks[i] = {
                "primitive": gl.TRIANGLE_STRIP,
                "buffer": buff,
                "numPoints": outerIndexArray.length
            };


            // Generate inner side
            let innerIndexArray = [];

            let inStart = (2 * div * (i + 1)) - 1;
            let inEnd = (2 * div * i) + 1;

            for(let k = inStart; k > inEnd; k=k-2) {
                //divs
                innerIndexArray.push(k);
                innerIndexArray.push((div*2) + k);
                innerIndexArray.push(k-2);
                innerIndexArray.push((div*2) + k-2);
            }

            //complete the ring
            innerIndexArray.push(inEnd);
            innerIndexArray.push(inEnd + (div*2));
            innerIndexArray.push(inStart);
            innerIndexArray.push(inStart + (div*2));

            let innerBuff = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, innerBuff);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(innerIndexArray), gl.STATIC_DRAW);

            this.stacks[i+stacks] = {
                "primitive": gl.TRIANGLE_STRIP,
                "buffer": innerBuff,
                "numPoints": innerIndexArray.length
            };


        }

        /* Put the indices as an array of objects. Each object has three attributes:
         primitive, buffer, and numPoints */

        this.indices = [
            {"primitive": gl.TRIANGLE_STRIP, "buffer": this.topIdxBuff, "numPoints": topIndex.length},
            {"primitive": gl.TRIANGLE_STRIP, "buffer": this.botIdxBuff, "numPoints": bottomIndex.length}
        ];

        Object.keys(this.stacks).forEach((k) => {
            this.indices.push(this.stacks[k]);
        });
    }

    draw(vertexAttr, colorAttr, modelUniform, coordFrame) {
        /* copy the coordinate frame matrix to the uniform memory in shader */
        gl.uniformMatrix4fv(modelUniform, false, coordFrame);

        /* binder the (vertex+color) buffer */
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuff);

        /* with the "packed layout"  (x,y,z,r,g,b),
         the stride distance between one group to the next is 24 bytes */
        gl.vertexAttribPointer(vertexAttr, 3, gl.FLOAT, false, 24, 0); /* (x,y,z) begins at offset 0 */
        gl.vertexAttribPointer(colorAttr, 3, gl.FLOAT, false, 24, 12); /* (r,g,b) begins at offset 12 */

        for (let k = 0; k < this.indices.length; k++) {
            let obj = this.indices[k];
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.buffer);
            gl.drawElements(obj.primitive, obj.numPoints, gl.UNSIGNED_SHORT, 0);
        }
    }
}