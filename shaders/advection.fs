precision highp float;
precision highp sampler2D;

varying vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform vec2 dyeTexelSize;
uniform float dt;
uniform float dissipation;
uniform float x_centre_rect;
uniform float y_centre_rect;
uniform float x_long;
uniform float y_long;
uniform float x_centre_cer;
uniform float y_centre_cer;
uniform float x_stretch;
uniform float y_stretch;
uniform float rayon;

vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
    vec2 st = uv / tsize - 0.5;

    vec2 iuv = floor(st);
    vec2 fuv = fract(st);

    vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
    vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
    vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
    vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

    return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
}

void main () {
    vec2 vUv2 = vUv;
    if (abs(vUv.x - x_centre_rect) < (0.5 + x_long) && abs(vUv.x - x_centre_rect) > (0.5 - x_long) && abs(vUv.y - y_centre_rect) < (0.5 + y_long) && abs(vUv.y - y_centre_rect) > (0.5 - y_long)) {vUv2 = vec2(0.0);}
     
    if (((vUv.x - x_centre_cer)*(vUv.x - x_centre_cer) / x_stretch) + ((vUv.y - y_centre_cer)*(vUv.y - y_centre_cer) / y_stretch) < rayon) {vUv2 = vec2(0.0);}



#ifdef MANUAL_FILTERING
    vec2 coord = vUv2 - dt * bilerp(uVelocity, vUv2, texelSize).xy * texelSize;
    vec4 result = bilerp(uSource, coord, dyeTexelSize);
#else
    vec2 coord = vUv2 - dt * texture2D(uVelocity, vUv2).xy * texelSize;
    vec4 result = texture2D(uSource, coord);
#endif
    float decay = 1.0 + dissipation * dt;
    gl_FragColor = result / decay;
}
