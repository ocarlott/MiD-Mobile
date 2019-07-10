import React from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import { COLOR } from '../Constants';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default (props) => {
    return <View style={[styles.container, {
        width: props.containerWidth | width,
        height: props.containerHeight | height
    }]}>
        <Image source={require('../assets/loader.gif')} style={{
            width: props.loaderWidth | 100,
            height: props.loaderHeight | 100
        }} />
    </View>
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR.PRIMARY
    }
});