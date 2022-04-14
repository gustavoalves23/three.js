void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = modelPosition * viewMatrix;
    gl_Position = projectionMatrix * viewPosition;
}