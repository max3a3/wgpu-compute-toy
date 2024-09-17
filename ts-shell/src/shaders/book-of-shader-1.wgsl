fn plot(st: vec2<f32>, pct: f32) -> f32 {
	return smoothstep(pct - 0.02, pct, st.y) - smoothstep(pct, pct + 0.02, st.y);
}

@compute @workgroup_size(16, 16)
fn main_image(@builtin(global_invocation_id) id: vec3u) {
    // Viewport resolution (in pixels)
    let screen_size = textureDimensions(screen);

    // Prevent overdraw for workgroups on the edge of the viewport
    if (id.x >= screen_size.x || id.y >= screen_size.y) { return; }

    // Pixel coordinates (centre of pixel, origin at bottom left)
    let fragCoord = vec2f(f32(id.x) + .5, f32(screen_size.y - id.y) - .5);

    // Normalised pixel coordinates (from 0 to 1)
    let st = fragCoord / vec2f(screen_size);


 	let y: f32 = smoothstep(0.1, 0.9, st.x);
	var color: vec3<f32> = vec3<f32>(y);
    let pct: f32 = plot(st, y);
    color = (1. - pct) * color + pct * vec3<f32>(0., 1., 0.);


    // Output to screen (linear colour space)
    textureStore(screen, id.xy, vec4f(color, 1.));
}
