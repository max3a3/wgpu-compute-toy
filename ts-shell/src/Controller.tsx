import {
    canvasElAtom,
    canvasParentElAtom,
    getDimensions,
    isSafeContext,
    wgpuAvailabilityAtom,
    wgputoyAtom, wgputoyPreludeAtom
} from './wgputoyatoms';
import {useCallback, useEffect, useState} from "react";
import {atom, useAtom, useAtomValue, useSetAtom} from 'jotai';
import {useTransientAtom} from 'jotai-game';
import {heightAtom, isPlayingAtom, manualReloadAtom, scaleAtom, timerAtom, widthAtom} from "./atoms";
import useResizeObserver from "@react-hook/resize-observer";
import geometryShader from "./shaders/geometry.wgsl"
import useAnimationFrame from 'use-animation-frame';

const halfResolution = false
// wgputoycontroller.tsx
export default function Controller() {
    const wgputoy = useAtomValue(wgputoyAtom);
    const [width, setWidth] = useTransientAtom(widthAtom);
    const [scale, setScale] = useTransientAtom(scaleAtom);
    const [, setHeight] = useTransientAtom(heightAtom);
    const canvas = useAtomValue(canvasElAtom); // set by wgputoywrapper
    const [, setPrelude] = useAtom(wgputoyPreludeAtom);

    const [manualReload, setManualReload] = useTransientAtom(manualReloadAtom);
    const [isPlaying, setIsPlaying] = useTransientAtom(isPlayingAtom);
    const [timer, setTimer] = useTransientAtom(timerAtom);
        const updateUniforms = useCallback(`z` () => {
        if (isSafeContext(wgputoy)) {
            /* NOT YET
            const names: string[] = [];
            const values: number[] = [];
            [...sliderRefMap().keys()].map(uuid => {
                names.push(sliderRefMap().get(uuid).getUniform());
                values.push(sliderRefMap().get(uuid).getVal());
            }, this);
            if (names.length > 0) {
                await wgputoy.set_custom_floats(names, Float32Array.from(values));
            }
            setSliderUpdateSignal(false);

             */
        }
    }, []);
    const reloadCallback = useCallback(() => {
        updateUniforms().then(() => {
            if (isSafeContext(wgputoy)) {
                let filename = window.ENV_FLAGS.shaderFile ?? "geometry"
                import (`./shaders/${filename}.wgsl`).then(geometryShaderModule => {
                    const geometryShader = geometryShaderModule.default
                wgputoy.preprocess(geometryShader).then(s => {
                    if (s) {
                        console.log(`compiling, should just do it once?`)
                        wgputoy.compile(s);
                        setPrelude(wgputoy.prelude()); // export engine prelude info to js
                        wgputoy.render();
                    }
                });
                setManualReload(false);
            })
            }
        });
    }, []);
    const handleSuccess = useCallback(entryPoints => {
        // not doing anything
        // setEntryPoints(entryPoints);
    }, [])
    const liveReloadCallback = useCallback(() => {
        if (manualReload()) { // if there is trigger
            reloadCallback();
        }
    },[])
    useEffect(() => {
        if (isSafeContext(wgputoy)) {
            wgputoy.on_success(handleSuccess);
        }
    }, []);

    const updateResolution = () => {
        if (isSafeContext(wgputoy)) {
            let dimensions = {x: 0, y: 0}; // dimensions in device (physical) pixels

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
                reloadCallback();  // reload the shader
            }
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


    useAnimationFrame(e => {
        if (isSafeContext(wgputoy)) {
            // TODO custom uniform handling not yet
            // if (sliderUpdateSignal()) {
            //     updateUniforms().then(() => {
            //         liveReloadCallback();
            //     });
            // } else {
                liveReloadCallback();// check if there is manualReload trigger

            if (isPlaying() || manualReload()) {
                let t = timer();
                if (!manualReload()) {
                    t += e.delta;
                }
                setTimer(t);
                wgputoy.set_time_elapsed(t);
                wgputoy.set_time_delta(e.delta);
                wgputoy.render();
            }
        }
    })
    return (null)
}