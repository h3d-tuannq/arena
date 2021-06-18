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
    RefreshControl,
    TextInput,
    Modal,
    Alert, Platform, PermissionsAndroid, ActivityIndicator,
} from 'react-native';
import Def from '../../def/Def'
const {width, height} = Dimensions.get('window');
import Style from '../../def/Style';
import ProgramVerList from '../../com/common/ProgramVerList';
import FlatController from  '../../controller/FlatController';
const PROGRAM_IMAGE_WIDTH = (width - 30-8) ;
const PROGRAM_IMAGE_HEIGHT = (width - 30-8) ;
import AsyncStorage  from '@react-native-async-storage/async-storage';
import AutocompleteModal from '../../com/common/AutocompleteModal';
import Icon from 'react-native-vector-icons/FontAwesome';
import FlatHelper from '../../def/FlatHelper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Net from '../../controller/Net';
import {OfflineHelper} from '../../def/OfflineHelper';
import NetInfo from "@react-native-community/netinfo";

const CHOSE_BUILDING = 0;
const CHOSE_CUSTOMER = 1;
const CHOSE_STATUS = 2;
const CHOSE_DELIVER_DATE = 3;


const ITEM_HEIGHT = 38;
const LoadingModal = (props) => (
    <Modal onRequestClose={() => {console.log('test')}} visible={props.visible} transparent={true} styles={{backgroundColor : '#green'}} >
        <View style={{ justifyContent : 'center', alignItems:'center', flex: 1 }}>
            <ActivityIndicator size="large" color="#0c5890"/>
        </View>
    </Modal>
)



class FlatListScreen extends React.Component {

    criteria = {};
    imageView = null;

    constructor(props){
        super(props);
        this.onGetFlatSuccess     = this.onGetFlatSuccess.bind(this);
        this.onGetFlatFalse     = this.onGetFlatFalse.bind(this);
        this.formatText    = this.formatText.bind(this);
        this.refresh     = this.refresh.bind(this);
        Def.mainNavigate = this.props.navigation;
        Def.refeshFlatList = this.refresh.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.choseBuildingClick = this.choseBuildingClick.bind(this);
        this.choseCustomerClick = this.choseCustomerClick.bind(this);
        this.showModal = this.showModal.bind(this);
        this.getBuildingSuccess = this.getBuildingSuccess.bind(this);
        this.getCustomerSuccess = this.getCustomerSuccess.bind(this);
        this.getFilterDataFalse = this.getFilterDataFalse.bind(this);
        this.closeFunction = this.closeFunction.bind(this);
        this.filterDataByCondition = this.filterDataByCondition.bind(this);
        this.searchButtonClick = this.searchButtonClick.bind(this);
        this.filterFunc = this.filterFunc.bind(this);
        this.resetCriteria = this.resetCriteria.bind(this);
        this.checkPermission = this.checkPermission.bind(this);
        this.displayImageLoaded = this.displayImageLoaded.bind(this);
        this.choseStatusClick = this.choseStatusClick.bind(this);
        this.signInBtnClick = this.signInBtnClick.bind(this);
        this.removeOfflineItem = this.removeOfflineItem.bind(this);
        this.resetOfflineFlat = this.resetOfflineFlat.bind(this);
        this.forcusFunction = this.forcusFunction.bind(this);

        let title = "Căn hộ bàn giao";
        this.state = {
            data: Def.NetWorkMode ?  Def.flat_data : [],
            title: title,
            stateCount: 0.0,
            isRefresh : false,
            building: null,
            customer: null,
            name:'',
            displayModal: false,
            filterAttr:"name",
            filterData: [],
            choseMode:0, // 0 chọn dự án, 1 chọn khách hàng
            displayLoadedImage: false,
            status:null,
            selectedDate: new Date(),
            filterDate: null,
            displaySelectDate: false,
            pageIndex:0,
            totalPage:0,
            isLoading:false,

        };

        this.handleDatePicked = this.handleDatePicked.bind(this);
        this.hideDateTimePicker = this.hideDateTimePicker.bind(this);
        this.displayFilterDate = this.displayFilterDate.bind(this);
        this.cancelDateFilter = this.cancelDateFilter.bind(this);
        this.onLoadNextPageSuccess = this.onLoadNextPageSuccess.bind(this);
        this.loadNextPage = this.loadNextPage.bind(this);

    }

