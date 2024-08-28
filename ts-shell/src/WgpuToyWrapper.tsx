import {useAtom, useSetAtom} from 'jotai';
import {useCallback, useState} from "react";
import {canvasElAtom, wgpuAvailabilityAtom} from "./wgputoyatoms";
import Controller from "./Controller";
// wgputoy.tsx
const WgpuToyWrapper = props => {
    const setCanvasEl = useSetAtom(canvasElAtom);
    const [wgpuAvailability, setWgpuAvailability] = useAtom(wgpuAvailabilityAtom);
    const [loaded, setLoaded] = useState(false);
    const canvasRef = useCallback(async canvas => {
        // there may be a case where we don't have the canvas *yet*
        if (canvas && canvas.getContext('webgpu') && 'gpu' in navigator) {
            const adapter = await navigator.gpu.requestAdapter();
            if (adapter) {
                const device = await adapter.requestDevice();
                if (device) {
                    setWgpuAvailability('available');
                    setCanvasEl(canvas);
                    setLoaded(true);
                } else {
                    debugger // no gpu
                    setWgpuAvailability('unavailable');
                }
            } else {
                debugger // no gpu
                setWgpuAvailability('unavailable');
            }
        } else {
            setWgpuAvailability('unavailable');
        }
    }, []);
    // have to have the id so wasm can init itself
    return (
        <div>
        <canvas width={800} height={600}
                id={"editor-canvas"}
            ref={canvasRef}
        ></canvas>
            {loaded&&<Controller/>}
        </div>
    )
}
export default WgpuToyWrapper