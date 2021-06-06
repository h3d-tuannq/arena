import React from 'react'
import {Text, View, Button, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image, Alert} from 'react-native';
import Def from '../../def/Def'
const {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome5';

import RNRestart from 'react-native-restart';


import Style from '../../def/Style';
import AsyncStorage  from '@react-native-async-storage/async-storage';

import  UserController from '../../../src/controller/UserController'
import {OfflineHelper} from '../../def/OfflineHelper';

const PROGRAM_IMAGE_WIDTH = (width - 30-8) /2;
const PROGRAM_IMAGE_HEIGHT = (width - 30-8) /2;

const BUTTON_WIDTH = (width - 60 ) / 3;
const BUTTON_HEIGHT = (width - 60 ) / 3;

class SettingScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            user: Def.user_info,
            stateCount: 0.0,
        };
        this.refresh = this.refresh.bind(this);
        this.signInBtnClick = this.signInBtnClick.bind(this);
        this.refreshData = this.refreshData.bind(this);
        this.resetData = this.resetData.bind(this);
        this.resetInteractData = this.resetInteractData.bind(this);

    }
    componentDicMount(){

    }
    refresh()
    {
        this.setState({ stateCount: Math.random() });
    }
    shouldComponentUpdate(){
        return true;
    }

    getNewDataByConfigKey(key){

    }

    signInBtnClick(){
        this.props.navigation.navigate('Login', {'screen': 'signIn'});
    }

    restartApp = () => {
        Alert.alert(
            "Thông báo",
            "Bạn chắc chắn muốn khởi động lại ứng dụng",
            [
                {
                    text: "Ok",
                    onPress: () => {
                        RNRestart.restart();
                    },
                    style: 'Cancel',
                },
                {
                    text: "Cancel",
                    style: 'Cancel',
                }
            ],
            {cancelable: false},
        );

    }

    resetData = ()=> {
        Alert.alert(
            "Xóa dữ liệu offline căn hộ ",
            "Dữ liệu lưu trữ và tương tác offline sẽ bị xóa",
            [
                {
                    text: "Ok",
                    onPress: async () => {
                        await OfflineHelper.resetInteractOfflineData();
                        await OfflineHelper.resetLocalData();
                        RNRestart.Restart();

                    },
                    style: 'Cancel',
                },
                {
                    text: "Cancel",
                    style: 'Cancel',
                }
            ],
            {cancelable: false},
        );

    }

    resetInteractData = ()=> {
        Alert.alert(
            "Xóa dữ liệu offline căn hộ ",
            "Dữ liệu tương tác offline sẽ bị xóa",
            [
                {
                    text: "Ok",
                    onPress: () => {
                        OfflineHelper.resetInteractOfflineData();
                        RNRestart.Restart();
                    },
                    style: 'Cancel',
                },
                {
                    text: "Cancel",
                    style: 'Cancel',
                }
            ],
            {cancelable: false},
        );

    }


    refreshData = ()=> {
        RNRestart.Restart();
    }

    render() {
        const {navigation} = this.props;
        const {user} = this.state;
        return (
            (!user) ?

                <View style={{justifyContent :'center',flex: 1, alignItems : 'center', width: width}}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize:Style.TITLE_SIZE, color:'#b3b3b3'}}>
                            Vui lòng
                        </Text>
                        <TouchableOpacity onPress={this.signInBtnClick}>
                            <Text style={{fontSize:Style.TITLE_SIZE, marginLeft:5 , color:Style.DEFAUT_RED_COLOR}}>
                                đăng nhập
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize:Style.TITLE_SIZE, color:'#b3b3b3'}}>
                        để sử dụng đầy đủ tính năng cá nhân
                    </Text>

                </View> :
                <View style={{flex:1, backgroundColor: Style.GREY_BACKGROUND_COLOR}}>
                    <View style={{alignItems : 'center', justifyContent:'space-between',paddingHorizontal:10 , paddingVertical: 5, backgroundColor : '#fff', marginBottom: 10}}>
                        <View style={{flexDirection : 'row', alignItems : 'center'}}>
                            <Image  style={styles.imageStyle}  source={{uri: Def.getAvatarUrlFromUserInfo() }}  />
                        </View>
                        <View style={{marginTop: 10, justifyContent:'space-between'}}>
                            <Text style={Style.text_styles.titleTextNotBold}>
                                {user['email']}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center', justifyContent:'space-between',paddingHorizontal:10 , paddingVertical: 10, backgroundColor : '#fff', marginTop:20}}
                        onPress={this.resetData}
                    >
                        <View style={{flexDirection : 'row', alignItems : 'center'}}>
                            <View style={{width :30}}>
                                <Icon name="user-cog" size={25} color={Style.GREY_TEXT_COLOR} />
                            </View>
                            <Text style={[Style.text_styles.middleText, {marginLeft :10}]}>
                                Xóa dữ liệu Offline
                            </Text>
                        </View>
                        <Icon name="angle-right" size={25} color={Style.GREY_TEXT_COLOR} />
                    </TouchableOpacity>

                    <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center', justifyContent:'space-between',paddingHorizontal:10 , paddingVertical: 10, backgroundColor : '#fff', marginTop:20}}
                                      onPress={this.resetInteractData}
                    >
                        <View style={{flexDirection : 'row', alignItems : 'center'}}>
                            <View style={{width :30}}>
                                <Icon name="user-cog" size={25} color={Style.GREY_TEXT_COLOR} />
                            </View>
                            <Text style={[Style.text_styles.middleText, {marginLeft :10}]}>
                                Xóa dữ liệu tương tác Offline
                            </Text>
                        </View>
                        <Icon name="angle-right" size={25} color={Style.GREY_TEXT_COLOR} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center', justifyContent:'space-between',paddingHorizontal:10 , paddingVertical: 10, backgroundColor : '#fff', marginTop:5}}
                        onPress={this.refreshData}
                    >
                        <View style={{flexDirection : 'row', alignItems : 'center'}}>
                            <View style={{width :30}}>
                                <Icon name="sync" size={25} color={Style.GREY_TEXT_COLOR} />
                            </View>
                            <Text style={[Style.text_styles.middleText, {marginLeft :10}]}>
                                Làm mới dữ liệu
                            </Text>
                        </View>
                        <Icon name="angle-right" size={25} color={Style.GREY_TEXT_COLOR} />
                    </TouchableOpacity>
                </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        paddingLeft: 15,
        // justifyContent: 'flex-start',
        // marginVertical : 5,
        marginBottom : 125,
        backgroundColor: '#fff'
    },
    slider: {
        justifyContent: 'center',
        paddingTop: 5,
        padding: 8,
        height: 120,
        borderRadius: 5,
        backgroundColor: "#e6e6e6",
        marginRight : 15
    },
    cardStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width-20,
        height: width/2,

    },
    programListStyle : {

    },
    itemImage: {
        width: PROGRAM_IMAGE_WIDTH -5,
        height : PROGRAM_IMAGE_HEIGHT -5,
        borderRadius: 5,
    },
    imageStyle : {
        width : width /3,
        height : width / 3,

        borderRadius: width / 6,
    },
    imageStyleInfo : {
        width : width /8,
        height : width / 8,

        borderRadius: width / 16,
    },
    buttonText : { color:'#fff', fontSize : 18, paddingVertical: 8, marginLeft : 15},
    overviewInfo: {
        // height: height/4,
        minHeight: 200,
        width : width -20,
        marginHorizontal:10,
        paddingVertical:10,
        paddingHorizontal:10,
        // backgroundColor:'#FF5E62',
        borderRadius:10,
        marginTop:10,
        borderColor : Style.DEFAUT_RED_COLOR,
        borderWidth:2,
    },

});

export default SettingScreen;
