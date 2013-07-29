precision highp float;

uniform float texelSize;
uniform sampler2D texture;

uniform int blurAmount;
uniform float blurScale;
uniform float blurStrength;

varying vec2 vTextureCoordinate;

float Gaussian(float x, float deviation) {
  return (1.0 / sqrt(2.0 * 3.141592 * deviation)) * exp(-((x * x) / (2.0 * deviation)));
}

vec4 averageFromRadialKernel(sampler2D texture, vec2 coordinate, int radius, float texelSize, float blurScale, int blurAmount, float strength, float deviation) {
  vec4 color = vec4(0.0);
  float offset;

  for(int i = 0; i < 1000; i++) {
    if(i >= radius) break;
    for(int j = 0; j < 1000; j++) {
      if(j >= radius) break;

      offset = float(i + j) - (float(blurAmount) * 0.5);
      color += (texture2D(texture, coordinate + vec2(float(i) * texelSize * blurScale, float(j) * texelSize * blurScale)) * Gaussian(offset * strength, deviation)) + (texture2D(texture, coordinate + vec2(-float(i) * texelSize * blurScale, -float(j) * texelSize * blurScale)) * Gaussian(offset * strength, deviation));
    }
  }

  return color;
}

void main() {
  vec4 color = vec4(0.0);
  vec4 texColor = vec4(0.0);

  float deviation = float(blurAmount) * 0.5 * 0.35;
  deviation *= deviation;
  float strength = 1.0 - blurStrength;

  gl_FragColor = clamp(averageFromRadialKernel(texture, vTextureCoordinate, 2, texelSize, blurScale, blurAmount, strength, deviation), 0.0, 1.0);
  gl_FragColor.w = 1.0;
}
