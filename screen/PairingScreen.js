import React from 'react';
import { View, Image, Platform, StyleSheet, Text, TouchableWithoutFeedback, PermissionsAndroid, NativeModules, NativeEventEmitter, FlatList } from 'react-native';
import { COLOR, SHADOW, TEXT, UUID } from '../Constants';
import BleManager, { BleEmitter } from '../services/BLEService';

class PairingScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            locks: new Map(),
            scanning: false,
            enabled: false
        };
        this.didFocusSubscription = props.navigation.addListener("didFocus", this.componentDidFocus);
        this.willBlurSubscription = null;
    }

    componentDidFocus = () => {
        BleEmitter.addListener('BleManagerDidUpdateState', (args) => {
            this.setState({ enabled: args.state == "on" });
        })
        BleManager.checkState();
        BleEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
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
        this.didFocusSubscription.remove();
        this.willBlurSubscription = this.props.navigation.addListener("willBlur", this.componentWillBlur);
    }

    componentWillBlur = () => {
        if (this.state.scanning) {
            BleManager.stopScan();
        }
        this.willBlurSubscription.remove();
        this.didFocusSubscription = this.props.navigation.addListener("didFocus", this.componentDidFocus);
    }

    handleDiscoverPeripheral = (peripheral) => {
        if (peripheral.id) {
            let newMap = new Map(this.state.locks.entries());
            newMap.set(peripheral.id, peripheral);
            this.setState({ locks: newMap });
        }
    }

    scanDevice = () => {
        this.setState({ scanning: true });
        BleManager.scan([UUID.AUTH.SERVICE], 100, true);
        setTimeout(() => {
            if (this.state.locks.size == 0) {
                BleManager.stopScan();
                this.setState({ scanning: false });
            }
        }, 5000);
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
                this.props.navigation.navigate('ConnectScreen', { peripheral: item });
            }}>
                <View style={styles.connectBtn}>
                    <Text style={TEXT.BOLD(15)}>Connect</Text>
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
                return <Text style={TEXT.BOLD(20)}>Searching...</Text>
            } else {
                return <View>
                    <Text style={TEXT.REGULAR(16, COLOR.DANGER)}>Please make sure the lock is powered!</Text>
                    <TouchableWithoutFeedback onPress={this.scanDevice}>
                        <View style={styles.scanBtn}>
                            <Text style={TEXT.BOLD(25)}>Find My Device</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    {/* <TouchableWithoutFeedback onPress={() => {
                        this.props.navigation.navigate('ConnectScreen');
                    }}>
                        <View style={styles.connectBtn}>
                            <Text style={TEXT.BOLD(15)}>Connect</Text>
                        </View>
                    </TouchableWithoutFeedback> */}
                </View>
            }
        }
    }

    render() {
        const { container, logo } = styles;
        return <View style={container}>
            <Image source={require('../assets/lock.png')} style={logo} />
            {this.state.enabled ? this.showDevice() : <Text style={TEXT.REGULAR(22, COLOR.DANGER)}>Please turn on bluetooth on your phone!</Text>}
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
        width: 60,
        height: 60,
        marginBottom: 40
    },
    scanBtn: {
        marginTop: 30,
        height: 50,
        backgroundColor: COLOR.SUCCESS,
        justifyContent: 'center',
        ...SHADOW
    },
    device: {
        backgroundColor: COLOR.SECONDARY,
        alignItems: 'center',
        width: 300,
        height: 170,
        marginTop: 10,
        justifyContent: 'center',
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
    detailFont: {
        marginBottom: 10,
        ...TEXT.REGULAR(16)
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