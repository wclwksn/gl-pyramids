precision mediump float;

uniform sampler2D texture0;
uniform sampler2D texture1;

varying vec2 vTextureCoordinate;

void main() {
  vec4 renderedScene = texture2D(texture0, vTextureCoordinate);
  vec4 glowMap = texture2D(texture1, vTextureCoordinate);

  gl_FragColor = min(renderedScene + glowMap, 1.0);
  //gl_FragColor = vec4(glowMap.xyz, 1.0);
  //gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
}
