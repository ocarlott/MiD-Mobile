import { StyleSheet } from 'react-native';

export const COLOR = {
    PRIMARY: "#34495E",
    SECONDARY: "#FFF",
    DANGER: "#E74C3C",
    SUCCESS: "#1ABC9C",
    WARNING: "#F39C12"
};

export const SHADOW = StyleSheet.create({
    BUTTON: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 3,
        shadowOpacity: 0.3
    },
    BOX: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 3,
        shadowOpacity: 0.3
    }
});

export const TEXT = StyleSheet.create({
    BOLD: {
        fontFamily: 'IBM Plex Sans SemiBold',
        color: 'white',
        textAlign: 'center'
    },
    LIGHT: {
        fontFamily: 'IBM Plex Sans Light',
        color: 'white',
        textAlign: 'center'
    },
    REGULAR: {
        fontFamily: 'IBM Plex Sans',
        color: 'white',
        textAlign: 'center'
    },
    BOLD_ITATIC: {
        fontFamily: 'IBM Plex Sans SemiBold Italic',
        color: 'white',
        textAlign: 'center'
    },
    LIGHT_ITALIC: {
        fontFamily: 'IBM Plex Sans Light Italic',
        color: 'white',
        textAlign: 'center'
    },
    REGULAR_ITALIC: {
        fontFamily: 'IBM Plex Sans Italic',
        color: 'white',
        textAlign: 'center'
    }
});

export const UUID = {
    AUTH_SERVICE: "aec1"
};