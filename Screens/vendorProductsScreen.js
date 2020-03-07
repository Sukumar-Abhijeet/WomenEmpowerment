import React from 'react';
import {
    View, StyleSheet, AsyncStorage, ScrollView, Text, Image, TouchableOpacity
} from 'react-native';
import Display from 'react-native-display';
import Icon from 'react-native-vector-icons/FontAwesome';
import Global from '../Urls/Global';
import { TouchableRipple } from 'react-native-paper';

const BASEPATH = Global.BASE_PATH;
class vendorProductsScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
            vendor: this.props.navigation.getParam('vendorData'),
            vendorFoodListSource: [],
            vendorDetails: {},
            cartItems: []
        }
    }

    async retrieveItem(key) {
        console.log("vendorProductsScreen retrieveItem() key: ", key);
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
        console.log("vendorProductsScreen storeItem() key: ", key);
        try {
            var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
            console.log(jsonOfItem);
            return jsonOfItem;
        } catch (error) {
            console.log(error.message);
        }
    }
    fetchVendorProducts() {
        console.log("vendorProductScreen fetchVendorProducts()", this.state.vendor);
        let formValue = JSON.stringify({
            'Eid': this.state.vendor.Eid,
        });
        console.log(" FETCH_VENDOR_PRODUCT_LIST_URL FormValue : ", formValue, BASEPATH + Global.FETCH_VENDOR_PRODUCT_LIST_URL);
        fetch(BASEPATH + Global.FETCH_VENDOR_PRODUCT_LIST_URL,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: formValue
            }).then((response) => response.json()).then((responseData) => {
                // console.log("FETCH_VENDOR_PRODUCT_LIST_URL : ", responseData);
                if (responseData.Success == 'Y') {
                    // this.setState({ vendorFoodListSource: responseData.VFood, vendorDetails: responseData.Info })
                    this.setState({ vendorDetails: responseData.Info }),
                        this.matchWithCart(responseData.VFood);
                }
                else {
                    ToastAndroid.show('Network is slow.', ToastAndroid.SHORT);
                }
            }).catch((error) => {
                console.log('Promise is rejected with error: ' + error);
                //this.setState({ networkRequest: true, loader: false })
                ToastAndroid.show('Network Error.', ToastAndroid.SHORT);
            });

    }
    componentDidMount() {
        this.initCartItems();
    }

    addtoCart(item) {
        console.log('vendorProductScreen addtoCart()', item);
        let products = this.state.vendorFoodListSource;
        let idx = this.state.vendorFoodListSource.indexOf(item);
        console.log("index found: ", idx);
        if (this.state.vendorFoodListSource.indexOf(item) !== -1) {
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
                    vendorFoodListSource: products
                }, () => { console.log("TEst : ", this.state.vendorFoodListSource) });
            }
        });
    }

    removeProductFromCart = (item) => {
        console.log("HomeScreen removeProductFromCart() item: ", item);
        let idx = this.state.vendorFoodListSource.indexOf(item);
        let products = this.state.vendorFoodListSource;
        if (this.state.vendorFoodListSource[idx].Qty > 0) {
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
                    vendorFoodListSource: products
                });
            }
        });
    }


    initCartItems() {
        console.log('vendorProductScreen initCartItems()');
        this.retrieveItem('CartItems').then((dataArr) => {
            if (dataArr != null) {
                this.setState({ cartItems: dataArr })
            }
        }).catch((error) => {
            console.log('Promise is rejected with error: ' + error);
        });
        this.fetchVendorProducts();
    }


    matchWithCart(dataArray) {
        console.log("vendorProductScreen mathcWithCart()")
        if (this.state.cartItems.length > 0) {
            console.log("Length of AsyncCart :", this.state.cartItems.length)
            let data = this.state.cartItems;
            for (let j = 0; j < dataArray.length; j++) {
                let qty = 0;
                for (let i = 0; i < data.length; i++) {
                    if (data[i].Fid == dataArray[j].Fid) {
                        qty = data[i].Qty;
                    }
                }
                dataArray[j].Qty = eval(qty);
            }
        }
        else {
            for (let j = 0; j < dataArray.length; j++) {
                dataArray[j].Qty = 0;
            }
        }
        this.setState({ vendorFoodListSource: dataArray }, () => { console.log(this.state.vendorFoodListSource) })
    }


    render() {
        return (

            <View style={styles.mainContainer}>
                <View style={styles.header}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <TouchableRipple>
                            <Icon name={'arrow-left'} color={'#000'} size={18} />
                        </TouchableRipple>
                        <Text style={{ color: '#d81e5b', marginLeft: 10, fontSize: 18, fontWeight: '600' }}>{this.state.vendorDetails.Name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Cart')} style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 5 }}>
                        <Icon name={'shopping-cart'} color={'#d81e5b'} size={22} />
                    </TouchableOpacity>
                </View>

                <View style={styles.body}>
                    {this.state.vendorFoodListSource.map((Item, index) => (
                        <View key={index} style={styles.itemBody}>
                            <TouchableRipple style={{ flex: 4 }} onPress={() => { this.props.navigation.navigate('ProductDetail', { product: Item }) }}>
                                <Image source={{ uri: BASEPATH + '/static/img/' + Item.Img }} style={{ height: 100, width: 100, borderRadius: 4 }} resizeMode={'cover'} />
                            </TouchableRipple>
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
                                <View style={{ flex: 1, alignSelf: 'flex-end', backgroundColor: 'green', padding: 5 }}>
                                    <Display enable={Item.Qty == 0}>
                                        <TouchableRipple onPress={() => { this.addtoCart(Item) }} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 10, alignSelf: 'center' }}>ADD TO CART</Text>
                                        </TouchableRipple>
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
                            <View></View>
                        </View>
                    ))}
                </View>

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
    body: {
        justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5, backgroundColor: '#ebebeb'
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

export default vendorProductsScreen;