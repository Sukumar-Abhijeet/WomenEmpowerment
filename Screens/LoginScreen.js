import React from 'react';
import {
    View, StyleSheet, AsyncStorage, ImageBackground, Image, Text, Dimensions, TextInput, TouchableOpacity, ActivityIndicator, ToastAndroid
} from 'react-native';
import Display from 'react-native-display';
import Icon from 'react-native-vector-icons/FontAwesome';
import CodeInput from 'react-native-confirmation-code-input';
import Global from '../Urls/Global';
import { Permissions, Notifications } from 'expo';


const BASEPATH = Global.BASE_PATH;
class LoginScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
            number: '', password: '',
            loader: false,
            networkRequest: false,
            showLoginBox: true,
            showOtpBox: false,
            showReenterPass: false,
            otpText: 'Enter OTP!',
            userOtp: ''
        }
    }

    async retrieveItem(key) {
        console.log("LoginScreen retrieveItem() key: ", key);
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
        console.log("LoginScreen storeItem() key: ", key);
        try {
            var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
            console.log(jsonOfItem);
            return jsonOfItem;
        } catch (error) {
            console.log(error.message);
        }
    }

    registerForPushNotifications = async () => {
        console.log("LoginScreen registerForPushNotifications() :");
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return;
        }
        global.token = await Notifications.getExpoPushTokenAsync();
        console.log("Fetched Token " + global.token);
    }


    login = () => {
        console.log("LoginScreen : login()");
        this.setState({ loader: true });
        if (this.state.number == '' || this.state.password == '') {
            ToastAndroid.show('Please fill all the fields', ToastAndroid.SHORT);
            this.setState({ loader: false });
        }
        else {
            let formValue = JSON.stringify({
                'username': this.state.number,
                'password': this.state.password,
            });
            console.log(" CHECK_DELIVERY_LOGIN FormValue : ", formValue, BASEPATH + Global.CHECK_LOGIN_URL);
            fetch(BASEPATH + Global.CHECK_LOGIN_URL,
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: formValue
                }).then((response) => response.json()).then((responseData) => {
                    console.log("LoginResponse : ", responseData);
                    if (responseData.Success == 'Y') {
                        this.storeItem('UserData', responseData.UserData);
                        this.setState({ loader: false })
                        this.props.navigation.navigate('Tabs');
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
                    //this.setState({ networkRequest: true, loader: false })
                    ToastAndroid.show('Network Error.', ToastAndroid.SHORT);
                });
        }
    };

    forgotPass() {
        console.log("LoginScreen forgotPass()")
        if (this.state.number == "" || this.state.number.length < 10) {
            ToastAndroid.show("Please insert a valid number", ToastAndroid.SHORT);
        } else {
            let formValue = JSON.stringify({
                'phone': this.state.number,
            });
            console.log(" CHECK_DELIVERY_LOGIN FormValue : ", formValue, BASEPATH + Global.CHECK_OTP_URL);
            fetch(BASEPATH + Global.CHECK_OTP_URL,
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
                        this.setState({ showOtpBox: true, showLoginBox: false, userOtp: responseData.OTP })
                    }
                    else if (responseData.Success == 'NW') {
                        ToastAndroid.show('New User number found', ToastAndroid.SHORT);
                    }
                    else {
                        this.setState({ loader: false })
                        ToastAndroid.show('Something went wrong, try again.', ToastAndroid.SHORT);
                    }
                }).catch((error) => {
                    console.log('Promise is rejected with error: ' + error);
                    //this.setState({ networkRequest: true, loader: false })
                    ToastAndroid.show('Network Error.', ToastAndroid.SHORT);
                });
        }
    }
    onFinishCheckingCode(otp) {
        console.log("LoginScreen onFinishCheckingCode()", otp)
        if (otp == this.state.userOtp) {
            this.setState({ otpText: 'Enter OTP!', showReenterPass: true, showOtpBox: false, showLoginBox: false })
        } else {
            this.setState({ otpText: 'Invalid OTP!' })
            this.refs.codeInputRef.clear();
        }
    }
    resendCode() {
        console.log("LoginScreen resendCode()")

    }
    resetPass() {
        console.log("LoginScreen resendCode()")
        this.setState({ loader: true })
        if (this.state.password.length < 5) {
            ToastAndroid.show("Minimum 6 characters", ToastAndroid.SHORT);
        } else {
            let formValue = JSON.stringify({
                'phone': this.state.number,
                'password': this.state.password,
            });
            console.log(" RESET_PASSWORD_URL FormValue : ", formValue, BASEPATH + Global.RESET_PASSWORD_URL);
            fetch(BASEPATH + Global.RESET_PASSWORD_URL,
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
                        this.setState({ showReenterPass: false, showOtpBox: false, showLoginBox: true })
                        this.props.navigation.navigate('Tabs');
                    }
                    else if (responseData.Success == 'N') {
                        ToastAndroid.show('Error while Updating password', ToastAndroid.SHORT);
                    }
                    else {
                        this.setState({ loader: false })
                        ToastAndroid.show('Something went wrong, try again.', ToastAndroid.SHORT);
                    }
                }).catch((error) => {
                    console.log('Promise is rejected with error: ' + error);
                    //this.setState({ networkRequest: true, loader: false })
                    ToastAndroid.show('Network Error.', ToastAndroid.SHORT);
                });
        }
        this.setState({ loader: false })
    }

    componentDidMount() {
        this.registerForPushNotifications();
    }


    render() {
        return (

            <View style={styles.mainContainer}>

                <ImageBackground style={{ width: '100%', height: '100%' }} source={require('../assets/Backgrounds/loginBack.jpg')} resizeMode={'cover'}>
                    <Display enable={!this.state.networkRequest} style={{ flex: 1 }}>
                        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../assets/Images/mainImg.png')} style={{ width: 140, height: 180 }} resizeMode={'contain'} />
                        </View>
                        <View style={{ flex: .5, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 25, fontWeight: '600' }}>WELCOME!</Text>
                        </View>
                        <View style={{ flex: 4, justifyContent: 'center', alignItems: 'center' }}>
                            <Display enable={this.state.showLoginBox} style={styles.loginCard}>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderBottomColor: '#d81e5b', borderBottomWidth: 1, paddingBottom: 5 }}>
                                    <Icon name="user" size={16} color="#d81e5b" />
                                    <TextInput placeholder=" Enter Phone Number " style={styles.phn_num}
                                        returnKeyType="next"
                                        keyboardType="numeric"
                                        onSubmitEditing={() => { this.passwordInput.focus(); }}
                                        blurOnSubmit={false}
                                        maxLength={10}
                                        //autoFocus={true}
                                        onChangeText={(number) => this.setState({ number })}
                                        underlineColorAndroid='transparent'
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <View style={{ flexDirection: 'row', alignSelf: 'flex-start', borderBottomColor: '#d81e5b', borderBottomWidth: 1, marginTop: 30, paddingBottom: 5 }}>
                                        <Icon name="key" size={16} color="#d81e5b" />
                                        <TextInput placeholder="Password" style={styles.pass}
                                            ref={(input) => { this.passwordInput = input; }}
                                            returnKeyType="go"
                                            secureTextEntry={true}
                                            onChangeText={(password) => this.setState({ password })}
                                            underlineColorAndroid='transparent'
                                            onSubmitEditing={() => { this.login(); }}
                                        />
                                    </View>
                                    <View style={{ marginTop: 30, marginLeft: 10 }}>
                                        <TouchableOpacity style={{ backgroundColor: '#d81e5b', borderRadius: 18, padding: 5, width: 70, justifyContent: 'center', alignItems: 'center', height: 35 }} onPress={() => { this.login() }}>
                                            <Display enable={!this.state.loader}>
                                                <Text style={{ color: '#fff', fontWeight: '300' }}>LOGIN</Text>
                                            </Display>
                                            <Display enable={this.state.loader}>
                                                <ActivityIndicator size={"small"} color="#fff" />
                                            </Display>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => this.forgotPass()}>
                                    <Text style={{ color: '#0049bf', marginTop: 5, fontWeight: '400' }}>Forgot Password ? </Text>
                                </TouchableOpacity>
                            </Display>
                            <Display enable={this.state.showOtpBox} style={styles.OtpCard}>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: "#3a3939", fontSize: 17, fontWeight: '800' }}>Complete Verification</Text>
                                    <Text style={{ color: "#706d6d", fontSize: 10 }}>We have sent an OTP to {this.state.number} </Text>
                                    <Text style={{ color: this.state.otpText == "Invalid OTP!" ? "#cd2121" : "#047a1c", fontSize: 15, marginTop: 6 }}>{this.state.otpText}</Text>
                                </View>
                                <View style={{ height: 80 }}>
                                    <CodeInput
                                        ref="codeInputRef"
                                        secureTextEntry={false}
                                        codeLength={4}
                                        activeColor='rgba(49, 180, 4, 1)'
                                        inactiveColor='rgba(49, 180, 4, 1.3)'
                                        autoFocus={false}
                                        keyboardType="numeric"
                                        ignoreCase={true}
                                        inputPosition='center'
                                        size={50}
                                        onFulfill={(code) => this.onFinishCheckingCode(code)}
                                        containerStyle={{ marginTop: 30 }}
                                        codeInputStyle={{ borderWidth: 1.5, borderRadius: 5 }}
                                    />
                                </View>
                                <Display enable={!this.state.isValid}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ fontSize: 8, marginTop: 3, color: '#92939e' }}>Didn't received SMS? </Text>
                                        <TouchableOpacity onPress={this.resendCode.bind(this)}>
                                            <Text style={{ fontSize: 11, color: '#cd2121' }}>Resend Code</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Display>
                            </Display>
                            <Display enable={this.state.showReenterPass} style={styles.ReenterPassCard}>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: "#3a3939", fontSize: 17, fontWeight: '800' }}>Enter New Password</Text>
                                    <Text style={{ color: "#706d6d", fontSize: 10 }}>Password Must be minimum of 6 characters </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignSelf: 'center', borderBottomColor: '#d81e5b', borderBottomWidth: 1, marginTop: 25, paddingBottom: 5 }}>
                                    <Icon name="key" size={16} color="#d81e5b" />
                                    <TextInput placeholder="Password" style={[styles.pass, { width: 220 }]}
                                        ref={(input) => { this.passwordInput = input; }}
                                        returnKeyType="go"
                                        secureTextEntry={true}
                                        onChangeText={(password) => this.setState({ password })}
                                        underlineColorAndroid='transparent'
                                        onSubmitEditing={() => { this.resetPass(); }}
                                    />
                                </View>
                                <TouchableOpacity style={{ alignSelf: 'center', backgroundColor: '#d81e5b', borderRadius: 25, padding: 10, width: 120, height: 40, marginTop: 6, justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.resetPass() }}>
                                    <Display enable={!this.state.loader}>
                                        <Text style={{ color: '#fff', fontWeight: '400' }}>RESET</Text>
                                    </Display>
                                    <Display enable={this.state.loader}>
                                        <ActivityIndicator size={"small"} color="#fff" />
                                    </Display>
                                </TouchableOpacity>
                            </Display>
                        </View>
                        <View style={{ flex: 2, justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'row', padding: 15 }}>
                            <Text style={{ fontSize: 10, fontWeight: '600', color: '#000' }}>Dont Have an account?</Text>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('SignUp') }}>
                                <Text style={{ color: '#0049bf', marginLeft: 5, fontWeight: '400' }}>SignUp</Text>
                            </TouchableOpacity>
                        </View>
                    </Display>
                </ImageBackground>

            </View >

        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    loginCard: {
        backgroundColor: '#fff', marginTop: 10
        , borderRadius: 5, shadowColor: '#000', shadowOpacity: .58, height: 150,
        shadowRadius: 16, elevation: 24, padding: 10,
        shadowOffset: {
            height: 12,
            width: 12
        },
        justifyContent: 'center', alignItems: 'center',
        width: Dimensions.get('window').width - 30
    },
    OtpCard: {
        backgroundColor: '#fff', marginTop: 10
        , borderRadius: 5, shadowColor: '#000', shadowOpacity: .58, height: 150,
        shadowRadius: 16, elevation: 24, padding: 10,
        shadowOffset: {
            height: 12,
            width: 12
        },
        justifyContent: 'center', alignItems: 'center',
        width: Dimensions.get('window').width - 30
    },
    ReenterPassCard: {
        backgroundColor: '#fff', marginTop: 10
        , borderRadius: 5, shadowColor: '#000', shadowOpacity: .58, height: 150,
        shadowRadius: 16, elevation: 24, padding: 10,
        shadowOffset: {
            height: 12,
            width: 12
        },
        justifyContent: 'center', alignItems: 'center',
        width: Dimensions.get('window').width - 30
    },
    phn_num:
    {
        height: 20, width: 250, marginLeft: 10, letterSpacing: 2
    },
    pass:
    {
        height: 20, width: 150, marginLeft: 10, letterSpacing: 2
    },
});

export default LoginScreen;