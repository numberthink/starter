import { writable } from 'svelte/store';

export const viz_state = writable({
    'freeze': false
}); 

