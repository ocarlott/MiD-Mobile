import React from 'react';
import { View, TextInput, Dimensions, Text, Image, TouchableWithoutFeedback, Animated, Easing } from 'react-native';
import { COLOR, TEXT, SHADOW, UUID } from '../Constants';
import BleManager, { BleEmitter } from '../services/BLEService';
import Alert from '../components/Alert';

const { width, height } = Dimensions.get('window');
class ConnectScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            connected: false,
            shouldGoBack: false,
            peripheral: null,
            animatedValue: new Animated.Value(0)
        }
        this.handlerDisconnect = null;
        this.handlerNotification = null;
    }

    componentDidMount() {
        this.handlerDisconnect = BleEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnect);
        Animated.timing(this.state.animatedValue, {
            toValue: 1,
            easing: Easing.back(),
            duration: 300,
        }).start();
        const peripheral = this.props.navigation.getParam('peripheral');
        BleManager.connect(peripheral.id).then(() => {
            BleManager.retrieveServices(peripheral.id).then((pInfo) => {
                console.log("pInfo: ", pInfo);
                BleManager.startNotification(peripheral.id, UUID.AUTH.SERVICE, UUID.AUTH.CHAR).then(() => {
                    this.handlerNotification = BleEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleNotification);
                    this.setState({ peripheral });
                }).catch(() => {
                    this.setState({ shouldGoBack: true });
                });
            }).catch(() => {
                console.log("Error getting services!");
                this.setState({ shouldGoBack: true });
            })
            this.setState({ connected: true });
        }).catch(() => {
            this.setState({ shouldGoBack: true });
        });
    }

    handleDisconnect = (peripheral) => {
        this.setState({ shouldGoBack: true });
    }

    handleNotification = ({ value, peripheral, characteristic, service }) => {
        if (peripheral.id == this.state.peripheral.id) {
            if (characteristic == UUID.AUTH.CHAR) {
                console.log(value);
                switch (value) {
                    case 1:
                        break;
                    case 2:
                        break;
                    case 0:
                        break;
                    default:
                        break;
                }
            }
        }
    }

    componentWillUnmount() {
        BleEmitter.removeAllListeners();
    }

    render() {
        const { container, form, input, logo, btn } = styles;
        return (
            <View style={container}>
                <Animated.Image source={require('../assets/lock.png')} style={[logo, {
                    transform: [{
                        scale: this.state.animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.5]
                        })
                    }, {
                        translateY: this.state.animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 10]
                        })
                    }]
                }]} />
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
                {this.state.shouldGoBack ? <Alert pAction={() => this.props.navigation.goBack()} pText={"Go Back"} pColor={COLOR.SUCCESS} message={"Connection is lost!"} /> : null}
            </View>
        )
    }
}

const styles = {
    container: {
        backgroundColor: COLOR.PRIMARY,
        paddingTop: 250,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center',
        flex: 1
    },
    logo: {
        width: 60,
        height: 60,
        top: 100,
        position: 'absolute',
        left: (width - 60) / 2
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