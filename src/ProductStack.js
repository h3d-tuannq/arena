import React from 'react';
import {Text, View, Button, TouchableOpacity, RefreshControl} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import ProductListScreen from './views/product/ProductListScreen';
import ProductDetailScreen from './views/product/ProductDetailScreen'
import MenuIcon from '../assets/icon/menu.svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import BackIconSvg from '../assets/icon/icon-back.svg'
import Style from './def/Style'
import Def from './def/Def'
import {OfflineHelper} from './def/OfflineHelper';




const RootStack = createStackNavigator();

class ProductStack extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          total:Def.design_data.length,
          downloaded: 0,
        };
        this.downloadProductSuccess = this.downloadProductSuccess.bind(this);
        this.downloadProduct = this.downloadProduct.bind(this);
    }

    goToSendRequestRepairScreen = (flat) => {
        console.log('');
    }
    downloadProduct = () => {
        if(OfflineHelper.downloadProductList) {
            console.log('Download Product List');
            OfflineHelper.downloadProductList();
        } else {
            console.log('Not exist dowload function');
        }
    }

    downloadProductSuccess = (data) => {

    }

    render() {
        return (
            <RootStack.Navigator>
                <RootStack.Screen name="product-list-screen" component={ProductListScreen} options={{
                    title: "Sản phẩm mẫu",
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
                    headerRight: Def.NetWorkMode && Def.NetWorkConnect ?  () => (
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
                            onPress={this.downloadProduct}>
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

export default ProductStack;
