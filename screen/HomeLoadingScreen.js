import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';
import { View } from 'react-native';
import { COLOR } from '../Constants';

class HomeLoadingScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setTimeout(this._bootstrapAsync, 1000);
        // AsyncStorage.removeItem("locks");
    }

    _bootstrapAsync = async () => {
        let locks = [];
        locks[0] = { id: "abde", name: "MiD-0000001" };
        locks[1] = { id: "abce", name: "MiD-0000002" };
        this.props.navigation.navigate("HomeScreen", { locks });
        // AsyncStorage.getItem("locks").then(str => {
        //     if (str) {
        //         let locks = JSON.parse(str);
        //         if (locks.size == 0) {
        //             this.props.navigation.navigate("PairingStack");
        //         } else {
        //             this.props.navigation.navigate("HomeScreen", { locks });
        //         }
        //     } else {
        //         this.props.navigation.navigate("PairingStack");
        //     }
        // }).catch(error => {
        //     console.log(error);
        // });
    }

    render() {
        return <View style={styles.container}>
            <LottieView source={require('../assets/loader.json')} autoPlay loop />
        </View>;
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
    }
}

export default HomeLoadingScreen;