    handleDatePicked = date => {
        this.hideDateTimePicker();
        this.setState({ selectedDate : date, filterDate:date, type:CHOSE_DELIVER_DATE });
        this.criteria['deliverDate'] = date;
        this.filterDataByCondition();
    };

    cancelDateFilter = () => {
        this.setState({filterDate : null});
        if(this.criteria['deliverDate']){
            this.criteria['deliverDate'] = null;
            this.filterDataByCondition();
        }
    }

    loadNextPage = (pageIndex) => {
        console.log('Load next page');
        if(this.state.pageIndex > this.state.totalPage){
            if(Def.NetWorkMode){
                FlatController.getFlat(this.onLoadNextPageSuccess, this.onGetDesignFalse, false, Def.pageSize, this.state.pageIndex + 1);
            }
        }
    }


    onLoadNextPageSuccess(data){
        Def.flat_data = Def.appendToFlatData(data["data"]);
        Def.flatCriteria = this.criteria;
        let title = "Danh sách thiết kế";
        let design_list = Def.flat_data;
        AsyncStorage.setItem('flat_data', JSON.stringify(Def.flat_data));
        let newPageIndex = this.state.pageIndex + 1;
        Def.flatCurrentPage = newPageIndex;
        AsyncStorage.setItem('flat_current_page', JSON.stringify(newPageIndex));
        console.log('New Page Index : ' + newPageIndex + " Flat Data Length : " + Def.flat_data.length) ;
        if(Def.criteria){
            design_list =  Def.flat_data.filter(this.filterFunc);
        }
        this.setState({data:design_list, isRefresh:false, pageIndex:newPageIndex});
    }

    onGetFlatSuccess(data){
        console.log("OnGetFlatSuccess Length : "  +  data['data'].length);
        Def.flat_data = data["data"];
        Def.flatCriteria = this.criteria;
        let title = "Danh sách thiết kế";
        let design_list = Def.flat_data;
        if(Def.flat_data){
            AsyncStorage.setItem('flat_data', JSON.stringify(Def.flat_data));
            // Def.flat_data.forEach(flat => {
            //     // Cập nhật dữ liệu thiết kế cho căn hộ đã lưu offline
            //     if(OfflineHelper.offlineFlatData[flat.id]){
            //         OfflineHelper.offlineFlatData[flat.id] = flat;
            //     }
            // });
        }


        let newPageIndex = this.state.pageIndex + 1;
        Def.flatCurrentPage = newPageIndex;
        AsyncStorage.setItem('flat_current_page', JSON.stringify(newPageIndex));
        console.log('New Page Index : ' + newPageIndex + " Flat Data Length : " + Def.flat_data.length) ;
        if(Def.criteria){
            design_list =  Def.flat_data.filter(this.filterFunc);
        }
        this.setState({data:design_list, isRefresh:false, isLoading:false,pageIndex:newPageIndex, totalPage: data['totalCount']});
    }





    hideDateTimePicker = () => {
        this.setState({ displaySelectDate : false });
    };

    displayFilterDate = () => {
        this.setState({ displaySelectDate : true });
    };


    refresh()
    {
        if(OfflineHelper.offlineFlatDataArr) {
            console.log('OfflineHelper.offlineFlatDataArr Forcus - Refresh ' +  OfflineHelper.offlineFlatDataArr.length);
        }
        this.setState({ stateCount: Math.random() , data : Def.NetWorkMode ?  Def.flat_data : OfflineHelper.offlineFlatDataArr });
    }

    searchButtonClick = () => {
        this.criteria['name'] = this.state.name;
        this.filterDataByCondition();
    }

