/** GLSL for the 3D world. Kept tiny: noise + fresnel + soft point sprites. */

// Ashima Arts 3D simplex noise (MIT)
export const simplexNoise = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

/** Deep-space backdrop: vignette + two drifting nebula glows + dither (no banding). */
export const backdropVertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.9999, 1.0);
}
`;

export const backdropFragment = /* glsl */ `
uniform float uTime;
uniform float uScroll;
uniform float uAspect;
uniform vec3 uBase;
uniform vec3 uDeep;
uniform vec3 uViolet;
uniform vec3 uCyan;
varying vec2 vUv;

float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

void main(){
  vec2 p = vUv - 0.5;
  p.x *= uAspect;
  float r = length(p);
  vec3 col = mix(uBase, uDeep, smoothstep(0.0, 0.95, r));

  vec2 a = vec2(-0.55 * uAspect + sin(uTime * 0.05) * 0.08, 0.32 - uScroll * 0.35);
  vec2 b = vec2(0.5 * uAspect + cos(uTime * 0.04) * 0.1, -0.3 + uScroll * 0.25);
  float ga = exp(-pow(length(p - a) * 1.7, 2.0));
  float gb = exp(-pow(length(p - b) * 1.9, 2.0));
  col += uViolet * ga * 0.06 + uCyan * gb * 0.04;

  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) / 255.0 * 2.0;
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`;

/** Holographic shell: noise-displaced lattice lit by fresnel. */
export const shellVertex = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uSize;
varying float vFresnel;
varying float vNoise;
${simplexNoise}
void main(){
  vec3 dir = normalize(position);
  float n = snoise(dir * 1.35 + vec3(uTime * 0.16, uTime * 0.11, 0.0));
  vec3 displaced = position + dir * n * uAmp;
  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  vec3 nrm = normalize(normalMatrix * dir);
  vFresnel = pow(1.0 - abs(dot(nrm, normalize(-mv.xyz))), 2.2);
  vNoise = n;
  gl_Position = projectionMatrix * mv;
  #ifdef POINTS
    gl_PointSize = uSize * (0.6 + 0.4 * (n * 0.5 + 0.5)) * (6.0 / -mv.z);
  #endif
}
`;

export const shellFragment = /* glsl */ `
uniform vec3 uViolet;
uniform vec3 uCyan;
uniform float uOpacity;
varying float vFresnel;
varying float vNoise;
void main(){
  #ifdef POINTS
    float d = length(gl_PointCoord - 0.5);
    float disc = smoothstep(0.5, 0.0, d);
    if (disc < 0.01) discard;
  #else
    float disc = 1.0;
  #endif
  vec3 col = mix(uViolet, uCyan, smoothstep(-0.6, 0.7, vNoise + vFresnel * 0.4));
  float alpha = (0.06 + vFresnel * 0.85) * uOpacity * disc;
  gl_FragColor = vec4(col * (1.0 + vFresnel), alpha);
  #include <colorspace_fragment>
}
`;

/** Soft glowing sprites — star field and data packets. */
export const pointsVertex = /* glsl */ `
attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;
uniform float uTime;
uniform float uPixelRatio;
uniform float uScale;
varying vec3 vColor;
varying float vTwinkle;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vTwinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aPhase * 0.8) + aPhase * 6.2831);
  vColor = aColor;
  gl_PointSize = aSize * uScale * uPixelRatio * (10.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;

export const pointsFragment = /* glsl */ `
uniform float uOpacity;
varying vec3 vColor;
varying float vTwinkle;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float core = smoothstep(0.5, 0.0, d);
  float glow = pow(core, 2.6);
  if (core < 0.01) discard;
  gl_FragColor = vec4(vColor * (0.6 + glow * 1.6), glow * vTwinkle * uOpacity);
  #include <colorspace_fragment>
}
`;

/** Camera-facing halo behind the core. */
export const haloFragment = /* glsl */ `
uniform vec3 uViolet;
uniform vec3 uCyan;
uniform float uOpacity;
uniform float uTime;
varying vec2 vUv;
void main(){
  vec2 p = vUv - 0.5;
  float r = length(p) * 2.0;
  float glow = exp(-r * r * 3.2);
  float angle = atan(p.y, p.x);
  vec3 col = mix(uViolet, uCyan, 0.5 + 0.5 * sin(angle + uTime * 0.25));
  gl_FragColor = vec4(col, glow * 0.42 * uOpacity);
  #include <colorspace_fragment>
}
`;

/** Holographic platform under the core: concentric rings + sweeping scan. */
export const platformFragment = /* glsl */ `
uniform vec3 uViolet;
uniform vec3 uCyan;
uniform float uOpacity;
uniform float uTime;
varying vec2 vUv;
void main(){
  vec2 p = (vUv - 0.5) * 2.0;
  float r = length(p);
  if (r > 1.0) discard;
  float rings = smoothstep(0.035, 0.0, abs(fract(r * 6.0 - uTime * 0.12) - 0.5) - 0.44);
  float angle = atan(p.y, p.x);
  float sweep = pow(0.5 + 0.5 * sin(angle - uTime * 0.7), 14.0);
  float fade = smoothstep(1.0, 0.25, r) * smoothstep(0.0, 0.18, r);
  float shadow = smoothstep(0.55, 0.0, r);
  vec3 col = mix(uCyan, uViolet, r);
  float a = (rings * 0.32 + sweep * 0.22) * fade + shadow * 0.12;
  gl_FragColor = vec4(col, a * uOpacity);
  #include <colorspace_fragment>
}
`;

export const uvVertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
