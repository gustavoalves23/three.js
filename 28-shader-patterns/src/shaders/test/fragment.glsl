#define PI 3.14159

uniform float uTime;
uniform float screenWidth;

varying vec2 vUv;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}

vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main()
{   
    //Pattern 3
    // float strength = vUv.x;

    // Pattern 4
    // float strength = vUv.y;

    //Pattern 5
    // float strength = 1. - vUv.y;

    //Pattern 6
    // float strength = vUv.y  * 10.;

    //Pattern 7
    // float strength = mod(vUv.y, .1) * 10.;

    //Pattern 8
    // float strength = ceil(sin(vUv.y * 50.));
    // Using step func

    // float strength = mod(vUv.y, .1) * 10.;
    // strength = step(0.5, strength);

    //Pattern 9
    // float strength = mod(vUv.y, .1) * 10.;
    // strength = step(0.8, strength);

    //Pattern 10
    // float strength = mod(vUv.x, .1) * 10.;
    // strength = step(0.8, strength);

    //Pattern 11
    // float strength = step(0.8, mod(vUv.x, .1) * 10.);
    // strength += step(0.8, mod(vUv.y, .1) * 10.);

    //Pattern 12
    // float strength = abs(step(0.8, mod(vUv.x, .1) * 10.));
    // strength *= abs(step(0.8, mod(vUv.y, .1) * 10.));

    //Pattern 13
    // float strength = step(0.8, mod(vUv.x, .1) * 10.);
    // strength *= step(0.4, mod(vUv.y, .1) * 10.);

    //Pattern 14
    // float xBar = step(0.4, mod(vUv.x, .1) * 10.);
    // xBar *= step(0.8, mod(vUv.y, .1) * 10.);

    // float yBar = step(0.8, mod(vUv.x, .1) * 10.);
    // yBar *= step(0.4, mod(vUv.y, .1) * 10.);

    // float strength = xBar + yBar;

    //Pattern 15
    // float xBar = step(0.4, mod((vUv.x - .02), .1) * 10.);
    // xBar *= step(0.8, mod(vUv.y, .1) * 10.);

    // float yBar = step(0.8, mod(vUv.x, .1) * 10.);
    // yBar *= step(0.4, mod(vUv.y - .02, .1) * 10.);

    // float strength = xBar + yBar;

    //Pattern 16

    // float strength = abs(vUv.x - 0.5);

    //Pattern 17

    // float strength = min(abs(vUv.x - 0.5),abs(vUv.y - 0.5));

    //Pattern 18

    // float strength = max(abs(vUv.x - 0.5),abs(vUv.y - 0.5));

    // Pattern 19

    // float strength = max(step(0.2, abs(vUv.x - 0.5)), step(0.2, abs(vUv.y - 0.5)));

    // float strength = step(0.2, max(abs(vUv.x - 0.5),abs(vUv.y - 0.5)));
    

    //Pattern 20

    // float strength = 1. - step(0.25, max(abs(vUv.x - 0.5),abs(vUv.y - 0.5)));
    // strength *= step(0.2, max(abs(vUv.x - 0.5),abs(vUv.y - 0.5)));

    //Pattern 21

    // float strength = floor(vUv.x * 10.) / 10.;

    // Pattern 22

    // float strength = floor(vUv.x * 10.) / 10.;
    // strength *= floor(vUv.y * 10.) / 10.;

    // Pattern 23
    // float strength = random(vUv);

    // Pattern 24
    // float xValue = floor(vUv.x * 10.) / 10.;
    // float yValue = floor(vUv.y * 10.) / 10.;
    // float strength = random(vec2(xValue, yValue));

    // Pattern 25
    // float xValue = floor(vUv.x * 10.) / 10.;
    // float yValue = floor((vUv.y + vUv.x/2.) * 10.) / 10.;
    // float strength = random(vec2(xValue, yValue));

    // Pattern 26
    // float strength = length(vUv);

    // Pattern 27
    // float strength = distance(vUv, vec2(.5));

    // Pattern 28
    // float strength = 1. - distance(vUv, vec2(.5));

    // Pattern 29
    // float strength = 0.015 / distance(vUv, vec2(.5));

    // Pattern 30
    // vec2 lightUv = vec2(vUv.x, vUv.y * 5. - 2.);
    // float strength = 0.15 / distance(lightUv, vec2(.5));

    // Pattern 31
    // vec2 lightUvX = vec2(vUv.x, vUv.y * 5. - 2.);
    // vec2 lightUvY = vec2(vUv.x * 5. - 2., vUv.y);
    // float distanceX = 0.15 / distance(lightUvX, vec2(.5));
    // float distanceY = 0.15 / distance(lightUvY, vec2(.5));
    // float strength = distanceX * distanceY;

    // Pattern 32
    // vec2 rotatedUv = rotate(vUv, PI/4., vec2(.5)); 
    // vec2 lightUvX = vec2(rotatedUv.x, rotatedUv.y * 5. - 2.);
    // vec2 lightUvY = vec2(rotatedUv.x * 5. - 2., rotatedUv.y);
    // float distanceX = 0.15 / distance(lightUvX, vec2(.5));
    // float distanceY = 0.15 / distance(lightUvY, vec2(.5));
    // float strength = distanceX * distanceY;

    // Pattern 33

    // float distToCenter = distance(vUv, vec2(.5));
    // float strength = step(.25, distFromCenter);

    // Pattern 34

    // float distToCenter = abs(distance(vUv, vec2(.5)) - .25);

    // float strength = distToCenter;

    // Pattern 35

    // float distToCenter = abs(distance(vUv, vec2(.5)) - .25);

    // float strength = step(.01, distToCenter);

    // Pattern 36

    // float distToCenter = abs(distance(vUv, vec2(.5)) - .25);

    // float strength =  1. - step(.01, distToCenter);

    // Pattern 37
    // vec2 newvUv = vec2(
    //     vUv.x,
    //     vUv.y + sin(vUv.x * 30.)/10.
    // );

    // float distToCenter = abs(distance(newvUv, vec2(.5)) - .25);

    // float strength =  1. - step(.01, distToCenter);


    // Pattern 38
    // vec2 newvUv = vec2(
    //     vUv.x + sin(vUv.y * 30.)/10.,
    //     vUv.y + sin(vUv.x * 30.)/10.
    // );

    // float distToCenter = abs(distance(newvUv, vec2(.5)) - .25);

    // float strength =  1. - step(.01, distToCenter);

    // Pattern 39

    // vec2 newvUv = vec2(
    //     vUv.x + sin(vUv.y * 100.)/10.,
    //     vUv.y + sin(vUv.x * 100.)/10.
    // );

    // float distToCenter = abs(distance(newvUv, vec2(.5)) - .25);

    // float strength =  1. - step(.01, distToCenter);

    // Pattern 40

    // float angle = atan(vUv.x, vUv.y);

    // float strength = angle;


    // Pattern 41

    // float angle = atan(vUv.x - 0.5, vUv.y - 0.5);

    // float strength = angle;

    // Pattern 42

    // float angle =atan(vUv.x - 0.5, vUv.y - 0.5) + PI;
    // float strength = angle / 5.;

    // Pattern 43

    // float angle =atan(vUv.x - 0.5, vUv.y - 0.5) + PI;
    // float strength = mod(angle / 5., .05) * 20.;

    // Pattern 44

    // float angle =atan(vUv.x - 0.5, vUv.y - 0.5) + PI;
    // float strength = sin(angle * 100. / 5.);

    // Pattern 45

    // float angle =atan(vUv.x - 0.5, vUv.y - 0.5) + PI;
    // float angleStrength = sin(angle * 100. / 5.);

    // float radius = .25 + angleStrength/50.;

    // float distToCenter = abs(distance(vUv, vec2(.5)) - radius);
    // float strength =  1. - step(.01, distToCenter);

    // Pattern 46

    // float strength = cnoise(vUv * 10.);

    // Pattern 47

    // float strength = step(0., cnoise(vUv * 10.));

    // Pattern 48

    // float strength = 1. - abs(cnoise(vUv * 10.));

    // Pattern 49

    // float strength = sin(uTime  * 3. + cnoise((vUv) * 10.0) * 20.);

    // Pattern 50

    float strength = step(0.6, sin(uTime  * 3. + cnoise((vUv * sin(uTime * .1)) * 10.0) * 20.));

    // Colored version
    vec3 blackColor = vec3(0.);

    vec3 uVColor = vec3(vUv, 1.);

    vec3 mixedColor = mix(blackColor, uVColor, clamp(strength, 0., 1.));

    gl_FragColor = vec4(mixedColor, 1.);



    // Black and white version
    // gl_FragColor = vec4(vec3(strength), 1.0);
}
