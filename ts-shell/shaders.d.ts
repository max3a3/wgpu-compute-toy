declare module '*.glsl?raw' {
    const content: string;
    export default content;
}
declare module '*.glsl' {
    const content: string;
    export default content;
}
declare module '*.wgsl' {
    const content: string;
    export default content;
}