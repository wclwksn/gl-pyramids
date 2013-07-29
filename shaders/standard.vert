uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 vertexPosition;
attribute vec3 textureCoordinate;

varying vec2 vTextureCoordinate;

void main() {
     vTextureCoordinate = textureCoordinate.xy;
     gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPosition, 1.0);
}