import React from 'react';
import { View, Text, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { COLOR, TEXT } from '../Constants';
const { width, height } = Dimensions.get('window');

export default (props) => {
    const { container, btnArea, sBtn, pBtn, msg, screen, bg } = styles;
    return <View style={screen}>
        <View style={bg} />
        <View style={container}>
            <Text style={msg}>{props.message}</Text>
            <View style={btnArea}>
                {props.sAction ? <TouchableWithoutFeedback onPress={() => props.sAction()}>
                    <View style={sBtn}>
                        <Text style={TEXT.BOLD(16)}>{props.sText || "Cancel"}</Text>
                    </View>
                </TouchableWithoutFeedback> : null}
                <TouchableWithoutFeedback onPress={() => props.pAction()}>
                    <View style={[pBtn, {
                        width: props.sAction ? 150 : 300,
                        backgroundColor: props.pColor || COLOR.SUCCESS
                    }]}>
                        <Text style={TEXT.BOLD(16)}>{props.pText}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    </View>
}

const styles = {
    screen: {
        width,
        height,
    },
    bg: {
        width,
        height,
        backgroundColor: 'black',
        opacity: 0.6,
        position: 'absolute',
        top: 0,
        left: 0
    },
    container: {
        width: 300,
        height: 200,
        backgroundColor: 'white',
        position: 'absolute',
        left: (width - 300) / 2,
        top: (height - 200) / 2
    },
    btnArea: {
        width: 300,
        position: 'absolute',
        height: 50,
        flexDirection: 'row',
        left: 0,
        bottom: 0
    },
    sBtn: {
        width: 150,
        backgroundColor: COLOR.CANCEL,
        alignItems: 'center',
        justifyContent: 'center'
    },
    pBtn: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    msg: {
        ...TEXT.BOLD(18, 'black'),
        marginTop: 30,
        marginLeft: 20,
        marginRight: 20
    }
}