import React from 'react';
import {
    View, StyleSheet, AsyncStorage, Text, TouchableOpacity, Image,
} from 'react-native';
import Display from 'react-native-display';
import { TabIcon } from '../vectoricons/TabIcon';
import Icon from 'react-native-vector-icons/FontAwesome';
import Global from '../Urls/Global';
import { TextField } from 'react-native-material-textfield';
import { TouchableRipple } from 'react-native-paper';

const BASEPATH = Global.BASE_PATH;
class CartScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
            cartItems: [],
            checkoutObj: {},
            instructions: ''
        }
    }

    async retrieveItem(key) {
        console.log("CartScreen retrieveItem() key: ", key);
        try {
            const retrievedItem = await AsyncStorage.getItem(key);
            const item = JSON.parse(retrievedItem);
            return item;
        } catch (error) {
            console.log(error.message);
        }
        return
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

    async storeItem(key, item) {
        console.log("CartScreen storeItem() key: ", key);
        try {
            var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
            console.log(jsonOfItem);
            return jsonOfItem;
        } catch (error) {
            console.log(error.message);
        }
    }

    fetchCartItems() {
        console.log('CartScreen fetchCartItems()');
        this.retrieveItem('CartItems').then((dataArr) => {
            console.log(dataArr);
            if (dataArr != null) {
                this.setState({ cartItems: dataArr }, () => { this.calculateTotalPrice() })
            }
        }).catch((error) => {
            console.log('Promise is rejected with error: ' + error);
        });
    }

    componentDidMount() {
        this.fetchCartItems();
    }

    calculateTotalPrice() {
        console.log('CartScreen calculateTotalPrice')
        {
            let products = this.state.cartItems;
            let sum = 0;
            let cktObj = {}
            let itemArr = []
            let productObj = {}
            for (let i = 0; i < products.length; i++) {
                sum += (eval(products[i].Qty) * (.6 * eval(products[i].Price)))
                productObj.Fid = products[i].Fid;
                productObj.Qty = products[i].Qty;
                productObj.Vid = products[i].Vid;
                productObj.UnitPrice = .6 * eval(products[i].Price);
                itemArr[i] = productObj;
                productObj = {}
            }
            cktObj.Data = itemArr;
            cktObj.Topay = sum;
            this.setState({ checkoutObj: cktObj })
            console.log("cktObj : ", cktObj);
        }
    }
    addtoCart(item) {
        console.log('vendorProductScreen addtoCart()', item);
        let products = this.state.cartItems;
        let idx = this.state.cartItems.indexOf(item);
        console.log("index found: ", idx);
        if (this.state.cartItems.indexOf(item) !== -1) {
            products[idx].Qty += 1;
        }
        this.retrieveItem('CartItems').then((dataArr) => {

            if (dataArr == null) {
                item.Qty = 1;
                let cartArray = [];
                cartArray.push(item);
                console.log('vendorProductScreen cartArray', cartArray)
                this.storeItem("CartItems", cartArray);
            }
            else {
                let flag = true;
                for (let i = 0; i < dataArr.length; i++) {
                    if (dataArr[i].Fid == item.Fid) {
                        dataArr[i].Qty++;
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    dataArr.push(item);
                }
                this.storeItem("CartItems", dataArr);

                this.setState({
                    cartItems: products
                }, () => { console.log("TEst : ", this.state.cartItems, this.calculateTotalPrice()) });
            }
        });
    }

    emptyCart = () => {
        this.removeItem("CartItems").then((cart) => {
            console.log("CartItems:", cart);
            if (cart == true) {
                this.setState({ checkoutObj: {} })
                this.fetchCartItems();
                this.props.navigation.navigate('Tabs');
            }
        }).catch((error) => {
            console.log('Promise is rejected with error: ' + error);
        });
    }

    removeProductFromCart = (item) => {
        console.log("HomeScreen removeProductFromCart() item: ", item);
        let idx = this.state.cartItems.indexOf(item);
        let products = this.state.cartItems;
        if (this.state.cartItems[idx].Qty > 0) {
            products[idx].Qty -= 1;
        }
        this.retrieveItem('CartItems').then((dataArr) => {
            if (dataArr != null) {
                let index = -1;
                for (let i = 0; i < dataArr.length; i++) {
                    if (dataArr[i].Fid == item.Fid) {
                        dataArr[i].Qty--;
                        if (dataArr[i].Qty < 1) {
                            index = i;
                        }
                        break;
                    }
                }
                if (index > -1) {
                    dataArr.splice(index, 1);
                }
                this.storeItem("CartItems", dataArr);
                // let itemTotal = 0;
                // let packagingTotal = 0;
                // let avgCookingTime = 0;
                // let itemFlag = false;
                // let deliveryTotal = 0;
                // for (let i = 0; i < dataArr.length; i++) {
                //     itemTotal += dataArr[i].Qty * (eval(dataArr[i].OfferPrice) + eval(dataArr[i].ProductDeliveryCharge));
                //     packagingTotal += dataArr[i].Qty * eval(dataArr[i].ProductPackingCharge);
                //     avgCookingTime = (avgCookingTime < eval(dataArr[i].ProductAvgCookingTime)) ? eval(dataArr[i].ProductAvgCookingTime) : avgCookingTime;
                //     itemFlag = true;
                // }
                // if ((itemTotal + packagingTotal) < this.state.minOrderChargeForDelivery && itemFlag) {
                //     deliveryTotal = this.state.deliveryCharge;
                //     avgCookingTime += 19;
                // }
                this.setState({
                    cartItems: products
                }, () => { this.calculateTotalPrice() });
            }
        });
    }


    render() {
        return (

            <View style={styles.mainContainer}>
                <View style={styles.header}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <TouchableRipple>
                            <Icon name={'arrow-left'} color={'#000'} size={18} />
                        </TouchableRipple>
                        <Text style={{ color: '#d81e5b', marginLeft: 10, fontSize: 18, fontWeight: '600' }}>Your Cart</Text>
                    </View>
                    <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 5 }} onPress={() => { this.emptyCart() }}>
                        <Icon name={'trash'} color={'#d81e5b'} size={22} />
                    </TouchableOpacity>
                </View>
                {this.state.cartItems.map((Item, index) => (
                    <View style={styles.itemBox} key={index}>
                        <View style={{ flex: 4 }} onPress={() => { this.props.navigation.navigate('ProductDetail', { product: Item }) }}>
                            <Image source={{ uri: BASEPATH + '/static/img/' + Item.Img }} style={{ height: 100, width: 100, borderRadius: 4 }} resizeMode={'cover'} />
                        </View>
                        <View style={{ flexDirection: 'row', flex: 8 }}>
                            <View style={{ flex: 2 }}>
                                <Text style={{ fontSize: 20, fontWeight: '600' }}>{Item.Name} <Text style={{ fontWeight: '300', fontSize: 14 }}>({Item.Unitweight})</Text></Text>
                                <Text style={{ marginTop: 6, fontSize: 12, color: '#79797a' }}>{Item.Description}</Text>

                                <View style={{ backgroundColor: '#0f7a41', padding: 3, borderRadius: 4, marginRight: 4, alignSelf: 'flex-start', flexDirection: 'row', marginTop: 3 }}>
                                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{Item.Rate}</Text>
                                    <Icon name={'star'} color={'#e5dd3b'} size={10} style={{ marginTop: 2, marginLeft: 2 }} />
                                </View>
                                <Text style={{ fontWeight: '600' }}>{Item.Rate > 3 ? "Excellent" : "Good"}</Text>
                                <Text style={{ color: '#adabab' }}>(10 reviews)</Text>

                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, alignItems: 'flex-end', padding: 5 }}>
                                    <Icon name={'times'} color='red' size={20} />
                                </View>
                                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                    <View style={{ backgroundColor: 'green', padding: 5, width: '100%' }}>
                                        <Display enable={Item.Qty == 0}>
                                            <View onPress={() => { this.addtoCart(Item) }} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 10, alignSelf: 'center' }}>ADD TO CART</Text>
                                            </View>
                                        </Display>
                                        <Display enable={Item.Qty > 0} style={{ flexDirection: 'row' }}>

                                            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.removeProductFromCart(Item) }}>
                                                <Text style={{ fontSize: 12, color: '#fff' }}>-</Text>
                                            </TouchableOpacity>

                                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontSize: 12, color: '#fff' }}>{Item.Qty}</Text>
                                            </View>

                                            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.addtoCart(Item) }}>
                                                <Text style={{ fontSize: 12, color: '#fff' }}>+</Text>
                                            </TouchableOpacity>

                                        </Display>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
                <View style={{ padding: 10, marginTop: 10 }}>
                    {/* <Text>Add any special instructions</Text> */}
                    <TextField
                        label="Any Special Instructions"
                        placeholderTextColor="#fff"
                        underlineColorAndroid='transparent'
                        returnKeyType="go"
                        keyboardType="default"
                        autoCorrect={false}
                        autoCapitalize='none'
                        onChangeText={(instructions) => this.setState.bind(instructions)}
                    />
                </View>
                <Display enable={this.state.cartItems.length > 0} style={{ height: 60, backgroundColor: '#f4e8e8', width: '100%', bottom: 0, position: 'absolute', flexDirection: 'row' }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#06990d', fontWeight: '300' }}>Total Cart Price</Text>
                        <Text style={{ fontSize: 21, fontWeight: '600', marginTop: 4 }}>₹ {this.state.checkoutObj.Topay}</Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={{ width: 100, height: 40, borderRadius: 20, backgroundColor: '#d81e5b', justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.props.navigation.navigate('Payment', { 'finalObj': this.state.checkoutObj }) }}>
                            <Text style={{ fontSize: 18, fontWeight: '600', color: '#fff' }}>PAY NOW</Text>
                        </TouchableOpacity>
                    </View>
                </Display>
            </View>

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
        alignItems: 'center',
        flexDirection: 'row', backgroundColor: '#fff',
        borderBottomColor: '#d8d8d8',
        borderBottomWidth: 1,
        shadowColor: '#000', shadowOffset: { width: 8, height: 8 }, shadowOpacity: 0.2,
        shadowRadius: 1, elevation: 1,
    },
    itemBox: {
        backgroundColor: '#fff', marginTop: 10, flexDirection: 'row',
        alignSelf: 'center'
        , borderRadius: 4, shadowColor: '#000', shadowOpacity: .58,
        shadowRadius: 16, elevation: 24, padding: 10,
        shadowOffset: {
            height: 12,
            width: 12
        }, height: 140, width: 340,
    }
});

export default CartScreen;