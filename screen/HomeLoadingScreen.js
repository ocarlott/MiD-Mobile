import React from 'react';
// import { AsyncStorage } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';

class HomeLoadingScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setTimeout(this._bootstrapAsync, 1000);
    }

    _bootstrapAsync = async () => {
        AsyncStorage.getItem("locks").then(str => {
            if (str) {
                let locks = JSON.parse(str);
                this.props.navigation.navigate("HomeStack");
            } else {
                this.props.navigation.navigate("PairingStack");
            }
        }).catch(error => {
            console.log(error);
        })
    }

    render() {
        return <LottieView source={require('../assets/loader.json')} autoPlay loop />;
    }
}

export default HomeLoadingScreen;