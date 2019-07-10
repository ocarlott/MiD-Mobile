import React from 'react';
import { View, Image, Platform, StyleSheet, Text, TouchableWithoutFeedback, PermissionsAndroid, NativeModules, NativeEventEmitter } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { COLOR, SHADOW, TEXT } from '../Constants';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

class PairingScreen extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            lock: null,
            scanning: false,
        };
        this.handlerDiscover = null;
    }

    componentDidMount() {
        BleManager.start({ showAlert: false })
            .then(() => {
                // Success code
                console.log('Module initialized');
            });
        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (!result) {
                    PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                        if (result) {
                            console.log("User acceptted");
                        } else {
                            console.log("User refused");
                        }
                    });
                }
            });
        }
        this.scanDevice();
    }

    handleDiscoverPeripheral = (peripheral) => {
        console.log(peripheral);
    }

    componentWillUnmount() {
        this.handlerDiscover.remove();
    }

    scanDevice = () => {
        this.setState({ scanning: true });
        BleManager.scan(["9e124dde-2782-4173-88af-53ff143fec1"], 5, true).then((results) => {
            console.log('Scanning...');
        });
        setTimeout(() => {
            BleManager.getDiscoveredPeripherals([]).then(pArr => this.setState({ lock: pArr[0] }));
            this.setState({ scanning: false });
        }, 5000);
    }

    showDevice = () => {
        if (this.state.lock) {
            return <Text>{JSON.stringify(this.state.lock)}</Text>
        } else {
            if (this.state.scanning) {
                return <Text style={[TEXT.BOLD, { fontSize: 20 }]}>Searching...</Text>
            } else {
                return <View>
                    <Text style={[TEXT.REGULAR, { color: COLOR.DANGER, fontSize: 16 }]}>Please make sure the lock is powered!</Text>
                    <TouchableWithoutFeedback onPress={this.scanDevice}>
                        <View style={styles.scanBtn}>
                            <Text style={[TEXT.BOLD, { fontSize: 28 }]}>Scan</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            }
        }
    }

    render() {
        const { container, logo } = styles;
        return <View style={container}>
            <Image source={require('../assets/lock.png')} style={logo} />
            {this.showDevice()}
        </View>
    }
}

const styles = StyleSheet.create({
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
    scanBtn: {
        marginTop: 30,
        height: 50,
        backgroundColor: COLOR.SUCCESS,
        justifyContent: 'center',
        ...SHADOW.BUTTON
    }
})

export default PairingScreen;