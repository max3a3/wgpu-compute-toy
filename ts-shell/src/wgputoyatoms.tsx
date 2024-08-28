import { atom } from 'jotai';
import { create_renderer, WgpuToyRenderer } from '../lib/wgputoy';
type WgpuStatus = 'available' | 'unavailable' | 'unknown';
interface Dimensions {
    x: number;
    y: number;
}

export const getDimensions = (parentWidth: number): Dimensions => {
    const baseIncrement = Math.max(Math.floor(parentWidth / 32), 1);
    return { x: baseIncrement * 32, y: baseIncrement * 18 };
};

declare module 'lib/wgputoy' {
    interface WgpuToyRenderer {
        __wbg_ptr: number;
    }
}
const isSSR = false
export const canvasElAtom = atom<HTMLCanvasElement | false>(false);
export const wgpuAvailabilityAtom = atom<WgpuStatus>('unknown');
const canvasParentElBaseAtom = atom<HTMLElement | false>(false);


export const wgputoyAtom = atom<Promise<WgpuToyRenderer | false>>(async get => {
    if (!isSSR && get(canvasElAtom) !== false && get(canvasParentElAtom)) {
        const parentEl = get(canvasParentElAtom);
        const dim = getDimensions(parentEl.offsetWidth * window.devicePixelRatio);
        return create_renderer(800,600, (get(canvasElAtom) as HTMLCanvasElement).id);
        // return create_renderer(dim.x, dim.y, (get(canvasElAtom) as HTMLCanvasElement).id);
    } else {
        return false;
    }
});
export const isSafeContext = (context: WgpuToyRenderer | false): context is WgpuToyRenderer =>
    context !== false && context.__wbg_ptr !== 0;

export const canvasParentElAtom = atom<HTMLElement | null, [HTMLElement | null], void>(
    get => {
        const target = get(canvasParentElBaseAtom);
        return target ? target : null;
    },
    (get, set, newValue) => set(canvasParentElBaseAtom, newValue ? newValue : false)
);
export const wgputoyPreludeAtom = atom<string>('');
