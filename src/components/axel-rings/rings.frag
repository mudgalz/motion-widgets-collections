#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 axel = vec2(1.0);
const float count = 88.0;
float brght = 0.01;
float dist = 0.5;
float radius = 0.05;
float l = 1.2;
float w = 1.2;

// simple HSV to RGB
vec3 hsv2rgb(vec3 c){
    vec3 rgb = clamp(
        abs(mod(c.x*6.0 + vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,
        0.0,
        1.0
    );
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main(void) {
    axel = mouse;

    // HSV base: hue changes with mouse.x, brightness with mouse.y
    vec3 Color = hsv2rgb(vec3(mouse.x, 0.6, 0.5 + 0.5*mouse.y));
    float col = -0.3;
    vec2 centr = 2.0 * (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    for(float i = 0.0; i < count; i++) {
        float si = sin(time + i * dist * axel.x) * l;
        float co = cos(time + i * dist * axel.y) * w;
        col += brght / abs(length(centr + vec2(si , co)) - radius);
    }

    gl_FragColor = vec4(Color * col, 1.0);
}
