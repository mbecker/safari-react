const rclass = '/[\t\r\n\f]/g';

export function getClass(elem) {
    return elem.getAttribute && elem.getAttribute("class") || "";
}

export function hasClass(el, selector) {
    var className = " " + selector + " ";

    if ((" " + el.className + " ").replace(rclass, " ").indexOf(className) > -1) {
        return true;
    }


    return false;
}

export function toggle(element, klass) {
    var classes = element.className.match(/\S+/g) || [],
        index = classes.indexOf(klass);

    index >= 0 ? classes.splice(index, 1) : classes.push(klass);
    element.className = classes.join(' ');
}
