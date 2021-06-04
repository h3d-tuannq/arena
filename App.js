/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
    Dimensions,
    StatusBar,
    PixelRatio,
    View,
    Button,
    TouchableOpacity,
    Text,
    Alert,
    Modal,
    ActivityIndicator
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNRestart from 'react-native-restart';
import { createDrawerNavigator,
    DrawerItemList,
    DrawerContentScrollView,
    DrawerItem } from '@react-navigation/drawer';

import AsyncStorage from '@react-native-async-storage/async-storage'


import Style from './src/def/Style'
import Def from './src/def/Def'

import PolicyIcon from './assets/icon/icon-policy.svg';
import GuideIcon from './assets/icon/icon-how-to-use.svg'
import GalleryIcon from './assets/icons/list.svg'
import GallerySelectedIcon from './assets/icons/List b.svg';

import TileSelectedIcon from './assets/icons/Tile b.svg';
import TileIcon from './assets/icons/Tile.svg';

import RuleIcon from './assets/icon/icon-rule.svg';
import UserController from './src/controller/UserController'
import FlatController from './src/controller/FlatController'

import {createStackNavigator} from '@react-navigation/stack';

import BackIcon from './assets/icon/icon-back.svg';

import FlatStack from './src/FlatStack';
import ProductStack from './src/ProductStack';
import DesignStack from './src/DesignStack';
import SettingStack from './src/SettingStack';
import NetInfo from "@react-native-community/netinfo";




NetInfo.addEventListener(async networkState => {
    console.log("Connection type - ", networkState.type);
    let msg;
    Def.NetWorkMode = JSON.parse(await AsyncStorage.getItem('network_mode')) == 1;
    Def.NetWorkConnect = JSON.parse(await AsyncStorage.getItem('network_connect')) == 1;
    if((networkState.isConnected != Def.NetWorkConnect)){
        await AsyncStorage.setItem('network_connect' , networkState.isConnected ? '1' : '0');
        if(networkState.isConnected) {
            msg = 'Mạng internet được khôi phục, bạn đồng bộ dữ liệu Offline sử dụng phiên bản online'
            Alert.alert(
                "Thông báo",
                msg,
                [
                    {   // Chuyển sang trạng thái online
                        text: "Online",
                        onPress: async () => {
                            console.log('Change Mode');
                            Def.NetWorkMode = networkState.isConnected;
                            await AsyncStorage.setItem('network_mode', Def.NetWorkMode ? '1' : '0')
                            if (Def.NetWorkMode == true) {
                                // if(Def.setLoading){
                                //     Def.setLoading(true);
                                // }
                                FlatController.syncOfflineDataToServer(OfflineHelper.syncSuccessCallback, OfflineHelper.syncFalseCallback);
                            } else {

                            }


                        },
                        style: 'cancel',
                    },
                    {
                        text: "Offline",
                        style: 'cancel',
                    }
                ],
                {cancelable: false},
            );
        }
        // Trong trường hợp mất mạng
        else {
            msg = 'Mất kết nối mạng internet vui chuyển trạng thái Offline';
            Alert.alert(
                "Thông báo",
                msg,
                [
                    {
                        text: "Offline",
                        onPress: async () => {
                            console.log('Change Mode');
                            Def.NetWorkMode = networkState.isConnected;
                            await AsyncStorage.setItem('network_mode', Def.NetWorkMode ? '1' : '0')
                            if (!Def.NetWorkMode) {
                                await OfflineHelper.initOfflineMode();
                                RNRestart.Restart();
                            } else {

                            }


                        },
                        style: 'cancel',
                    },
                    {
                        text: "Cancel",
                        style: 'cancel',
                    }
                ],
                {cancelable: false},
            );
        }

        }
});

Def.initFunc();


const {width, height} = Dimensions.get('window');

const Drawer = createDrawerNavigator();

