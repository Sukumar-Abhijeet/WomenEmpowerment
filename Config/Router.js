import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from '../Screens/HomeScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import LoginScreen from '../Screens/LoginScreen';
import SearchScreen from '../Screens/SearchScreen';
import AuthenticationScreen from '../Screens/AuthenticationScreen';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { TabIcon } from '../vectoricons/TabIcon';
import SignUpScreen from '../Screens/SignUpScreen';
import CartScreen from '../Screens/CartScreen';
import vendorProductsScreen from '../Screens/vendorProductsScreen';
import productDetailScreen from '../Screens/productDetailScreen';
import PaymentScreen from '../Screens/PaymentScreen';
import CheckDisease from '../assets/CheckDIsease';

export const Tabs = createMaterialBottomTabNavigator({
    Home: {
        screen: HomeScreen,
        navigationOptions: {
            tabBarIcon: ({ focused, tintColor }) => (
                <TabIcon
                    iconDefault='ios-home'
                    iconFocused='ios-home'
                    focused={focused}
                    activeTintColor={"#d81e5b"}
                    inactiveTintColor={"#fff"}
                    size={25}
                />
            ),
            labeled: false,
            tabBarColor: "#fff"
        }
    },

    // Search: {
    //     screen: SearchScreen,
    //     navigationOptions: {
    //         header: null,
    //         tabBarIcon: ({ focused, tintColor }) => (
    //             <TabIcon
    //                 iconDefault='ios-search'
    //                 iconFocused='ios-search'
    //                 focused={focused}
    //                 activeTintColor={"#d81e5b"}
    //                 inactiveTintColor={"#fff"}
    //                 size={25}
    //             />
    //         ),
    //         labeled: false,
    //         tabBarColor: "#fff"
    //     }
    // },
    // Cart: {
    //     screen: CartScreen,
    //     navigationOptions: {
    //         tabBarIcon: ({ focused, tintColor }) => (
    //             <TabIcon
    //                 iconDefault='ios-search'
    //                 iconFocused='ios-search'
    //                 focused={focused}
    //                 activeTintColor={"#d81e5b"}
    //                 inactiveTintColor={"#fff"}
    //                 size={25}
    //             />
    //         ),
    //         labeled: false,
    //         tabBarColor: "#fff"
    //     }
    // },
    Profile: {
        screen: ProfileScreen,
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
            tabBarIcon: ({ focused, tintColor }) => (
                <TabIcon
                    iconDefault='ios-contact'
                    iconFocused='ios-contact'
                    focused={focused}
                    size={25}
                    style={{ padding: 50 }}
                />
            ),
            labeled: false,
            tabBarColor: "#fff",
            height: 20,
            width: 20
        },
        activeTintColor: "#d81e5b",
        inactiveTintColor: "#fff"
    },
},
    {
        animationEnabled: true,
        tabStyle: {
            width: 2,
            height: 2
        },
        swipeEnabled: true,
        barStyle: { paddingBottom: 0, backgroundColor: '#fff' }
    });
export const AppStack = createStackNavigator({

    Authentication:
    {
        screen: AuthenticationScreen,
        defaultNavigationOptions: {
            headerVisible: false,
        }
    },
    Login:
    {
        screen: LoginScreen,
        defaultNavigationOptions: {
            headerVisible: false,
        }
    },
    SignUp:
    {
        screen: SignUpScreen,
        defaultNavigationOptions: {
            headerVisible: false,
        }
    },
    Cart: {
        screen: CartScreen,
        defaultNavigationOptions: {
            headerVisible: false,
        }
    },
    vendorProducts:
    {
        screen: vendorProductsScreen,
        defaultNavigationOptions: {
            headerVisible: false,
        }
    },
    ProductDetail: {
        screen: productDetailScreen,
        defaultNavigationOptions: {
            headerVisible: false,
        }
    },
    Payment: {
        screen: PaymentScreen,
        defaultNavigationOptions: {
            headerVisible: false,
        }
    },
    Disease: {
        screen: CheckDisease,
        defaultNavigationOptions: {
            headerVisible: false,
        }
    },
    Tabs: {
        screen: Tabs,
        navigationOptions:
        {
            headerVisible: false,
            header: null
        }
    },
},
    {
        initialRouteName: 'Authentication'
    });

const LoginStack = createAppContainer(AppStack);
export default LoginStack;
