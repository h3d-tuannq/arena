import React from 'react';
import {Text, View, Button, TouchableOpacity, RefreshControl} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import DesignListScreen from './views/design/DesignListScreen';
import DesignDetailScreen from './views/design/DesignDetailScreen';
import MenuIcon from '../assets/icon/menu.svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import BackIconSvg from '../assets/icon/icon-back.svg'
import Style from './def/Style'
import Def from './def/Def'
import FlatHelper from "./def/FlatHelper";
import {OfflineHelper} from "./def/OfflineHelper";
import ProductDetailScreen from "./views/product/ProductDetailScreen";
const RootStack = createStackNavigator();
class DesignStack extends React.Component {
    downloaded = 0;
    downloadFalse = 0;

    constructor(props){
        super(props);
        this.downloadDesignList = this.downloadDesignList.bind(this);
    }

    goToSendRequestRepairScreen = (flat) => {
        console.log('');
    };

    downloadDesignList = () => {
        if(OfflineHelper.downloadDesignList){
            OfflineHelper.downloadDesignList();
        }
    };

    render() {
        return (
            <RootStack.Navigator
                screenOptions={{
                    headerBackTitleVisible: false
                }}
            >
                <RootStack.Screen name="design-screen" component={DesignListScreen} options={{
                    title: "Danh sách căn mẫu",
                    headerLeft: () => (
                        <TouchableOpacity
                            style={
                                {
                                    width: Style.DRAWER_MENU_SIZE,
                                    height: Style.DRAWER_MENU_SIZE,
                                    justifyContent: 'center',
                                    paddingLeft:15 ,
                                    alignItems : 'center'
                                }
                            }
                            onPress={() => this.props.navigation.toggleDrawer()}>
                            <MenuIcon
                                width={Style.DRAWER_MENU_ICON_SIZE}
                                height={Style.DRAWER_MENU_ICON_SIZE}
                            />
                        </TouchableOpacity>

                    ),
                    headerStyle: {
                        backgroundColor: Style.DEFAUT_BLUE_COLOR,
                        height: Style.HEADER_HEIGHT,
                    },
                    headerRight:  Def.user_info && Def.NetWorkMode && Def.NetWorkConnect ?  () => (

                        <TouchableOpacity
                            style=  {
                                {
                                    width: Style.DRAWER_MENU_SIZE,
                                    height: Style.DRAWER_MENU_SIZE,
                                    justifyContent: 'center',
                                    paddingRight:5 ,
                                    alignItems : 'center'
                                }
                            }
                            onPress={this.downloadDesignList}>
                            <Icon name="download" size={20} color="#fff" />
                        </TouchableOpacity>


                    ) : null,
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        // alignSelf: 'center'
                    },
                    headerBackImage: ()=> {
                        return <BackIconSvg width={Style.BACK_ICON_SIZE} height={Style.BACK_ICON_SIZE} />
                    }
                }} />
                <RootStack.Screen name="design-detail" component={DesignDetailScreen} options={({route}) => {
                    return ({
                    title: 'Chi tiết căn mẫu',
                    headerStyle: {
                        backgroundColor: Style.DEFAUT_BLUE_COLOR,
                        height: Style.HEADER_HEIGHT,
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {

                    },
                    headerRight: Def.user_info && false?  () => (

                        <TouchableOpacity
                            style=  {
                                {
                                    width: Style.DRAWER_MENU_SIZE,
                                    height: Style.DRAWER_MENU_SIZE,
                                    justifyContent: 'center',
                                    paddingRight:5 ,
                                    alignItems : 'center'
                                }
                            }
                            onPress={this.downloadDesignList}>
                            <Icon name="calendar" size={30} color="#fff" />
                        </TouchableOpacity>


                    ) : null,

                    headerBackImage: ()=> {
                        return <BackIconSvg width={Style.BACK_ICON_SIZE} height={Style.BACK_ICON_SIZE} />
                    }
                })}
                } />
                <RootStack.Screen name="product-detail" component={ProductDetailScreen} options={({route}) => {
                    return ({
                        title: 'Chi tiết sản phẩm',
                        headerStyle: {
                            backgroundColor: Style.DEFAUT_BLUE_COLOR,
                            height: Style.HEADER_HEIGHT,
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {

                        },
                        headerRight: false?  () => (

                            <TouchableOpacity
                                style=  {
                                    {
                                        width: Style.DRAWER_MENU_SIZE,
                                        height: Style.DRAWER_MENU_SIZE,
                                        justifyContent: 'center',
                                        paddingRight:5 ,
                                        alignItems : 'center'
                                    }
                                }
                                onPress={() => this.goProductList}>
                                <Icon name="download" size={25} color="#fff" />
                            </TouchableOpacity>


                        ) : null,

                        headerBackImage: ()=> {
                            return <BackIconSvg width={Style.BACK_ICON_SIZE} height={Style.BACK_ICON_SIZE} />
                        }
                    })}
                } />

            </RootStack.Navigator>
        )
    }
}

export default DesignStack;
