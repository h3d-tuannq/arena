import React, {Component} from 'react'
import {
    Text,
    Image,
    StyleSheet,
    View,
    TextInput,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    Modal,PixelRatio, Keyboard
} from 'react-native'
import Style from "../../../src/def/Style";
import Def from "../../../src/def/Def";

import UserController from '../../../src/controller/UserController'

const {width,height} = Dimensions.get('window');

const LoadingModal = (props) => (
    <Modal onRequestClose={() => {console.log('test')}} visible={props.visible} transparent={true} styles={{backgroundColor : '#green'}} >
        <View style={{ justifyContent : 'center', alignItems:'center', flex: 1 }}>
            <ActivityIndicator size="large" color="#0c5890"/>
        </View>
    </Modal>
)

export default class SignIn extends Component {
    constructor(props){
        super(props);
        this.state = {
            focus : 0,
            email:"",
            password:"",
            isLoging : false,
        }
        this.signIn = this.signIn.bind(this);
        this.setLoader = this.setLoader.bind(this);
        this.loginFalseCallback = this.loginFalseCallback.bind(this);
        this.loginFalseCallback = this.loginFalseCallback.bind(this);
        Def.setLoader = this.setLoader;
        Def.setIsLogin = this.setLoader;
        this.loginSuccessCallback = this.loginSuccessCallback.bind(this);
    }

    setLoader(isLoging){
        this.setState({isLoging:isLoging});
    }

    signIn(){
        console.log('Email : ' + this.state.email);
        if(!this.state.email){
            alert("Email không đúng định dạng");
        } else if(this.state.password.length < 6){
            alert("Mật khẩu phải dài hơn 8 ký tự");
        }else{
            const {navigation} = this.props;
            this.setState({isLoging:true});
            UserController.login(this.state.email,this.state.password,navigation, this.loginSuccessCallback, this.loginFalseCallback);
        }
    }

    componentDidMount(){
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);

    }
    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    _keyboardDidShow() {
        console.log('Keyboard show');
        // this.setState({showKeyboard : true});
    }

    _keyboardDidHide() {
        console.log('Keyboard hide');
        // this.setState({showKeyboard : false});
    }

    loginSuccessCallback(data){
        this.setState({isLoging : false});
        console.log('Login success-----------------------------');
    }

    loginFalseCallback(data){
        alert("Login lỗi " + JSON.stringify(data));

    }


    render() {
        const {navigation} = this.props;
        const {wraper,loginform, loginButton, loginText , button, labelInputNormal ,
            labelInputHover, textInputHover, textInputNormal } = styles;

        return (
            <View style={wraper}>
                {
                    Def.NetWorkMode && Def.NetWorkConnect ?

                    <View style={[loginform, {marginTop: -10}]}>
                        <TextInput
                            onFocus={() => this.setState({focus: 1})}
                            onBlur={() => this.setState({focus: 0})}
                            style={this.state.focus == 1 ? textInputHover : textInputNormal}
                            value={this.state.email}
                            onChangeText={text => this.setState({email: text})}
                            placeholder='Nhập Email'
                            placeholderTextColor="#b3b3b3"
                            autoCapitalize='none'
                            // underlineColorAndroid = "transparent"
                        />
                        {/*<Text style={this.state.focus == 2 ? labelInputHover : labelInputNormal}>Password</Text>*/}
                        <TextInput
                            onFocus={() => this.setState({focus: 2})}
                            onBlur={() => this.setState({focus: 0})}
                            style={this.state.focus == 2 ? textInputHover : textInputNormal}
                            value={this.state.password}
                            onChangeText={text => this.setState({password: text})}
                            secureTextEntry={true}
                            placeholder='Nhập mật khẩu'
                            placeholderTextColor="#b3b3b3"
                            autoCapitalize='none'
                            underlineColorAndroid="transparent"
                        />

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            marginTop: 10
                        }}>
                            <TouchableOpacity style={loginButton} onPress={() => this.signIn()}>
                                <Text style={loginText}>
                                    Đăng nhập
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <LoadingModal visible={this.state.isLoging}/>
                    </View>
                        :
                    <Text style={{fontSize:Style.TITLE_SIZE, color:'#b3b3b3'}}>
                        Để đăng nhập bạn vui lòng kết nối mạng Internet!
                    </Text>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wraper : {flex:1, alignItems: 'center' , backgroundColor: '#fff', justifyContent : 'center'},
    loginform : { width : width * 0.9, marginTop: height / 20,},
    textInputNormal : {height: 45, backgroundColor : '#fff', borderColor: "#9e9e9e", borderWidth : 1 ,color:'black', fontSize : Style.TITLE_SIZE, borderRadius: 5, marginTop: 10, paddingHorizontal: 10  },
    textInputHover : {height: 45, backgroundColor : '#fff', borderColor: "#48a5ea", borderWidth : 1 , color:'black', fontSize : Style.TITLE_SIZE,borderRadius: 5, marginTop: 10, paddingHorizontal: 10 },
    loginButton : { backgroundColor : '#ff3c29' ,borderRadius : 5, paddingLeft: 20, paddingRight : 10 },
    button : {
        paddingVertical : 5,backgroundColor : '#ff3c29' ,borderRadius : 5, paddingLeft: 20, marginTop : 20, borderWidth : 1, borderColor:'#b3b3b3',
        flexDirection : 'row', alignItems: 'center',
    },
    icon : {
        width :25,
        height : 25
    },

    loginText : { color:'#fff', fontSize : Style.TITLE_SIZE, textAlign : 'center', paddingVertical: 8},
    buttonText : { color:'#fff', fontSize : Style.TITLE_SIZE, paddingVertical: 8, marginLeft: 15},
    labelInputNormal : { color:'#9e9e9e', fontSize : Style.NORMAL_SIZE, marginTop : 20 },
    labelInputHover : { color:'#48a5ea', fontSize : Style.NORMAL_SIZE, marginTop : 20 },
    logoContainer : {alignItems : 'center', width :  width * 0.8, justifyContent: 'center', paddingBottom : 10 , marginTop: height / 10 },
    logoStyle : {width : width /5 , height : width /5 }
});
