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
import MailProductItemrenderer from '../../com/item-render/MailProductItemrenderer';
import DesignItemrenderer from '../../com/item-render/DesignItemrenderer';
import {OfflineHelper} from "../../def/OfflineHelper";
import BuildingItemrenderer from "../../com/item-render/BuildingItemrenderer";

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



class BuildingListScreen extends React.Component {

    criteria = {};
    imageView = null;

    constructor(props){
        super(props);
        this.getBuildingSuccess     = this.getBuildingSuccess.bind(this);
        this.onGetBuildingFalse     = this.onGetBuildingFalse.bind(this);
        this.refresh     = this.refresh.bind(this);
        this.onRefresh = this.onRefresh.bind(this);
        this.choseBuildingClick = this.choseBuildingClick.bind(this);
        this.showModal = this.showModal.bind(this);
        this.getBuildingSuccess = this.getBuildingSuccess.bind(this);
        this.getFilterDataFalse = this.getFilterDataFalse.bind(this);
        this.closeFunction = this.closeFunction.bind(this);
        this.filterDataByCondition = this.filterDataByCondition.bind(this);
        this.searchButtonClick = this.searchButtonClick.bind(this);
        this.filterFunc = this.filterFunc.bind(this);
        this.resetCriteria = this.resetCriteria.bind(this);
        this.choseStatusClick = this.choseStatusClick.bind(this);
        this.signInBtnClick = this.signInBtnClick.bind(this);
        this.checkPermission = this.checkPermission.bind(this);
        this.downloadBuildingList = this.downloadBuildingList.bind(this);
        this.downloadBuildingFalse = this.downloadBuildingFalse.bind(this);
        let title = "Danh sách dự án";
        this.state = {
            data: Def.buildingData,
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
            downloaded: 0,
            startDownload : false,
            downloadFalse : 0,
            isLoading:false

        };
        this.finishDownloadBuilding = this.finishDownloadBuilding.bind(this);
        this.itemClick = this.itemClick.bind(this);

    }

