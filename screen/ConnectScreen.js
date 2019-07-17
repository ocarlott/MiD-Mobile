import React from 'react';
import { View, TextInput, Dimensions, Text, Image, TouchableWithoutFeedback, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { COLOR, TEXT, SHADOW, UUID } from '../Constants';
import BleManager, { BleEmitter } from '../services/BLEService';
import { stringToByteArray } from '../services/ByteService';
import Alert from '../components/Alert';

const { width, height } = Dimensions.get('window');
class ConnectScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            connected: false,
            shouldGoBack: false,
            peripheral: null,
            animatedValue: new Animated.Value(0),
            signingIn: false,
            password: "",
            attempsLeft: 5
        }
        this.didFocusSubscription = props.navigation.addListener("didFocus", this.componentDidFocus);
        this.willBlurSubscription = null;
    }

    componentDidFocus = () => {
        BleEmitter.addListener('BleManagerDisconnectPeripheral', this.handleDisconnect);
        Animated.timing(this.state.animatedValue, {
            toValue: 1,
            easing: Easing.back(),
            duration: 300,
        }).start();
        const peripheral = this.props.navigation.getParam('peripheral');
        BleManager.connect(peripheral.id).then(() => {
            BleManager.retrieveServices(peripheral.id).then((pInfo) => {
                this.setState({ peripheral, connected: true });
                BleManager.startNotification(peripheral.id, UUID.AUTH.SERVICE, UUID.AUTH.CHAR).then(() => {
                    BleEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleNotification);
                }).catch(() => {
                    this.setState({ shouldGoBack: true });
                });
            }).catch(() => {
                console.log("Error getting services!");
                this.setState({ shouldGoBack: true });
            })
        }).catch(() => {
            this.setState({ shouldGoBack: true });
        });
        this.didFocusSubscription.remove();
        this.willBlurSubscription = this.props.navigation.addListener("willBlur", this.componentWillBlur);
    }

    componentWillBlur = () => {
        AsyncStorage.getItem("locks").then(str => {
            let locks = [];
            if (str) {
                locks = JSON.parse(str);
            }
            locks[this.state.peripheral.id] = this.state.peripheral;
            AsyncStorage.setItem("locks", JSON.stringify(locks)).then(() => {
                this.props.navigation.navigate("HomeLoadingScreen");
            });
        }).catch(error => {
            console.log(error);
        });
        this.willBlurSubscription.remove();
        this.didFocusSubscription = this.props.navigation.addListener("didFocus", this.componentDidFocus);
    }

    handleDisconnect = (peripheral) => {
        this.setState({ shouldGoBack: true });
    }

    handleNotification = ({ value, peripheral, characteristic, service }) => {
        console.log(peripheral);
        if (peripheral.id == this.state.peripheral.id) {
            console.log(value);
            switch (value) {
                case 1:
                    console.log("Error while bonding!");
                    this.setState({ shouldGoBack: true });
                    break;
                case 2:
                    this.setState({ signingIn: false, attempsLeft: this.state.attempsLeft - 1 });
                    break;
                default:
                    this.props.navigation.navigate("HomeStack", { peripheral: this.state.peripheral });
                    break;
            }
        }
    }

    updatePassword = (text) => {
        this.setState({ password: text });
    }

    signIn = () => {
        console.log(stringToByteArray(this.state.password));
        this.setState({ signingIn: true });
        setTimeout(() => {
            this.handleNotification({ value: this.state.password == "MiD" ? 0 : 2, peripheral: this.state.peripheral });
        }, 1000);
    }

    render() {
        const { container, form, input, logo, btn } = styles;
        const { connected, shouldGoBack, password, animatedValue, signingIn, attempsLeft } = this.state;
        return (
            <View style={container}>
                <Animated.Image source={require('../assets/lock.png')} style={[logo, {
                    transform: [{
                        scale: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 1.5]
                        })
                    }, {
                        translateY: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, 10]
                        })
                    }]
                }]} />
                {!connected ?
                    <Text style={[TEXT.BOLD(24), { textAlign: 'center' }]}>Connecting...</Text> :
                    <View style={form}>
                        <Text style={[TEXT.BOLD(24), { marginBottom: 10 }]}>Please Enter Passcode</Text>
                        <Text style={TEXT.REGULAR(18, COLOR.DANGER)}>You have {attempsLeft} attemps left.</Text>
                        <TextInput secureTextEntry style={input} value={password} onChangeText={this.updatePassword} />
                        <TouchableWithoutFeedback onPress={this.signIn}>
                            <View style={[btn, { backgroundColor: signingIn ? COLOR.CANCEL : COLOR.SUCCESS }]}>
                                <Text style={TEXT.BOLD(20)}>{signingIn ? "Authenticating" : "Sign In"}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                }
                {shouldGoBack ? <Alert pAction={() => this.props.navigation.goBack()} pText={"Go Back"} pColor={COLOR.SUCCESS} message={"Connection is lost!"} /> : null}
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
        height: 40,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        ...SHADOW
    }
}

export default ConnectScreen;