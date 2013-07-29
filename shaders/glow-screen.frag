precision highp float;

uniform sampler2D texture0;
uniform sampler2D texture1;

uniform float brightness;

varying vec2 vTextureCoordinate;

void main() {
  vec4 renderedScene = texture2D(texture0, vTextureCoordinate);
  vec4 glowMap = texture2D(texture1, vTextureCoordinate);

  gl_FragColor = clamp(((renderedScene + glowMap) - (renderedScene * glowMap)) * brightness, 0.0, 1.0);
  gl_FragColor.w = 1.0;
}
