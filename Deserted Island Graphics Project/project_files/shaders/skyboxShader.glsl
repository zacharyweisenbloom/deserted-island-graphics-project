
#ifdef VERTEX_SHADER
// ------------------------------------------------------//
// ----------------- VERTEX SHADER ----------------------//
// ------------------------------------------------------//

attribute vec3 a_position; // the position of each vertex

uniform mat4 u_matrixP;
uniform mat4 u_matrixV;

varying vec3 texcoords;


void main() {
    // calculate new position
    vec4 pos = vec4 (a_position, 1);
    pos = u_matrixP * u_matrixV * pos;
    gl_Position = pos;
    texcoords = vec3(a_position);
}

#endif // (these lines seperate our vertex and fragment shader for the compiler)
#ifdef FRAGMENT_SHADER
// ------------------------------------------------------//
// ----------------- Fragment SHADER --------------------//
// ------------------------------------------------------//

precision highp float; //float precision settings

uniform samplerCube u_cubeMap;
varying vec3 texcoords;
void main(void){

    gl_FragColor = textureCube(u_cubeMap, texcoords);
}

#endif

