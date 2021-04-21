import React from 'react'
import {
    Text, View, Button, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image, TextInput, FlatList,
    Alert, Platform
} from 'react-native'
import Def from '../../def/Def'
import FlatHelper from '../../def/FlatHelper'
const {width, height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome5';



import Style from '../../def/Style';
import FlatController from "../../controller/FlatController";
import DateTimePickerModal from "react-native-modal-datetime-picker";

class UpdateDeadlineModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'Cập nhật Deadline hoàn thiện',
            flat: props.flat ,
            note:'',
            type: 0,
            deadlineCompleted: new Date(),
            displayUpdateDeadline: true,
        };
        this.requestBtnClick = this.requestBtnClick.bind(this);
        this.changeStatusSuccess = this.changeStatusSuccess.bind(this);
        this.changeStatusFalse = this.changeStatusFalse.bind(this);

        this.handleDatePicked = this.handleDatePicked.bind(this);
        this.hideDateTimePicker = this.hideDateTimePicker.bind(this);


    }

    handleDatePicked = date => {
        this.hideDateTimePicker();
        this.setState({ deadlineCompleted : date });
    };

    hideDateTimePicker = () => {
        this.setState({ displayUpdateDeadline : false });
    };

    requestBtnClick = () => {
        console.log("Request button click");
        if(Def.user_info) {
            FlatController.changeStatusFlat(this.changeStatusSuccess, this.changeStatusFalse, Def.user_info['access_token'] ,this.state.flat.id, null, 1 , null, this.state.note,  FlatHelper.DECLINE_DELIVER_TYPE);
        } else  {
            console.log('User info not exits');
        }
    };

    changeStatusSuccess = (data) => {
        console.log('Change Status Sucsess ' + JSON.stringify(data));
        if(data['msg'] == "Ok"){
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

    changeStatusFalse = (data) => {
        console.log('Change Status False ' + JSON.stringify(data));
    };
    render() {

        return (
            <View style={styles.container}>
                <View style={{height:50, backgroundColor:Style.DEFAUT_BLUE_COLOR , justifyContent:'center' , borderTopRightRadius:10, borderTopLeftRadius:10, paddingHorizontal : 10}}>
                    <Text style={[Style.text_styles.titleText, {color:'#fff'}]}>
                        {this.state.title}
                    </Text>
                </View>
                <View style={{paddingHorizontal:10 , paddingVertical:5}}>
                    <DateTimePickerModal
                        isVisible={this.state.displayUpdateDeadline}
                        onConfirm={(date) => {
                            this.handleDatePicked(date);
                        }}
                        onCancel={this.hideDateTimePicker}
                        date={this.state.deadlineCompleted}
                        mode={'datetime'}
                        display='spinner'
                        style={{width: 400, opacity: 1, height: 100, marginTop: 540}}
                        datePickerModeAndroid='spinner'
                        timePickerModeAndroid='spinner'
                    />

                    <Text style={[Style.text_styles.titleText, {color: Style.DEFAUT_RED_COLOR}]}>
                        {Def.getDateString(this.state.deadlineCompleted,"dd-MM-yyyy hh:mm" )}
                    </Text>


                    <TouchableOpacity
                        // disabled={this.state.note.length == 0}
                        style={styles.requestBtn}
                        onPress={this.requestBtnClick}
                    >
                        <Text style={{color:'#fff'}}>
                            Gửi
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
        // height:height * 0.3 -20,
        backgroundColor : '#fff',
        borderRadius : 10,

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

export default UpdateDeadlineModal;
