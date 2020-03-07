import React from 'react';
import {
    View, StyleSheet, AsyncStorage, TouchableOpacity, Image, Dimensions
} from 'react-native';
import Display from 'react-native-display';
import { TabIcon } from '../vectoricons/TabIcon';
class AuthenticationScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    async retrieveItem(key) {
        console.log("AuthenticationScreen retrieveItem() key: ", key);
        try {
            const retrievedItem = await AsyncStorage.getItem(key);
            const item = JSON.parse(retrievedItem);
            return item;
        } catch (error) {
            console.log(error.message);
        }
        return
    }

    async storeItem(key, item) {
        console.log("AuthenticationScreen storeItem() key: ", key);
        try {
            var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
            console.log(jsonOfItem);
            return jsonOfItem;
        } catch (error) {
            console.log(error.message);
        }
    }
    checkUserData() {
        console.log('AuthenticationScreen checkUserData()');
        this.retrieveItem('UserData').then((user) => {
            if (user != null) {
                console.log("User is logged in");
                this.props.navigation.navigate('Tabs');
            }
            else {
                console.log("User is not logged in");
                this.props.navigation.navigate('Login');
            }
        }).catch((error) => {
            console.log('Promise is rejected with error: ' + error);
        });
    }

    componentDidMount() {
        this.checkUserData();
    }


    render() {
        return (

            <View style={{ flex: 1 }}>
                <Image source={require('../assets/splash.png')} resizeMode={'contain'} style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }} />
            </View>

        );
    }
}

const styles = StyleSheet.create({

});

export default AuthenticationScreen;