    checkPermission = async () => {

        // Function to check the platform
        // If iOS then start downloading
        // If Android then ask for permission

        if (Platform.OS === 'ios') {
            this.downloadDesignList();
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
                    this.downloadDesignList();

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

    downloadBuildingList = () => {
        this.setState({startDownload:true});
        let i = 0;
        this.downloaded = 0; this.downloadFalse = 0;
        OfflineHelper.offlineDesignData = OfflineHelper.makeObjectDataWithIdKey(Def.design_data);
        for (const key in  OfflineHelper.offlineDesignData){
            if(OfflineHelper.offlineDesignData[key]){
                OfflineHelper.downloadDesignImage(OfflineHelper.offlineDesignData[key], this.downloadDesignSuccess, this.downloadDesignFalse);
            }
        }
    }

    downloadBuildingSuccess = (obj,res) => {
        obj.offline_img = res.path();
        this.downloaded = this.downloaded + 1;
        this.setState({downloaded: this.downloaded , isLoading:true});
        if(this.downloaded + this.downloadFalse >= Def.design_data.length ){
            this.finishDownloadDesign();
        }
    }

    finishDownloadBuilding = ()=> {

    }

    downloadBuildingFalse = (obj,res) => {
        this.downloadFalse = this.downloadFalse + 1;
        this.setState({downloadFalse: this.downloadFalse,isLoading:true});
    }

    handleDatePicked = date => {
        this.hideDateTimePicker();
        this.setState({ selectedDate : date, filterDate:date, type:CHOSE_DELIVER_DATE });
        this.criteria['deliverDate'] = date;
        this.filterDataByCondition();
    };

    loadNextPage = (pageIndex) => {
        FlatController.getFlat(this.onGetFlatSuccess, this.onGetDesignFalse, false, Def.pageSize, this.state.pageIndex + 1);
    }

    itemClick(item){
       this.props.navigation.navigate('Building', {screen:'building-detail', params: { item: item }});
    }

    refresh()
    {
        this.setState({ stateCount: Math.random() , data : Def.flat_data });
    }

    searchButtonClick = () => {
        this.criteria['name'] = this.state.name;
        this.filterDataByCondition();
    }

    filterDataByCondition = () => {
        this.criteria['name'] = this.state.name;
       console.log('Run Filter Criteria : ' + JSON.stringify(this.criteria));
       let dataFilter =  Def.flat_data.filter(this.filterFunc);
       console.log('Filter-Data : ' + dataFilter.length);
       this.setState({data:dataFilter});
    }

    filterFunc = (item) => {
        let rs = true;

        return rs;
    }

    onRefresh = () => {
        if(!this.state.startDownload){
            this.setState({isRefresh:true, pageIndex:0,downloaded : 0, downloadFalse:0});
        }

        this.resetCriteria();
            FlatController.getbuilding(this.onGetBuildingSuccess, this.onGetBuildingFalse);
    };

    resetCriteria = () => {
        this.setState({building: null, customer:null, name: "", deliverDate: null});
        this.criteria = {};
    }


    onGetBuildingSuccess(data){
        Def.design_data = data["data"];
        let title = "Danh sách dự án";
        AsyncStorage.setItem('buildingData', JSON.stringify(Def.buildingData));
        this.setState({data:Def.buildingData, isRefresh:false});
    }


    onGetBuildingFalse(data){
        console.log("false data : " + data);
        this.setState({isRefresh:false});
    }



    shouldComponentUpdate(){
        const index = Def.REFESH_SCREEN.indexOf('building-screen');

        if (index > -1 || (this.props.route && this.props.route.param && this.props.route.param.refresh)) {
            if(index > -1){
                Def.REFESH_SCREEN.splice(index, 1);
            }
            this.onRefresh();
        }

        return true;
    }

    choseStatusClick = () => {

    };


    choseBuildingClick = ()=> {
        console.log('Chose Building Click');
        if(!Def.buildingData && Def.buildingData.length < 1 ){
            FlatController.getbuilding(this.getBuildingSuccess, this.getFilterDataFalse);
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
        if(Def.refresh_building_data || !Def.buildingData || Def.buildingData.length == 0){
            if (Def.buildingData && Def.buildingData.length > 0) {
                this.setState({data:Def.buildingData});
            } else {
                let designData  = await AsyncStorage.getItem('buildingData');
                designData = designData ? JSON.parse(designData) : [];
                if(designData && designData.length > 0){
                    Def.buildingData = designData;
                    this.setState({data:Def.buildingData});
                } else {
                    await AsyncStorage.setItem('buildingData', "");
                    FlatController.getFlat(this.onGetDesignSuccess, this.onGetDesignFalse);
                }
            }
            Def.refresh_building_data = false;
        }
    }
    render() {
        const {navigation} = this.props;
        const configMenu = Def.config_design_menu;
        Def.order_number = 20;
        const ListHeader = () => (
            <View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between' , alignItems: 'flex-start'}}>
                    <View style={{marginLeft:15, paddingBottom:5}}>
                        <Text style={styles.titleStyle}>{ (this.state.data ? this.state.data.length : 0 )+ " Dự án"}</Text>
                    </View>
                </View>
            </View>
        );

        const renderItem = ({item}) => {

            return (
                <View style={{}}>
                    <BuildingItemrenderer
                        item ={item} click={this.itemClick}
                        styleImage={{width: (width - 30), height: (width - 30)}}
                    />
                </View>
            )
        }


        return (
            <View style={{flex:1, paddingTop:5, paddingHorizontal:10}}>
                <LoadingModal visible={this.state.isLoading}/>
                {
                    this.state.startDownload ?
                        <View>
                            <Text>
                                Tải xuống
                            </Text>
                            <View style={{flexDirection : 'row', justifyContent: 'space-between'}}>
                                <Text>
                                    Thành công
                                </Text>
                                <Text>
                                    {this.state.downloaded + '/' + Def.design_data.length }
                                </Text>
                            </View>
                            <View style={{flexDirection : 'row', justifyContent: 'space-between'}}>
                                <Text>
                                    Thất bại
                                </Text>
                                <Text>
                                    {this.state.downloadFalse + '/' + Def.design_data.length }
                                </Text>
                            </View>
                        </View>

                        : null
                }
                 <ProgramVerList

                    data={this.state.data}
                    navigation={this.props.navigation}
                    header={ListHeader}
                    styleList={{paddingHorizontal:10}}
                    refreshControl={
                        <RefreshControl refreshing={this.state.isRefresh} onRefresh={this.onRefresh}/>
                    }
                    renderFunction={renderItem}
                    type={'building'}
                    numColumns={1}
                    screen={'building-detail'}
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

export default BuildingListScreen;
