import { isServer } from 'utils/helpers/isServer';

export function detectTouch() {
    if (isServer) return false;

    return window.ontouchstart === null && window.ontouchmove === null && window.ontouchend === null;
}
