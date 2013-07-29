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

var pyramids = function() {
    "use strict";

    var __components__,
        __buffers__,
        __models__,
        __shaders__;

    var canvas,
        gl;

    var sceneProg,
        glowProg,
        blurProg;

    var projectionMatrix,
        viewMatrix,
        modelMatrix;

    var blurMag,
        blurMod;

    var pyramids,
        squares,
        skyLines;

    var pyramidTexture,
        squareTexture,
        skyTexture;

    var pyramidImage,
        squareImage,
        skyImage;

    var sceneFrameBuffer,
        sceneTexture,
        sceneRenderBuffer;

    var blurFrameBuffer,
        blurTexture,
        blurRenderBuffer;

    var glowFrameBuffer,
        glowTexture,
        glowRenderBuffer;

    var initGL,
        initViewport,
        initStatics,
        initBuffers,
        initImages,
        initShaders;

    var cycleBlur,
        renderSceneToBuffer,
        renderBlurredSceneToBuffer,
        renderGlowingScene;

    var init,
        main;

    __components__ = pyramids_components;
    __buffers__ = pyramids_buffers;
    __models__ = pyramids_models;
    __shaders__ = pyramids_shaders;

    //---//

    initGL = function() {
        canvas = document.getElementById('glcanvas');
        gl = WebGLUtils.setupWebGL(canvas);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
    };

    initViewport = function() {
        projectionMatrix = new J3DIMatrix4();
        projectionMatrix.makeIdentity();
        projectionMatrix.perspective(45, 4/3, 0.1, 50.0);

        viewMatrix = new J3DIMatrix4();
        viewMatrix.makeIdentity();
        viewMatrix.rotate(1.0, 1.0, 0.0, 0.0);

        modelMatrix = new J3DIMatrix4();
    };

    initStatics = function() {
        var i, j;

        pyramids = [];
        for(i = 0; i < 4; i++) {
            for(j = 0; j < 10; j++) {
                pyramids.push(new __components__.Static(new __components__.Vec3((8 * i) - 16.0, 0.0, (4 * j) - 38.0), __models__.Pyramid));
            }
        }

        squares = [];
        for(i = 0; i < 4; i++) {
            for(j = 0; j < 10; j++) {
                squares.push(new __components__.Static(new __components__.Vec3((8 * i) - 16.0, 0.0, (4 * j) - 38.0), __models__.Square));
            }
        }

        skyLines = [];
        for(i = 0; i < 5; i++) {
            skyLines.push(new __components__.Static(new __components__.Vec3(0.0, 4.0 * i, -50.0), __models__.Sky));
        }
    };

    initBuffers = function() {
        sceneFrameBuffer = __buffers__.FrameBuffer(gl, 1024, 1024);
        sceneTexture = __buffers__.FrameBufferTexture(gl, 1024, 1024);
        sceneRenderBuffer = __buffers__.RenderBuffer(gl, 1024, 1024, sceneTexture, sceneFrameBuffer);

        blurFrameBuffer = __buffers__.FrameBuffer(gl, 1024, 1024);
        blurTexture = __buffers__.FrameBufferTexture(gl, 1024, 1024);
        blurRenderBuffer = __buffers__.RenderBuffer(gl, 1024, 1024, blurTexture, blurFrameBuffer);
    };

    initImages = function(continuation) {
        pyramidImage = new Image();
        squareImage = new Image();
        skyImage = new Image();

        pyramidImage.src = 'assets/textures/pyramid.png';
        pyramidImage.onload = function() {
            squareImage.src = 'assets/textures/square-thin.png';
            squareImage.onload = function() {
                skyImage.src = 'assets/textures/sky.png';
                skyImage.onload = function() {
                    continuation();
                };
            };
        };
    };

    initShaders = function(continuation) {
        sceneProg = new __shaders__.ShaderProgram(gl);
        jQuery.get('shaders/standard.vert', function(vShaderSource) {
            jQuery.get('shaders/standard.frag', function(fShaderSource) {
                sceneProg.loadVertexShader(vShaderSource);
                sceneProg.loadFragmentShader(fShaderSource);
                sceneProg.create();

                blurProg = new __shaders__.ShaderProgram(gl);
                jQuery.get('shaders/render-to-texture.vert', function(vShaderSource) {
                    jQuery.get('shaders/blur.frag', function(fShaderSource) {
                        blurProg.loadVertexShader(vShaderSource);
                        blurProg.loadFragmentShader(fShaderSource);
                        blurProg.create();

                        glowProg = new __shaders__.ShaderProgram(gl);
                        jQuery.get('shaders/render-to-texture.vert', function(vShaderSource) {
                            jQuery.get('shaders/glow-screen.frag', function(fShaderSource) {
                                glowProg.loadVertexShader(vShaderSource);
                                glowProg.loadFragmentShader(fShaderSource);
                                glowProg.create();

                                continuation();
                            });
                        });
                    });
                });
            });
        });
    };

    init = function() {
        initGL();
        initViewport();
        initStatics();
        initBuffers();

        initImages(function() {
            initShaders(function() {
                main(canvas);
            });
        });
    };

    //---//

    cycleBlur = function() {
        if(typeof blurMag === 'undefined') {
            blurMag = 0.0;
        }

        if(blurMag >= 1.5) {
            blurMod = -0.05;
        } else if(blurMag <= 0.0) {
            blurMod = 0.05;
        }

        blurMag += blurMod;
    };

    renderSceneToBuffer = function() {
        var i;

        sceneProg.use();

        __buffers__.enableBufferRendering(gl, sceneFrameBuffer);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        sceneProg.loadMatrix('projectionMatrix', projectionMatrix);
        sceneProg.loadMatrix('viewMatrix', viewMatrix);

        //---//

        sceneProg.loadArray('vertexPosition', __models__.Pyramid);
        sceneProg.loadArray('textureCoordinate', __models__.PyramidTexCoords);
        sceneProg.loadTextureFromImage('texture', pyramidImage);

        for(i = 0; i < pyramids.length; i++) {
            if(pyramids[i].position.x + 0.04 > 16.0) {
                pyramids[i].position.x -= 31.95;
            } else {
                pyramids[i].position.x += 0.04;
            }

            modelMatrix.makeIdentity();
            modelMatrix.translate(pyramids[i].position.x, pyramids[i].position.y - 0.1, pyramids[i].position.z);
            modelMatrix.scale(1.6, 1.0, 1.0);

            sceneProg.loadMatrix('modelMatrix', modelMatrix);

            gl.drawArrays(gl.TRIANGLES, 0, __models__.Pyramid.length / 3);
        }

        sceneProg.unloadTexture();

        //---//

        sceneProg.loadArray('vertexPosition', __models__.Square);
        sceneProg.loadArray('textureCoordinate', __models__.SquareTexCoords);
        sceneProg.loadTextureFromImage('texture', squareImage);

        for(i = 0; i < squares.length; i++) {
            if(squares[i].position.x + 0.04 > 16.0) {
                squares[i].position.x -= 31.95;
            } else {
                squares[i].position.x += 0.04;
            }

            modelMatrix.makeIdentity();
            modelMatrix.translate(squares[i].position.x, squares[i].position.y - 0.1, squares[i].position.z);
            modelMatrix.scale(4.0, 1.0, 2.0);

            sceneProg.loadMatrix('modelMatrix', modelMatrix);

            gl.drawArrays(gl.TRIANGLES, 0, __models__.Square.length / 3);
        }

        sceneProg.unloadTexture();

        //---//

        sceneProg.loadArray('vertexPosition', __models__.Sky);
        sceneProg.loadArray('textureCoordinate', __models__.SkyTexCoords);
        sceneProg.loadTextureFromImage('texture', skyImage);

        for(i = 0; i < skyLines.length; i++) {
            modelMatrix.makeIdentity();
            modelMatrix.translate(skyLines[i].position.x, skyLines[i].position.y, skyLines[i].position.z);
            modelMatrix.scale(40.0, 2.0, 1.0);

            sceneProg.loadMatrix('modelMatrix', modelMatrix);

            gl.drawArrays(gl.TRIANGLES, 0, __models__.Sky.length / 3);
        }

        sceneProg.unloadTexture();
        sceneProg.unloadArray('vertexPosition');
        sceneProg.unloadArray('textureCoordinate');

        //---//

        __buffers__.disableBufferRendering(gl);
    };

    renderBlurredSceneToBuffer = function() {
        blurProg.use();

        __buffers__.enableBufferRendering(gl, blurFrameBuffer);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, sceneTexture);
        blurProg.loadInt('texture', 0);
        blurProg.loadInt('blurAmount', 5);
        blurProg.loadFloat('blurScale', blurMag);
        blurProg.loadFloat('blurStrength', 0.5);
        blurProg.loadFloat('texelSize', 0.001);
        blurProg.loadArray('vertexPosition', __models__.RenderPane);
        blurProg.loadArray('textureCoordinate', __models__.RenderPaneTexCoords);

        gl.drawArrays(gl.TRIANGLES, 0, __models__.RenderPane.length / 3);

        blurProg.unloadTexture();
        blurProg.unloadArray('vertexPosition');
        blurProg.unloadArray('textureCoordinate');

        __buffers__.disableBufferRendering(gl);
    };

    renderGlowingScene = function() {
        glowProg.use();

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, sceneTexture);
        glowProg.loadInt('texture0', 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, blurTexture);
        glowProg.loadInt('texture1', 1);

        gl.uniform1f(gl.getUniformLocation(glowProg.program(), 'brightness'), (blurMag / 1.5) + 0.5);

        glowProg.loadArray('vertexPosition', __models__.RenderPane);
        glowProg.loadArray('textureCoordinate', __models__.RenderPaneTexCoords);

        gl.activeTexture(gl.TEXTURE0); // why the fuck won't things draw unless we set texture0 as active again?
        gl.drawArrays(gl.TRIANGLES, 0, __models__.RenderPane.length / 3);

        glowProg.unloadTexture();
        glowProg.unloadArray('vertexPosition');
        glowProg.unloadArray('textureCoordinate');
    };

    main = function(canvas) {
        var mainLoop = function() {
            window.requestAnimFrame(mainLoop, canvas);

            cycleBlur();
            renderSceneToBuffer();
            renderBlurredSceneToBuffer();
            renderGlowingScene();
        };

        mainLoop();
    };

    //---//

    return {
        init: init
    };
}();