import {StyleSheet} from 'react-native'
import LoginStack from "./src/LoginStack";
import FlatHelper from "./src/def/FlatHelper";

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
                    {Def.email == null || Def.email == '' ? 'WSH' : 'WSH'}
                </Text>
                <View />
            </View>
            <DrawerContentScrollView {...props}>
                <View style={{flex: 1}}>
                    {Def.NetWorkMode && (Def.email == null || Def.email == '')  ? (
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



                        </View>
                    ) : (
                        <View
                            style={{
                                justifyContent: 'space-between',
                                paddingVertical: PixelRatio.get() < 2 ? 3 :5,
                                paddingHorizontal: 10,
                                marginTop: PixelRatio.get() < 2 ? 6 :10,
                                marginBottom: PixelRatio.get() < 2 ? 6 :10,
                            }}>

                            <View style={{paddingBottom:10}}>
                                <Text>
                                    {Def.user_info ? Def.user_info['username'] : ''}
                                </Text>

                                <Text>
                                    {FlatHelper.getRoleName(FlatHelper.getPriorityRole(Def.user_info))}
                                </Text>

                            </View>
                            <View style={{flexDirection : 'row', justifyContent: 'space-between'}}>

                                {
                                    Def.NetWorkMode ?
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
                                    </TouchableOpacity> : null
                                }


                            {
                                ((Def.NetWorkMode != Def.NetWorkConnect) || Def.NetWorkMode) ?
                                    <TouchableOpacity
                                        style={{
                                            width: width * 0.35,
                                            borderRadius: 5,
                                            paddingVertical: PixelRatio.get() < 2 ? 5 :8,
                                            backgroundColor: Style.DEFAUT_BLUE_COLOR,
                                            alignItems: 'center',

                                        }}
                                        onPress={() => {
                                            OfflineHelper.changeAppMode();
                                        }}>
                                        <Text style={{fontSize: Style.TITLE_SIZE, color: '#fff'}}> {Def.NetWorkMode ? 'Offline' : 'Online'} </Text>
                                    </TouchableOpacity> : null

                            }
                            </View>

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
const Stack = createStackNavigator();

function AppStack() {
    return (
        <RootStack.Navigator headerMode="none">
            <RootStack.Screen name="Flat" component={FlatStack} />
            <RootStack.Screen name="Login" component={LoginStack} />
        </RootStack.Navigator>
        );

}

function OfflineLibStack() {
    return (
        <Stack.Navigator headerMode="none">
            <Stack.Screen name="Design" component={OfflineTab} />
            <RootStack.Screen name="Login" component={LoginStack} />
        </Stack.Navigator>
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
                    title: 'Căn hộ',
                    drawerIcon: ({focused: boolean, color: string, size: number}) => {
                        return <Icon name="building" size={iconSize} />;
                    },
                }}
            />

            <Drawer.Screen
                name="Offline-Lib"
                component={OfflineLibStack}
                options={{
                    title: 'Thư viện Offline',
                    drawerIcon: ({focused: boolean, color: string, size: number}) => {
                        return <Icon name="folder-open" size={iconSize} />;
                    },
                }}
            />


            <Drawer.Screen
                name="Setting"
                component={SettingStack}
                options={{
                    drawerIcon: ({focused: boolean, color: string, size: number}) => {
                        return <Icon name="cogs" size={iconSize} />;
                    },
                }}
            />
        </Drawer.Navigator>
    );
}
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {OfflineHelper} from './src/def/OfflineHelper';

const Tab = createBottomTabNavigator();

function OfflineTab() {
    return (
        <Tab.Navigator
            style={{height: 120, paddingVertical: 20 , backgroundColor : 'red'}}

            // tabBar={(props) => <MyTabBar {...props} item={null} />}
            initialRouteName={'Design'}
            tabBarOptions={{
                activeTintColor: Style.DEFAUT_RED_COLOR,
                inactiveTintColor: '#b3b3b3',
                labelStyle: {
                    fontSize: Style.NORMAL_SIZE,
                },
                style: {height: 50},
                tabStyle: {
                    paddingVertical: 5,
                    paddingTop :8,
                },
                // item:program
            }}>

            <Tab.Screen
                name="Design"
                component={DesignStack}
                options={(route) => {
                    return false
                        ? {tabBarVisible: false}
                        : {
                            tabBarLabel: 'Thiết kế',
                            tabBarIcon: ({focused, color, size}) => {
                                if (focused) {
                                    return <GallerySelectedIcon style={styles.tabBarIconStyle} />;
                                    // return <MyProfileIconSelect style={styles.tabBarIconStyle} />;
                                }
                                return <GalleryIcon style={styles.tabBarIconStyle} />;
                            },
                        };
                }}
            />

            <Tab.Screen
                name="Product"
                component={ProductStack}
                options={(route) => {
                    return false
                        ? {tabBarVisible: false}
                        : {
                            tabBarLabel: 'Sản phẩm',
                            tabBarIcon: ({focused, color, size}) => {
                                if (focused) {
                                    return <TileSelectedIcon style={styles.tabBarIconStyle} />;
                                    return <Icon name="th" size={25} color={Style.DEFAUT_RED_COLOR} />
                                    // return <MyProfileIconSelect style={styles.tabBarIconStyle} />;
                                }
                                return <TileIcon style={styles.tabBarIconStyle} />;
                            },
                        };
                }}
            />
        </Tab.Navigator>
    );
}

