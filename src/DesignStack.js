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
const RootStack = createStackNavigator();
class DesignStack extends React.Component {
    constructor(props){
        super(props);
    }

    goToSendRequestRepairScreen = (flat) => {
        console.log('');
    }

    render() {
        return (
            <RootStack.Navigator>
                <RootStack.Screen name="flat-screen" component={DesignListScreen} options={{
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
                            onPress={() => this.goProductList}>
                            <Icon name="download" size={30} color="#fff" />
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
