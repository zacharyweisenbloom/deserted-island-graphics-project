"use strict";

class PointLightRenderer {

    /**
    * Creates a new instance of Renderer. The given source code will be compiled
    * and assembled into a WebGL ShaderProgram used by this shader to draw models.
    * @param {string} shaderName the source code (text) of this shader programs shader.
    */
	constructor(shaderName){
		this.program = GLUtils.createShaderProgram(shaderName);
	}

    /**
    * Draws a model using this Renderers ShaderProgram.
    * @param {ModelTransform} model the model to draw.
    * @param {Object} shaderData whatever other data the ShaderProgram needs for drawing.
    */
    drawModel(model, camera, shaderData){

        // activate this shader program
        gl.useProgram(this.program);

        // set the arrtibute arrays and uniform data for this programs vertex and
        // fragment shader based on the models buffer data and material
        this.setVertexAttributeArrays(model);
        this.setUniformData(model, camera, shaderData);

        // draw call using index based triangle assembly (elements)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.mesh.bufIndex);
        gl.drawElements(model.mesh.drawMode, model.mesh.indexCount, gl.UNSIGNED_SHORT, 0);

        return this;
	}

    /**
    * Sets ALL attributes for the vertex shader of this renderers shader program before drawing.
    * @param {ModelTransform} model the model to draw.
    */
    setVertexAttributeArrays(model){
        // position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.positionBuffer);
        let posAttribLoc = gl.getAttribLocation(this.program, "a_position");
        gl.enableVertexAttribArray(posAttribLoc);
        gl.vertexAttribPointer(posAttribLoc,3,gl.FLOAT,false,0,0);

        gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.normalBuffer); 
        let normalAttribLoc = gl.getAttribLocation(this.program, "a_normal");
        gl.enableVertexAttribArray(normalAttribLoc);
        gl.vertexAttribPointer(normalAttribLoc, 3, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, model.mesh.texcoordBuffer);
        let texcoordAttribLoc = gl.getAttribLocation(this.program, "a_texcoord");
        gl.enableVertexAttribArray(texcoordAttribLoc);
        gl.vertexAttribPointer(texcoordAttribLoc, 2, gl.FLOAT, false, 0, 0);
        
    }

    /**
    * Sets ALL uniforms for the vertex and fragment shader of this renderers shader program before drawing.
    * @param {ModelTransform} model the model to draw.
    * @param {Object} shaderData whatever other data the Shader needs for drawing.
    */
    setUniformData(model, camera, shaderData){

        let viewMatrix = camera.viewMatrix;
        let projectionMatrix = camera.projectionMatrix;
        let lightColor = shaderData.lightingData.lightColor;
        let lightColor_dir = shaderData.lightingData.dirColor;
        let lightDirection = shaderData.lightingData.dirDirection;

        // set model, view and projection matrices in the vertex shader
        let modelMatrixLoc = gl.getUniformLocation(this.program, "u_matrixM");
        gl.uniformMatrix4fv(modelMatrixLoc, false, model.modelMatrix.toFloat32());
        let viewMatrixLoc = gl.getUniformLocation(this.program, "u_matrixV");
        gl.uniformMatrix4fv(viewMatrixLoc, false, viewMatrix.toFloat32());
        let projMatrixLoc = gl.getUniformLocation(this.program, "u_matrixP");
        gl.uniformMatrix4fv(projMatrixLoc, false, projectionMatrix.toFloat32());

        let lightPosition =  shaderData.lightingData.lightPosition;
        gl.uniform3fv(gl.getUniformLocation(this.program, "u_lightPosition"), lightPosition);

        let inverseTranspose = M4.inverseTranspose3x3(model.modelMatrix);
        let invTransLoc = gl.getUniformLocation(this.program, "u_matrixInvTransM");
        gl.uniformMatrix3fv(invTransLoc, false, inverseTranspose.toFloat32());

        //light direction
        
        let lightDirLoc = gl.getUniformLocation(this.program, "u_lightDirection");
        gl.uniform3fv(lightDirLoc, lightDirection.toFloat32());
        

        let viewPosLocation = gl.getUniformLocation(this.program, "u_viewPos");
        let camPos = camera.getPosition();
        gl.uniform3fv(viewPosLocation, camPos.toFloat32());

        let shininessLocation = gl.getUniformLocation(this.program, "u_shininess");
        gl.uniform1f(shininessLocation, model.material.shininess);


        let lightColorLocation = gl.getUniformLocation(this.program, "u_lightColor");
        gl.uniform3fv(lightColorLocation, lightColor.toFloat32());
        let lightColorLocation_dir = gl.getUniformLocation(this.program, "u_lightColor_dir");
        gl.uniform3fv(lightColorLocation_dir, lightColor_dir.toFloat32());


        // set tint color data
        let colorLoc = gl.getUniformLocation(this.program, "u_tint");
        gl.uniform3fv(colorLoc, model.material.tint.toFloat32());
        
        // Texturing 
        gl.activeTexture(gl.TEXTURE0);
        let mainTexture = TextureCache[model.material.mainTexture];
        gl.bindTexture(gl.TEXTURE_2D, mainTexture);
        let maintexLoc = gl.getUniformLocation(this.program, "u_mainTex");
        gl.uniform1i(maintexLoc, 0);
        
    }
}




