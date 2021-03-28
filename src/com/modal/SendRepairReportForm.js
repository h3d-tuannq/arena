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
import ProgramVerList from '../common/ProgramVerList';
import BackIcon from '../../../assets/icon/icon-back-red.svg';

class SendRepairReportForm extends React.Component {
    constructor(props) {
        super(props);
        console.log('Send mail init');
        this.state = {
            title: 'Biên bản sửa chữa',
            flat: props.flat ,
            repairList : FlatHelper.getRepairItemList(this.props.flat),
            note:'',
            type: 0
        };
        this.requestBtnClick = this.requestBtnClick.bind(this);
        this.sendMailSuccess = this.sendMailSuccess.bind(this);
        this.sendMailFalse = this.sendMailFalse.bind(this);
        this.getPifIds = this.getPifIds.bind(this);
        this.resetButtonClick = this.resetButtonClick.bind(this);
    }

    requestBtnClick = () => {
        console.log("Request button click");
        if(Def.user_info) {
            FlatController.sendRepairList(this.sendMailSuccess, this.sendMailFalse, Def.user_info['access_token'], this.props.flat.id, this.getPifIds() );
        } else  {
            console.log('User info not exits');
        }
    };

    resetButtonClick = () => {

    }

    getPifIds = () => {

    }

    sendMailSuccess = (data) => {
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

    sendMailFalse = (data) => {
        console.log('Change Status False ' + JSON.stringify(data));
    };
    render() {
        const ListHeader = () => (
            <View style={{flexDirection: 'row', justifyContent: 'space-between' , alignItems: 'flex-start', marginTop:5}}>
                <View style={{marginLeft:15, paddingBottom:8}}>
                    <Text style={styles.titleStyle}>{(this.state.flat.productInstanceFlat ? this.state.flat.productInstanceFlat.length : 0) + " Sản phẩm chưa đạt"}</Text>
                </View>
            </View>);

        return (
            <View style={{height:height}}>
                <View style={{height:50,  justifyContent:'flex-start' ,flexDirection:'row', alignItems:'center'}}>
                    <TouchableOpacity style={{paddingHorizontal : 10, paddingVertical:5}} onPress={this.props.closeFunction}>
                        <BackIcon width={25} height={25} />
                    </TouchableOpacity>
                    <Text style={[Style.text_styles.titleText]}>
                        {this.state.title}
                    </Text>
                </View>
                <View style={{height:height -100}}>
                    <ProgramVerList
                        data={this.state.repairList}
                        navigation={this.props.navigation}
                        header={ListHeader}
                        type={'product'}
                        numColumns={2}
                        stack={'Flat'}
                        screen={'product-detail'}
                        addToCart={this.addToCart}
                    />
                </View>
                    <View style={{ flexDirection: "row"}}>
                        <TouchableOpacity style={styles.buttonStyle}
                                          onPress={
                                              this.requestBtnClick
                                          }>
                            <Text>Gửi</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonStyle}
                                          onPress={this.resetButtonClick}>
                            <Text>Bỏ chọn</Text>
                        </TouchableOpacity>

                    </View>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    container: {
        width:width ,
        height:height,
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

    buttonStyle: {
        flex: 1, justifyContent: "center", alignItems: "center", height: 50,
        backgroundColor: "#eeeeee",
        margin: 10
    }

});

export default SendRepairReportForm;
