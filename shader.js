/*
===============================================================================
Copyright (c) 2013, Stephen M. Youts
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
===============================================================================
*/

var pyramids_shaders = function() {
    "use strict";

    var ShaderProgram = function(gl) {
		this._gl = gl;
		this._consoleLogging = 1;
		this._program = {};
		this._vShader = '';
		this._fShader = '';
		this._buffers = {};

		// error codes
		this.RET_ERROR_VERTEX_COMPILE = -1;
		this.RET_ERROR_FRAGMENT_COMPILE = -2;
		this.RET_ERROR_PROGRAM_LINK = -3;
		this.RET_ERROR_PROGRAM_VALIDATE = -4;
        this.RET_ERROR_TEXTURE_LOAD = -5;
		this.RET_SUCCESS = 0;
	};

	ShaderProgram.prototype.create = function() {
		this._program = this._gl.createProgram();

		this._gl.attachShader(this._program, this._vShader);
		this._gl.attachShader(this._program, this._fShader);

		this._gl.linkProgram(this._program);

		if(!this._gl.getProgramParameter(this._program, this._gl.LINK_STATUS)) {
			if(this._consoleLogging) {
				console.log(this._gl.getProgramInfoLog(this._program));
			}
			return this.RET_ERROR_PROGRAM_LINK;
		}

		this._gl.validateProgram(this._program);

		if(!this._gl.getProgramParameter(this._program, this._gl.VALIDATE_STATUS)) {
			if(this._consoleLogging) {
				console.log(this._gl.getProgramInfoLog(this._program));
			}
			return this.RET_ERROR_PROGRAM_VALIDATE;
		}

		return this.RET_SUCCESS;
	};

	ShaderProgram.prototype.destroy = function() {
		this._gl.deleteProgram(this._program);
	};

	ShaderProgram.prototype.recreate = function() {
		this.destroy();
		this.create();
	};

	ShaderProgram.prototype.use = function() {
		this._gl.useProgram(this._program);
	};

	ShaderProgram.prototype.loadVertexShader = function(vShaderSource) {
		this._vShader = this._gl.createShader(this._gl.VERTEX_SHADER);
		this._gl.shaderSource(this._vShader, vShaderSource);
		this._gl.compileShader(this._vShader);

		if(!this._gl.getShaderParameter(this._vShader, this._gl.COMPILE_STATUS)) {
			if(this._consoleLogging) {
				console.log(this._gl.getShaderInfoLog(this._vShader));
			}
			return this.RET_ERROR_VERTEX_COMPILE;
		}

		return this.RET_SUCCESS;
	};

	ShaderProgram.prototype.unloadVertexShader = function() {
		this._gl.detachShader(this._program, this._vShader);
		this._gl.deleteShader(this._vShader);
	};

	ShaderProgram.prototype.loadFragmentShader = function(fShaderSource) {
		this._fShader = this._gl.createShader(this._gl.FRAGMENT_SHADER);
		this._gl.shaderSource(this._fShader, fShaderSource);
		this._gl.compileShader(this._fShader);

		if(!this._gl.getShaderParameter(this._fShader, this._gl.COMPILE_STATUS)) {
			if(this._consoleLogging) {
				console.log(this._gl.getShaderInfoLog(this._fShader));
			}
			return this.RET_ERROR_FRAGMENT_COMPILE;
		}

		return this.RET_SUCCESS;
	};

	ShaderProgram.prototype.unloadFragmentShader = function() {
		this._gl.detachShader(this._program, this._fShader);
		this._gl.deleteShader(this._fShader);
	};

	ShaderProgram.prototype.enableConsoleLogging = function() {
		this._consoleLogging = 1;
	};

	ShaderProgram.prototype.disableConsoleLogging = function() {
		this._consoleLogging = 0;
	};

	ShaderProgram.prototype.program = function() {
		return this._program;
	};

	ShaderProgram.prototype.loadArray = function(attribName, array) {
		var programAttrib = this._gl.getAttribLocation(this._program, attribName);

		this._gl.enableVertexAttribArray(programAttrib);
		this._buffers[attribName] = this._gl.createBuffer();
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._buffers[attribName]);
		this._gl.bufferData(this._gl.ARRAY_BUFFER, array, this._gl.STATIC_DRAW);
		this._gl.vertexAttribPointer(programAttrib, 3, this._gl.FLOAT, false, 0, 0);
		this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
	};

	ShaderProgram.prototype.unloadArray = function(attribName) {
		var programAttrib = this._gl.getAttribLocation(this._program, attribName);

		this._gl.disableVertexAttribArray(programAttrib);
		this._gl.deleteBuffer(this._buffers[attribName]);
	};

	ShaderProgram.prototype.loadTexture = function(uniformName, texture) {
		var image;

		image = texture.image;

        this.loadTextureFromImage(uniformName, image);

		return this.RET_SUCCESS;
	};

    ShaderProgram.prototype.loadTextureFromImage = function(uniformName, image) {
        var programUniform;

        if(image === null) {
            return this.RET_ERROR_TEXTURE_LOAD;
        }

        programUniform = this._gl.getUniformLocation(this._program, uniformName);

		this._texture = this._gl.createTexture();
		//this._gl.activeTexture(this._gl.TEXTURE0);
		this._gl.bindTexture(this._gl.TEXTURE_2D, this._texture);
		this._gl.texImage2D(this._gl.TEXTURE_2D, 0, this._gl.RGBA, this._gl.RGBA, this._gl.UNSIGNED_BYTE, image);
		this._gl.generateMipmap(this._gl.TEXTURE_2D);
		this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MAG_FILTER, this._gl.LINEAR);
		this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_MIN_FILTER, this._gl.LINEAR_MIPMAP_LINEAR);
		this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_S, this._gl.CLAMP_TO_EDGE);
		this._gl.texParameteri(this._gl.TEXTURE_2D, this._gl.TEXTURE_WRAP_T, this._gl.CLAMP_TO_EDGE);
		this._gl.uniform1i(programUniform, 0); // set uniform to texture unit 0

        return this.RET_SUCCESS;
    };

	ShaderProgram.prototype.unloadTexture = function() {
		this._gl.bindTexture(this._gl.TEXTURE_2D, null);
		this._gl.deleteTexture(this._texture);
	};

	ShaderProgram.prototype.loadMatrix = function(attribName, matrix) {
		matrix.setUniform(this._gl, this._gl.getUniformLocation(this._program, attribName), false);
	};

    ShaderProgram.prototype.loadInt = function(name, value) {
        this._gl.uniform1i(this._gl.getUniformLocation(this._program, name), value);
    };

    ShaderProgram.prototype.loadFloat = function(name, value) {
        this._gl.uniform1f(this._gl.getUniformLocation(this._program, name), value);
    };

    return {
        ShaderProgram: ShaderProgram
    };
}();
