import React from 'react';
import { View, Image, Platform, StyleSheet, Text, TouchableWithoutFeedback, PermissionsAndroid, NativeModules, NativeEventEmitter, FlatList } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { COLOR, SHADOW, TEXT, UUID } from '../Constants';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

class PairingScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            locks: new Map(),
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
        if (peripheral.id && !this.state.locks.has(peripheral.id)) {
            let newMap = new Map(this.state.locks.entries());
            newMap.set(peripheral.id, peripheral);
            this.setState({ locks: newMap });
        }
    }

    componentWillUnmount() {
        this.handlerDiscover.remove();
    }

    scanDevice = () => {
        this.setState({ scanning: true });
        BleManager.scan([UUID.AUTH_SERVICE], 6, true);
        setTimeout(() => {
            this.setState({ scanning: false });
        }, 6000);
    }

    keyExtractor = (item, index) => {
        return item.id;
    };

    renderItem = ({ item }) => {
        return <View style={styles.device}>
            <View style={styles.top}>
                <View style={styles.left}>
                    <Text style={[styles.detailFont, { textAlign: 'right', color: COLOR.DANGER }]}>Name:</Text>
                    <Text style={[styles.detailFont, { textAlign: 'right', color: COLOR.DANGER }]}>RSSI:</Text>
                </View>
                <View style={styles.right}>
                    <Text style={[styles.detailFont, { textAlign: 'left', color: 'black' }]}>{item.name}</Text>
                    <Text style={[styles.detailFont, { textAlign: 'left', color: 'black' }]}>{item.rssi}</Text>
                </View>
            </View>
            <TouchableWithoutFeedback onPress={() => {
                this.props.navigation.navigate('connect', item);
            }}>
                <View style={styles.connectBtn}>
                    <Text style={[TEXT.BOLD, { fontSize: 15 }]}>Connect</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    }

    showDevice = () => {
        const { locks } = this.state;
        if (locks.size) {
            return <FlatList data={Array.from(locks.values())} keyExtractor={this.keyExtractor} renderItem={this.renderItem} />
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
    },
    device: {
        backgroundColor: COLOR.SECONDARY,
        alignItems: 'center',
        width: 300,
        height: 170,
        marginTop: 10,
        justifyContent: 'center',
        ...SHADOW.BOX
    },
    connectBtn: {
        height: 50,
        width: 100,
        marginTop: 20,
        backgroundColor: COLOR.PRIMARY,
        justifyContent: 'center',
        ...SHADOW.BUTTON
    },
    detailFont: {
        fontSize: 16,
        marginBottom: 10,
        ...TEXT.REGULAR
    },
    top: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around'
    },
    left: {
        width: 80
    },
    right: {
        width: 150,
        textAlign: 'left'
    }
})

export default PairingScreen;