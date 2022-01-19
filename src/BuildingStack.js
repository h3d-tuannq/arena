import React from 'react';
import {Text, View, Button, TouchableOpacity, RefreshControl} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import BuildingListScreen from './views/building/BuildingListScreen';
import BuildingDetailScreen from './views/building/BuildingDetailScreen';
import MenuIcon from '../assets/icon/menu.svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import BackIconSvg from '../assets/icon/icon-back.svg'
import Style from './def/Style'
import Def from './def/Def'
import FlatHelper from "./def/FlatHelper";
import {OfflineHelper} from "./def/OfflineHelper";
import ProductDetailScreen from "./views/product/ProductDetailScreen";
const RootStack = createStackNavigator();
class BuildingStack extends React.Component {
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
                <RootStack.Screen name="design-screen" component={BuildingListScreen} options={{
                    title: "Danh sách dự án",
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
                <RootStack.Screen name="building-detail" component={BuildingDetailScreen} options={({route}) => {
                    return ({
                    title: 'Giới thiệu dự án',
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
                })}
                } />
            </RootStack.Navigator>
        )
    }
}

export default BuildingStack;
