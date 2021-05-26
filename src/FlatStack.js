import React from 'react';
import {Text, View, Button, TouchableOpacity, RefreshControl} from 'react-native';
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

    }

    goToSendRequestRepairScreen = (flat) => {
        console.log('');
    }

    downloadFlat = (flatId) => {
        if(OfflineHelper.downloadRepariItemInflat){
            OfflineHelper.downloadRepariItemInflat();
        }
    }

    render() {
        return (
            <RootStack.Navigator>
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
                    headerRight: Def.user_info ?  () => (

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
                            {/*<Text style={{color:'#fff'}}>*/}
                                {/*{route.params.item.id}*/}
                            {/*</Text>*/}

                        </TouchableOpacity>


                    ) : null,

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
