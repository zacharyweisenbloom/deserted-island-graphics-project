"use strict";
class Skybox{
    /** Creates a new instance of Skybox. A skybox needs a shader
    * and the cubemap that should be used for the sky texturing.
    * @param {string} shaderName the name of the shader
    * @param {string} cubemap name of the cubemap for this skybox.
    */
    constructor(shaderName,cubeMap){
        this.program = GLUtils.createShaderProgram(shaderName);
        this.cubeMap = cubeMap;
        // make the position buffer for the skybox mesh
        this.positionBuffer = gl.createBuffer();
        let vertices = [
            // 36 positions for cube with 2x2x2 dimensions (no index buffer needed)
                        -1.0, 1.0, -1.0,
                        -1.0, -1.0, -1.0,
                        1.0, -1.0, -1.0,
                        1.0, -1.0, -1.0,
                        1.0, 1.0, -1.0,
                        -1.0, 1.0, -1.0,
                        -1.0, -1.0, 1.0,
                        -1.0, -1.0, -1.0,
                        -1.0, 1.0, -1.0,
                        -1.0, 1.0, -1.0,
                        -1.0, 1.0, 1.0,
                        -1.0, -1.0, 1.0,
                        1.0, -1.0, -1.0,
                        1.0, -1.0, 1.0,
                        1.0, 1.0, 1.0,
                        1.0, 1.0, 1.0,
                        1.0, 1.0, -1.0,
                        1.0, -1.0, -1.0,
                        -1.0, -1.0, 1.0,
                        -1.0, 1.0, 1.0,
                        1.0, 1.0, 1.0,
                        1.0, 1.0, 1.0,
                        1.0, -1.0, 1.0,
                        -1.0, -1.0, 1.0,
                        -1.0, 1.0, -1.0,
                        1.0, 1.0, -1.0,
                        1.0, 1.0, 1.0,
                        1.0, 1.0, 1.0,
                        -1.0, 1.0, 1.0,
                        -1.0, 1.0, -1.0,
                        -1.0, -1.0, -1.0,
                        -1.0, -1.0, 1.0,
                        1.0, -1.0, -1.0,
                        1.0, -1.0, -1.0,
                        -1.0, -1.0, 1.0,
                        1.0, -1.0, 1.0
                    ];
        // TODO: add vertex data and assign it to the positionBuffer
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        // TODO: assign vertexCount (how many vertices to render)
        this.vertexCount = vertices.length / 3; // 3 components (x, y, z) per vertex

    }
    /** Draw this skybox.
    * @param {Camera} camera the camera to use to draw the skybox.
    */

    draw(camera){
        gl.useProgram(this.program);
        // TODO: set up viewMatrix and projectionMatrix
 
        let viewMatrix = camera.viewMatrix.clone();
        viewMatrix[12] = 0;
        viewMatrix[13] = 0;
        viewMatrix[14] = 0;

        let projectionMatrix = camera.projectionMatrix;

        let viewMatrixLoc = gl.getUniformLocation(this.program, "u_matrixV");
        gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix.toFloat32());

        let projMatrixLoc = gl.getUniformLocation(this.program, "u_matrixP");
        gl.uniformMatrix4fv(projMatrixLoc, false, projectionMatrix.toFloat32());



        // get camera (view) position
        let cameraPosition = camera.getPosition();


        gl.useProgram(this.program);
        //disable depth before drawing (drawn as background)
        gl.depthMask(false);
        // TODO: set up attribute pointer for position attribute
        const positionAttribLocation = gl.getAttribLocation(this.program, 'a_position');
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(positionAttribLocation);
        // TODO: use texture unit 0 for cubemap

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, TextureCache[this.cubeMap]);
        let cubeMapLoc = gl.getUniformLocation(this.program, "u_cubeMap");
        gl.uniform1i(cubeMapLoc, 0)

        gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
        //enable depth after drawing
        gl.depthMask(true);
    }
}