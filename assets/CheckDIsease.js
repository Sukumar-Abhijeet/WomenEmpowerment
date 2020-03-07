import React from 'react';
import {
    View, StyleSheet, AsyncStorage, ImageBackground, Text, TouchableOpacity, Image, ActivityIndicator, ScrollView, Dimensions, CheckBox
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as OpenAnything from 'react-native-openanything';
import Modal from 'react-native-modal';
import Display from 'react-native-display';
import { Camera, Permissions, } from 'expo';
import { TouchableRipple } from 'react-native-paper';
// import { CheckBox, } from 'native-base'
class CheckDisease extends React.Component {
    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);
        this.state = {
            Disease: [
                {
                    "Name": "Cancer",
                    "Value": false,
                },
                {
                    "Name": "Diabetis",
                    "Value": false,
                },
                {
                    "Name": "Gastriec",
                    "Value": false,
                },
                {
                    "Name": "Heart Disease",
                    "Value": false,
                },
                {
                    "Name": "High blood pressure",
                    "Value": false,
                },
                {
                    "Name": "Hyper tension",
                    "Value": false,
                },
                {
                    "Name": "Kidney disease",
                    "Value": false,
                },
                {
                    "Name": "lungs disease",
                    "Value": false,
                },
                {
                    "Name": "Others",
                    "Value": false,
                },

            ],
        }
    }

    async retrieveItem(key) {
        console.log("CheckDisease retrieveItem() key: ", key);
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
        console.log("CheckDisease storeItem() key: ", key);
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



    componentDidMount() {

    }

    selectReason(disease) {
        console.log("Disease : ", disease);

    }

    sendReport() {
        console.log('CheckDisease sendReport');
        this.props.navigation.navigate('Tabs')
    }




    render() {
        return (

            <View style={styles.mainContainer}>
                <View style={styles.header}>
                    <View style={{ flex: 1, flexDirection: 'row', }}>
                        <TouchableRipple>
                            <Image source={require('../assets/icon.png')} style={{ width: 25, height: 25, alignSelf: 'flex-end' }} resizeMode={'contain'} />
                        </TouchableRipple>
                        <Text style={{ color: '#d81e5b', marginLeft: 10, fontSize: 18, fontWeight: '600', alignSelf: 'center' }}>DISEASE</Text>
                    </View>
                </View>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={{ padding: 10, height: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ebebeb' }}>
                        <Text style={{ fontSize: 18, fontWeight: '400', color: '#4c4949' }}>Help us to take care of what you order and eat</Text>
                        <Text style={{ fontSize: 12, fontWeight: '200', color: '#848383' }}>Please Select the diseases you are suffering from</Text>
                    </View>
                    {this.state.Disease.map((disease, index) => (
                        <View style={{ flexDirection: 'row', marginTop: 5, marginBottom: 5, padding: 10 }} key={index}>
                            <CheckBox checked={disease.Value}
                                onPress={() => this.selectReason(disease)}
                                color="#2dbe60"
                            />
                            <Text style={{ marginLeft: 12, alignSelf: 'flex-end', fontWeight: '500', fontSize: 16, marginTop: -6 }}>{disease.Name}</Text>
                        </View>
                    ))}

                    <TouchableOpacity style={{ alignSelf: 'center', padding: 5, width: 100, height: 40, borderRadius: 20, backgroundColor: '#d81e5b', marginTop: 10 }} onPress={() => { this.sendReport() }}>
                        <Text style={{ fontSize: 23, fontWeight: '400', color: '#fff', alignSelf: 'center', marginTop: 2 }}>Submit</Text>
                    </TouchableOpacity>
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

});

export default CheckDisease;