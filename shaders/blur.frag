precision highp float;

uniform float texelSize;
uniform int kernelRadius;
uniform float gaussianDeviation;
uniform float gaussianScale;
uniform sampler2D texture;

varying vec2 vTextureCoordinate;

const int MAX_RADIUS = 1000;

float gaussian(float x, float deviation) {
  return (1.0 / sqrt(2.0 * 3.141592 * deviation)) * exp(-((x * x) / (2.0 * deviation)));
}

vec4 averageFromRadialKernel(sampler2D texture, vec2 coordinate, int radius, float texelSize, float gaussianScale, float deviation) {
  vec4 colorSum = vec4(0.0);
  vec4 color = vec4(0.0);

  // colorSum is used for normalizing the color
  for(int i = 0; i < MAX_RADIUS; i++) {
    if(i >= radius) break;
    for(int j = 0; j < MAX_RADIUS; j++) {
      if(j >= radius) break;

      colorSum += texture2D(texture, coordinate + vec2(float(i) * texelSize, float(j) * texelSize)) * gaussian(gaussianScale * float(i + j), deviation);
      if(j + i == 0) continue;
      colorSum += texture2D(texture, coordinate + vec2(-float(i) * texelSize, -float(j) * texelSize)) * gaussian(gaussianScale * float(i + j), deviation);
    }
  }
  for(int i = 0; i < MAX_RADIUS; i++) {
    if(i >= radius) break;
    for(int j = 0; j < MAX_RADIUS; j++) {
      if(j >= radius) break;

      color += texture2D(texture, coordinate + vec2(float(i) * texelSize, float(j) * texelSize)) * gaussian(gaussianScale * float(i + j), deviation) * colorSum;
      if(j + i == 0) continue;
      color += texture2D(texture, coordinate + vec2(-float(i) * texelSize, -float(j) * texelSize)) * gaussian(gaussianScale * float(i + j), deviation) * colorSum;
    }
  }

  return color;
}

void main() {
  vec4 color = vec4(0.0);

  gl_FragColor = clamp(averageFromRadialKernel(texture, vTextureCoordinate, kernelRadius, texelSize, gaussianScale, gaussianDeviation), 0.0, 1.0);
  gl_FragColor.w = 1.0;
}
