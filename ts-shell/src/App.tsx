import Controller from "./Controller";
import WgpuToyWrapper from "./WgpuToyWrapper";
import {useCallback} from "react";
import {useSetAtom} from "jotai";
import {canvasParentElAtom} from "./wgputoyatoms";

export default function App() {
    const setCanvasParentEl = useSetAtom(canvasParentElAtom); //todo doc what's for
    const renderParentNodeRef = useCallback(parent => {
        if (parent) {
            setCanvasParentEl(parent);
        }
    }, []);
    return (
        <div ref={renderParentNodeRef}>
            <div>app</div>
            <WgpuToyWrapper/>
        </div>
    )
}