import BleManager from 'react-native-ble-manager';
import { NativeModules, NativeEventEmitter } from 'react-native';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

BleManager.start({ showAlert: false })
    .then(() => {
        // Success code
        console.log('Module initialized');
    });

export default BleManager;
export const BleEmitter = bleManagerEmitter;