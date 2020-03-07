import React from 'react';
import {
    View, StyleSheet, AsyncStorage, ImageBackground, Image, Text, Dimensions, TextInput, TouchableOpacity, ActivityIndicator, ToastAndroid, ScrollView,
} from 'react-native';
import { TextField } from 'react-native-material-textfield';
import Display from 'react-native-display';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import Global from '../Urls/Global';
import { TouchableRipple } from 'react-native-paper';
import { Rating, AirbnbRating } from 'react-native-ratings';

const BASEPATH = Global.BASE_PATH;
class PaymentScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
            checoutObj: this.props.navigation.getParam('finalObj'),
            uid: '',
            payMethod: [{
                "Mode": 'COD',
                "Selected": false
            }, {
                "Mode": 'PAYTM',
                "Selected": false
            }, {
                "Mode": 'UPI',
                "Selected": false
            }],
            showPayTM: false,
            showUpi: false,
            loader: false,
            ratingModal: null,
            cartItems: [],
            rating: 0,
            review: ''
        }
    }

    async retrieveItem(key) {
        console.log("PaymentScreen retrieveItem() key: ", key);
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
        console.log("PaymentScreen storeItem() key: ", key);
        try {
            var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
            console.log(jsonOfItem);
            return jsonOfItem;
        } catch (error) {
            console.log(error.message);
        }
    }

    async removeItem(key) {
        console.log("HomeScreen removeItem() key: ", key);
        try {
            await AsyncStorage.removeItem(key);
            return true;
        }
        catch (exception) {
            return false;
        }
    }

    emptyCart = () => {
        this.removeItem("CartItems").then((cart) => {
            console.log("CartItems:", cart);
            if (cart == true) {
                this.setState({ checkoutObj: {} })
                this.props.navigation.navigate('Tabs');
            }
        }).catch((error) => {
            console.log('Promise is rejected with error: ' + error);
        });
    }
    showRating() {
        console.log('PaymentScreen showRating');
        this.retrieveItem('CartItems').then((user) => {
            if (user != null) {
                this.setState({ cartItems: user })
                //this.props.navigation.navigate('Tabs');
            }
            else {
                console.log("User is not logged in");
            }
        }).catch((error) => {
            console.log('Promise is rejected with error: ' + error);
        });
        this.setState({ ratingModal: 5 })
    }



    placeOrder() {
        console.log('PaymentScreen placeOrder()', this.state.checoutObj);
        this.setState({ loader: true })
        let formValue = JSON.stringify({
            'OrderData': this.state.checoutObj,
            'Eid': this.state.uid,
        });
        console.log(" SEND_PLACE_ORDER_URL FormValue : ", BASEPATH + Global.SEND_PLACE_ORDER_URL);
        fetch(BASEPATH + Global.SEND_PLACE_ORDER_URL,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: formValue
            }).then((response) => response.json()).then((responseData) => {
                if (responseData.Success == 'Y') {
                    ToastAndroid.show('ORDER PLACED', ToastAndroid.LONG);
                    // this.emptyCart();
                    this.showRating()
                }
                else {
                    ToastAndroid.show('Network is slow.', ToastAndroid.SHORT);
                }
            }).catch((error) => {
                console.log('Promise is rejected with error: ' + error);
                //this.setState({ networkRequest: true, loader: false })
                ToastAndroid.show('Network Error.', ToastAndroid.SHORT);
            });
        this.setState({ loader: false })
    }

    selectPayMode(mode) {
        console.log('paymentScreen selectPaymentMode():', mode);
        let cktObj = this.state.checoutObj;
        cktObj.paymentMode = mode.Mode
        let modeArr = this.state.payMethod;
        for (let i = 0; i < modeArr.length; i++) {
            modeArr[i].Selected = false
            if (modeArr[i].Mode == mode.Mode) {
                modeArr[i].Selected = true
                if (mode.Mode == "PAYTM") {
                    this.setState({ showPayTM: true, showUpi: false })
                }
                if (mode.Mode == "UPI") {
                    this.setState({ showUpi: true, showPayTM: false })
                }
                if (mode.Mode == "COD") {
                    this.setState({ showUpi: false, showPayTM: false })
                }
            }

        }
        this.setState({ payMethod: modeArr, checoutObj: cktObj }, () => { console.log('paymentMode : ', this.state.showPayTM, this.state.showUpi) });
    }

    checkUserData() {
        console.log('PaymentScreen checkUserData()');
        this.retrieveItem('UserData').then((user) => {
            if (user != null) {
                this.setState({ uid: user.Eid })
                console.log("User is logged in : ", user);
                //this.props.navigation.navigate('Tabs');
            }
            else {
                console.log("User is not logged in");
            }
        }).catch((error) => {
            console.log('Promise is rejected with error: ' + error);
        });
    }


    componentDidMount() {
        console.log('componentDIDMOUNT');
        this.checkUserData();

        console.log("CKTOBJ", this.state.checoutObj)
    }

    sendFeedback() {
        console.log('paymentScreen sendFeedback');
        this.emptyCart();
        this.props.navigation.navigate('Tabs');
    }

    setFeedBack(word, num, id) {

    }
    __renderRatingModal = () => (
        <View style={styles.body}>
            <Text>Help Us for just 2 mins.</Text>
            {this.state.cartItems.map((Item, index) => (
                <View key={index} style={styles.itemBody}>
                    <TouchableRipple style={{ flex: 4 }} onPress={() => { this.props.navigation.navigate('ProductDetail', { product: Item }) }}>
                        <Image source={{ uri: BASEPATH + '/static/img/' + Item.Img }} style={{ height: 100, width: 100, borderRadius: 4 }} resizeMode={'cover'} />
                    </TouchableRipple>
                    <View style={{ flexDirection: 'row', flex: 8 }}>
                        <View style={{ flex: 2 }}>
                            <Text style={{ fontSize: 20, fontWeight: '600' }}>{Item.Name} <Text style={{ fontWeight: '300', fontSize: 14 }}>({Item.Unitweight})</Text></Text>
                            <Text>Rate $ Review</Text>
                            <AirbnbRating
                                showRating={false}
                                defaultRating={4}
                                size={20}
                                onFinishRating={(num) => { this.setFeedBack.bind(this, 'rating', num, Item.Fid) }}
                                style={{ paddingVertical: 10, flex: 1 }}
                                ratingColor='#cd2121'
                            />
                            <View style={{ width: '85%', borderBottomColor: '#ebebeb', borderBottomWidth: 1, marginTop: -10 }}>
                                <TextField
                                    label="Review"
                                    placeholderTextColor="#fff"
                                    underlineColorAndroid='transparent'
                                    returnKeyType="go"
                                    keyboardType="default"
                                    autoCorrect={false}
                                    autoCapitalize='none'
                                    onChangeText={(review) => this.setFeedBack.bind(this, 'review', review, Item.Fid)}
                                />
                            </View>

                        </View>
                    </View>
                    <View></View>
                </View>
            ))}

            <TouchableOpacity style={{ alignSelf: 'center', padding: 5, width: 100, height: 40, borderRadius: 20, backgroundColor: '#d81e5b', marginTop: 10 }} onPress={() => { this.sendFeedback() }}>
                <Text style={{ fontSize: 23, fontWeight: '400', color: '#fff', alignSelf: 'center', marginTop: 2 }}>Submit</Text>
            </TouchableOpacity>
        </View>
    )

    render() {
        return (

            <View style={styles.mainContainer}>
                <View style={styles.header}>
                    <View style={{ flex: 1, flexDirection: 'row', }}>
                        <TouchableRipple style={{ marginTop: 6 }}>
                            <Icon name={'arrow-left'} color={'#000'} size={18} />
                        </TouchableRipple>
                        <Text style={{ color: '#d81e5b', marginLeft: 10, fontSize: 18, fontWeight: '600', alignSelf: 'center' }}>PAYMENT</Text>
                    </View>
                    <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 5 }} onPress={() => this.props.navigation.navigate('Cart')}>
                        <Icon name={'credit-card'} color={'#d81e5b'} size={22} />
                    </TouchableOpacity>
                </View>
                <View style={{ padding: 10, }}>
                    <View style={{ flexDirection: 'row', height: 200, borderRadius: 4 }}>
                        <View style={{
                            flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 8, height: 8 }, shadowOpacity: 0.2,
                            shadowRadius: 1, elevation: 1,
                        }}>
                            <Text style={{ fontSize: 16, fontWeight: '600' }}>You are just one step back</Text>
                            <Text style={{ fontSize: 12, fontWeight: '300' }}>To place your order</Text>
                        </View>
                        <View style={{ flex: 1, backgroundColor: '#d81e5b', justifyContent: 'center', alignItems: 'center', borderRadius: 4 }}>
                            <Text style={{ color: '#fff', fontSize: 18 }}>To PAY</Text>
                            <Text style={{ color: '#fff', fontSize: 25 }}> ₹ {this.state.checoutObj.Topay}</Text>
                        </View>
                    </View>

                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <Text style={{ fontSize: 20, fontWeight: '600' }}>Select Payment Method</Text>
                        <View style={{ marginTop: 20 }}>
                            <ScrollView horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            >
                                {this.state.payMethod.map((payMode, index) => (
                                    <TouchableRipple key={index} style={{ backgroundColor: payMode.Selected == true ? 'blue' : '#ebebeb', padding: 10, borderRadius: 5, marginRight: 8, borderColor: '#ebebeb', borderWidth: 1, height: 50, justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.selectPayMode(payMode) }}>
                                        <Text style={{ color: payMode.Selected == true ? '#fff' : '#000' }}>{payMode.Mode}</Text>
                                    </TouchableRipple>
                                ))}
                            </ScrollView>
                            <Display enable={true} style={{ width: 200, height: 200, backgroundColor: 'red', marginTop: 10 }}>
                                <Image source={require('../assets/paytm.png')} style={{ width: 150, height: 150 }} resizeMode={'cover'} />
                            </Display>
                            <Display enable={this.state.showUpi} style={{ width: 200, height: 200, marginTop: 10 }}>
                                <Image source={require('../assets/upi.png')} style={{ width: 150, height: 150 }} resizeMode={'cover'} />
                            </Display>
                        </View>


                    </View>
                </View>
                <Display enable={true} style={{ height: 60, width: '100%', bottom: 0, position: 'absolute', }}>
                    <View style={{ width: '100%', height: 60, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={{ width: 200, height: 40, borderRadius: 20, backgroundColor: '#d81e5b', justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.placeOrder() }}>
                            <Display enable={!this.state.loader}>
                                <Text style={{ fontSize: 18, fontWeight: '600', color: '#fff' }}>PLACE ORDER</Text>
                            </Display>
                            <Display enable={this.state.loader}>
                                <ActivityIndicator color={'#fff'} size={'small'} />
                            </Display>
                        </TouchableOpacity>
                    </View>
                </Display>
                <Modal isVisible={this.state.ratingModal === 5} style={styles.bottomModal} onBackButtonPress={() => this.setState({ visibleModal: null })} onRequestClose={() => { this.setState({ visibleModal: null }) }}>
                    {this.__renderRatingModal()}
                </Modal>
            </View >

        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        marginTop: Expo.Constants.statusBarHeight,
    },
    header: {
        padding: 10,
        height: 50,
        flexDirection: 'row', backgroundColor: '#fff',
        borderBottomColor: '#d8d8d8',
        borderBottomWidth: 1,
        shadowColor: '#000', shadowOffset: { width: 8, height: 8 }, shadowOpacity: 0.2,
        shadowRadius: 1, elevation: 1,
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    body: {
        justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, backgroundColor: '#ebebeb', flex: 1
    },
    itemBody: {
        backgroundColor: '#fff', marginTop: 10, flexDirection: 'row'
        , borderRadius: 4, shadowColor: '#000', shadowOpacity: .58,
        shadowRadius: 16, elevation: 24, padding: 10,
        shadowOffset: {
            height: 12,
            width: 12
        }, height: 140, width: 340,
    }
});

export default PaymentScreen;