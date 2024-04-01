#ifdef VERTEX_SHADER
// ------------------------------------------------------//
// ----------------- VERTEX SHADER ----------------------//
// ------------------------------------------------------//

attribute vec3 a_position; // the position of each vertex
// TODO: Create new attribute a_normal
attribute vec3 a_normal;

//TODO: Add a_texcoord attribute
attribute vec2 a_texcoord;

uniform mat4 u_matrixM; // the model matrix of this object
uniform mat4 u_matrixV; // the view matrix of the camera
uniform mat4 u_matrixP; // the projection matrix of the camera
varying vec3 u_lightPosition;
uniform mat3 u_matrixInvTransM;

// TODO: create new varying v_normal
varying vec3 v_normal; 

// TODO: (for specular) add new varying v_worldPos
varying vec3 v_worldPos;

//TODO: Add v_texcoord varying
varying vec2 v_texcoord;

void main() {
    // TODO: Set v_normal to have the value of a_normal. This means creating a
    // new output for the vertex shader or forwarding a value from the vertex shader
    // to the fragment shader.
    v_normal = u_matrixInvTransM * a_normal;
    vec3 normal  = normalize(v_normal);
    // Remember to apply the Inverse Transpose matrix, to transform the normals to their
    // correct world coordinates!

    // TODO: (For specular) calculate world position
    vec3 worldPosition = (u_matrixM * vec4 (a_position, 1)).xyz;
    v_worldPos = worldPosition;

    v_texcoord = a_texcoord;

    // calculate new position
    gl_Position = u_matrixP * u_matrixV * u_matrixM * vec4 (a_position, 1);
}

#endif
#ifdef FRAGMENT_SHADER
// ------------------------------------------------------//
// ----------------- Fragment SHADER --------------------//
// ------------------------------------------------------//

precision highp float; //float precision settings

uniform vec3 u_tint;            // the tint color of this object
uniform vec3 u_lightColor;
uniform vec3 u_lightColor_dir;
uniform vec3 u_lightPosition;

uniform vec3 u_lightDirection;


varying vec2 v_texcoord;
uniform sampler2D u_mainTex;
varying vec3 v_normal;
varying vec3 v_worldPos;
uniform vec3 u_viewPos;
uniform float u_shininess;


void main(void){
    float constant = 1.0;
    float linear = 0.09;
    float quadratic = 0.032;
    float distance = length(u_lightDirection - v_worldPos);
    float distance_point = length(u_lightPosition - v_worldPos);
    float attenuation = 1.0 / (constant + linear * distance + quadratic * (distance * distance));
    float attenuation_point = 1.0 / (constant + linear * distance_point + quadratic * (distance_point * distance_point));

    vec3 normal  = normalize(v_normal);
    vec3 viewDirection = normalize(u_viewPos - v_worldPos);
    vec3 lightDirection = normalize(v_worldPos - u_lightPosition);
    vec3 lightDirection_directional = normalize(u_lightDirection);
    vec3 reflectDirection = reflect(lightDirection, normal);
    vec3 reflectDirection_dir = reflect(lightDirection_directional, normal);

    float diffuse = max(0.0, dot(normal, -lightDirection));
    float diffuse_dir = max(0.0, dot(normal, -lightDirection_directional));

    float specular = .6 * pow(max(dot(viewDirection, reflectDirection), 0.0), u_shininess * .5);
    float specular_dir = .6 * pow(max(dot(viewDirection, reflectDirection_dir), 0.0), u_shininess * .5);

    vec3 specularColor = u_lightColor_dir * specular;
    vec3 specularColor_dir = u_lightColor_dir * specular_dir;

    vec3 textureColor = texture2D(u_mainTex, v_texcoord).rgb;


    vec3 baseColor = textureColor * u_tint;
    float ambient = .055;
    vec3 pointLightResult = baseColor * u_lightColor * (diffuse + ambient + specular) * attenuation_point * 1.5;
    vec3 directional_light_result = (baseColor * u_lightColor_dir * (diffuse_dir + ambient) + specular_dir) *.5;
    vec3 result = mix(pointLightResult, directional_light_result, 0.5);
    gl_FragColor = vec4(result, 1);
}

#endif
