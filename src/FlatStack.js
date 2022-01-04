import React from 'react';
import {Text, View, Button, TouchableOpacity, RefreshControl, Alert} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import FlatListScreen from './views/flat/FlatListScreen';
import FlatDetailScreen from './views/flat/FlatDetailScreen';
import ProductDetailScreen from './views/flat/ProductDetailScreen'
import MenuIcon from '../assets/icon/menu.svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import BackIconSvg from '../assets/icon/icon-back.svg'
import Style from './def/Style'
import Def from './def/Def'
import FlatHelper from "./def/FlatHelper";
import {OfflineHelper} from "./def/OfflineHelper";

const RootStack = createStackNavigator();

class FlatStack extends React.Component {
    constructor(props){
        super(props);
        this.uploadOfflineFlat = this.uploadOfflineFlat.bind(this);

    }

    goToSendRequestRepairScreen = (flat) => {
        console.log('');
    }

    downloadFlat = (flatId) => {
        if(OfflineHelper.downloadRepariItemInflat){
            OfflineHelper.downloadRepariItemInflat();
        }
    }

    uploadAllOfflineFlat = () => {
        Alert.alert(
            "Thông báo",
            "Tính năng đồng bộ toàn bộ căn hộ đang phát triển",
            [
                {
                    text: "Ok",
                    style: 'Cancel',
                }
            ],
            {cancelable: false},
        );
    }

    uploadOfflineFlat = (flatId) => {
        Alert.alert(
            "Thông báo",
            "Tính năng đồng bộ căn hộ đang phát triển",
            [
                {
                    text: "Ok",
                    style: 'Cancel',
                }
            ],
            {cancelable: false},
        );
    }

    render() {
        return (
            <RootStack.Navigator
                screenOptions={{
                    headerBackTitleVisible: false
                }}
            >
                <RootStack.Screen name="flat-screen" component={FlatListScreen} options={{
                    title: "Danh sách căn hộ",
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

                    headerRight: !(Def.NetWorkMode == 1 || Def.NetWorkMode == '1') && Def.user_info  ?  () => {
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
                            disabled={OfflineHelper.checkChangeData()}
                            onPress={() => this.uploadAllOfflineFlat()}>
                            <Icon name="upload" size={20}
                                  color={OfflineHelper.checkChangeData() ? "#03fc66" : Style.GREY_BACKGROUND_COLOR } />

                        </TouchableOpacity>
                        } : null,

                    headerStyle: {
                        backgroundColor: Style.DEFAUT_BLUE_COLOR,
                        height: Style.HEADER_HEIGHT,
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        // alignSelf: 'center'
                    },
                    headerBackImage: ()=> {
                        return <BackIconSvg width={Style.BACK_ICON_SIZE} height={Style.BACK_ICON_SIZE} />
                    }
                }} />
                <RootStack.Screen name="flat-detail" component={FlatDetailScreen} options={({route}) => {
                    return ({
                    title: 'Chi tiết căn hộ',
                    headerStyle: {
                        backgroundColor: Style.DEFAUT_BLUE_COLOR,
                        height: Style.HEADER_HEIGHT,
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {

                    },
                    headerRight: Def.user_info ?  () => {
                        return (Def.NetWorkMode == 1 || Def.NetWorkMode == '1' ?

                                (Def.NetWorkMode == 1 || Def.NetWorkMode == '1') || !OfflineHelper.checkOffline(route.params.item, Def.FlatType)
                                ?
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
                                    onPress={() => this.downloadFlat(route.params.item.id)}>
                                    <Icon name="download" size={20} color={OfflineHelper.checkOffline(route.params.item, Def.FlatType) ? "#03fc66" : "#fff" } />
                                </TouchableOpacity>

                                :
                                OfflineHelper.checkChangeOfflineFlat(route.params.item) ?
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
                                        disabled={(route.params.item['update'] == 1 || route.params.item['update'] == '1') || OfflineHelper.checkChangeOfflineFlat(route.params.item)}
                                        onPress={() => this.uploadOfflineFlat(route.params.item.id)}>
                                        <Icon name="upload" size={20}
                                              color={(route.params.item['update'] == 1 || route.params.item['update'] == '1') || OfflineHelper.checkChangeOfflineFlat(route.params.item) ? "#03fc66" : Style.GREY_BACKGROUND_COLOR } />

                                    </TouchableOpacity>
                                    : null
                            : null
                            : null)
                        } : null


                    ,

                    headerBackImage: ()=> {
                        return <BackIconSvg width={Style.BACK_ICON_SIZE} height={Style.BACK_ICON_SIZE} />
                    }
                })}
                } />

                <RootStack.Screen name="product-detail" component={ProductDetailScreen} options={{
                    title: 'Chi tiết sản phẩm',
                    headerStyle: {
                        backgroundColor: Style.DEFAUT_BLUE_COLOR,
                        height: Style.HEADER_HEIGHT,
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {

                    },
                    headerBackImage: ()=> {
                        return <BackIconSvg width={Style.BACK_ICON_SIZE} height={Style.BACK_ICON_SIZE} />
                    }
                }} />


            </RootStack.Navigator>
        )
    }
}

export default FlatStack;
