import { writable } from 'svelte/store';

export const onColorChange = writable(()=> {});

/**
 * @codemetatag {doc-scheme-1}
 * @meta {type: function, name: 'showAlertFunction', scope: global}
 * @entity {showAlert}
 */
export const showAlert = writable((alertObj)=> {
    if (alertObj?.msg) {
        console.log(alertObj.msg)
    }
});

