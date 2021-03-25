import React from 'react'
import {
    Text, View, Button, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image, TextInput, FlatList,
    Alert, Platform
} from 'react-native'
import Def from '../../def/Def'
import FlatHelper from '../../def/FlatHelper'
const {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome5';

import SignatureCapture from 'react-native-signature-capture';





import Style from '../../def/Style';
import FlatController from "../../controller/FlatController";

class SignatureModalForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'Từ chối bàn giao',
            flat: props.flat,
            note: '',
            type: 0
        };
        this.requestBtnClick = this.requestBtnClick.bind(this);
        this.changeStatusSuccess = this.changeStatusSuccess.bind(this);
        this.changeStatusFalse = this.changeStatusFalse.bind(this);
    }

    requestBtnClick = () => {
        console.log("Request button click");
        if (Def.user_info) {
            FlatController.changeStatusFlat(this.changeStatusSuccess, this.changeStatusFalse, Def.user_info['access_token'], this.state.flat.id, null, 1, null, this.state.note, FlatHelper.DECLINE_DELIVER_TYPE);
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
        this.refs["sign"].saveImage();
    }

    resetSign() {
        this.refs["sign"].resetImage();
    }

    _onSaveEvent(result) {
        //result.encoded - for the base64 encoded png
        //result.pathName - for the file path name
        console.log(result);
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
            <View style={{flex: 1, flexDirection: "column"}}>
                <Text style={{alignItems: "center", justifyContent: "center"}}>Signature Capture Extended </Text>
                <SignatureCapture
                    style={[{flex: 1}, styles.signature]}
                    ref="sign"
                    onSaveEvent={this._onSaveEvent}
                    onDragEvent={this._onDragEvent}
                    saveImageFileInExtStorage={false}
                    showNativeButtons={false}
                    showTitleLabel={false}
                    backgroundColor="#ff00ff"
                    strokeColor="#ffffff"
                    minStrokeWidth={4}
                    maxStrokeWidth={4}
                    viewMode={"portrait"}/>

                <View style={{flex: 1, flexDirection: "row"}}>
                    <TouchableHighlight style={styles.buttonStyle}
                                        onPress={() => {
                                            this.saveSign()
                                        }}>
                        <Text>Save</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={styles.buttonStyle}
                                        onPress={() => {
                                            this.resetSign()
                                        }}>
                        <Text>Reset</Text>
                    </TouchableHighlight>

                </View>

            </View>
        );
    }
}
const styles = StyleSheet.create({
    signature: {
        flex: 1,
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
