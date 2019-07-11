import { StyleSheet } from 'react-native';

export const COLOR = {
    PRIMARY: "#34495E",
    SECONDARY: "#FFF",
    DANGER: "#E74C3C",
    SUCCESS: "#1ABC9C",
    WARNING: "#F39C12",
    CANCEL: "#404040"
};

export const SHADOW = {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 3,
    shadowOpacity: 0.3
};

export const TEXT = {
    BOLD: (size, color = 'white') => ({
        fontFamily: 'IBM Plex Sans SemiBold',
        color: color,
        textAlign: 'center',
        fontSize: size
    }),
    LIGHT: (size, color = 'white') => ({
        fontFamily: 'IBM Plex Sans Light',
        color: color,
        textAlign: 'center',
        fontSize: size
    }),
    REGULAR: (size, color = 'white') => ({
        fontFamily: 'IBM Plex Sans',
        color: color,
        textAlign: 'center',
        fontSize: size
    }),
    BOLD_ITATIC: (size, color = 'white') => ({
        fontFamily: 'IBM Plex Sans SemiBold Italic',
        color: color,
        textAlign: 'center',
        fontSize: size
    }),
    LIGHT_ITALIC: (size, color = 'white') => ({
        fontFamily: 'IBM Plex Sans Light Italic',
        color: color,
        textAlign: 'center',
        fontSize: size
    }),
    REGULAR_ITALIC: (size, color = 'white') => ({
        fontFamily: 'IBM Plex Sans Italic',
        color: color,
        textAlign: 'center',
        fontSize: size
    })
};

export const UUID = {
    AUTH_SERVICE: "aec1"
};