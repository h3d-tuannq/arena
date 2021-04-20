import React from 'react'
import {
    Text, View, Button, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image, TextInput, FlatList,
    Alert, Platform
} from 'react-native'
import Def from '../../def/Def'
const {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome5';



import Style from '../../def/Style';
import FlatController from "../../controller/FlatController";
import ImagePicker  from 'react-native-image-picker'
import ImageResizer from 'react-native-image-resizer';
import FlatHelper from "../../def/FlatHelper";

const PROGRAM_IMAGE_WIDTH = width * 0.6;
const PROGRAM_IMAGE_HEIGHT = width * 0.6;

class RequestRepairModalForm extends React.Component {

    constructor(props) {
        super(props);
        let title = props.type == 0 ? 'Tạo yêu cầu chỉnh sửa' : 'Hoàn thành chỉnh sửa';

        this.state = {
            title: title,
            product: props.product ,
            note:'',
            image: '',
            type: props.type , // 0 Tạo yêu cầu chỉnh sửa, 1 Hoàn thành chỉnh sửa, 2 wsh cho yêu cầu đạt
        };
        this.handleChoosePhoto = this.handleChoosePhoto.bind(this);
        this.requestBtnClick = this.requestBtnClick.bind(this);
    }

    requestBtnClick = () => {
        let param = {'token' : Def.user_info['access_token']};

        console.log(JSON.stringify(param));
        if(Def.user_info) {
            let img ;
            if(this.state.image){
                img = {
                    name: this.state.image.fileName ? this.state.image.fileName : this.state.image.name,
                    type: this.state.image.type,
                    uri: Platform.OS === "android" ? this.state.image.uri : this.state.image.uri.replace("file://", "")
                };
            }
            let status = this.state.type == FlatHelper.REPAIRED_TYPE ? 2 : (this.state.type == FlatHelper.COMMENT_TYPE  ? 3 :  0);
            FlatController.changeStatusProduct(this.changeStatusSuccess, this.changeStatusFalse, this.state.product.id, this.state.type ? 'wsh' : 'handover', Def.user_info['access_token'] ,this.props.type, this.state.note, img, status);
        } else  {
            console.log('User info not exits');
        }
    };

    changeStatusSuccess = (data) => {
        console.log('Change Status Sucsess ' + JSON.stringify(data));
        if(data['msg'] == "Ok"){
            console.log("Request Repair Item : " + JSON.stringify(data['requestRepair']));
            this.props.appendRepairItem(data);
        } else {
            Alert.alert(
                "Thông báo",
                data['msg'],
                [
                    {
                        text: "Ok",
                        onPress: () => {Def.setIsLogin(false)},
                        style: 'cancel',
                    }
                ],
                {cancelable: false},
            );
        }
    };

    changeStatusFalse = (data) => {
        console.log('Change Status False ' + JSON.stringify(data));
    };




    handleChoosePhoto = (attr = null) => {
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



        ImagePicker.showImagePicker(options, response => {
                console.log('Attr res++' + attr);
                if (response.uri) {
                    console.log('Reponse browser image : ' + JSON.stringify(response));
                    let maxsize = response.width > response.height ? response.width : response.height;
                    if (maxsize > Def.DEFAULT_MAX_SIZE) {
                        let compressType = response.type == "image/jpeg" ? "JPEG" : "PNG";
                        ImageResizer.createResizedImage(response.uri, Def.DEFAULT_MAX_SIZE, Def.DEFAULT_MAX_SIZE, compressType, 50, 0, undefined, false)
                            .then(resizedImage => {
                                console.log("Attr : " + attr);
                                resizedImage['type'] = response.type;
                                this.setState({[attr]: resizedImage});
                            })
                            .catch(err => {
                                console.log(err);
                                return Alert.alert(
                                    'Unable to resize the photo',
                                    'Check the console for full the error message',
                                );
                            });
                    } else {
                        this.setState({[attr]: response})
                    }
                } else {
                    console.log("Response : " + JSON.stringify(response));
            }
            }
        )
    }


    render() {

        return (
            <View style={styles.container}>
                <View style={{height:50, backgroundColor:Style.DEFAUT_BLUE_COLOR , justifyContent:'center' , borderTopRightRadius:10, borderTopLeftRadius:10, paddingHorizontal : 10}}>
                    <Text style={[Style.text_styles.titleText, {color:'#fff'}]}>
                        {this.state.title}
                    </Text>
                </View>
                <View style={{paddingHorizontal:10}}>
                    <TextInput
                        placeholder={'Nhập ghi chú'}
                        value={this.state.note}
                        multiline={true}
                        numberOfLines={2}
                        onChangeText={(text) => {
                            this.setState({note:text});
                        }}

                        style={{borderBottomWidth : 1}}
                    />

                        <TouchableOpacity onPress={() => this.handleChoosePhoto('image')}
                                          style={{marginTop:2,  paddingVertical:5}}
                        >
                            { this.state.image ?

                                <Image
                                    source={{ uri: this.state.image.uri }}
                                    style={{ width: width * 0.8 -20, height:150, maxHeight: 200 , marginTop: 5 }}
                                />

                                :
                                <View style={{ width: width * 0.8 -20,  marginTop: 5 , borderWidth: 2 ,
                                    alignItems: 'center', justifyContent: 'center', height:150 , borderColor:Style.DEFAUT_BLUE_COLOR
                                }}>
                                    <Icon size={40} name="camera" color={Style.DEFAUT_RED_COLOR}/>
                                </View>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.requestBtn}
                            onPress={this.requestBtnClick}
                        >
                            <Text style={{color:'#fff'}}>
                                Gửi yêu cầu
                            </Text>
                        </TouchableOpacity>

                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width:width * 0.8,
        height:height * 0.5 -20,
        backgroundColor : '#fff',
        borderRadius : 10,

    },
    itemImage: {
        width : PROGRAM_IMAGE_WIDTH,
        height : PROGRAM_IMAGE_WIDTH,
    },
    imageContainer: {
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor:'red',
        // borderWidth:50,
        flex:1

    },

    infoContainer:{
        marginTop : 20,
    },

    requestBtn : {
        marginTop : 10,
        backgroundColor: Style.DEFAUT_RED_COLOR,
        height: 45,
        justifyContent : 'center',
        alignItems: 'center',
        paddingHorizontal : 10,
        // marginHorizontal : 10,
        borderRadius:10
    },

});

export default RequestRepairModalForm;
