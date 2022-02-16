    precision mediump float;

    uniform vec3 uColor;
    uniform sampler2D uTexture;
    
    varying vec2 vUv;
    varying float vElevation;

    void main() {
        vec4 textureColor = texture2D(uTexture, vUv);
        gl_FragColor = textureColor;
        gl_FragColor += vec4(vec3(vElevation * 2.0), 1.0);
    }


    // vec2 oneZero = vec2(1.0, 1.0);

    // vec4 generateColor() {
    //     float k = 2.0;
    //     float a;
    //     if (k == 2.0) {
    //         a = 1.0;
    //     } else {
    //         a = 0.5;
    //     }
    //     return vec4(a, oneZero.xy , 1.0);
    // }