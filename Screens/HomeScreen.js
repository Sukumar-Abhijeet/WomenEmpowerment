import React from 'react';
import {
    View, StyleSheet, AsyncStorage, ScrollView, Text, TouchableOpacity, Dimensions, Image, ImageBackground, ToastAndroid, BackHandler,
} from 'react-native';
import Display from 'react-native-display';
import Icon from 'react-native-vector-icons/FontAwesome';
import Global from '../Urls/Global';


const BASEPATH = Global.BASE_PATH;

import { TouchableRipple } from 'react-native-paper';
class HomeScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    _didFocusSubscription;
    _willBlurSubscription;
    constructor(props) {
        super(props);
        this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
            BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid));
        this.state = {
            offerList: ['r1', 'r2', 'r3'],
            vendorListSource: [],
            offerListSource: [],
            userId: '',
            recommendeProductListSource: [],
            mostRatedProductListSource: [{
                'Name': '',
                'Img': '',
                'Price': '',
                'Description': '',
                'Unitweight': '',
            }, {
                'Name': '',
                'Img': '',
                'Price': '',
                'Description': '',
                'Unitweight': '',
            }, {
                'Name': '',
                'Img': '',
                'Price': '',
                'Description': '',
                'Unitweight': '',
            }],
            dealsOfDaySource: [{
                'Name': '',
                'Price': '',
            }, {
                'Name': '',
                'Price': '',
            }, {
                'Name': '',
                'Price': '',
            }, {
                'Name': '',
                'Price': '',
            }],
            countback: true,
        }
    }

    async retrieveItem(key) {
        console.log("HomeScreen retrieveItem() key: ", key);
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
        console.log("HomeScreen storeItem() key: ", key);
        try {
            var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
            console.log(jsonOfItem);
            return jsonOfItem;
        } catch (error) {
            console.log(error.message);
        }
    }

    getUserData() {
        console.log('ProfileSCreen getUserData()');
        this.retrieveItem('UserData').then((user) => {
            if (user == null) {
            }
            else {
                this.setState({ userId: user.Eid });
            }
        }).catch((error) => {
            console.log('Promise is rejected with error: ' + error);
        });
    }



    onBackButtonPressAndroid = () => {
        console.log("back handling");
        if (this.state.countback) {
            ToastAndroid.show("Press again to close the app.", ToastAndroid.SHORT);
            this.setState({ countback: false });
            return true;
        }
        else {
            ToastAndroid.show("Closing the app.", ToastAndroid.SHORT);
            this.setState({ countback: true });
            BackHandler.exitApp();
            //return false;
        }
    };

    componentWillMount() {
        this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
            BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid));
    }

    dashboardOffers() {
        console.log('HomeScreen dashboardOffers()');
        console.log(" FETCH_DASHBOARD_OFFERS_URL FormValue : ", BASEPATH + Global.FETCH_DASHBOARD_OFFERS_URL);
        fetch(BASEPATH + Global.FETCH_DASHBOARD_OFFERS_URL,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                // body: formValue
            }).then((response) => response.json()).then((responseData) => {
                if (responseData.Success == 'Y') {
                    console.log("FETCH_DASHBOARD_OFFERS_URL : ", responseData);
                    this.setState({ offerListSource: responseData.Offer })
                    this.fetchRecommendeProducts();
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


    fetchVendorList() {
        console.log('HomeScreen fetchVendorList()');
        // let formValue = JSON.stringify({
        //     'phone': this.state.number,
        //     'password': this.state.password,
        // });
        console.log(" FETCH_VENDORLIST_URL FormValue : ", BASEPATH + Global.FETCH_VENDORLIST_URL);
        fetch(BASEPATH + Global.FETCH_VENDORLIST_URL,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                // body: formValue
            }).then((response) => response.json()).then((responseData) => {
                if (responseData.Success == 'Y') {
                    console.log("LogiFETCH_VENDORLIST_URL Response : ", responseData);
                    this.setState({ vendorListSource: responseData.VList })
                    this.dashboardOffers();
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

    fetchRecommendeProducts() {
        console.log('HomeScreen fetchRecommendeProducts()');
        console.log(" FETCH_RECOMMENDED_PRODUCTS_URL FormValue :", BASEPATH + Global.FETCH_RECOMMENDED_PRODUCTS_URL);
        fetch(BASEPATH + Global.FETCH_RECOMMENDED_PRODUCTS_URL,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }, body: JSON.stringify({
                    "Uid": this.state.userId
                })
            }).then((response) => response.json()).then((responseData) => {
                console.log("FETCH_RECOMMENDED_PRODUCTS_URL Response : ", responseData);
                if (responseData.Success == 'Y') {
                    this.setState({ recommendeProductListSource: responseData.VFood })
                    this.fetchMostRatedProducts();
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


    fetchMostRatedProducts() {
        console.log('HomeScreen fetchMostRated()');
        console.log(" FETCH_MOSTRATED_PRODUCTS_URL FormValue :", BASEPATH + Global.FETCH_MOSTRATED_PRODUCTS_URL);
        fetch(BASEPATH + Global.FETCH_MOSTRATED_PRODUCTS_URL,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            }).then((response) => response.json()).then((responseData) => {
                console.log("FETCH_MOSTRATED_PRODUCTS_URL Response : ", responseData);
                if (responseData.Success == 'Y') {
                    this.fetchDealsOfDay();
                    this.setState({ mostRatedProductListSource: responseData.VFood })
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

    fetchDealsOfDay() {
        console.log('HomeScreen fetchDealsOfDay()');
        // let formValue = JSON.stringify({
        //     'phone': this.state.number,
        //     'password': this.state.password,
        // });
        console.log(" FETCH_DEALS_OF_DAY_LIST_URL FormValue : ", BASEPATH + Global.FETCH_DEALS_OF_DAY_LIST_URL);
        fetch(BASEPATH + Global.FETCH_DEALS_OF_DAY_LIST_URL,
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                // body: formValue
            }).then((response) => response.json()).then((responseData) => {
                if (responseData.Success == 'Y') {
                    console.log("FETCH_DEALS_OF_DAY_LIST_URL Response : ", responseData);
                    this.setState({ dealsOfDaySource: responseData.VFood })
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
        this.getUserData();
        this.fetchVendorList();
    }

    showVendor(vendor) {
        console.log('HomeScreen showVendor() : ', vendor);
        this.props.navigation.navigate('vendorProducts', { vendorData: vendor })
    }


    render() {
        return (

            <View style={styles.mainContainer}>
                <View style={styles.header}>
                    <View style={{ flex: 1, flexDirection: 'row', }}>
                        <TouchableRipple>
                            <Image source={require('../assets/icon.png')} style={{ width: 25, height: 25, alignSelf: 'flex-end' }} resizeMode={'contain'} />
                        </TouchableRipple>
                        <Text style={{ color: '#d81e5b', marginLeft: 10, fontSize: 18, fontWeight: '600', alignSelf: 'center' }}>APNA-VIKAS</Text>
                    </View>
                    <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end', marginRight: 5 }} onPress={() => this.props.navigation.navigate('Cart')}>
                        <Icon name={'shopping-cart'} color={'#d81e5b'} size={22} />
                    </TouchableOpacity>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.topbarOffers}>
                        <ScrollView horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            {this.state.offerListSource.map((offer, index) => (
                                <TouchableRipple key={index}>
                                    <ImageBackground style={{ flexDirection: 'row', backgroundColor: '#fff', marginLeft: 4, height: 160, width: 350, borderRadius: 4 }} source={{ uri: BASEPATH + '/static/img/' + offer.url }}>
                                    </ImageBackground>
                                </TouchableRipple>
                            ))}
                        </ScrollView>
                    </View>
                    <View style={styles.dealsOfDay}>
                        <ImageBackground source={require('../assets/Images/womenWork.jpg')} style={{ width: Dimensions.get('window').width, height: 400, justifyContent: 'center', alignItems: 'center' }} resizeMode={'stretch'}>
                            <View style={{ flexDirection: 'row', padding: 20 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: '#d81e5b', fontSize: 20, fontWeight: '600' }}>Deals Of the Day</Text>
                                    <Text style={{ color: '#000', fontSize: 12 }}>10 minutes remaining.</Text>
                                </View>
                                <TouchableOpacity style={{ alignSelf: 'flex-end', backgroundColor: '#fff', padding: 5, borderRadius: 5 }}>
                                    <Text style={{ alignSelf: 'flex-end' }}>View All</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ height: 290, width: Dimensions.get('window').width - 50, marginTop: 20, borderRadius: 4, backgroundColor: '#fff', marginLeft: 20 }}>
                                <View style={{ flex: 1, flexDirection: 'row', borderBottomColor: '#cecaca', borderBottomWidth: 1 }}>
                                    <TouchableOpacity style={{ flex: 1, borderRightColor: '#cecaca', borderRightWidth: 1 }} onPress={() => { this.props.navigation.navigate('ProductDetail', { product: this.state.dealsOfDaySource[0] }) }}>
                                        <View style={{ flex: 3.5, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                                            <ImageBackground style={{ backgroundColor: '#fff', height: 80, width: 80, paddingVertical: 10 }} source={{ uri: BASEPATH + '/static/img/' + this.state.dealsOfDaySource[0].Img }} resizeMode={'contain'}></ImageBackground>
                                        </View>
                                        <View style={{ flex: 1.5, alignSelf: 'center', backgroundColor: '#ebebeb', width: '100%' }}>
                                            <Text style={{ fontSize: 16, fontWeight: '600', alignSelf: 'center' }}>{this.state.dealsOfDaySource[0].Name}<Text style={{ fontWeight: '300', fontSize: 12 }}>({this.state.dealsOfDaySource[0].Unitweight})</Text></Text>
                                            <Text style={{ color: '#03680e', fontSize: 12, alignSelf: 'center' }}>Flat 40% OFF<Text style={{ color: '#03680e', fontSize: 16, fontWeight: '500' }}>/ ₹{this.state.dealsOfDaySource[0].Price}</Text></Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.props.navigation.navigate('ProductDetail', { product: this.state.dealsOfDaySource[1] }) }}>
                                        <View style={{ flex: 3.5, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                                            <ImageBackground style={{ backgroundColor: '#fff', height: 80, width: 80, paddingVertical: 10 }} source={{ uri: BASEPATH + '/static/img/' + this.state.dealsOfDaySource[1].Img }} resizeMode={'contain'}></ImageBackground>
                                        </View>
                                        <View style={{ flex: 1.5, alignSelf: 'center', backgroundColor: '#ebebeb', width: '100%' }}>
                                            <Text style={{ fontSize: 16, fontWeight: '600', alignSelf: 'center' }}>{this.state.dealsOfDaySource[1].Name}<Text style={{ fontWeight: '300', fontSize: 12 }}>({this.state.dealsOfDaySource[1].Unitweight})</Text></Text>
                                            <Text style={{ color: '#03680e', fontSize: 12, alignSelf: 'center' }}>Flat 40% OFF<Text style={{ color: '#03680e', fontSize: 16, fontWeight: '500' }}>/ ₹{this.state.dealsOfDaySource[1].Price}</Text></Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <TouchableOpacity style={{ flex: 1, borderRightColor: '#cecaca', borderRightWidth: 1 }} onPress={() => { this.props.navigation.navigate('ProductDetail', { product: this.state.dealsOfDaySource[2] }) }}>
                                        <View style={{ flex: 3.5, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                                            <ImageBackground style={{ backgroundColor: '#fff', height: 80, width: 80, paddingVertical: 10 }} source={{ uri: BASEPATH + '/static/img/' + this.state.dealsOfDaySource[2].Img }} resizeMode={'contain'}></ImageBackground>
                                        </View>
                                        <View style={{ flex: 1.5, alignSelf: 'center', backgroundColor: '#ebebeb', width: '100%' }}>
                                            <Text style={{ fontSize: 16, fontWeight: '600', alignSelf: 'center' }}>{this.state.dealsOfDaySource[2].Name}<Text style={{ fontWeight: '300', fontSize: 12 }}>({this.state.dealsOfDaySource[2].Unitweight})</Text></Text>
                                            <Text style={{ color: '#03680e', fontSize: 12, alignSelf: 'center' }}>Flat 40% OFF<Text style={{ color: '#03680e', fontSize: 16, fontWeight: '500' }}>/ ₹{this.state.dealsOfDaySource[2].Price}</Text></Text>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.props.navigation.navigate('ProductDetail', { product: this.state.dealsOfDaySource[3] }) }}>
                                        <View style={{ flex: 3.5, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                                            <ImageBackground style={{ backgroundColor: '#fff', height: 80, width: 80, paddingVertical: 10 }} source={{ uri: BASEPATH + '/static/img/' + this.state.dealsOfDaySource[3].Img }} resizeMode={'contain'}></ImageBackground>
                                        </View>
                                        <View style={{ flex: 1.5, alignSelf: 'center', backgroundColor: '#ebebeb', width: '100%' }}>
                                            <Text style={{ fontSize: 16, fontWeight: '600', alignSelf: 'center' }}>{this.state.dealsOfDaySource[3].Name}<Text style={{ fontWeight: '300', fontSize: 12 }}>({this.state.dealsOfDaySource[3].Unitweight})</Text></Text>
                                            <Text style={{ color: '#03680e', fontSize: 12, alignSelf: 'center' }}>Flat 40% OFF<Text style={{ color: '#03680e', fontSize: 16, fontWeight: '500' }}>/ ₹{this.state.dealsOfDaySource[3].Price}</Text></Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                    <View style={styles.vendorLists}>
                        <ScrollView horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            {this.state.vendorListSource.map((vendor, index) => (
                                <TouchableRipple key={index} style={{
                                    backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 8, height: 8 }, shadowOpacity: 0.2,
                                    shadowRadius: 1, elevation: 1, marginRight: 4, borderBottomLeftRadius: 4, borderBottomRightRadius: 4
                                }}
                                    onPress={() => { this.showVendor(vendor) }}
                                >
                                    <View style={{ marginRight: 3.5, height: 250, width: 180, marginLeft: 10, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }} >
                                        <ImageBackground style={{ flex: 4, backgroundColor: '#282828', justifyContent: 'center', alignItems: 'center', width: '100%', borderRadius: 4 }} source={require('../assets/Images/wmTogether.jpg')} resizeMode={'cover'}>
                                            <Image source={{ uri: BASEPATH + '/static/img/' + vendor.Img }} style={{ height: 100, width: 100, borderRadius: 4 }} resizeMode={'cover'} />
                                        </ImageBackground>
                                        <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 20, marginTop: 4, color: '#d81e5b' }}>{vendor.Name}</Text>
                                            <View style={{ backgroundColor: '#009b1c', padding: 5, borderRadius: 8, alignSelf: 'center', flexDirection: 'row' }}>
                                                <Text style={{ color: '#fff', fontSize: 10, fontWeight: '500', marginRight: 3 }}>{vendor.Rate}</Text>
                                                <Icon name={'star'} color={'#e5dd3b'} size={10} />
                                            </View>
                                            <Text style={{ color: '#4f4c4c', fontSize: 14 }}>{vendor.Specialization}</Text>
                                        </View>
                                    </View>
                                </TouchableRipple>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.recommendedProducts}>
                        <View style={{ borderBottomColor: '#ccc9c9', width: '100%', paddingBottom: 5, borderBottomWidth: 1 }}>
                            <Text style={{ fontSize: 20, fontWeight: '400' }}>Recommendations for You</Text>
                        </View>
                        <View>
                            {this.state.recommendeProductListSource.map((item, index) => (
                                <TouchableRipple key={index} style={{ justifyContent: 'center', alignSelf: 'center' }} onPress={() => { this.props.navigation.navigate('ProductDetail', { product: item }) }}>
                                    <View style={{ flexDirection: 'row', height: 70, width: Dimensions.get('window').width - 20, marginTop: 6, borderRadius: 4 }}>
                                        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'flex-end' }}>
                                            <Image source={{ uri: BASEPATH + '/static/img/' + item.Img }} style={{ height: 50, width: 50, borderRadius: 4 }} />
                                        </View>
                                        <View style={{ flex: 7, paddingTop: 5, paddingLeft: 5 }}>
                                            <Text style={{ fontSize: 17, fontWeight: '300' }}>{item.Name}<Text style={{ fontWeight: '300', fontSize: 16 }}>({item.Unitweight})</Text></Text>
                                            <Text style={{ fontSize: 12, fontWeight: '200', color: '#a5a4a4' }}>{item.Description}</Text>
                                            <Text style={{ fontSize: 14 }}>₹ {item.Price} <Text style={{ textDecorationLine: 'line-through', fontSize: 10 }}> ₹ 800 </Text></Text>
                                        </View>
                                        {/* <Image source={{ uri: BASE_PATH + item.BannerImage }} style={{ height: 225, width: 225, borderRadius: 4 }} /> */}
                                    </View>
                                </TouchableRipple>
                            ))}
                        </View>
                    </View>

                    <View style={styles.mostRatedProducts}>
                        <ImageBackground source={require('../assets/Images/womenPot.jpg')} style={{ width: Dimensions.get('window').width, height: 400, justifyContent: 'center', alignItems: 'center' }} resizeMode={'stretch'}>
                            <View style={{ flexDirection: 'row', padding: 20 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: '#d81e5b', fontSize: 20, fontWeight: '600' }}>MostRated</Text>
                                    <Text style={{ color: '#000', fontSize: 12 }}>See the most rated Products now</Text>
                                </View>
                                <TouchableOpacity style={{ alignSelf: 'flex-end', backgroundColor: '#fff', padding: 5, borderRadius: 5 }}>
                                    <Text style={{ alignSelf: 'flex-end' }}>View All</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ height: 290, width: Dimensions.get('window').width - 50, marginTop: 20, borderRadius: 4, backgroundColor: '#fff', flexDirection: 'row', marginLeft: 20 }}>
                                <View style={{ flex: 1, flexDirection: 'row', borderBottomColor: '#cecaca', borderBottomWidth: 1 }}>
                                    <TouchableRipple style={{ flex: 1, borderRightColor: '#cecaca', borderRightWidth: 1 }}
                                        onPress={() => { this.props.navigation.navigate('ProductDetail', { product: this.state.mostRatedProductListSource[0] }) }}
                                    >
                                        <ImageBackground style={{ backgroundColor: '#fff', marginLeft: 4, height: 280, width: 150, paddingVertical: 10 }} source={{ uri: BASEPATH + '/static/img/' + this.state.mostRatedProductListSource[0].Img }} resizeMode={'contain'}>
                                            <View style={{ flex: 7 }}>
                                                <View style={{ backgroundColor: 'red', width: '100%', paddingHorizontal: 10, paddingVertical: 5 }}>
                                                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>20%OFF</Text>
                                                </View>
                                            </View>
                                            <View style={{ flex: 3 }}>
                                                <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 20 }}>{this.state.mostRatedProductListSource[0].Name}<Text style={{ fontWeight: '300', fontSize: 14 }}>({this.state.mostRatedProductListSource[0].Unitweight})</Text></Text>
                                                <Text style={{ fontSize: 10, color: '#adabab' }}>{this.state.mostRatedProductListSource[0].Description}</Text>
                                                <Text style={{ fontSize: 16, fontWeight: '600' }}>₹ {this.state.mostRatedProductListSource[0].Price} <Text style={{ textDecorationLine: 'line-through', fontSize: 10, color: '#666768' }}> ₹ 800 </Text></Text>
                                            </View>
                                        </ImageBackground>
                                    </TouchableRipple>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                    <TouchableOpacity style={{ flex: 1, borderBottomColor: '#cecaca', borderBottomWidth: 1 }} onPress={() => { this.props.navigation.navigate('ProductDetail', { product: this.state.mostRatedProductListSource[1] }) }}>
                                        <ImageBackground style={{ backgroundColor: '#fff', marginLeft: 4, height: 100, width: 150, paddingVertical: 10 }} source={{ uri: BASEPATH + '/static/img/' + this.state.mostRatedProductListSource[1].Img }} resizeMode={'contain'}>
                                            <View style={{ flex: 7 }}>
                                                <View style={{ backgroundColor: 'red', width: '70%', paddingHorizontal: 10, paddingVertical: 5 }}>
                                                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>20%OFF</Text>
                                                </View>
                                            </View>
                                            <View style={{ flex: 3 }}>
                                                <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 20 }}>{this.state.mostRatedProductListSource[1].Name}<Text style={{ fontWeight: '300', fontSize: 14 }}>({this.state.mostRatedProductListSource[1].Unitweight})</Text></Text>
                                                <Text style={{ fontSize: 10, color: '#adabab' }}>{this.state.mostRatedProductListSource[1].Description}</Text>
                                                <Text style={{ fontSize: 16, fontWeight: '600' }}>₹ {this.state.mostRatedProductListSource[1].Price} <Text style={{ textDecorationLine: 'line-through', fontSize: 10, color: '#666768' }}> ₹ 800 </Text></Text>
                                            </View>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.props.navigation.navigate('ProductDetail', { product: this.state.mostRatedProductListSource[2] }) }}>
                                        <ImageBackground style={{ backgroundColor: '#fff', marginLeft: 4, height: 100, width: 150, paddingVertical: 10 }} source={{ uri: BASEPATH + '/static/img/' + this.state.mostRatedProductListSource[2].Img }} resizeMode={'contain'}>
                                            <View style={{ flex: 7 }}>
                                                <View style={{ backgroundColor: 'red', width: '70%', paddingHorizontal: 10, paddingVertical: 5 }}>
                                                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>20%OFF</Text>
                                                </View>
                                            </View>
                                            <View style={{ flex: 3 }}>
                                                <Text style={{ fontSize: 14, fontWeight: '600', marginTop: 20 }}>{this.state.mostRatedProductListSource[2].Name}<Text style={{ fontWeight: '300', fontSize: 16 }}>({this.state.mostRatedProductListSource[1].Unitweight})</Text></Text>
                                                <Text style={{ fontSize: 10, color: '#adabab' }}>{this.state.mostRatedProductListSource[2].Description}</Text>
                                                <Text style={{ fontSize: 16, fontWeight: '600' }}>₹ {this.state.mostRatedProductListSource[2].Price} <Text style={{ textDecorationLine: 'line-through', fontSize: 10, color: '#666768' }}> ₹ 800 </Text></Text>
                                            </View>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                    {/* <View style={styles.appExperience}>
                        <View style={{ flex: 3, borderBottomColor: '#a5a4a4', borderBottomWidth: 1, alignItems: 'center', width: '100%', justifyContent: 'center' }}>
                            <Text>Are You Happy with</Text>
                            <Text>ApnaVikas Experience?</Text>
                        </View>
                        <View style={{ flex: 2, flexDirection: 'row' }}>
                            <TouchableOpacity style={{ flex: 1, borderRightColor: '#a5a4a4', borderRightWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{}}>NO</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{}}>YES</Text>
                            </TouchableOpacity>
                        </View>
                    </View> */}
                </ScrollView>
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
        flexDirection: 'row', backgroundColor: '#fff',
        borderBottomColor: '#d8d8d8',
        borderBottomWidth: 1,
        shadowColor: '#000', shadowOffset: { width: 8, height: 8 }, shadowOpacity: 0.2,
        shadowRadius: 1, elevation: 1,
    },
    topbarOffers:
    {
        padding: 0,
        paddingTop: 10,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: '#ebebeb'
    },
    dealsOfDay: {
        backgroundColor: '#6f0000',
        height: 400,
        width: Dimensions.get('window').width,
        marginTop: 10,
    },
    vendorLists: {
        marginTop: 10,
        height: 250,
    },
    recommendedProducts: {
        marginTop: 10,
        paddingHorizontal: 15, paddingVertical: 10,
        height: 280,
        backgroundColor: '#fff'
    },
    mostRatedProducts: {
        backgroundColor: '#7F00FF',
        height: 400,
        width: Dimensions.get('window').width,
        marginTop: 10,
        paddingHorizontal: 15,
        justifyContent: 'center', alignItems: 'center'
    },
    appExperience: {
        padding: 0,
        paddingTop: 10,
        backgroundColor: '#fff',
        justifyContent: 'center',
        height: 140
    }
});

export default HomeScreen;