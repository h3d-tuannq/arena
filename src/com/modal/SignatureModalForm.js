import React from 'react'
import base64 from 'react-native-base64'
import {
    Text, View, Button, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image, TextInput, FlatList,TouchableHighlight,
    Alert, Platform
} from 'react-native'
import Def from '../../def/Def'
import FlatHelper from '../../def/FlatHelper'
const {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome5';

import BackIcon from '../../../assets/icon/icon-back-red.svg';

import SignatureCapture from 'react-native-signature-capture';





import Style from '../../def/Style';
import FlatController from "../../controller/FlatController";

class SignatureModalForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'Ký nhận bàn giao',
            flat: props.flat,
            note: '',
            type: 0,
            image_path:'',
            data:null
        };
        this.requestBtnClick = this.requestBtnClick.bind(this);
        this.changeStatusSuccess = this.changeStatusSuccess.bind(this);
        this.changeStatusFalse = this.changeStatusFalse.bind(this);
        this.updateImage = this.updateImage.bind(this);
        this._onSaveEvent = this._onSaveEvent.bind(this);
    }

    requestBtnClick = () => {
        console.log("Request button click");
        if (Def.user_info) {
            FlatController.changeStatusFlat(this.changeStatusSuccess, this.changeStatusFalse, Def.user_info['access_token'], this.state.flat.id, FlatHelper.SIGNED_STATUS, 0, this.state.data ?this.state.data.encoded : null, this.state.note, FlatHelper.SIGNATURE_PAD_TYPE);
        } else {
            console.log('User info not exits');
        }
    };

    changeStatusSuccess = (data) => {
        console.log('Change Status Sucsess ' + JSON.stringify(data));
        if (data['msg'] == "Ok") {
            console.log("Request Repair Item : " + JSON.stringify(data['requestRepair']));
            this.props.updateFlatStatus(data['flat']);
        } else {
            Alert.alert(
                "Thông báo",
                data['msg'],
                [
                    {
                        text: "Ok",
                        style: 'cancel',
                    }
                ],
                {cancelable: false},
            );
        }
    };

    saveSign() {
        console.log('save image');
        this.refs["sign"].saveImage();
    }

    resetSign() {
        console.log('reset sign');
        this.refs["sign"].resetImage();
    }

    _onSaveEvent(result) {
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
        // this.setState({image_path: result.pathName});
        this.updateImage(result);
        console.log(result);
    }

    updateImage = (data) => {
        this.setState({data:data,image_path: data.pathName});
         console.log('base64 encode : ' + base64.decode(data.encoded))
    }

    _onDragEvent() {
        // This callback will be called when the user enters signature
        console.log("dragged");
    }

    changeStatusFalse = (data) => {
        console.log('Change Status False ' + JSON.stringify(data));
    };

    render() {
        return (
            <View style={{flexDirection: "column", }}>
                <View style={{height:50,  justifyContent:'flex-start' ,flexDirection:'row', alignItems:'center'}}>
                    <TouchableOpacity style={{paddingHorizontal : 10, paddingVertical:5}} onPress={this.props.closeFunction}>
                        <BackIcon width={25} height={25} />
                    </TouchableOpacity>
                    <Text style={[Style.text_styles.titleText]}>
                        {this.state.title}
                    </Text>
                </View>
                <View style={{borderWidth: 1}}>
                <SignatureCapture
                    style={[{}, styles.signature]}
                    ref="sign"
                    onSaveEvent={this._onSaveEvent}
                    onDragEvent={this._onDragEvent}
                    saveImageFileInExtStorage={false}
                    showNativeButtons={false}
                    showTitleLabel={false}
                    backgroundColor="#ffffff"
                    strokeColor="#000000"
                    minStrokeWidth={4}
                    maxStrokeWidth={4}
                    viewMode={"portrait"}/>
                </View>

                <View>
                    {
                        this.state.data ?
                            <Image  style={[{width: width -10, height : height/2-100} ]} source={{uri:'data:image/png;base64,'+this.state.data.encoded}} />
                            : null

                    }

                </View>

                <View style={{ flexDirection: "row"}}>
                    <TouchableOpacity style={styles.buttonStyle}
                                        onPress={() => {
                                            this.saveSign()
                                        }}>
                        <Text>Xác nhận</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonStyle}
                                        onPress={() => {
                                            this.resetSign()
                                        }}>
                        <Text>Ký lại</Text>
                    </TouchableOpacity>

                </View>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    signature: {
        width : width - 10,
        height: height/2 -100,
        borderColor: '#000033',
        borderWidth: 1,
    },
    buttonStyle: {
        flex: 1, justifyContent: "center", alignItems: "center", height: 50,
        backgroundColor: "#eeeeee",
        margin: 10
    }

});

export default SignatureModalForm;