    filterDataByCondition = () => {
        this.criteria['name'] = this.state.name;
       console.log('Run Filter Criteria : ' + JSON.stringify(this.criteria));
       let allData = Def.NetWorkMode ? Def.flat_data : OfflineHelper.offlineFlatDataArr;
       let dataFilter =  allData.filter(this.filterFunc);
       console.log('Filter-Data : ' + dataFilter.length);
       this.setState({data:dataFilter});
    }

    filterFunc = (item) => {
        let rs = true;
        if(this.criteria.building){
            rs = item.building_id == this.criteria.building.id;
        }

        if(rs && this.criteria.customer){
            rs = item.customer_code == this.criteria.customer.code;
        }

        if(rs && this.criteria.status){
            console.log('Status : ' + JSON.stringify(this.criteria.status));
            switch (this.criteria.status['id']) {

                case -2: // Filter cho trường hợp từ chối bàn giao
                    console.log('Case -2');
                    rs = item.is_decline == 1;
                    break;
                case -3 : // Filter cho trường hợp bàn giao vắng mặt
                    console.log('Case -3');
                    rs = item.absentee_hanover == 1;
                    break;
                default :
                    rs = item.status == this.criteria.status['id'];
                    break;
            }

        }
        if(rs && this.criteria.deliverDate){
            // console.log('Item : ' + JSON.stringify(item.deliverDate));
            rs = item.deliver_date && Def.compairDate(item.deliver_date * 1000, this.criteria.deliverDate, Def.COMPARE_DATE);
        }
        if(rs && this.criteria.name && this.criteria.name.length > 0){
            const regex = new RegExp(`${this.criteria.name.trim()}`, 'i');
            rs = item.code.search(regex) >= 0;
        }
        return rs;
    }

    onRefresh = () => {
        this.resetCriteria();
        if(Def.user_info){
            if (Def.NetWorkMode){
                this.setState({isRefresh:true, pageIndex:0});
                FlatController.getFlat(this.onGetFlatSuccess, this.onGetDesignFalse);
            }else {
                Net.showNetworkMsg();
            }
        }
    };

    resetCriteria = () => {
        this.setState({building: null, customer:null, name: "", deliverDate: null, status: null});
        this.criteria = {};
    }
    onGetFlatFalse(data){
        console.log("false data : " + data);
        this.setState({isRefresh:false, isLoading:false});
    }

    formatText(text){
        let rs = text;
        if(text && text.length > 10){
            rs = text.substring(0, 20) ;
        }
        return rs;
    }


    shouldComponentUpdate(){
        const index = Def.REFESH_SCREEN.indexOf('flat-screen');

        if (index > -1 || (this.props.route && this.props.route.param && this.props.route.param.refresh)) {
            if(index > -1){
                Def.REFESH_SCREEN.splice(index, 1);
            }
            this.onRefresh();
        }

        return true;
    }

    choseStatusClick = () => {
        console.log('Chose status click');

        this.showModal(FlatHelper.FlatStatusData, 'Chọn Trạng thái', CHOSE_STATUS);
    };


    choseBuildingClick = ()=> {
        console.log('Chose Building Click');
        if(!Def.buildingData && Def.buildingData.length < 1 ){
            if (Def.NetWorkMode){
                FlatController.getbuilding(this.getBuildingSuccess, this.getFilterDataFalse);
            }else {
                Net.showNetworkMsg();
            }
        } else {
            this.showModal(Def.buildingData, 'Chọn Dự án', CHOSE_BUILDING);
        }

    }

    getBuildingSuccess = (data) => {
        if(data['result'] == 1){
            Def.buildingData = data['building'];
            AsyncStorage.setItem('buildingData', JSON.stringify(Def.buildingData));
            this.showModal(Def.buildingData, 'Chọn Dự án', CHOSE_BUILDING);

        }else {
            Alert.alert(
                "Thông báo",
                data['msg'],
                [
                    {
                        text: "Ok",
                        style: 'Cancel',
                    }
                ],
                {cancelable: false},
            );
        }

    }

    getFilterDataFalse = (data)=> {
        console.log('Get Bulding False' + JSON.stringify(data));
    }

