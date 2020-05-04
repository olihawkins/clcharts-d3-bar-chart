/* 
Utilities for making charts in the House of Commons Library style using D3.
*/

/* Add a stylesheet to the document head ----------------------------------- */

function addStylesheet(href, onLoad) {

    // Prevent for adding the same stylesheet twice
    for(let i = 0; i < document.styleSheets.length; i++) {
        if(document.styleSheets[i].href == href) {
            return;
        }
    }

    const head = document.getElementsByTagName("head")[0];
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.type = "text/css";
    link.href = href;
    if (onLoad) { link.onload = () => onLoad(); }
    head.appendChild(link);
}

/* Deep copy an object ----------------------------------------------------- */

function deepCopy(obj) {
    
    let copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepCopy(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (let attr in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, attr)) {
                copy[attr] = deepCopy(obj[attr]);
            }
        }
        return copy;
    }

    throw new Error("Unable to copy object: its type is not supported");
}


/* Exports ----------------------------------------------------------------- */

export {
    addStylesheet,
    deepCopy
};

