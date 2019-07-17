import React from 'react';
import { View, Image, Dimensions, Text, TouchableWithoutFeedback, FlatList } from 'react-native';
import { COLOR, TEXT, SHADOW } from '../Constants';
import BleManager, { BleEmitter } from '../services/BLEService';

const { width, height } = Dimensions.get('window');
class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            locks: null,
        }
        this.didFocusSubscription = props.navigation.addListener("didFocus", this.componentDidFocus);
        this.willBlurSubscription = null;
        this.timer = null;
    }

    componentDidFocus = () => {
        let locks = this.props.navigation.getParam("locks");
        for (let lock of locks) {
            lock.connected = false;
        }
        locks[0].connected = true;
        this.setState({ locks });
        this.didFocusSubscription.remove();
        this.willBlurSubscription = this.props.navigation.addListener("willBlur", this.componentWillBlur);
    }

    componentWillBlur = () => {
        this.willBlurSubscription.remove();
        this.didFocusSubscription = this.props.navigation.addListener("didFocus", this.componentDidFocus);
    }

    keyExtractor = (item, index) => item.id;

    renderItem = ({ item }) => {
        const { card, setupBtn } = styles;
        return <View style={card}>
            <Text style={[TEXT.BOLD(20, 'black'), { marginBottom: 5 }]}>{item.name}</Text>
            {item.connected ? <Text style={TEXT.REGULAR(13, COLOR.SUCCESS)}>Connected</Text> : <Text style={TEXT.REGULAR(13, COLOR.DANGER)}>Disconnected</Text>}
            {item.connected ? <TouchableWithoutFeedback><View style={setupBtn}>
                <Text style={TEXT.BOLD(20)}>Setup</Text>
            </View></TouchableWithoutFeedback> : null}
        </View>
    }

    render() {
        const { container, top, bottom } = styles;
        return <View style={container}>
            <View style={top}>
                <Text style={[TEXT.BOLD(30, 'black'), { textAlign: 'left' }]}>Hello!</Text>
            </View>
            <View style={bottom}>
                {this.state.locks && this.state.locks.length != 0 ? <FlatList data={this.state.locks} keyExtractor={this.keyExtractor} renderItem={this.renderItem} /> : null}
            </View>
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