const LoadingModal = (props) => (
        <Modal onRequestClose={() => {console.log('test')}} visible={props.visible} transparent={true} styles={{backgroundColor : '#green'}} >
            <View style={{ justifyContent : 'center', alignItems:'center', flex: 1 }}>
                <ActivityIndicator size="large" color="#0c5890"/>
            </View>
        </Modal>
    )



class App extends React.Component {

    constructor(props){
        super(props);
        this.state={'isLoading' : false};
        this.setLoading = this.setLoading.bind(this);
        Def.setLoading = this.setLoading;

    }

    setLoading = (value) => {
        this.setState({isLoading:value});
    }

   async componentDidMount(){
        let network_mode = JSON.parse(await AsyncStorage.getItem('network_mode'));
        Def.NetWorkMode = network_mode == 1 || network_mode == '1' ;
        AsyncStorage.getItem('user_info').then(async (value) => {
            if(value){
                Def.user_info = JSON.parse(value);
                Def.username = Def.user_info['user_name'];
                Def.email = Def.user_info['email'];

                AsyncStorage.getItem('flat_data').then((value) => {
                    if(value){
                        Def.flat_data = JSON.parse(value);
                        console.log("FlatData Length : " + (Def.flat_data ? Def.flat_data.length : 0 ));
                    }
                });

                AsyncStorage.getItem('requestRepairsTree').then(value => {
                   if(value){
                       Def.requestRepairsTree = JSON.parse(value);
                   }
                });
                let offlineFlatDataStr = await  AsyncStorage.getItem('offlineFlatData');
                OfflineHelper.offlineFlatData = offlineFlatDataStr ?JSON.parse(offlineFlatDataStr) : {};

                OfflineHelper.offlineFlatDataArr = JSON.parse( await  AsyncStorage.getItem('offlineFlatDataArr'));
                let flatChangeDataStr = await  AsyncStorage.getItem('flatChangeData');
                OfflineHelper.flatChangeData = flatChangeDataStr && flatChangeDataStr != undefined ? JSON.parse( flatChangeDataStr) : {};
                // console.log('OfflineHelper.offlineFlatDataArr : ' + JSON.stringify(OfflineHelper.offlineFlatDataArr) )



                // AsyncStorage.getItem('offlineFlatData').then(value => {
                //     if(value){
                //         OfflineHelper.offlineFlatData = JSON.parse(value);
                //     } else {
                //
                //     }
                // });
                AsyncStorage.getItem('pifChangeData').then(value => {
                    if(value){
                        OfflineHelper.pifChangeData = JSON.parse(value);
                        // console.log('OfflineHelper.pifChangeData.length ' + JSON.stringify(OfflineHelper.pifChangeData));
                    } else {

                    }
                });

                AsyncStorage.getItem('offlineDesignData').then(value => {
                    if(value){
                        OfflineHelper.offlineDesignData = JSON.parse(value);
                    } else {
                        console.log('Offline Data not found');
                    }
                });

                AsyncStorage.getItem('offlineProductData').then(value => {
                    if(value){
                        OfflineHelper.offlineProductData = JSON.parse(value);
                    } else {
                        console.log('Offline Data not found');
                    }
                });


                AsyncStorage.getItem('offlineRepairData').then(value => {
                    if(value){
                        OfflineHelper.offlineRepairData = JSON.parse(value);
                    }
                });

                // AsyncStorage.getItem('offlineFlatData').then(value => {
                //     if(value){
                //         OfflineHelper.offlineFlatData = JSON.parse(value);
                //     }
                // });

                AsyncStorage.getItem('offlineRequestTree').then(value => {
                    if(value){
                        OfflineHelper.offlineRequestTree = JSON.parse(value);
                    }
                });

                AsyncStorage.getItem('flat_current_page').then((value) => {
                    if(value){
                        Def.flatCurrentPage = value;
                    }
                });

            } else {
                AsyncStorage.removeItem('flat_data');
            }
        });


    }



    render() {
        return (
            <NavigationContainer>
                <AppDrawer/>
                <LoadingModal visible={this.state.isLoading}/>
            </NavigationContainer>
        );
    }
}

const styles = StyleSheet.create({

});

export default App;
