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

var pyramids_models = function() {
    "use strict";

    var Pyramid,
        PyramidTexCoords,
        Square,
        SquareTexCoords,
        Sky,
        SkyTexCoords,
        RenderPane,
        RenderPaneTexCoords;

    //---//

    Pyramid = new Float32Array([
        1.0, 0.0, 1.0,
        1.0, 0.0, -1.0,
        0.0, 1.0, 0.0,

        1.0, 0.0, -1.0,
            -1.0, 0.0, -1.0,
        0.0, 1.0, 0.0,

            -1.0, 0.0, -1.0,
            -1.0, 0.0, 1.0,
        0.0, 1.0, 0.0,

            -1.0, 0.0, 1.0,
        1.0, 0.0, 1.0,
        0.0, 1.0, 0.0
    ]);

    PyramidTexCoords = new Float32Array([
        0.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        0.5, 0.5, 0.0,

        0.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        0.5, 0.5, 0.0,

        0.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        0.5, 0.5, 0.0,

        0.0, 0.0, 0.0,
        1.0, 0.0, 0.0,
        0.5, 0.5, 0.0
    ]);

    //---//

    Square = new Float32Array([
        1.0, 0.0, 1.0,
        1.0, 0.0, -1.0,
            -1.0, 0.0, 1.0,

            -1.0, 0.0, 1.0,
            -1.0, 0.0, -1.0,
        1.0, 0.0, -1.0
    ]);

    SquareTexCoords = new Float32Array([
        1.0, 0.5, 0.0,
        1.0, 0.0, 0.0,
        0.0, 0.5, 0.0,

        0.0, 0.5, 0.0,
        0.0, 0.0, 0.0,
        1.0, 0.0, 0.0
    ]);

    //---//

    Sky = new Float32Array([
            -1.0, 0.0, 0.0,
            -1.0, 1.0, 0.0,
        1.0, 1.0, 0.0,

        1.0, 0.0, 0.0,
        1.0, 1.0, 0.0,
            -1.0, 0.0, 0.0
    ]);

    SkyTexCoords = new Float32Array([
        0.0, 1.0, 0.0,
        0.0, 0.0, 0.0,
        1.0, 0.0, 0.0,

        1.0, 1.0, 0.0,
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0
    ]);

    //---//

    RenderPane = new Float32Array([
        1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
            -1.0, 1.0, 0.0,

        1.0, -1.0, 0.0,
            -1.0, -1.0, 0.0,
            -1.0, 1.0, 0.0
    ]);

    RenderPaneTexCoords = new Float32Array([
        1.0, 0.0, 0.0,
        1.0, 1.0, 0.0,
        0.0, 0.0, 0.0,

        1.0, 1.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 0.0
    ]);

    //---//

    return {
        Pyramid: Pyramid,
        PyramidTexCoords: PyramidTexCoords,
        Square: Square,
        SquareTexCoords: SquareTexCoords,
        Sky: Sky,
        SkyTexCoords: SkyTexCoords,
        RenderPane: RenderPane,
        RenderPaneTexCoords: RenderPaneTexCoords
    };
}();
