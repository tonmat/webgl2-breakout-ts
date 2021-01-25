#version 300 es

layout (location = 0) in vec4 a_pos;
layout (location = 1) in vec4 a_color;

uniform mat4 u_proj;

out vec4 v_color;

void main()
{
    gl_Position = u_proj * a_pos;
    v_color = a_color;
}