    getCustomerSuccess = (data) => {
        if(data['result'] == 1){
            Def.customerData = data['customer'];
            console.log('Customer Length : ' + Def.customerData.length);
            AsyncStorage.setItem('customerData', JSON.stringify(Def.customerData));
            this.showModal(Def.customerData, 'Chọn Chủ sở hữu', CHOSE_CUSTOMER );

        }else {
            Alert.alert(
                "Thông báo",
                data['msg'],
                [
                    {
                        text: "Ok",
                        style: 'Cancel',
                    }
                ],
                {cancelable: false},
            );
        }

    }

    removeOfflineItem = (item)=> {
        Alert.alert(
            "Xóa dữ liệu offline căn hộ " + item.code,
            "Dữ liệu lưu trữ và tương tác offline sẽ bị xóa",
            [
                {
                    text: "Ok",
                    onPress: () => {
                        OfflineHelper.removeOfflineFlat(item);
                        this.refresh();
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

    resetOfflineFlat = (item) => {
        Alert.alert(
            "Xóa dữ liệu tương tác offline căn hộ " + item.code,
            "Dữ liệu tương tác offline sẽ bị xóa",
            [
                {
                    text: "Đồng ý",
                    onPress: () => {
                        OfflineHelper.resetChangeFlat(item);
                        this.refresh();
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



    choseCustomerClick = ()=> {
        console.log('Chose Customer Click');
        if(!Def.customerData || Def.customerData.length < 1){
            if(Def.NetWorkMode) {
                FlatController.getCustomer(this.getCustomerSuccess, this.getFilterDataFalse);
            } else {
                Net.showNetworkMsg();
            }
        } else {
            this.showModal(Def.customerData, 'Chọn Chủ sở hữu', CHOSE_CUSTOMER);
        }

    }

    signInBtnClick(){
        this.props.navigation.navigate('Login', {'screen': 'signIn'});
    }

    showModal =(data, title, type ) => {

        this.setState({displayModal:true, title:title, type:type , filterData:data})
    }

    closeFunction = (data) => {
        let state = {displayModal:false};

        if(data){
            console.log("DAta :" + JSON.stringify(data))
            if(data && data['id'] == -1){
                data = null;
            }


          this.state.type == CHOSE_CUSTOMER?  state['customer'] = data : state['status'] = data;
            this.state.type == CHOSE_CUSTOMER ?  this.criteria['customer'] = data : this.criteria['status'] = data;
          this.filterDataByCondition();
        }


        this.setState(state)
    }

    async componentDidMount() {
        console.log('Flat list component did mount');
        let network_mode_data = await AsyncStorage.getItem('network_mode');
        if(network_mode_data){
            Def.NetWorkMode = JSON.parse(network_mode_data) == 1 || JSON.parse(network_mode_data) == '-1' ;
        } else {
            let network_connectRaw = await AsyncStorage.getItem('network_connect');
            if(network_connectRaw) {
                Def.NetWorkConnect = JSON.parse(network_connectRaw) == 1;
                Def.NetWorkMode = JSON.parse(await AsyncStorage.getItem('network_connect')) == 1;
            } else {
                let state = await NetInfo.fetch();
                if(state){
                    Def.NetWorkConnect = state.isConnected;
                    Def.NetWorkMode = state.isConnected;
                    await AsyncStorage.setItem('network_connect' , state.isConnected ? '1' : '0');
                    await AsyncStorage.setItem('network_mode' , state.isConnected ? '1' : '0');
                }
            }
        }
        let offlineFlatDataStr = await  AsyncStorage.getItem('offlineFlatData');
        OfflineHelper.offlineFlatData = offlineFlatDataStr && offlineFlatDataStr!== undefined  ?JSON.parse(offlineFlatDataStr) : {};
        let offlineFlatDataArrStr = await  AsyncStorage.getItem('offlineFlatDataArr');
        OfflineHelper.offlineFlatDataArr = offlineFlatDataArrStr && offlineFlatDataArrStr !== undefined ? JSON.parse( offlineFlatDataArrStr): [];

        let flatChangeStr = await  AsyncStorage.getItem('flatChangeData');
        OfflineHelper.flatChangeData = flatChangeStr && flatChangeStr !== undefined ? JSON.parse( flatChangeStr) : {};

        console.log('OfflineHelper.offlineFlatDataArr : ' + OfflineHelper.offlineFlatDataArr.length);
        // if(Array.isArray(OfflineHelper.offlineFlatDataArr)){
        //     OfflineHelper.offlineFlatDataArr.forEach(item => {
        //         console.log('Update --' + item['update']);
        //     });
        // }

        if(!Def.user_info)
            Def.user_info = JSON.parse(await AsyncStorage.getItem('user_info'));

        if(!Def.NetWorkMode) {
            if(!OfflineHelper.offlineFlatDataArr || OfflineHelper.offlineFlatDataArr.length == 0){

                if (!OfflineHelper.offlineFlatData && ( !OfflineHelper.offlineFlatData || JSON.stringify(OfflineHelper.offlineFlatData) === JSON.stringify({}))) {
                    console.log('get data from storage');
                    if(!Def.user_info)
                        Def.user_info = JSON.parse(await AsyncStorage.getItem('user_info'));
                    OfflineHelper.offlineFlatData = JSON.parse(await AsyncStorage.getItem('offlineFlatData'));
                }
                console.log('rewrite offlineFlatDataArr');
                OfflineHelper.offlineFlatDataArr =OfflineHelper.convertObjectTreeToArray(OfflineHelper.offlineFlatData);
            }



            this.setState({data: OfflineHelper.offlineFlatDataArr, isRefresh:false});

            let offlineRequestTreeStr = await  AsyncStorage.getItem('offlineRequestTree');
            OfflineHelper.offlineRequestTree = offlineRequestTreeStr && offlineRequestTreeStr != undefined ? JSON.parse( offlineRequestTreeStr) : {};

            console.log('Read Offline Request Tree : '+ JSON.stringify(OfflineHelper.offlineRequestTree));

            // console.log('App Mode1' + JSON.stringify(OfflineHelper.offlineFlatData));
            //
            // console.log('App Mode2' + JSON.stringify(OfflineHelper.offlineFlatData));
            // OfflineHelper.offlineFlatDataArr =OfflineHelper.convertObjectTreeToArray(OfflineHelper.offlineFlatData);
            // console.log('offlineFlatDataArr' + OfflineHelper.offlineFlatDataArr.length);
            // this.setState({data: OfflineHelper.offlineFlatDataArr});
        } else
        if(Def.refresh_flat_data || Def.flat_data.length == 0){
            if (Def.flat_data.length > 0 && Def.flat_data) {
                this.setState({data:Def.flat_data});
            } else {
                AsyncStorage.getItem('user_info').then((value) => {
                    if(value){
                        Def.user_info = JSON.parse(value);
                        Def.username = Def.user_info['user_name'];
                        Def.email = Def.user_info['email'];

                        AsyncStorage.getItem('flat_data').then((value) => {
                            JSON.parse(value);
                            if(value && JSON.parse(value).length > 0 ){
                                Def.flat_data = JSON.parse(value);
                                console.log("FlatData Length : " + (Def.flat_data ? Def.flat_data.length : 0 ));
                                this.setState({data:Def.flat_data, pageIndex : Math.ceil(Def.flat_data.length/Def.pageSize) -1});
                            } else {
                                this.setState({isLoading:true});
                                FlatController.getFlat(this.onGetFlatSuccess, this.onGetDesignFalse);
                            }

                        });

                    } else {
                        AsyncStorage.removeItem('flat_data');
                    }
                });

                if(Def.user_info){

                }
            }
            Def.refresh_flat_data = false;
        }
        let navigation =  this.props.navigation ? this.props.navigation : Def.mainNavigate ;

        if(navigation){
            this.focusListener = navigation.addListener("focus", this.forcusFunction);
        }
    }

    componentWillUnmount() {
        // if(this.hasOwnProperty('focusListener')){
            // this.focusListener.remove();
        // }
        console.log('Component will unmount!');
    }

    forcusFunction = () => {
        this.refresh();
    };

    displayImageLoaded = (res) => {
       let path = Def.remoteVersion(res.path());
        console.log('File Path : ' + path);
        this.imageView =
            <Image style={{width:width, height:300, backgroundColor:'red'}} source={{ uri : Platform.OS === 'android' ? 'file://' +path : '' + path }}/>
        this.setState({displayLoadedImage: true});
    };


    checkPermission = async () => {

        // Function to check the platform
        // If iOS then start downloading
        // If Android then ask for permission

        if (Platform.OS === 'ios') {
            FlatHelper.downloadImage('', this.displayImageLoaded);
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
                    FlatHelper.downloadImage('', this.displayImageLoaded);

                } else {
                    // If permission denied then show alert
                    alert('Storage Permission Not Granted');
                }
            } catch (err) {
                // To handle permission related exception
                console.warn(err);
            }
        }
    };

    render() {
        const {navigation} = this.props;
        const configMenu = Def.config_design_menu;
        Def.order_number = 20;
        const ListHeader = () => (
            <View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between' , alignItems: 'flex-start'}}>
                    <View style={{marginLeft:15, paddingBottom:5}}>
                        <Text style={styles.titleStyle}>{ (this.state.data ? this.state.data.length : 0 )+ " Căn hộ"}</Text>
                    </View>
                </View>
            </View>
        );


        return (

            !Def.user_info ?
                Def.NetWorkMode && Def.NetWorkConnect ?

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

                </View > :
                    <View style={{justifyContent :'center',flex: 1, alignItems : 'center', width: width}}>
                        <Text>
                            Vui lòng kết nối mạng Internet
                        </Text>
                    </View>
                :
            <View style={{flex:1, paddingTop:5}}>
                <LoadingModal visible={this.state.isLoading}/>
                <View style={{paddingHorizontal:10, backgroundColor : '#fff', paddingBottom:2}}>
                    <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center', height:ITEM_HEIGHT,justifyContent:'space-between',paddingHorizontal:10 , paddingVertical: 5, backgroundColor : '#fff', marginTop:2}}
                                      onPress={this.choseStatusClick}
                    >
                        <Text style={[Style.text_styles.middleText,{}]}>
                            Trạng thái
                        </Text>
                        <View style={{flexDirection : 'row', alignItems : 'center'}}>

                            <Text style={[Style.text_styles.middleText,{ marginRight : 5}]}>
                                {this.state.status ? this.state.status.name : 'Chọn Trạng thái'}
                            </Text>
                            <Icon name="angle-right" size={25} color={Style.GREY_TEXT_COLOR} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center',height:ITEM_HEIGHT , justifyContent:'space-between',paddingHorizontal:10 , paddingVertical: 5, backgroundColor : '#fff', marginTop:2}}
                                      onPress={this.choseCustomerClick}
                    >
                        <Text style={[Style.text_styles.middleText,{}]}>
                            Chủ sở hữu
                        </Text>
                        <View style={{flexDirection : 'row', alignItems : 'center'}}>

                            <Text style={[Style.text_styles.middleText,{ marginRight : 5}]}>
                                {this.state.customer ? this.state.customer.name : 'Chọn chủ sở hữu'}
                            </Text>
                            <Icon name="angle-right" size={25} color={Style.GREY_TEXT_COLOR} />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        backgroundColor: '#fff',
                        marginTop: 1,
                    }}>
                        <Text style={[Style.text_styles.middleText, {}]}>
                            Ngày bàn giao
                        </Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            {
                                this.state.filterDate ?
                                    <TouchableOpacity style={{paddingHorizontal:5}} onPress={this.cancelDateFilter}>
                                        <Icon name="trash" size={18} color={Style.DEFAUT_RED_COLOR}/>
                                    </TouchableOpacity>
                                    : null
                            }


                            <TouchableOpacity style={{
                                marginRight: 5,
                                height: ITEM_HEIGHT,
                                justifyContent: 'center',
                                borderColor: Style.GREY_TEXT_COLOR
                            }} onPress={ this.displayFilterDate}>
                                <Text style={[Style.text_styles.middleText,{}]}>
                                    {this.state.filterDate ? Def.getDateString(this.state.filterDate, "yyyy-MM-dd") : "Chọn ngày bàn giao"}
                                </Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={this.state.displaySelectDate}
                                onConfirm={(date) => {
                                    this.handleDatePicked(date);
                                    // this.hideDateTimePicker();
                                }}
                                onCancel={this.hideDateTimePicker}
                                date={this.state.selectedDate}
                                mode={'date'}
                                display='spinner'
                                style={{width: 400, opacity: 1, height: 100, marginTop: 540}}
                                datePickerModeAndroid='spinner'
                                timePickerModeAndroid='spinner'
                            />
                            <Icon name="angle-right" size={25} color={Style.GREY_TEXT_COLOR}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{ width : width -20, borderWidth : 0, height:ITEM_HEIGHT + 10 ,borderBottomWidth:1 ,borderColor:Style.GREY_BACKGROUND_COLOR, flexDirection : 'row',alignItems : 'center', marginTop : 0, marginBottom : 5,}}>
                        <TextInput value={this.state.name} onChangeText={text => this.setState({ name : text })} placeholder={"Tìm kiếm"} style={[styles.textInput, {backgroundColor:'#fff',marginTop:5, width: width -70, paddingHorizontal:10}]}>
                        </TextInput>
                        <TouchableOpacity onPress={this.searchButtonClick} style={{paddingLeft:5,paddingRight:10, paddingVertical:5 ,  }} >
                            <Icon style={styles.searchIcon} name="search" size={27} color={Style.GREY_TEXT_COLOR}/>
                        </TouchableOpacity>
                    </View>

                    {/*<TouchableOpacity onPress={this.checkPermission}>*/}
                        {/*<Text>*/}
                            {/*Download*/}
                        {/*</Text>*/}
                    {/*</TouchableOpacity>*/}

                    {/*{*/}
                        {/*this.state.displayLoadedImage ?*/}
                            {/*<View>*/}
                                {/*{this.imageView}*/}
                            {/*</View>*/}
                             {/*: null*/}

                    {/*}*/}

                    <Modal onRequestClose={() => {this.closeFunction(null)}} visible={this.state.displayModal}  transparent={false} styles={{backgroundColor : 'green'}} >
                        {/*{this.state.choseAddress ?*/}
                        <AutocompleteModal
                            data={this.state.filterData}
                            filterAttr={this.state.filterAttr}
                            closeFunction={this.closeFunction}
                            title={this.state.title}
                            type={this.state.type}

                        />
                    </Modal>

                </View>
                 <ProgramVerList

                    data={this.state.data}
                    navigation={this.props.navigation}
                    header={ListHeader}
                    styleList={{height: height-(ITEM_HEIGHT * 5 + 30)}}
                    refreshControl={
                        <RefreshControl refreshing={this.state.isRefresh} onRefresh={this.onRefresh}/>
                    }
                    itemHandleFunc={{
                        removeOfflineItem: this.removeOfflineItem,
                        resetOfflineFlat: this.resetOfflineFlat,
                    }}

                    type={'flat'}
                    numColumns={1}
                    screen={'flat-detail'}
                    itemSeparatorComponent={
                        (({ highlighted }) => (
                            <View
                                style={[
                                    {backgroundColor:Style.GREY_TEXT_COLOR, height:1, width:width -25, marginHorizontal: 10},
                                    highlighted && { marginHorizontal:10 }
                                ]}
                            />
                        ))
                    }
                    endListReach={this.loadNextPage}
                    />
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
        // marginBottom : 300,
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
    titleStyle : {
        fontSize : Style.BIG_SIZE,
        color: Style.GREY_TEXT_COLOR,
    },
    textInput : {height: 40,  borderColor: "#9e9e9e", borderWidth : 0, borderBottomWidth:0 ,color:'black', fontSize : Style.MIDLE_SIZE, borderRadius: 5, paddingHorizontal: 5  },
});

export default FlatListScreen;
