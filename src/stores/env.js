import { writable } from 'svelte/store';


export const vizState = writable({
    'freeze': false
}); 

export const viz_state = writable({
    'freeze': false
}); 

/**
 * @codemetatag {doc-scheme-1}
 * @meta {type: object, name: 'guiStore', scope: global}
 * @entity {gui}
 */
export const gui = writable({
    'items': null,
    'folders': {},
    'overlay_visible': false,
    'overlay_fading': null
});

/**
 * @codemetatag {doc-scheme-1}
 * @meta {type: object, name: 'interfaceStore', scope: global}
 * @entity {interfaceDialog}
 */
export const interface_state = writable({
    'text_modal_visible': null,
    'text_modal_content': 'No Content to Display',
    'text_modal_content_type': 'default',
    'text_modal_title': 'This is a text/data display modal',
    'alert_rect': {
        'visible': false,
        'content': 'This is an alert rectangle!',
        'type': 'success' // success/failure/exclamation
    }
}); 
