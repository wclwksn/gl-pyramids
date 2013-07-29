attribute vec3 vertexPosition;
attribute vec3 textureCoordinate;

varying vec2 vTextureCoordinate;

void main() {
  vTextureCoordinate = vec2(textureCoordinate.x, -textureCoordinate.y);
  gl_Position = vec4(vertexPosition, 1.0);
}
