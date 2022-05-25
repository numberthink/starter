import { writable, derived } from 'svelte/store';

/** @name {vizStateStore}
	@start {vizStateStore} */
export const vizState = writable({
    freeze: false,
    active: true
})
/** @end {vizStateStore} */