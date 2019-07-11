import React from 'react';
import { View, TextInput, Dimensions, Text, Image, TouchableWithoutFeedback } from 'react-native';
import { COLOR, TEXT, SHADOW } from '../Constants';
import BleManager, { BleEmitter } from '../services/BLEService';
import Alert from '../components/Alert';

class ConnectScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            connected: false,
            shouldGoBack: false
        }
    }

    componentDidMount() {
        // const peripheral = this.props.navigation.getParam('peripheral');
        // BleManager.connect(peripheral.id).then(() => {
        //     console.log("Connected!");
        // }).catch(() => {
        //     this.setState({ shouldGoBack: true })
        // });
    }

    render() {
        const { container, form, input, logo, btn } = styles;
        return (
            <View style={container}>
                <Image source={require('../assets/lock.png')} style={logo} />
                {!this.state.connected ?
                    <Text style={[TEXT.BOLD(24), { textAlign: 'center' }]}>Connecting...</Text> :
                    <View style={form}>
                        <Text style={[TEXT.BOLD(24), { marginBottom: 10 }]}>Please Enter Passcode</Text>
                        <Text style={TEXT.REGULAR(18, COLOR.DANGER)}>You have 5 attemps left.</Text>
                        <TextInput secureTextEntry style={input} />
                        <TouchableWithoutFeedback>
                            <View style={btn}>
                                <Text style={TEXT.BOLD(22)}>Authenticate</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                }
                {this.state.shouldGoBack ? <Alert pAction={() => this.props.navigation.goBack()} pText={"Go Back"} pColor={COLOR.SUCCESS} message={"Could not connect to the device!"} /> : null}
            </View>
        )
    }
}

const styles = {
    container: {
        backgroundColor: COLOR.PRIMARY,
        paddingTop: 100,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center',
        flex: 1
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 40
    },
    form: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        width: 240,
        height: 40,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 30,
        backgroundColor: COLOR.SECONDARY
    },
    btn: {
        backgroundColor: COLOR.SUCCESS,
        height: 40,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        ...SHADOW
    }
}

export default ConnectScreen;