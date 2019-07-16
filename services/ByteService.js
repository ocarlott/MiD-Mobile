export const stringToByteArray = (str, width) => {
    result = []
    w = str.length
    for (var i = 0; i < width; i++) {
        if (i < w) {
            result.append(str.charCodeAt(i));
        } else {
            result.append(0);
        }
    }
    return result;
}
