import React, {Component} from 'react'
import {Text, Image, StyleSheet, View, TextInput, Dimensions, TouchableOpacity} from 'react-native'
import Style from "../../../src/def/Style";

const {width,height} = Dimensions.get('window');

export default class ForgetPassword extends Component {
    constructor(props){
        super(props);
        this.state = {
            focus : 0,
            email:""
        }
        this.resetPassword = this.resetPassword.bind(this);
    }

    resetPassword(){
        if(this.state.email.includes("@", 0) && this.state.email.includes(".", 0)){
            FirebaseController.resetPassword(this.state.email);
            alert("Bạn vui lòng làm theo hướng dẫn trong email để reset password");
            const {navigation} = this.props;
            navigation.navigate('signIn');
        }else{
            alert("Email không đúng định dạng");

        }
    }
    render() {
        const {navigation} = this.props;
        const {wraper,loginform, loginButton, loginText , labelInputNormal ,
            labelInputHover, textInputHover, textInputNormal, button, buttonText } = styles;

        return (
            <View style={wraper}>

                <View style={[loginform, {marginTop:-10}]}>

                    <TextInput
                        onFocus={() => this.setState({focus:1})}
                        onBlur={()=> this.setState({focus:0})}
                        style={this.state.focus == 1 ? textInputHover : textInputNormal}
                        value={this.state.email}
                        onChangeText={text => this.setState({email:text})}
                        placeholder='Nhập Email'
                        autoCapitalize = 'none'
                        placeholderTextColor="#b3b3b3"
                    />

                    <View style={{flexDirection: 'row', justifyContent : 'flex-end', alignItems : 'center' , marginTop:10 }}>

                        <TouchableOpacity style={loginButton} onPress={()=>this.resetPassword()}>
                            <Text style={loginText}>
                                Gửi mail
                            </Text>
                        </TouchableOpacity>

                    </View>
                <View>
                </View>
                <TouchableOpacity style={button} onPress={()=> {
                    navigation.navigate('signIn');
                }}>
                    <Text style={buttonText}>
                        Đăng nhập
                    </Text>
                </TouchableOpacity>



            </View>
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
    button : { paddingVertical : 5,backgroundColor : '#ff3c29' ,borderRadius : 5, paddingLeft: 20, marginTop : 20, borderWidth : 1, borderColor:'#b3b3b3'},
    loginText : { color:'#fff', fontSize : Style.TITLE_SIZE, textAlign : 'center', paddingVertical: 8},
    buttonText : { color:'#fff', fontSize : Style.TITLE_SIZE, paddingVertical: 8},
    labelInputNormal : { color:'#9e9e9e', fontSize : Style.NORMAL_SIZE, marginTop : 20 },
    labelInputHover : { color:'#48a5ea', fontSize : Style.NORMAL_SIZE, marginTop : 20 },
    logoContainer : {alignItems : 'center', width :  width * 0.8, justifyContent: 'center', paddingBottom : 10 , marginTop: height / 10 },
    logoStyle : {width : width /5 , height : width /5 }
});
