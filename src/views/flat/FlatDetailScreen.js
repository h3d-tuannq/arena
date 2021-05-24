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
    RefreshControl, PermissionsAndroid, Platform
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

import AsyncStorage from '@react-native-async-storage/async-storage'


import FullImageModal from  '../../../src/com/modal/FullImageModal'
import {OfflineHelper} from "../../def/OfflineHelper";


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


class FlatDetailScreen extends React.Component {

    downloaded = 0;
    downloadFalse = 0;

    constructor(props){
        super(props);
        this.formatText    = this.formatText.bind(this);
        this.refresh     = this.refresh.bind(this);
        Def.mainNavigate = this.props.navigation;

        let design_list = [];
        let title = "Gian hàng";

        this.closeFunction = this.closeFunction.bind(this);
        let calPif = FlatHelper.calPassPif(this.props.route.params.item);
        console.log('CanPif : ' + JSON.stringify(calPif));


        this.state = {
            item: this.props.route.params.item,
            title: title,
            stateCount: 0.0,
            slide_data : carouselItems,
            activeSlide : 0,
            displayDeclineForm : false,
            displaySignatureForm : false,
            displaySendMailForm : false,
            displayUpdateDeadline: false,
            canSaveDeadline:false,
            type : -1,
            totalProduct:calPif.total ? calPif.total : 0,
            passProduct:calPif.pass ? calPif.pass : 0,
            isRefresh : false,
            selectedDate: new Date(),
            deadlineCompleted: null,
            displayFullFlatImg : false,
            downloaded : false,
            startDownload : false,
            imageRepairItem : 0,


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
        this.onGetFlatDetailSuccess = this.onGetFlatDetailSuccess.bind(this);
        this.onGetDesignFalse = this.onGetDesignFalse.bind(this);
        this.displayFullImg = this.displayFullImg.bind(this);
        this.downloadFlat = this.downloadFlat.bind(this);
        this.downloadRepairInFlat = this.downloadRepairInFlat.bind(this);
        this.downloadRepairFalse = this.downloadRepairFalse.bind(this);
        this.finishDownload = this.finishDownload.bind(this);
        this.processDownloadRepairInFlat = this.processDownloadRepairInFlat.bind(this);
        this.getRepairByFlatFalse = this.getRepairByFlatFalse.bind(this);
        this.getRepairByFlatSuccess = this.getRepairByFlatSuccess.bind(this);
        OfflineHelper.downloadRepariItemInflat = this.downloadFlat.bind(this);
    }
    downloadFlat = async () => {
        if (Platform.OS === 'ios') {
            this.downloadRepairInFlat();
        } else {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission Required',
                        message:
                            'App needs access to your storage to download Photos',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    // Once user grant the permission start downloading
                    console.log('Storage Permission Granted.');
                    this.downloadRepairInFlat();

                } else {
                    // If permission denied then show alert
                    alert('Storage Permission Not Granted');
                }
            } catch (err) {
                // To handle permission related exception
                console.warn(err);
            }
        }
    }

    downloadRepairInFlat = () => {
        if(Def.user_info){
            FlatController.getRequestRepairByFlat(this.getRepairByFlatSuccess, this.getRepairByFlatFalse, this.state.item.id);
        }

    };

    getRepairByFlatSuccess = (data) => {
        if( data['result']  && data['request_repairs']){
            Def.requestRepairtFlat[this.state.item.id] = OfflineHelper.makeObjectDataWithKeyObj (data['request_repairs']);
            let requestRepair = data['request_repairs'];
             requestRepair.forEach((pifRepair) => {
                if(pifRepair){
                    for (const key in pifRepair) {
                        Def.requestRepairsTree[key] = pifRepair[key];
                    }
                }
            });
            console.log('Request Repair Tree: ' + JSON.stringify(Def.requestRepairsTree));
            if(Def.requestRepairsTree){
                AsyncStorage.setItem('requestRepairsTree', JSON.stringify(Def.requestRepairsTree));
            }
            this.processDownloadRepairInFlat();
        }
    };

    getRepairByFlatFalse = (data) => {
        console.log('Err : ' + JSON.stringify(data));
    };

    processDownloadRepairInFlat = () => {
        if(Def.requestRepairtFlat[this.state.item.id]) {
            console.log('Start download in flat + ' + this.state.item.id);
            this.setState({startDownload: true});
            let offlineItem = this.state.item;
            OfflineHelper.offlineFlatData[this.state.item.id] = offlineItem;
            let flatRepairItems = [];
            let productInstances = this.state.item.productInstanceFlat;
            let repairItems, requestRepairs;
            productInstances.forEach(pif => {
                if(Def.requestRepairtFlat[this.state.item.id][pif.id]) {
                    requestRepairs = Def.requestRepairtFlat[this.state.item.id][pif.id];
                    // repairItems = OfflineHelper.makeObjectDataWithIdKey(requestRepairs);
                    // if(repairItems.length > 0){
                    //     // console.log('Request Repair : ' + pif.id + '---' + repairItems.length);
                    //     // console.log('Request Repair content : '+ JSON.stringify(repairItems))
                    // }
                    flatRepairItems =  flatRepairItems.concat(repairItems);
                }
            });
            console.log('Request repair item : ' + flatRepairItems.length);
            let imageRepairItems = flatRepairItems.filter((item) => {
                return item &&  item['image_path'] != null && item['image_path'].length > 0;
            });
            this.setState({imageRepairItem: imageRepairItems.length});
            console.log('Total download : ' + imageRepairItems.length);
            imageRepairItems.forEach((value, index) => {
                if (value && value['image_path']) {
                     OfflineHelper.downloadRepairItemImage(value, this.downloadDesignSuccess, this.downloadDesignFalse);
                }
            });
        }
    }

    downloadRepairInFlatSuccess = (obj,res) => {
        console.log('Download Success');
        obj.offline_img = res.path();
        OfflineHelper.updateOfflineRepairItem(obj);
        this.downloaded = this.downloaded + 1;
        this.setState({downloaded: this.downloaded });
        if(this.downloaded + this.downloadFalse == this.state.imageRepairItem) {
            this.finishDownload();
        }
    }

    finishDownload() {
        console.log('total download : ' + this.state.imageRepairItem  + ' downloaded' + this.downloaded);
        let offlineItem = OfflineHelper.offlineFlatData[this.state.item.id];
        offlineItem['downloaded'] = this.state.downloaded;
        offlineItem['image_dowload'] = this.state.imageRepairItem;


        OfflineHelper.offlineFlatData[this.state.item.id] = offlineItem;
        if(OfflineHelper.offlineFlatData){
            AsyncStorage.setItem('offlineFlatData', JSON.stringify(OfflineHelper.offlineFlatData));
        }

        if(OfflineHelper.offlineRepairData){
            AsyncStorage.setItem('offlineFlatData', JSON.stringify(OfflineHelper.offlineRepairData));
        }



    }

    downloadRepairFalse = (obj,res) => {
        this.downloadFalse = this.downloadFalse + 1;
        this.setState({downloadFalse: this.downloadFalse })
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

    changeFlatStatus = (type, status = null, absentee_hanover = null) => {
        if(type == decline_deliver_form) {
            this.setState({displayDeclineForm : true, type:type});
        }
        if(type == signature_form) {
            this.setState({displaySignatureForm : true, type:type});
        }
        if (type == update_status_form) {
            if(Def.user_info){
                FlatController.changeStatusFlat(this.changeStatusSuccess, this.changeStatusFalse, Def.user_info['access_token'] ,this.state.item.id, status, 0 , null, "",  FlatHelper.UPDATE_STATUS_TYPE, null, null, absentee_hanover);
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
    };

    changeStatusFalse = (data) => {
        console.log('Change Status False ' + JSON.stringify(data));
    };



    refresh()
    {
        this.setState({ stateCount: Math.random(), deadlineCompleted: null });
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

        if(navigation){
            console.log('Isset Navigation : ' + JSON.stringify(navigation));
            this.focusListener = navigation.addListener("focus", this.forcusFunction);
        }
    }

    forcusFunction = () => {
        console.log('Forcus function');
        if(Def.user_info){
            FlatController.getFlatById(this.onGetFlatDetailSuccess, this.onGetDesignFalse, this.state.item.id);
        }
    };

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
        const configMenu = Def.config_design_menu;
        Def.order_number = 20;
        const ListHeader = () => (
            <View>
                <View style={{width : width, backgroundColor: '#fff', flexDirection : 'row' , paddingBottom:5 }}>
                    <TouchableOpacity style={styles.imageContainer} onPress={this.displayFullImg}>
                        {item.design && item.design.image_path ?
                            <Image  style={[styles.itemImage ]}  source={{uri: Def.getObjImage(item.design)}}  />
                            :
                            <Image  style={[styles.itemImage ]} source={require('../../../assets/icon/default_arena.jpg')} />
                        }

                        <View style = {{marginTop : 10, width:PROGRAM_IMAGE_WIDTH, justifyContent:'flex-start'  }}>

                            <Text style={[{   paddingVertical:1 , borderRadius : 3 ,bottom:5, backgroundColor:  Style.DEFAUT_BLUE_COLOR, textAlign: 'center'}, Style.text_styles.whiteTitleText]}>
                                {Def.formatText(item.code, 15)}
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {
                        this.state.item.signature && this.state.item.signature['image_path'] ?
                            <View style={styles.imageContainer}>
                                <Image  style={[styles.itemImage ]}  source={{uri: Def.getThumnailImg(item.signature.image_path)}}  />
                                <View style = {{marginTop : 10, width:PROGRAM_IMAGE_WIDTH, justifyContent:'flex-start'  }}>
                                    <TouchableOpacity style={[{   paddingVertical:1 , flexDirection:'row' , justifyContent:'space-around' , borderRadius : 3 ,bottom:5, backgroundColor:  Style.DEFAUT_BLUE_COLOR, textAlign: 'center'}, {}]}
                                        onPress={this.clickSignature}
                                    >
                                        { FlatHelper.canReSigning(this.state.item, Def.user_info) ?
                                            <Icon name="pencil" size={20} color="#fff" />
                                            : <View/>
                                        }
                                        <Text style={Style.text_styles.whiteTitleText}>
                                            {"Chữ Ký"}
                                        </Text>
                                        <View/>

                                    </TouchableOpacity>
                                </View>
                            </View>
                            : null

                    }
                </View>

                <View style={styles.info}>
                    <View style={{flexDirection:'row'}}>
                        <Text>
                            {"Tình trạng:" + ' '}
                        </Text>
                        <Text style={{fontSize:Style.MIDLE_SIZE ,  paddingRight:5}}>
                            {Def.getFlatStatusName(item.status)+"" + (item.is_decline ? "/Đã từ chối bàn giao" :"")}
                        </Text>
                    </View>

                    {
                        item.is_decline ?
                            <View style={{flexDirection:'row'}}>
                                <Text>
                                    {"Lý do từ chối bàn giao:" + ' '}
                                </Text>
                                <Text style={{fontSize:Style.MIDLE_SIZE ,  paddingRight:5}}>
                                    {item.decline_note}
                                </Text>
                            </View> : null
                    }

                    <View style={{flexDirection:'row'}}>
                        <Text>
                            {"Cán bộ bàn giao:" + ' '}
                        </Text>
                        <Text style={{fontSize:Style.MIDLE_SIZE ,  paddingRight:5}}>
                            {item.handover ? item.handover.username+"" : ""}
                        </Text>
                    </View>

                    <View style={{flexDirection:'row'}}>
                        <Text>
                            {"CSKH:" + ' '}
                        </Text>
                        <Text style={{fontSize:Style.MIDLE_SIZE ,  paddingRight:5}}>
                            {item.cskh ? item.cskh.username+"" : ""}
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

                    {
                        item.authority_name ?
                            <View style={{flexDirection:'row'}}>
                                <Text>
                                    {"Ủy quyền :" + ' '}
                                </Text>
                                <Text style={{fontSize:Style.MIDLE_SIZE, paddingRight:5}}>
                                    { item.authority_name? item.authority_name+ (item.authority_phone ? '-' + item.authority_phone : '' ) : ""}
                                </Text>
                            </View>
                            :
                            <View style={{flexDirection:'row'}}>

                                <Text>
                                    {"Chủ sở hữu :" + ' '}
                                </Text>
                                <Text style={{fontSize:Style.MIDLE_SIZE, paddingRight:5}}>
                                    { item.customer? item.customer.name+"" : ""}
                                </Text>
                            </View>
                    }



                    <View style={{flexDirection:'row'}}>
                        <Text>
                            {"Ngày bàn giao: "}
                        </Text>

                        <Text style={{fontSize:Style.MIDLE_SIZE, paddingRight:5}}>
                            { item.deliver_date ? Def.getDateString(new Date(item.deliver_date *1000), "dd-MM-yyyy") : ""}
                        </Text>
                    </View>
                    {
                        item.signature ?
                            <View style={{flexDirection:'row'}}>
                                <Text>
                                    {"Ngày ký nhận: "}
                                </Text>

                                <Text style={{fontSize:Style.MIDLE_SIZE, paddingRight:5}}>
                                    { item.signature && item.signature.date_create ? Def.getDateString(new Date(item.signature.date_create *1000), "dd-MM-yyyy hh:mm") : ""}
                                </Text>
                            </View> : null
                    }




                    <View style={{flexDirection:'row'}}>
                        <Text>
                            {"Deadline hoàn thiện: "}
                        </Text>

                        <Text style={[{fontSize:Style.MIDLE_SIZE, paddingRight:5}, {color: this.state.canSaveDeadline ? Style.DEFAUT_RED_COLOR : '#000'}]}>
                            { this.state.deadlineCompleted ? Def.getDateString(this.state.deadlineCompleted, "dd-MM-yyyy hh:mm") : ( item.deadline_date ? Def.getDateString(new Date(item.deadline_date *1000), "dd-MM-yyyy hh:mm") : "Không có")}
                        </Text>
                    </View>


                </View>



                {/*<View style={{flexDirection: 'row', justifyContent: 'space-between' , alignItems: 'flex-start', marginTop:5}}>*/}
                    <View style={{paddingHorizontal:10, paddingBottom:8 , flexDirection:'row', justifyContent:'space-between'}}>

                        <Text style={styles.titleStyle}>{"Hạng mục bàn giao"}</Text>
                        <Text style={styles.titleStyle}>{(this.state.passProduct +"/" +this.state.totalProduct )}</Text>
                    </View>
                {/*</View>*/}
            </View>
        );
        return (
            <View style={{flex:1}}>
                <View style={{flex:1, paddingTop:5 , paddingBottom : 5 }}>
                    <ProgramVerList
                        refreshControl={
                            <RefreshControl refreshing={this.state.isRefresh} onRefresh={this.onRefresh}/>
                        }
                        data={this.state.item.productInstanceFlat}
                        navigation={this.props.navigation}
                        header={ListHeader}
                        type={'product'}
                        numColumns={2}
                        stack={'Flat'}
                        screen={'product-detail'}
                        addToCart={this.addToCart}
                    />
                </View>

                <View style={styles.controlBtn}>
                    {
                        Def.user_info ?

                            <View style={{flexDirection: 'row', paddingBottom: 2}}>
                                {FlatHelper.canDecline(this.state.item, Def.user_info) ?
                                    <TouchableOpacity style={Style.button_styles.buttonFlatStyle}
                                                      onPress={() => this.changeFlatStatus(decline_deliver_form)}>
                                        <Text style={Style.text_styles.whiteTitleText}>
                                            Từ chối
                                        </Text>
                                    </TouchableOpacity> : null
                                }
                                {
                                    FlatHelper.canSigning(this.state.item, Def.user_info) ?
                                        <TouchableOpacity style={Style.button_styles.buttonFlatStyle}
                                                          onPress={() => this.changeFlatStatus(signature_form)}>
                                            <Text style={Style.text_styles.whiteTitleText}>
                                                Ký nhận
                                            </Text>
                                        </TouchableOpacity> : null
                                }

                                {
                                    FlatHelper.canAbsenteeHanover(this.state.item, Def.user_info) ?
                                        <TouchableOpacity style={Style.button_styles.buttonFlatStyle}
                                                          onPress={() => this.changeFlatStatus(update_status_form, FlatHelper.PROFILE_COMPLETED_STATUS, 1)}>
                                            <Text style={Style.text_styles.whiteTitleText}>
                                                Bàn giao vắng mặt
                                            </Text>
                                        </TouchableOpacity> : null
                                }

                                {FlatHelper.canSendRequestRepair(this.state.item, Def.user_info) ?
                                    <TouchableOpacity style={Style.button_styles.buttonFlatStyle}
                                                      onPress={this.openSendMailModal}>
                                        <Text style={Style.text_styles.whiteTitleText}>
                                            Gửi biên bản
                                        </Text>
                                    </TouchableOpacity> : null
                                }
                                {
                                    FlatHelper.canDone(this.state.item,Def.user_info) ?
                                        <TouchableOpacity style={Style.button_styles.buttonFlatStyle}
                                                          onPress={() => this.changeFlatStatus(update_status_form, FlatHelper.DONE_STATUS)}>
                                            <Text style={Style.text_styles.whiteTitleText}>
                                                Hoàn thành
                                            </Text>
                                        </TouchableOpacity> : null
                                }



                                {
                                    FlatHelper.canChangeDeliverStatus(this.state.item,Def.user_info)  ?
                                        <TouchableOpacity style={Style.button_styles.buttonFlatStyle}
                                                          onPress={() => this.changeFlatStatus(update_status_form, FlatHelper.CAN_DELIVER_STATUS)}>
                                            <Text style={Style.text_styles.whiteTitleText}>
                                                Đủ điều kiện
                                            </Text>
                                        </TouchableOpacity> : null
                                }

                                {
                                    FlatHelper.readyToDeliver(this.state.item,Def.user_info)  ?
                                        <TouchableOpacity style={Style.button_styles.buttonFlatStyle}
                                                          onPress={() => this.readyToDeliver()}>
                                            <Text style={Style.text_styles.whiteTitleText}>
                                                Sẵn sàng bàn giao
                                            </Text>
                                        </TouchableOpacity> : null
                                }


                                {
                                    FlatHelper.canPerformDelivering(this.state.item,Def.user_info) ?
                                        <TouchableOpacity style={Style.button_styles.buttonFlatStyle}
                                                          onPress={() => this.changeFlatStatus(update_status_form, FlatHelper.DELIVERING_STATUS)}>
                                            <Text style={Style.text_styles.whiteTitleText}>
                                                Thực hiện bàn giao
                                            </Text>
                                        </TouchableOpacity> : null
                                }

                                {
                                    FlatHelper.canCompleteProfile(this.state.item,Def.user_info) ?
                                        <TouchableOpacity style={Style.button_styles.buttonFlatStyle}
                                                          onPress={() => this.changeFlatStatus(update_status_form, FlatHelper.PROFILE_COMPLETED_STATUS)}>
                                            <Text style={Style.text_styles.whiteTitleText}>
                                                Hoàn thiện hồ sơ
                                            </Text>
                                        </TouchableOpacity> : null
                                }

                                {
                                    FlatHelper.canRepairAfterSigned(this.state.item,Def.user_info) ?
                                        <TouchableOpacity style={Style.button_styles.buttonFlatStyle}
                                                          onPress={() => this.changeFlatStatus(update_status_form, FlatHelper.REPAIR_AFTER_SIGN_STATUS)}>
                                            <Text style={Style.text_styles.whiteTitleText}>
                                                Yêu cầu sửa
                                            </Text>
                                        </TouchableOpacity> : null
                                }

                                {
                                    FlatHelper.canRollbackFinalDone(this.state.item,Def.user_info)  ?
                                        <TouchableOpacity style={Style.button_styles.buttonFlatStyle}
                                                          onPress={() => this.changeFlatStatus(update_status_form, FlatHelper.FINANCE_DONE_STATUS)}>
                                            <Text style={Style.text_styles.whiteTitleText}>
                                                Chưa đủ điều kiện
                                            </Text>
                                        </TouchableOpacity> : null
                                }

                                {
                                    FlatHelper.canChangeDeadlineCompleted(this.state.item,Def.user_info)  ?
                                        <TouchableOpacity style={Style.button_styles.buttonFlatStyle}
                                                          onPress={this.updateDeadlineCompleted}>
                                            <Text style={Style.text_styles.whiteTitleText}>
                                                Deadline hoàn thiện
                                            </Text>
                                        </TouchableOpacity> : null
                                }

                                {/*{*/}
                                {/*    FlatHelper.canChangeDeadlineCompleted(this.state.item,Def.user_info) && this.state.item.deadlineCompleted ?*/}
                                {/*        <TouchableOpacity style={Style.button_styles.buttonFlatStyle}*/}
                                {/*                          onPress={this.updateDeadlineCompleted}>*/}
                                {/*            <Text style={Style.text_styles.whiteTitleText}>*/}
                                {/*                Xóa Deadline*/}
                                {/*            </Text>*/}
                                {/*        </TouchableOpacity> : null*/}
                                {/*}*/}

                                {
                                    FlatHelper.canChangeDeadlineCompleted(this.state.item,Def.user_info) && this.state.canSaveDeadline  ?
                                        <TouchableOpacity style={Style.button_styles.buttonFlatStyle}
                                                          onPress={this.saveDeadline}>
                                            <Text style={Style.text_styles.whiteTitleText}>
                                                Lưu Deadline
                                            </Text>
                                        </TouchableOpacity> : null
                                }


                            </View> :  null
                    }
                </View>

                <Modal  onRequestClose={this.closeFunction}  transparent={true}  visible={this.state.displayDeclineForm} >
                    <TouchableOpacity  onPress={this.closeFunction} style={[styles.requestDetailModalView, {justifyContent:'center', alignItems: 'center'}]}  activeOpacity={1}>
                        <TouchableWithoutFeedback activeOpacity={1}  style={{width : width * 0.8, height :0.5*height,  alignItems: "center",
                            justifyContent : 'center', zIndex: 3}} onPress ={ (e) => {
                            // props.closeFun(props.selectedDate)
                            console.log('prevent click');
                            e.preventDefault()
                        }}>
                            <View style={{zIndex : 5 }}>
                                <DeclineDeliverModalForm updateFlatStatus={this.updateFlatStatus} flat={this.state.item}  />
                            </View>

                        </TouchableWithoutFeedback>

                    </TouchableOpacity>
                </Modal>

                <Modal  onRequestClose={this.closeFunction}  transparent={false}  visible={this.state.displaySignatureForm} style={styles.requestSignatureModalView}>
                        {/*<TouchableWithoutFeedback activeOpacity={1}  style={{width : width * 0.8, height :0.5*height,  alignItems: "center",*/}
                            {/*justifyContent : 'center', zIndex: 3}} onPress ={ (e) => {*/}
                            {/*// props.closeFun(props.selectedDate)*/}
                            {/*console.log('prevent click');*/}
                            {/*e.preventDefault()*/}
                        {/*}}>*/}
                            <View style={{zIndex : 5 }}>
                                <SignatureModalForm updateFlatStatus={this.updateFlatStatus} flat={this.state.item} closeFunction={this.closeFunction} />
                            </View>

                        {/*</TouchableWithoutFeedback>*/}

                </Modal>

                <Modal  onRequestClose={this.closeFunction}  transparent={false}  visible={this.state.displaySendMailForm} style={styles.requestSignatureModalView}>
                    <View style={{zIndex : 5 }}>
                        <SendRepairReportForm updateFlatStatus={this.updateFlatStatus} flat={this.state.item} closeFunction={this.closeFunction} />
                    </View>
                </Modal>

                {/*<Modal  onRequestClose={this.closeFunction}  transparent={false}  visible={this.state.displayUpdateDeadline} style={styles.requestSignatureModalView}>*/}
                {/*    <View style={{zIndex : 5 }}>*/}
                {/*        <UpdateDeadlineModal updateFlatStatus={this.updateFlatStatus} flat={this.state.item} closeFunction={this.closeFunction} />*/}
                {/*    </View>*/}
                {/*</Modal>*/}

                <DateTimePickerModal
                    isVisible={this.state.displayUpdateDeadline}
                    onConfirm={(date) => {
                        this.handleDatePicked(date);
                        // this.hideDateTimePicker();
                    }}
                    onCancel={this.hideDateTimePicker}
                    date={this.state.selectedDate}
                    mode={'datetime'}
                    display='spinner'
                    style={{width: 400, opacity: 1, height: 100, marginTop: 540}}
                    datePickerModeAndroid='spinner'
                    timePickerModeAndroid='spinner'
                />

                <Modal  onRequestClose={this.closeFullImgFunc}  transparent={true}  visible={this.state.displayFullFlatImg} >
                    <TouchableOpacity  onPress={this.closeFunction} style={[styles.requestDetailModalView, {justifyContent:'center', alignItems: 'center'}]}  activeOpacity={1}>
                        <TouchableWithoutFeedback activeOpacity={1}  style={{width : width, height : height,  alignItems: "center",
                            justifyContent : 'center', zIndex: 3}} onPress ={ (e) => {
                            console.log('prevent click');
                            e.preventDefault()
                        }}>
                            <View>
                                <FullImageModal item={this.state.item ? this.state.item.design : null } />
                            </View>

                        </TouchableWithoutFeedback>

                    </TouchableOpacity>
                </Modal>
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

export default FlatDetailScreen;
