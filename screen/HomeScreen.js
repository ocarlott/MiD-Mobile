import React from 'react';
import { View, Image, Dimensions, Text, TouchableWithoutFeedback, FlatList } from 'react-native';
import { COLOR, TEXT, SHADOW } from '../Constants';

const { width, height } = Dimensions.get('window');
class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            locks: []
        }
    }

    keyExtractor = (item, index) => item.id;

    renderItem = () => {

    }

    render() {
        const { container, top, bottom, card, connectBtn, setupBtn } = styles;
        return <View style={container}>
            <View style={top}>
                <Text style={[TEXT.BOLD(30, 'black'), { textAlign: 'left' }]}>Hello!</Text>
            </View>
            {this.state.locks.length == 0 ? <View /> :
                <FlatList style={bottom} data={this.state.locks} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />}
        </View>
    }
}

const styles = {
    container: {
    },
    top: {
        height: 160,
        backgroundColor: COLOR.WARNING,
        paddingTop: 80,
        paddingLeft: 20
    },
    bottom: {
        height: height - 160,
        backgroundColor: COLOR.PRIMARY,
        alignItems: 'center',
        paddingTop: 20
    },
    card: {
        width: width - 40,
        paddingTop: 30,
        paddingBottom: 30,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOR.SECONDARY,
        ...SHADOW
    },
    connectBtn: {
        height: 50,
        width: 100,
        marginTop: 20,
        backgroundColor: COLOR.PRIMARY,
        justifyContent: 'center',
        ...SHADOW
    },
    setupBtn: {
        height: 50,
        width: 100,
        marginTop: 20,
        backgroundColor: COLOR.SUCCESS,
        justifyContent: 'center',
        ...SHADOW
    }
}

export default Home;