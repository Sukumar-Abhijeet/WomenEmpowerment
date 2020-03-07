import React from 'react';
import {
    View, StyleSheet, AsyncStorage,
} from 'react-native';
import Display from 'react-native-display';
import { TabIcon } from '../vectoricons/TabIcon';
class SearchScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    async retrieveItem(key) {
        console.log("SearchScreen retrieveItem() key: ", key);
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
        console.log("SearchScreen storeItem() key: ", key);
        try {
            var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
            console.log(jsonOfItem);
            return jsonOfItem;
        } catch (error) {
            console.log(error.message);
        }
    }


    render() {
        return (

            <View>

            </View>

        );
    }
}

const styles = StyleSheet.create({

});

export default SearchScreen;