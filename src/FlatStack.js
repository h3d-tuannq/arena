import React from 'react';
import {Text, View, Button, TouchableOpacity} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';


import FlatListScreen from './views/flat/FlatListScreen';
import FlatDetailScreen from './views/flat/FlatDetailScreen';
import ProductDetailScreen from './views/flat/ProductDetailScreen'
import MenuIcon from '../assets/icon/menu.svg';

import BackIconSvg from '../assets/icon/icon-back.svg'

import Style from './def/Style'

const RootStack = createStackNavigator();

class FlatStack extends React.Component {
    constructor(props){
        super(props);
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
                <RootStack.Screen name="flat-detail" component={FlatDetailScreen} options={{
                    title: 'Chi tiết căn hộ',
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
