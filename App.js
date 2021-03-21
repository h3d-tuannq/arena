/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Dimensions, StatusBar, PixelRatio, View , Button , TouchableOpacity, Text } from  'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator,
    DrawerItemList,
    DrawerContentScrollView,
    DrawerItem } from '@react-navigation/drawer';


import Style from './src/def/Style'
import Def from './src/def/Def'

import PolicyIcon from './assets/icon/icon-policy.svg';
import GuideIcon from './assets/icon/icon-how-to-use.svg'
import RuleIcon from './assets/icon/icon-rule.svg';

import {createStackNavigator} from '@react-navigation/stack';

import BackIcon from './assets/icon/icon-back.svg';

import FlatStack from './src/FlatStack';

const {width, height} = Dimensions.get('window');

const Drawer = createDrawerNavigator();

import {StyleSheet} from 'react-native'
import LoginStack from "./src/LoginStack";

function CustomDrawerContent(props) {
    return (
        <View style={{flex: 1}}>
            <View
                style={{
                    height: Style.HEADER_HEIGHT,
                    backgroundColor: Style.DEFAUT_BLUE_COLOR,
                    flexDirection: 'row',
                    // justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                <TouchableOpacity
                    style={{padding: 5}}
                    onPress={() => {
                        props.navigation.closeDrawer();
                    }}>
                    <BackIcon width={25} height={25} />
                </TouchableOpacity>
                <Text style={{marginLeft: 30, color: '#fff' , fontSize: Style.TITLE_SIZE}}>
                    {Def.email == null || Def.email == '' ? 'Cài đặt' : 'Cài đặt'}
                </Text>
                <View />
            </View>
            <DrawerContentScrollView {...props}>
                <View style={{flex: 1}}>
                    {Def.email == null || Def.email == '' ? (
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingVertical: PixelRatio.get() < 2 ? 3 :5,
                                paddingHorizontal: 10,
                                marginTop: PixelRatio.get() < 2 ? 6 :10,
                                marginBottom: PixelRatio.get() < 2 ? 6 :10,
                                // backgroundColor : 'red'
                            }}>
                            <TouchableOpacity
                                style={{
                                    width: width * 0.35,
                                    borderRadius: 5,
                                    paddingVertical: PixelRatio.get() < 2 ? 5 :8,
                                    backgroundColor: Style.DEFAUT_BLUE_COLOR,
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    props.navigation.navigate('Login', {screen: 'signIn'});
                                }}>
                                <Text style={{fontSize: Style.TITLE_SIZE, color: '#fff'}}> Đăng nhập </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    width: width * 0.35,
                                    borderRadius: 5,
                                    paddingVertical: PixelRatio.get() < 2 ? 5 :8,
                                    backgroundColor: Style.DEFAUT_RED_COLOR,
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    props.navigation.navigate('Login', {screen: 'signUp'});
                                }}>
                                <Text style={{fontSize: Style.TITLE_SIZE, color: '#fff'}}> Đăng ký </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingVertical: PixelRatio.get() < 2 ? 3 :5,
                                paddingHorizontal: 10,
                                marginTop: PixelRatio.get() < 2 ? 6 :10,
                                marginBottom: PixelRatio.get() < 2 ? 6 :10,
                            }}>
                            <TouchableOpacity
                                style={{
                                    width: width * 0.35,
                                    borderRadius: 5,
                                    paddingVertical: PixelRatio.get() < 2 ? 5 :8,
                                    backgroundColor: 'green',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    // AsyncStorage.removeItem('email');
                                    // AsyncStorage.removeItem('login_token');
                                    // AsyncStorage.removeItem('user_info');
                                    // AsyncStorage.removeItem('username');
                                    // AsyncStorage.removeItem('firebase_token');
                                    // AsyncStorage.removeItem('cart_data');
                                    // RNRestart.Restart();
                                    UserController.logoutLocal();
                                }}>
                                <Text style={{fontSize: Style.TITLE_SIZE, color: '#fff'}}> Đăng xuất </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    padding: 5,
                    paddingLeft: 10,
                    zIndex: 10,
                }}>
                <Text style={styles.infoText}>Hotline: +84 24 3936 9284</Text>
                <Text style={styles.infoText}>Email: arenacamranh@gmail.com</Text>
                <Text style={styles.infoText}>Website: https://arenacamranh.com</Text>
                <Text style={styles.infoText}>Phiên bản 1.0</Text>
            </View>
        </View>
    );
}

function HomeScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button
                onPress={() => navigation.navigate('Notifications')}
                title="Go to notifications"
            />
        </View>
    );
}

const RootStack = createStackNavigator();

function AppStack() {
    return (
        <RootStack.Navigator headerMode="none">
            <RootStack.Screen name="Flat" component={FlatStack} />
            <RootStack.Screen name="Login" component={LoginStack} />
        </RootStack.Navigator>
        );

}


function AppDrawer() {
    const iconSize = true <2 ? 18 : 20;
    return (
        <Drawer.Navigator
            drawerStyle={{
                width: width * 0.8,
            }}

            drawerContentOptions={{
                // activeTintColor: '#e91e63',
                itemStyle: { marginVertical: 0, height : true < 2 ? 35 :40, paddingVertical:0, justifyContent:'center'},
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            <Drawer.Screen
                name="Flat"
                component={AppStack}
                options={{
                    drawerIcon: ({focused: boolean, color: string, size: number}) => {
                        return <GuideIcon width={iconSize} height={iconSize} />;
                    },
                }}
            />
        </Drawer.Navigator>
    );
}


class App extends React.Component {
    render() {
        return (
            <NavigationContainer>
                <AppDrawer/>
            </NavigationContainer>
        );
    }
}

const styles = StyleSheet.create({

});

export default App;
