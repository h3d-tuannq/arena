import React from 'react';
import {Text, View, Button, TouchableOpacity, RefreshControl} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import SettingScreen from './views/setting/SettingScreen';
import MenuIcon from '../assets/icon/menu.svg';
import BackIconSvg from '../assets/icon/icon-back.svg'
import Style from './def/Style'
import {OfflineHelper} from "./def/OfflineHelper";




const RootStack = createStackNavigator();

class SettingStack extends React.Component {
    constructor(props){
        super(props);

    }
    render() {
        return (
            <RootStack.Navigator
                screenOptions={{
                    headerBackTitleVisible: false
                }}
            >
                <RootStack.Screen name="setting-screen" component={SettingScreen} options={{
                    title: "Cài đặt",
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
            </RootStack.Navigator>
        )
    }
}

export default SettingStack;
