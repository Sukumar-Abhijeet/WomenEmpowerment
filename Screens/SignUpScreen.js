import React from 'react';
import {
    View, StyleSheet, AsyncStorage, TouchableOpacity, Text, ImageBackground, ScrollView, ToastAndroid, ActivityIndicator,
} from 'react-native';
import Display from 'react-native-display';
import { TabIcon } from '../vectoricons/TabIcon';
import { TextField } from 'react-native-material-textfield';
import Global from '../Urls/Global';

const BASEPATH = Global.BASE_PATH;
//import transLanguage from './GoogleTranslator';
class SignUpScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
            networkRequest: false,
            loader: false,
            number: '',
            name: '',
            email: '',
            address: '',
            password: '',
        }
    }

    async retrieveItem(key) {
        console.log("SignUpScreen retrieveItem() key: ", key);
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
        console.log("SignUpScreen storeItem() key: ", key);
        try {
            var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
            console.log(jsonOfItem);
            return jsonOfItem;
        } catch (error) {
            console.log(error.message);
        }
    }
    signUp() {
        console.log("SignUpScreen signUp()");
        if (this.state.number == "" || this.state.name == "" || this.state.email == "" || this.state.password == "" || this.state.address == "") {
            ToastAndroid.show("Please fill all fields", ToastAndroid.SHORT);
        }
        else {
            this.setState({ loader: true })
            let formValue = JSON.stringify({
                'number': this.state.number,
                'name': this.state.name,
                'email': this.state.email,
                'address': this.state.address,
                'password': this.state.password,
                'reqFrom': 'UserApp'
            });
            console.log(" CHECK_SIGNUP_URL FormValue : ", formValue, BASEPATH + Global.CHECK_SIGNUP_URL);
            fetch(BASEPATH + Global.CHECK_SIGNUP_URL,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: formValue
                }).then((response) => response.json()).then((responseData) => {
                    if (responseData.Success == 'Y') {
                        console.log("LoginResponse : ", responseData);
                        this.setState({ loader: false })
                        // this.storeItem('UserData', responseData.UserData);
                        // this.setState({ loader: false })
                        // this.props.navigation.navigate('Tabs');
                    }
                    else if (responseData.Success == 'N') {
                        ToastAndroid.show('Invalid Credentials', ToastAndroid.SHORT);
                        this.setState({ loader: false })
                    }
                    else {
                        this.setState({ loader: false })
                        ToastAndroid.show('Something went wrong, try again.', ToastAndroid.SHORT);
                    }
                }).catch((error) => {
                    console.log('Promise is rejected with error: ' + error);
                    this.setState({ loader: false })
                    //this.setState({ networkRequest: true, loader: false })
                    ToastAndroid.show('Network Error.', ToastAndroid.SHORT);
                });
        }

    }

    render() {
        return (

            <View style={styles.mainContainer}>
                <ImageBackground style={{ width: '100%', height: '100%' }} source={require('../assets/Backgrounds/signupBack.jpg')} resizeMode={'cover'}>
                    <Display enable={!this.state.networkRequest} style={{ flex: 1, paddingHorizontal: 10 }}>
                        <View style={{ marginTop: 50, flex: 1 }}>
                            <Text style={{ fontSize: 30, fontWeight: '300' }}>Sign Up</Text>
                            <Text style={{ fontSize: 10, color: '#aaa7a7', marginTop: 6 }}>As we lose ourselves in the service of others, we discover our own lives and our own happiness</Text>
                        </View>
                        <View style={{ flex: 4 }}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <TextField
                                    label="Mobile Number"
                                    editable={true}
                                    value={this.state.number}
                                    placeholderTextColor="#fff"
                                    underlineColorAndroid='transparent'
                                    returnKeyType="next"
                                    keyboardType="default"
                                    autoCorrect={false}
                                    autoCapitalize='none'
                                    onChangeText={(number) => this.setState({ number })}
                                    ref={component => this._phoneInput = component}
                                    onSubmitEditing={() => { this.nameInput.focus(); }}
                                />
                                <TextField
                                    label="Name"
                                    placeholderTextColor="#fff"
                                    underlineColorAndroid='transparent'
                                    returnKeyType="next"
                                    keyboardType="default"
                                    autoCorrect={false}
                                    autoCapitalize='none'
                                    onChangeText={(name) => this.setState({ name })}
                                    ref={(input) => { this.nameInput = input; }}
                                    onSubmitEditing={() => { this.emailInput.focus(); }}
                                />
                                <TextField
                                    label="Email"
                                    placeholderTextColor="#fff"
                                    underlineColorAndroid='transparent'
                                    returnKeyType="next"
                                    keyboardType="default"
                                    autoCorrect={false}
                                    autoCapitalize='none'
                                    onChangeText={(email) => this.setState({ email })}
                                    ref={(input) => { this.emailInput = input; }}
                                    onSubmitEditing={() => { this.addressInput.focus(); }}
                                />
                                <TextField
                                    label="Permanent Address"
                                    placeholderTextColor="#fff"
                                    underlineColorAndroid='transparent'
                                    returnKeyType="go"
                                    keyboardType="default"
                                    autoCorrect={false}
                                    autoCapitalize='none'
                                    onChangeText={(address) => this.setState({ address })}
                                    ref={(input) => { this.addressInput = input; }}
                                    onSubmitEditing={() => { this.passwordInput.focus(); }}
                                />
                                <TextField
                                    label="Password"
                                    placeholderTextColor="#fff"
                                    underlineColorAndroid='transparent'
                                    returnKeyType="go"
                                    keyboardType="default"
                                    autoCorrect={false}
                                    autoCapitalize='none'
                                    secureTextEntry={true}
                                    onChangeText={(password) => this.setState({ password })}
                                    ref={(input) => { this.passwordInput = input; }}
                                    onSubmitEditing={() => { this.signUp(); }}
                                />

                            </ScrollView>
                        </View>
                        <View style={{ flex: 3 }}>
                            <TouchableOpacity style={{ alignSelf: 'center', backgroundColor: '#d81e5b', borderRadius: 25, padding: 10, width: 120, height: 40, justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.signUp() }}>
                                <Display enable={!this.state.loader}>
                                    <Text style={{ color: '#fff', fontWeight: '400' }}>SIGNUP</Text>
                                </Display>
                                <Display enable={this.state.loader}>
                                    <ActivityIndicator size={"small"} color="#fff" />
                                </Display>
                            </TouchableOpacity>
                            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', padding: 15 }}>
                                <Text style={{ fontSize: 10, fontWeight: '600', color: '#000' }}>Already have an account?</Text>
                                <TouchableOpacity onPress={() => { this.props.navigation.navigate('Login') }}>
                                    <Text style={{ color: '#0049bf', marginLeft: 5, fontWeight: '400' }}>Login</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Display>
                </ImageBackground>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
});

export default SignUpScreen;