import React, {Component} from 'react'
import {Text, Image, StyleSheet, View, TextInput, Dimensions, TouchableOpacity, Button} from 'react-native'
import Style from "../../../src/def/Style";
import FacebookIcon from "../../../assets/icon/icon-facebook.svg";
import GoogleIcon from "../../../assets/icon/icon-google.svg";
import Def from '../../def/Def';

const options = {
    title: 'Select Avatar',
    customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};




const {width,height} = Dimensions.get('window');

export default class SignUp extends Component {
    constructor(props){
        super(props);
        this.state = {
            focus : 0,
            display_name : "",
            email:"",
            password:"",
            re_password:"",
            isPartner:false,
            avatarSource:{uri:Def.URL_DEFAULT_AVATAR},

        }
        this.signUp = this.signUp.bind(this);
    }

    handleChoosePhoto = () => {
        console.log('image picker');
        const options = {
            title: 'Chọn ảnh đại diện',
            // customButtons: [{ name: 'Eurotile', title: 'Chọn ảnh đại diện' }],
            takePhotoButtonTitle : "Chụp ảnh",
            chooseFromLibraryButtonTitle : "Chọn từ thư viện",
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            noData :true,
        };
    }

    signUp(){
        if(!this.state.email.includes("@", 0) && !this.state.email.includes(".", 0)){
            alert("Email không đúng định dạng");
        }else if(this.state.password != this.state.re_password){
            alert("Mật khẩu và mật khẩu xác nhận phải giống nhau");
        } else if(this.state.password.length < 6){
            alert("Mật khẩu phải dài hơn 8 ký tự");
        }else{
            const {navigation} = this.props;
        }
    }
    render() {
        const {navigation} = this.props;
        const {wraper,loginform, loginButton, loginText , labelInputNormal ,
            labelInputHover, textInputHover, textInputNormal, buttonText, button } = styles;

        return (
            <View style={wraper}>

                <View style={[loginform, {marginTop:-10}]}>

                    {/*<Text style={{fontSize:Style.BIG_SIZE, fontWeight: 'bold', color: '#000', marginBottom :20}}>*/}
                        {/*Đăng ký*/}
                    {/*</Text>*/}

                    {/*<Text style={this.state.focus == 1 ? labelInputHover : labelInputNormal}>Email</Text>*/}


                    {/*<View style={{ alignItems: 'center', justifyContent: 'center' }}>*/}
                        {/*{this.state.avatarSource ?*/}
                            {/*<Image*/}
                                {/*source={{ uri: this.state.avatarSource.uri }}*/}
                                {/*style={{ width: 160, height: 160 , marginTop: 20 }}*/}
                            {/*/> : <View/>*/}
                        {/*}*/}
                        {/*<TouchableOpacity style={[button, {backgroundColor:'#1976d2'}]}*/}
                                          {/*onPress={this.handleChoosePhoto} >*/}
                            {/*<Text style={styles.buttonText}>*/}
                                {/*Chọn ảnh*/}
                            {/*</Text>*/}
                        {/*</TouchableOpacity>*/}
                    {/*</View>*/}


                    {/*<TextInput*/}
                        {/*onFocus={() => this.setState({focus:1})}*/}
                        {/*onBlur={()=> this.setState({focus:0})}*/}
                        {/*style={this.state.focus == 1 ? textInputHover : textInputNormal}*/}
                        {/*value={this.state.display_name}*/}
                        {/*onChangeText={text => this.setState({display_name:text})}*/}
                        {/*placeholder='Tên hiển thị'*/}
                        {/*placeholderTextColor="#b3b3b3"*/}
                        {/*autoCapitalize = 'none'*/}
                        {/*// underlineColorAndroid = "transparent"*/}
                    {/*/>*/}
                    <TextInput
                        onFocus={() => this.setState({focus:1})}
                        onBlur={()=> this.setState({focus:0})}
                        style={this.state.focus == 1 ? textInputHover : textInputNormal}
                        value={this.state.email}
                        onChangeText={text => this.setState({email:text})}
                        placeholder='Nhập Email'
                        placeholderTextColor="#b3b3b3"
                        autoCapitalize = 'none'
                        // underlineColorAndroid = "transparent"
                    />
                    <TextInput
                        onFocus={() => this.setState({focus:2})}
                        onBlur={()=> this.setState({focus:0})}
                        style={this.state.focus == 2 ? textInputHover : textInputNormal}
                        value={this.state.password}
                        onChangeText={text => this.setState({password:text})}
                        secureTextEntry={true}
                        placeholder='Nhập mật khẩu'
                        autoCapitalize = 'none'
                        placeholderTextColor="#b3b3b3"
                    />
                    <TextInput
                        onFocus={() => this.setState({focus:2})}
                        onBlur={()=> this.setState({focus:0})}
                        style={this.state.focus == 2 ? textInputHover : textInputNormal}
                        value={this.state.re_password}
                        onChangeText={text => this.setState({re_password:text})}
                        secureTextEntry={true}
                        placeholder='Nhập lại mật khẩu'
                        autoCapitalize = 'none'
                        placeholderTextColor="#b3b3b3"
                    />


                    <View style={{flexDirection: 'row', justifyContent : 'flex-end', alignItems : 'center' , marginTop:10 }}>
                        <TouchableOpacity style={{alignItems: 'center', marginRight : 20}} onPress={()=> {
                            navigation.navigate('forgetPass');
                        }}>
                            <Text style={{fontSize:Style.MIDLE_SIZE, color:'#b3b3b3'}}>
                                Quên mật khẩu?
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={loginButton} onPress={()=>this.signUp()}>
                            <Text style={loginText}>
                                Đăng ký
                            </Text>
                        </TouchableOpacity>

                    </View>

                    {/*<TouchableOpacity style={button} onPress={()=> {*/}
                        {/*navigation.navigate('signIn');*/}
                    {/*}}>*/}
                        {/*<Text style={buttonText}>*/}
                            {/*Đăng nhập*/}
                        {/*</Text>*/}
                    {/*</TouchableOpacity>*/}

                    {/*<TouchableOpacity style={{alignItems: 'center', marginTop : 20, paddingVertical: 5,marginRight : 20, flexDirection : 'row'}} onPress={()=> {*/}
                        {/*navigation.navigate('signIn');*/}
                    {/*}}>*/}
                        {/*<Text style={{fontSize:Style.TITLE_SIZE, color:'#b3b3b3'}}>*/}
                            {/*Tài khoản bạn đã sẵn sàng?*/}
                        {/*</Text>*/}
                        {/*<Text style={{fontSize:Style.MIDLE_SIZE, marginLeft:5 , color:Style.DEFAUT_RED_COLOR}}>*/}
                            {/*Đăng nhập ngay*/}
                        {/*</Text>*/}
                    {/*</TouchableOpacity>*/}

                    {/*<TouchableOpacity style={[button, {backgroundColor:'#1976d2'}]} onPress={()=> FirebaseController.facebookLogin(navigation)}>*/}
                        {/*<FacebookIcon style={styles.icon}/>*/}
                        {/*<Text style={styles.buttonText}>*/}
                            {/*Đăng nhập với Facebook*/}
                        {/*</Text>*/}
                    {/*</TouchableOpacity>*/}

                    {/*<TouchableOpacity style={[button, {backgroundColor:'#ffffff'}]} onPress={()=> FirebaseController.googleLogin(navigation)}>*/}
                        {/*<GoogleIcon style={styles.icon}/>*/}
                        {/*<Text style={[styles.buttonText, {color: '#b3b3b3'}]}>*/}
                            {/*Đăng nhập với Google*/}
                        {/*</Text>*/}
                    {/*</TouchableOpacity>*/}


                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wraper : {flex:1, alignItems: 'center' , backgroundColor: '#fff', justifyContent : 'center'},
    loginform : { width : width * 0.9, marginTop: height / 20,},
    textInputNormal : {height: 45, backgroundColor : '#fff', borderColor: "#9e9e9e", borderWidth : 1 ,color:'black', fontSize : 18, borderRadius: 5, marginTop: 10, paddingHorizontal: 10  },
    textInputHover : {height: 45, backgroundColor : '#fff', borderColor: "#48a5ea", borderWidth : 1 , color:'black', fontSize : 18,borderRadius: 5, marginTop: 10, paddingHorizontal: 10 },
    loginButton : { backgroundColor : '#ff3c29' ,borderRadius : 5, paddingLeft: 20, paddingRight : 10 },
    button : {
        paddingVertical : 5,backgroundColor : '#ff3c29' ,borderRadius : 5, paddingLeft: 20, marginTop : 20, borderWidth : 1, borderColor:'#b3b3b3',
        flexDirection : 'row', alignItems: 'center',
    },
    icon : {
        width :25,
        height : 25
    },
    loginText : { color:'#fff', fontSize : 18, textAlign : 'center', paddingVertical: 8},

    buttonText : { color:'#fff', fontSize : 18, paddingVertical: 8, marginLeft : 15},

    labelInputNormal : { color:'#9e9e9e', fontSize : 14, marginTop : 20 },
    labelInputHover : { color:'#48a5ea', fontSize : 14, marginTop : 20 },
    logoContainer : {alignItems : 'center', width :  width * 0.8, justifyContent: 'center', paddingBottom : 10 , marginTop: height / 10 },
    logoStyle : {width : width /5 , height : width /5 },
    uploadAvatar : {
        width :width /2,
        height :width /2,
    }
});
