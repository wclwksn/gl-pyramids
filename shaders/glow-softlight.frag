precision mediump float;

uniform sampler2D texture0;
uniform sampler2D texture1;

varying vec2 vTextureCoordinate;

void main() {
  vec4 renderedScene = texture2D(texture0, vTextureCoordinate);
  vec4 glowMap = texture2D(texture1, vTextureCoordinate);

  renderedScene = (renderedScene * 0.5) + 0.5;

  gl_FragColor.xyz = vec3((renderedScene.x <= 0.5) ? (glowMap.x - (1.0 - 2.0 * renderedScene.x) * glowMap.x * (1.0 - glowMap.x)) : (((renderedScene.x > 0.5) && (glowMap.x <= 0.25)) ? (glowMap.x + (2.0 * renderedScene.x - 1.0) * (4.0 * glowMap.x * (4.0 * glowMap.x + 1.0) * (glowMap.x - 1.0) + 7.0 * glowMap.x)) : (glowMap.x + (2.0 * renderedScene.x - 1.0) * (sqrt(glowMap.x) - glowMap.x))), (renderedScene.y <= 0.5) ? (glowMap.y - (1.0 - 2.0 * renderedScene.y) * glowMap.y * (1.0 - glowMap.y)) : (((renderedScene.y > 0.5) && (glowMap.y <= 0.25)) ? (glowMap.y + (2.0 * renderedScene.y - 1.0) * (4.0 * glowMap.y * (4.0 * glowMap.y + 1.0) * (glowMap.y - 1.0) + 7.0 * glowMap.y)) : (glowMap.y + (2.0 * renderedScene.y - 1.0) * (sqrt(glowMap.y) - glowMap.y))), (renderedScene.z <= 0.5) ? (glowMap.z - (1.0 - 2.0 * renderedScene.z) * glowMap.z * (1.0 - glowMap.z)) : (((renderedScene.z > 0.5) && (glowMap.z <= 0.25)) ? (glowMap.z + (2.0 * renderedScene.z - 1.0) * (4.0 * glowMap.z * (4.0 * glowMap.z + 1.0) * (glowMap.z - 1.0) + 7.0 * glowMap.z)) : (glowMap.z + (2.0 * renderedScene.z - 1.0) * (sqrt(glowMap.z) - glowMap.z))));
  gl_FragColor.w = 1.0;
}
