import { atom } from 'jotai';

export const widthAtom = atom<number>(0);
export const heightAtom = atom<number>(0);
export const scaleAtom = atom<number>(1);
export const manualReloadAtom = atom<boolean>(false);
export const isPlayingAtom = atom<boolean>(true);
export const timerAtom = atom<number>(0);
