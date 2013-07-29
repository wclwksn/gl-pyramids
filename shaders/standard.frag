precision highp float;

uniform sampler2D texture;

varying vec2 vTextureCoordinate;

void main() {
     gl_FragColor = vec4(texture2D(texture, vTextureCoordinate).xyz, 1.0);
}
