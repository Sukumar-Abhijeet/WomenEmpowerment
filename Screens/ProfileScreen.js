import React from 'react';
import {
    View, StyleSheet, AsyncStorage, ImageBackground, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView, Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as OpenAnything from 'react-native-openanything';
import Modal from 'react-native-modal';
import Display from 'react-native-display';
import { Camera, Permissions, } from 'expo';
class ProfileScreen extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
            customerName: '', customerMail: '',
            visibleModal: null,
            pictureSize: '640x480',
            type: Camera.Constants.Type.back,
            camera: false,
            cameraLoader: false,
            photo: {},
        }
    }

    async retrieveItem(key) {
        console.log("ProfileScreen retrieveItem() key: ", key);
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
        console.log("ProfileScreen storeItem() key: ", key);
        try {
            var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
            console.log(jsonOfItem);
            return jsonOfItem;
        } catch (error) {
            console.log(error.message);
        }
    }
    async removeItem(key) {
        try {
            await AsyncStorage.removeItem(key);
            return true;
        }
        catch (exception) {
            return false;
        }
    }

    getUserData() {
        console.log('ProfileSCreen getUserData()');
        this.retrieveItem('UserData').then((user) => {
            if (user == null) {
            }
            else {
                this.setState({ customerName: user.Name, customerMail: user.Email });
            }
        }).catch((error) => {
            console.log('Promise is rejected with error: ' + error);
        });
    }

    logout() {
        console.log('ProfileSCreen logout()');
        this.removeItem("UserData").then((user) => {
            console.log("userData:", user);
            if (user == true) {
                this.props.navigation.navigate('Login');
            }
        }).catch((error) => {
            console.log('Promise is rejected with error: ' + error);
        });
        // this.props.navigation.navigate('Login');
    }

    async cameraPermission() {
        console.log("OrderRestaurantScreen cameraPermission:");
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.CAMERA
        );
        if (existingStatus !== 'granted') {
            status = await Permissions.askAsync(Permissions.CAMERA);
        }
    }

    async  snap() {
        //this.setState({ cameraLoader: true, camera: false, });
        console.log("Async snap()");
        this.state.photo = await this.camera.takePictureAsync();
        this.setState({ cameraLoader: false, camera: false, photoClicked: true });
    }

    savePhoto = () => {
        console.log('savePhoto ()');
        this.setState({ camera: false, cameraLoader: false, photoClicked: false, loader: false, visibleModal: null, verifyOtp: false, uploadPhoto: false, loader: true, });
        // console.log("File", this.state.photo);
        // let localUri = this.state.photo.uri;
        // let filename = localUri.split('/').pop();

        // let match = /\.(\w+)$/.exec(filename);
        // let type = match ? `image/${match[1]}` : `image`;

        // let formData = new FormData();
        // formData.append('del-per-id', this.state.dataObj.EmployeeId);
        // formData.append('order-id', this.state.orderId);
        // formData.append('rest-id', this.state.currentRestaurant.VendorId);
        // formData.append('order-image', { uri: localUri, name: filename, type });
        // console.log("COLLECT_ORDER_FROM_RESTAURANT formValue ", formData);
        // fetch(BASEPATH + Global.COLLECT_ORDER_FROM_RESTAURANT, {
        //     method: "POST",
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     },
        //     body: formData
        // }).then((response) => response.json()).then((responseJson) => {
        //     console.log("COLLECT ORDER response", responseJson);
        //     if (responseJson.Success == "Y") {
        //         this.setState({ visibleModal: null }, () => {
        //             this.fetchRestaurantDetails();
        //         });
        //     }
        //     else {
        //         ToastAndroid.show(responseJson.Message, ToastAndroid.SHORT);
        //     }
        //     // this.setState({ loader: false })
        // }).catch((error) => {
        //     console.log('Promise is rejected with error: ' + error);
        //     ToastAndroid.show("Network error , please try again", ToastAndroid.SHORT);
        //     this.setState({ networkRequest: true, loader: false, })
        // });
    }


    componentDidMount() {
        this.getUserData();
        this.cameraPermission();
    }

    __renderCameraOption = () => (
        <View style={{ flex: 1 }}>
            <Display enable={this.state.camera} style={{ backgroundColor: 'red', flex: 1, width: '100%' }}>
                <Camera style={{ flex: 1 }} type={this.state.type} ref={ref => { this.camera = ref; }}
                    pictureSize={this.state.pictureSize}
                    autoFocus={Camera.Constants.AutoFocus.on}
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            flexDirection: 'column',
                        }}>
                        <View style={styles.camerTop}>
                            <TouchableOpacity onPress={() => this.setState({ camera: false, visibleModal: null })} >
                                <Icon name="times" size={20} color="#cd2121" style={{}} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.cameraBottom}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity style={{ marginLeft: 8 }} onPress={() => this.snap()}>
                                    <Icon name="camera" size={35} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Camera>
            </Display>
            <Display enable={this.state.cameraLoader} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#CD2121" />
                <Text style={{ color: 'green', fontSize: 16 }}>Just a moment ..</Text>
            </Display>
            <Display enable={this.state.photoClicked && !this.state.cameraLoader} style={{ flex: 1, padding: 5 }}>
                <ScrollView>
                    <ImageBackground source={{ uri: this.state.photo.uri }} style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, padding: 10, }}>
                        <View style={{ height: 50, padding: 10, }}>
                            <TouchableOpacity style={{ width: 100 }} onPress={() => this.setState({ camera: true, photoClicked: false, cameraLoader: false })}>
                                <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 5, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon name="times" size={22} color="#cd2121" />
                                    <Text style={{ color: '#cd2121', marginLeft: 3 }}>Retry</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: 100, marginTop: 8 }} onPress={this.savePhoto.bind(this)}>
                                <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 5, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
                                    <Icon name="check" size={22} color="green" />
                                    <Text style={{ color: 'green', marginLeft: 3 }}>Upload</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </ScrollView>
            </Display>
        </View>
    )


    render() {
        return (

            <View style={styles.mainContainer}>
                <ImageBackground style={{ width: '100%', height: '100%' }} source={require('../assets/Backgrounds/profileBack.jpg')} resizeMode={'cover'}>
                    <View style={{ padding: 5, paddingTop: 10 }}>
                        {/* <TouchableOpacity>
                            <Icon name="arrow-left" size={16} color="#fff" />
                        </TouchableOpacity> */}
                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <View style={{ flex: 1, }}>
                                <Text style={{ color: '#fff', fontSize: 26, fontWeight: '400' }}>{this.state.customerName}</Text>
                                <Text style={{ color: '#e2e2e2', fontSize: 12 }}>{this.state.customerMail}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ width: 150, height: 150, borderRadius: 100, backgroundColor: '#f7f7d7', padding: 5, justifyContent: 'center', alignItem: 'center' }}>
                                    <ImageBackground style={{ width: 140, height: 180, }} source={require('../assets/Images/mainImg.png')} resizeMode={'contain'} />
                                    <TouchableOpacity style={{ backgroundColor: '#41a6e2', alignSelf: 'center', padding: 12, borderRadius: 30, marginTop: -60, marginLeft: 70 }} onPress={() => { this.setState({ camera: true, visibleModal: 7 }) }}>
                                        <Icon name="camera" size={20} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        <View style={{ flex: 2, marginLeft: 50 }}>
                            <TouchableOpacity style={styles.roundBox}>
                                <Icon name="history" size={25} color="#d81e5b" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 8, alignItems: 'flex-start', justifyContent: 'center', marginLeft: 6 }}>
                            <Text style={{ color: '#b2b0b0', fontSize: 12 }}>OrderHistory</Text>
                            <TouchableOpacity>
                                <Text style={{ color: '#000', fontSize: 16, fontWeight: '500' }}>Check Your Order History</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 2, marginLeft: 50 }}>
                            <TouchableOpacity style={styles.roundBox}>
                                <Icon name="phone" size={25} color="#d81e5b" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 8, alignItems: 'flex-start', justifyContent: 'center', marginLeft: 6 }}>
                            <Text style={{ color: '#b2b0b0', fontSize: 12 }}>Support</Text>
                            <TouchableOpacity onPress={() => OpenAnything.Call(7978915803)}>
                                <Text style={{ color: '#000', fontSize: 16, fontWeight: '500' }}>Contact Us</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 2, marginLeft: 50 }}>
                            <TouchableOpacity style={styles.roundBox}>
                                <Icon name="edit" size={25} color="#d81e5b" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 8, alignItems: 'flex-start', justifyContent: 'center', marginLeft: 6 }}>
                            <Text style={{ color: '#b2b0b0', fontSize: 12 }}>Disease</Text>
                            <TouchableOpacity onPress={() => { this.props.navigation.navigate('Disease') }}>
                                <Text style={{ color: '#000', fontSize: 16, fontWeight: '500' }}>Add any disease you have</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 2, marginLeft: 50 }}>
                            <TouchableOpacity style={styles.roundBox}>
                                <Icon name="briefcase" size={25} color="#d81e5b" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 8, alignItems: 'flex-start', justifyContent: 'center', marginLeft: 6 }}>
                            <Text style={{ color: '#b2b0b0', fontSize: 12 }}>Wallet</Text>
                            <TouchableOpacity>
                                <Text style={{ color: '#000', fontSize: 16, fontWeight: '500' }}>check your wallet balance</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={{ backgroundColor: '#d81e5b', width: '70%', alignSelf: 'center', borderRadius: 20, padding: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20 }} onPress={() => { this.logout() }}>
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>LOGOUT</Text>
                    </TouchableOpacity>

                    <Text style={{ marginTop: 25, color: '#404042', fontSize: 10, alignSelf: 'center' }}>Version 1.0</Text>
                </ImageBackground>
                <Modal isVisible={this.state.visibleModal === 7} style={styles.bottomModal} onBackButtonPress={() => this.setState({ visibleModal: null })} onRequestClose={() => { this.setState({ visibleModal: null }) }}>
                    {this.__renderCameraOption()}
                </Modal>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        marginTop: Expo.Constants.statusBarHeight,
    },
    roundBox: {
        backgroundColor: '#f7f7d7', marginTop: 10
        , borderRadius: 30, shadowColor: '#000', shadowOpacity: .58, height: 60,
        shadowRadius: 16, elevation: 24, padding: 10,
        shadowOffset: {
            height: 12,
            width: 12
        },
        justifyContent: 'center', alignItems: 'center',
        width: 60
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    camerTop:
    {
        flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', paddingHorizontal: 15,
    },
    cameraBottom:
    {
        flex: 9, justifyContent: 'center', alignItems: 'center', padding: 20, flexDirection: 'row'

    },
});

export default ProfileScreen;