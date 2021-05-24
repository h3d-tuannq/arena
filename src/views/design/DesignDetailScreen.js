import React from 'react'
import {
    Text,
    View,
    Button,
    StyleSheet,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    TouchableWithoutFeedback,
    Modal,
    Alert,
    RefreshControl
} from 'react-native';
import Def from '../../def/Def'
const {width, height} = Dimensions.get('window');
import Style from '../../def/Style';
import FlatHelper from  '../../def/FlatHelper'

import DeclineDeliverModalForm from '../../com/modal/DeclineDeliverModalForm'
import SignatureModalForm from  '../../../src/com/modal/SignatureModalForm'
import SendRepairReportForm from '../../../src/com/modal/SendRepairReportForm'

import ProgramVerList from '../../com/common/ProgramVerList';
import FlatController from '../../controller/FlatController';

import Icon from 'react-native-vector-icons/FontAwesome';

import DateTimePickerModal from "react-native-modal-datetime-picker";
import UpdateDeadlineModal from '../../com/modal/UpdateDeadlineModal';


import FullImageModal from  '../../../src/com/modal/FullImageModal'


const PROGRAM_IMAGE_WIDTH = (width - 38) /2;
const PROGRAM_IMAGE_HEIGHT = (width) /3;
const carouselItems = [
    {
        id:1,
        image_path : Def.URL_BASE + '/data/eurotileData/collection/202009/24/1/main_img.jpg',
    },
    {
        id:2,
        image_path : Def.URL_BASE + '/data/eurotileData/collection/202009/30/2/main_img.jpg',
    }
];

const decline_deliver_form = 0;
const update_status_form = 1;
const signature_form = 2;
const sendmail_form = 3;
const update_deadline_form = 4;


class DesignDetailScreen extends React.Component {

    constructor(props){
        super(props);
        this.formatText    = this.formatText.bind(this);
        this.refresh     = this.refresh.bind(this);
        Def.mainNavigate = this.props.navigation;

        let design_list = [];
        let title = "Chi tiết thiết kế";

        this.closeFunction = this.closeFunction.bind(this);


        this.state = {
            item: this.props.route.params.item,
            title: title,
            stateCount: 0.0,
            slide_data : carouselItems,
            activeSlide : 0,
            type : -1,
            isRefresh : false,
            selectedDate: new Date(),
            displayFullFlatImg : false,

        };
        this.updateFlatStatus = this.updateFlatStatus.bind(this);
        this.changeStatusSuccess = this.changeStatusSuccess.bind(this);
        this.changeStatusFalse = this.changeStatusFalse.bind(this);
        this.clickSignature = this.clickSignature.bind(this);
        this.updateDeadlineCompleted = this.updateDeadlineCompleted.bind(this);
        this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
        this.handleDatePicked = this.handleDatePicked.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.saveDeadline = this.saveDeadline.bind(this);
        this.readyToDeliver = this.readyToDeliver.bind(this);
        this.displayFullImg = this.displayFullImg.bind(this);
    }

    onRefresh = () => {
        console.log('Refresh News');
        this.setState({isRefresh:true});
        FlatController.getFlatById(this.onGetFlatDetailSuccess, this.onGetDesignFalse, this.state.item.id);
    };

    displayFullImg =  ()=> {
        this.setState({'displayFullFlatImg' : true});
    }

