import React from 'react';
import {
    View, StyleSheet, AsyncStorage, Text, TouchableOpacity, Dimensions, ImageBackground
} from 'react-native';
import Display from 'react-native-display';
import Icon from 'react-native-vector-icons/FontAwesome';
import { TouchableRipple } from 'react-native-paper';
import Global from '../Urls/Global';

const BASEPATH = Global.BASE_PATH;
class productDetailScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
            indivisualProduct: this.props.navigation.getParam('product'),
            cartItems: [],
        }
    }

    async retrieveItem(key) {
        console.log("productDetailScreen retrieveItem() key: ", key);
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
        console.log("productDetailScreen storeItem() key: ", key);
        try {
            var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
            console.log(jsonOfItem);
            return jsonOfItem;
        } catch (error) {
            console.log(error.message);
        }
    }

    matchWithCart(dataArray) {
        console.log("productDetailScreen mathcWithCart()")
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
        this.setState({ indivisualProduct: dataArray }, () => { console.log(this.state.indivisualProduct) })
    }

    componentDidMount() {
        console.log('productDetailScreen componentDidMount():', this.state.indivisualProduct);
        this.initCartItems();
    }

    initCartItems() {
        console.log('productDetailScreen initCartItems()');
        this.retrieveItem('CartItems').then((dataArr) => {
            if (dataArr != null) {
                this.setState({ cartItems: dataArr }, () => { this.matchWithCart(this.state.indivisualProduct) })
            }
        }).catch((error) => {
            console.log('Promise is rejected with error: ' + error);
        });

    }

    addtoCart(item) {
        console.log('productDetailScreen addtoCart()', item);
        dataArr = this.state.cartItems;
        let idx = dataArr.indexOf(item);
        console.log("Idx : ", idx)
        if (idx == -1) {
            item.Qty = eval(item.Qty) + 1;
            dataArr.push(item);
        } else {
            let flag = true;
            for (let i = 0; i < dataArr.length; i++) {
                if (dataArr[i].Fid == item.Fid) {
                    dataArr[i].Qty = eval(dataArr[i].Qty) + 1;
                    flag = false;
                    break;
                }
            }
            if (flag) {
                dataArr.push(item);
            }
            console.log("dataArr:", dataArr)
            this.storeItem("CartItems", dataArr);

            this.setState({
                indivisualProduct: item
            }, () => { console.log("Console : ", this.state.indivisualProduct) });
        }



        // this.retrieveItem('CartItems').then((dataArr) => {
        //     dataArr.push(item);
        // });
        // // let products = this.state.cartItems;
        // let idx = products.indexOf(item);
        // console.log("index found: ", idx);
        // if (products.indexOf(item) !== -1) {
        //     products[idx].Qty += 1;
        // }
        // this.retrieveItem('CartItems').then((dataArr) => {

        //     if (dataArr == null) {
        //         item.Qty = 1;
        //         let cartArray = [];
        //         cartArray.push(item);
        //         console.log('vendorProductScreen cartArray', cartArray)
        //         this.storeItem("CartItems", cartArray);
        //     }
        //     else {
        //         let flag = true;
        //         for (let i = 0; i < dataArr.length; i++) {
        //             if (dataArr[i].Fid == item.Fid) {
        //                 dataArr[i].Qty++;
        //                 flag = false;
        //                 break;
        //             }
        //         }
        //         if (flag) {
        //             dataArr.push(item);
        //         }
        //         this.storeItem("CartItems", dataArr);

        //         this.setState({
        //             indivisualProduct: item
        //         }, () => { console.log("TEst : ", this.state.indivisualProduct) });
        //     }
        // });
    }

    removeProductFromCart = (item) => {
        console.log("HomeScreen removeProductFromCart() item: ", item);
        dataArr = this.state.cartItems;
        let idx = dataArr.indexOf(item);
        let products = dataArr;
        if (dataArr[idx].Qty > 0) {
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
                    indivisualProduct: item
                });
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
                        {/* <Text style={{ color: '#d81e5b', marginLeft: 10, fontSize: 18, fontWeight: '600' }}>{this.state.vendorDetails.Name}</Text> */}
                    </View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Cart')} style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 5 }}>
                        <Icon name={'shopping-cart'} color={'#d81e5b'} size={22} />
                    </TouchableOpacity>
                </View>
                <View style={styles.body}>

                    <View style={{ height: 300, width: Dimensions.get('window').width, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ebebeb' }}>
                        <ImageBackground source={{ uri: BASEPATH + '/static/img/' + this.state.indivisualProduct.Img }} style={{ height: 200, width: 200 }} resizeMode={'cover'} />
                    </View>
                    <View style={{ padding: 10, backgroundColor: '#fff' }}>
                        <Text style={{ color: '#000', fontSize: 25, fontWeight: '600' }}>{this.state.indivisualProduct.Name}
                            <Text style={{ color: '#636161', fontSize: 20, marginLeft: 5 }}>({this.state.indivisualProduct.Unitweight})</Text>
                        </Text>
                        <Text style={{ color: '#8c8c8c', fontSize: 12, fontWeight: '300', marginTop: 3 }}>{this.state.indivisualProduct.Description}</Text>

                        <View style={{ flexDirection: 'row', marginTop: 6 }}>
                            <View style={{ backgroundColor: '#0f7a41', padding: 3, borderRadius: 4, marginRight: 4, alignSelf: 'flex-start', flexDirection: 'row', marginTop: 3 }}>
                                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{this.state.indivisualProduct.Rate}</Text>
                                <Icon name={'star'} color={'#e5dd3b'} size={10} style={{ marginTop: 2, marginLeft: 2 }} />
                            </View>
                            <Text style={{ fontWeight: '600', alignSelf: 'flex-end' }}>{this.state.indivisualProduct.Rate > 3 ? "Excellent" : "Good"}</Text>
                            <Text style={{ color: '#adabab', alignSelf: 'flex-end', marginLeft: 3 }}>(10 reviews)</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 6 }}>
                            <Text style={{ color: '#000', fontSize: 20, alignSelf: 'center', fontWeight: '800' }}>₹{this.state.indivisualProduct.Price}<Text style={{ color: '#7a7979', fontSize: 12, textDecorationLine: 'line-through', marginLeft: 4 }}> ₹ 800</Text></Text>
                            <Text style={{ marginLeft: 10, color: '#0f7a41', marginLeft: 4, fontSize: 12, alignSelf: 'flex-end' }}>20% OFF</Text>
                        </View>
                        <Text style={{ color: '#0f7a41' }}>Stock Available!</Text>
                    </View>
                </View>
                <Display enable={true} style={{ height: 60, width: '100%', bottom: 0, position: 'absolute', }}>
                    <View style={{ flexDirection: 'row', height: 60 }}>
                        <View style={{ flex: 1, borderColor: '#d81e5b', borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Display enable={this.state.indivisualProduct.Qty == 0}>
                                <TouchableRipple onPress={() => { this.addtoCart(this.state.indivisualProduct) }} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ justifyContent: 'center', alignItems: 'center', fontSize: 20, fontWeight: '600', color: '#d81e5b' }}>ADD TO CART</Text>
                                </TouchableRipple>
                            </Display>
                            <Display enable={this.state.indivisualProduct.Qty > 0} style={{ flexDirection: 'row' }}>

                                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.removeProductFromCart(this.state.indivisualProduct) }}>
                                    <Text style={{ fontSize: 15, color: '#d81e5b' }}>-</Text>
                                </TouchableOpacity>

                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ fontSize: 15, color: '#d81e5b' }}>{this.state.indivisualProduct.Qty}</Text>
                                </View>

                                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={() => { this.addtoCart(this.state.indivisualProduct) }}>
                                    <Text style={{ fontSize: 15, color: '#d81e5b' }}>+</Text>
                                </TouchableOpacity>

                            </Display>
                        </View>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Cart') }} style={{ flex: 1, backgroundColor: '#d81e5b', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 20, color: '#fff' }}>BUY</Text>
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
    body: {
        paddingHorizontal: 5, backgroundColor: '#fff', height: Dimensions.get('window').height - 50
    },
});

export default productDetailScreen;