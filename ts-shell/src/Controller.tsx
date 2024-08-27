import {
    canvasElAtom,
    canvasParentElAtom,
    getDimensions,
    isSafeContext,
    wgpuAvailabilityAtom,
    wgputoyAtom
} from './wgputoyatoms';
import {useCallback, useState} from "react";
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useTransientAtom } from 'jotai-game';
import {heightAtom, scaleAtom, widthAtom} from "./atoms";
import useResizeObserver from "@react-hook/resize-observer";


const halfResolution = false
// wgputoycontroller.tsx
export default function Controller() {
    const wgputoy = useAtomValue(wgputoyAtom);
    const [width, setWidth] = useTransientAtom(widthAtom);
    const [scale, setScale] = useTransientAtom(scaleAtom);
    const [, setHeight] = useTransientAtom(heightAtom);
    const canvas = useAtomValue(canvasElAtom); // set by wgputoywrapper
    const updateResolution = () => {
        debugger
        if (isSafeContext(wgputoy)) {
            let dimensions = { x: 0, y: 0 }; // dimensions in device (physical) pixels

            // not embed, not full window
            const padding = 16;
            dimensions = getDimensions(
                (parentRef.offsetWidth - padding) * window.devicePixelRatio
            );

            const newScale = halfResolution ? 0.5 : 1;
            if (dimensions.x !== width() || newScale !== scale()) {
                setWidth(dimensions.x);
                setHeight(dimensions.y);
                setScale(newScale);
                wgputoy.resize(dimensions.x, dimensions.y, newScale);
                debugger
                //                reloadCallback();  // load the source
            }
            debugger
            if (canvas) {
                canvas.width = dimensions.x;
                canvas.height = dimensions.y;
                canvas.style.width = `${dimensions.x / window.devicePixelRatio}px`;
                canvas.style.height = `${dimensions.y / window.devicePixelRatio}px`;
            }
        }
    };
    const parentRef = useAtomValue<HTMLElement | null>(canvasParentElAtom);
    useResizeObserver(parentRef, updateResolution);
    return (null)
}