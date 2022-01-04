import React from 'react'
import {Text, View, Button, TouchableOpacity} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack';

import SignInScreen from './views/user/SignIn'
import SignUpScreen from './views/user/SignUp'
import ForgetPassScreen from './views/user/ForgetPassword'

import BackIconSvg from '../assets/icon/icon-back.svg'
import Style from "../src/def/Style";

const Stack = createStackNavigator();
const RootStack = createStackNavigator();

class LoginStack extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <RootStack.Navigator  mode='modal'
                                  screenOptions={{
                                      headerBackTitleVisible: false
                                  }}
            >
                <RootStack.Screen name="signIn" component={SignInScreen} options={{
                    title: 'Đăng nhập',
                    headerStyle: {
                        backgroundColor: Style.DEFAUT_BLUE_COLOR,
                        height: Style.HEADER_HEIGHT,
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackImage: ()=> {
                        return <BackIconSvg width={Style.BACK_ICON_SIZE} height={Style.BACK_ICON_SIZE} />
                    }
                }} />
                <RootStack.Screen name="signUp" component={SignUpScreen}
                                  options={{
                                      title: 'Đăng ký',
                                      headerStyle: {
                                          backgroundColor: Style.DEFAUT_BLUE_COLOR,
                                          height: Style.HEADER_HEIGHT,
                                      },
                                      headerTintColor: '#fff',
                                      headerTitleStyle: {
                                          // fontWeight: 'bold',
                                      },
                                      headerBackImage: ()=> {
                                          return <BackIconSvg width={Style.BACK_ICON_SIZE} height={Style.BACK_ICON_SIZE} />
                                      }
                                  }}
                />
                <RootStack.Screen name="forgetPass" component={ForgetPassScreen}
                                  options={{
                                      title: 'Quên mật khẩu',
                                      headerStyle: {
                                          backgroundColor: Style.DEFAUT_BLUE_COLOR,
                                          height: Style.HEADER_HEIGHT,
                                      },
                                      headerTintColor: '#fff',
                                      headerTitleStyle: {
                                          // fontWeight: 'bold',
                                      },
                                      headerBackImage: ()=> {
                                          return <BackIconSvg width={Style.BACK_ICON_SIZE} height={Style.BACK_ICON_SIZE} />
                                      }
                                  }}

                />

            </RootStack.Navigator>
        )
    }
}

export default LoginStack;
