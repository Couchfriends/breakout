/**
 * IE 5.5+, Firefox, Opera, Chrome, Safari XHR object
 *
 * @param string url
 * @param object callback
 * @param mixed data
 * @param string responseType type of the request, e.g. text or arraybuffer
 */
function ajax(url, callback, data, responseType) {
    var x;
    if (responseType == null) {
        responseType = 'text';
    }
    try {
        x = new (this.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
        x.open(data ? 'POST' : 'GET', url, 1);
        x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        x.responseType = responseType;
        x.onreadystatechange = function () {
            if (x.readyState == 4 && (x.status == 200 || x.status == 0)) {
                callback(x.response, x);
            }
        };
        x.send(data)
    } catch (e) {
        window.console && console.log(e);
    }
}