    onGetFlatDetailSuccess(data){
        this.setState({isRefresh:false});
        if(data['result'] == 1){
            this.updateFlatStatus(data['flat']);
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
    }
    onGetDesignFalse(data){
        this.setState({isRefresh:false});
        console.log("false data : " + data);
    }

    changeFlatStatus = (type, status = null) => {
        if(type == decline_deliver_form) {
            this.setState({displayDeclineForm : true, type:type});
        }
        if(type == signature_form) {
            this.setState({displaySignatureForm : true, type:type});
        }
        if (type == update_status_form) {
            if(Def.user_info){
                FlatController.changeStatusFlat(this.changeStatusSuccess, this.changeStatusFalse, Def.user_info['access_token'] ,this.state.item.id, status, 0 , null, "",  FlatHelper.UPDATE_STATUS_TYPE);
            }
        }
    }

    saveDeadline = () => {
        FlatController.changeStatusFlat(this.changeStatusSuccess, this.changeStatusFalse, Def.user_info['access_token'] ,this.state.item.id, null, 0 , null, "",  FlatHelper.UPDATE_DEADLINE, this.state.deadlineCompleted.getTime()/1000);
    }
    readyToDeliver = () => {
        console.log('Ready To Send');
        FlatController.changeStatusFlat(this.changeStatusSuccess, this.changeStatusFalse, Def.user_info['access_token'] ,this.state.item.id, null, 0 , null, "",  FlatHelper.READY_TO_DELIVER, null, 1);
    }

    clickSignature = () => {
        this.setState({displaySignatureForm : true, type:signature_form});
    }

    updateDeadlineCompleted = () => {
        this.setState({displayUpdateDeadline : true, type:update_deadline_form});
    }

    openSendMailModal = () => {
            this.setState({displaySendMailForm : true, type:sendmail_form});
    }


    changeStatusSuccess = (data) => {
        console.log('REady : '+ JSON.stringify(data['flat']['highlight_re_schedule']));
        if(data['msg'] == "Ok"){
            // this.setState({canSaveDeadline:false});
            Alert.alert(
                "Thông báo",
                'Cập nhật thành công',
                [
                    {
                        text: "Ok",
                    }
                ],
                {cancelable: false},
            );
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



    refresh()
    {
        this.setState({ stateCount: Math.random(),  });
    }

    updateFlatStatus =(flat) => {
        if(flat) {
            this.setState({item:flat, deadlineCompleted: null, canSaveDeadline : false});
            if(Def.flat_data) { // Update dữ liệu
                let updated = Def.updateFlatToFlatList(flat);
                if(updated){
                    Def.refresh_flat_data = true;
                    if (Def.refeshFlatList){
                        Def.refeshFlatList();
                    }
                }
            }
        }

        this.closeFunction();
    };

    closeFunction = () => {
        if(this.state.type == decline_deliver_form) {
            this.setState({displayDeclineForm : false});
        }

        if(this.state.type == signature_form) {
            this.setState({displaySignatureForm : false});
        }

        if(this.state.type == sendmail_form) {
            this.setState({displaySendMailForm : false});
        }
        if(this.state.type == update_deadline_form) {
            this.setState({displayUpdateDeadline : false});
        }
    };

    closeFullImgFunc = () => {
        this.setState({displayFullFlatImg:false});
    };

    onGetDesignSuccess(data){
        Object.entries(data["data"]).map((prop, key) => {
        });
        Def.design_data = data["data"];
        let design_list = [];
        let title = "Danh sách thiết kế";
        if(this.state.cate){
            design_list = Def.design_cate[this.state.cate['id']]['data'];
            title = Def.design_cate[this.state.cate['id']]['name_vi']
            this.setState({design_list:design_list, title:title});
        }
        Def.config_design_menu = this.createConfigData(data["data"]) ;
    }


    createConfigData(data){
        if(data){
            let configData =  Object.entries(data).map((prop, key) => {
                // console.log("Props : " + JSON.stringify(prop));
                return {key: prop[0],name_vi:prop[1]["name_vi"], hidden:0, data:prop[1]["data"]};
            });
            return configData;
        }
    }




    formatText(text){
        let rs = text;
        if(text && text.length > 10){
            rs = text.substring(0, 20) ;
        }
        return rs;
    }


    shouldComponentUpdate(){
        // this.setState({ configMenu: Def.config_news_menu});
        // console.log('SortData ddd:' + JSON.stringify(this.props.route));
        console.log('shouldComponentUpdate - flat');
        return true;
    }

    componentDidMount() {
        console.log('Component did mount -flat');
        let {navigation} = this.props;
        navigation =  this.props.navigation ? this.props.navigation : Def.mainNavigate ;
    }


    handleDatePicked = date => {
        this.hideDateTimePicker();
        this.setState({ deadlineCompleted : date, canSaveDeadline:true });
    };

    hideDateTimePicker = () => {
        this.setState({ displayUpdateDeadline : false });
    };



    render() {
        const {navigation} = this.props;
        const {item} = this.state;
        Def.order_number = 20;
        const ListHeader = () => (
            <View>
                <View style={{width : width, backgroundColor: '#fff', flexDirection : 'row' , paddingBottom:5 }}>
                    <TouchableOpacity style={styles.imageContainer} onPress={this.displayFullImg}>
                        { item.image_path ?
                            <Image  style={[styles.itemImage ]}  source={{uri: Def.getThumnailImg(item.image_path)}}  />
                            :
                            <Image  style={[styles.itemImage ]} source={require('../../../assets/icon/default_arena.jpg')} />
                        }

                        <View style = {{marginTop : 10, width:PROGRAM_IMAGE_WIDTH, justifyContent:'flex-start'  }}>

                            <Text style={[{   paddingVertical:1 , borderRadius : 3 ,bottom:5, backgroundColor:  Style.DEFAUT_BLUE_COLOR, textAlign: 'center'}, Style.text_styles.whiteTitleText]}>
                                {Def.formatText(item.name, 15)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.info}>
                    <View style={{flexDirection:'row'}}>
                        <Text>
                            {"Tình trạng:" + ' '}
                        </Text>
                        <Text style={{fontSize:Style.MIDLE_SIZE ,  paddingRight:5}}>
                            {Def.getDesignStatusName(item.status)}
                        </Text>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Text>
                            {"Dự án:" + ' '}
                        </Text>
                        <Text style={{fontSize:Style.MIDLE_SIZE ,  paddingRight:5}}>
                            {item.building ? item.building.name+"" : ""}
                        </Text>
                    </View>
                </View>
                <View style={{paddingHorizontal:10, marginTop:20 ,  paddingBottom:8 , flexDirection:'row', justifyContent:'space-between'}}>
                    <Text style={styles.titleStyle}>{"Thiết bị nội thất"}</Text>
                </View>
            </View>
        );
        return (
            <View style={{flex:1}}>
                <View style={{flex:1, paddingTop:5 , paddingBottom : 5 }}>

                    <ListHeader />
                    {/*<ProgramVerList*/}
                    {/*    refreshControl={*/}
                    {/*        <RefreshControl refreshing={this.state.isRefresh} onRefresh={this.onRefresh}/>*/}
                    {/*    }*/}
                    {/*    data={this.state.item.product}*/}
                    {/*    navigation={this.props.navigation}*/}
                    {/*    header={ListHeader}*/}
                    {/*    type={'product'}*/}
                    {/*    numColumns={2}*/}
                    {/*    stack={'Flat'}*/}
                    {/*    screen={'product-detail'}*/}
                    {/*    addToCart={this.addToCart}*/}
                    {/*/>*/}
                </View>

                <View style={styles.controlBtn}>
                    {       false ?
                            <View style={{flexDirection: 'row', paddingBottom: 2}}>
                                {
                                   true ?
                                        <TouchableOpacity style={Style.button_styles.buttonFlatStyle}
                                                          >
                                            <Text style={Style.text_styles.whiteTitleText}>
                                                Download
                                            </Text>
                                        </TouchableOpacity> : null
                                }
                                {
                                    true ?
                                        <TouchableOpacity style={Style.button_styles.buttonFlatStyle}
                                                          >
                                            <Text style={Style.text_styles.whiteTitleText}>
                                                Xóa
                                            </Text>
                                        </TouchableOpacity> : null
                                }
                            </View> : null}

                </View>
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
    imageContainer:{
        flex: 1,
        borderRadius :5,
        // justifyContent:'center',
        padding: 10,
        marginTop:5,
        alignItems:'center'
        // backgroundColor:'green'
    },

    programListStyle : {

    },
    itemImage: {
        width: PROGRAM_IMAGE_WIDTH,
        height : PROGRAM_IMAGE_HEIGHT + 5,
        borderRadius: 5,
    },
    titleStyle : {
        fontSize : Style.BIG_SIZE,
        color: Style.GREY_TEXT_COLOR,
    },
    info: {
        paddingHorizontal:10,
        // flex: 2.5,
        // backgroundColor : 'red',
        marginTop : 5,
        // justifyContent: 'space-around',
        // paddingVertical: 5,
        // backgroundColor : 'red'
    },
    modalStyle: {
        width : width,
        height: 300,
        marginTop : 20,
        backgroundColor:'green'
    },
    requestDetailModalView : {
        padding: 5,
        paddingVertical : 0,
        height :height,
        width : width,
        shadowOpacity:1,
        shadowRadius: 3.84,
        justifyContent : 'center',
        alignItems : 'center',
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    requestSignatureModalView : {
        padding: 5,
        paddingVertical : 0,
        height :height,
        width : width,
        shadowOpacity:1,
        shadowRadius: 3.84,
        justifyContent : 'center',
        alignItems : 'center',
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },

});

export default DesignDetailScreen;
