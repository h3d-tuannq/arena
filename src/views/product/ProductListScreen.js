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
import ProductItemrenderer from '../../com/item-render/ProductItemrenderer';
import {OfflineHelper} from '../../def/OfflineHelper';

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



class ProductListScreen extends React.Component {

    criteria = {};
    imageView = null;
    downloaded = 0;
    downloadFalse = 0;

    constructor(props){
        super(props);
        this.onGetProductSuccess     = this.onGetProductSuccess.bind(this);
        this.onGetProductFalse     = this.onGetProductFalse.bind(this);
        this.refresh     = this.refresh.bind(this);
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
        this.choseStatusClick = this.choseStatusClick.bind(this);
        this.signInBtnClick = this.signInBtnClick.bind(this);
        this.checkPermission = this.checkPermission.bind(this);
        this.downloadProductList = this.downloadProductList.bind(this);
        this.downloadProductFalse = this.downloadProductFalse.bind(this);

        OfflineHelper.downloadProductList = this.checkPermission;

        let title = "Sản phẩm mẫu";
        this.state = {
            data: Def.product_data,
            title: title,
            stateCount: 0.0,
            isRefresh : false,
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
            total:Def.product_data.length,
            downloaded: 0,
            startDownload : false,
            downloadFalse : 0,
            isLoading:false,

        };

        this.itemClick = this.itemClick.bind(this);

        this.downloadProductSuccess = this.downloadProductSuccess.bind(this);
        this.downloadProduct = this.downloadProduct.bind(this);
        this.finishDownloadProduct = this.finishDownloadProduct.bind(this);
    }

    downloadProduct = () => {
        console.log('call download product list in product list');
    }

    goToSendRequestRepairScreen = (flat) => {
        console.log('');
    }


    checkPermission = async () => {

        // Function to check the platform
        // If iOS then start downloading
        // If Android then ask for permission

        if (Platform.OS === 'ios') {
            this.downloadProductList();
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
                    this.downloadProductList();

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

    downloadProductList = () => {
        this.setState({startDownload:true, isLoading:true});
        let i = 0;
        this.downloaded = 0; this.downloadFalse =0;
        OfflineHelper.offlineProductData =  OfflineHelper.makeObjectDataWithIdKey(Def.product_data);
        for (const key in  OfflineHelper.offlineProductData) {
            if (OfflineHelper.offlineProductData[key]) {
                OfflineHelper.downloadProductImage(OfflineHelper.offlineProductData[key], this.downloadProductSuccess, this.downloadProductFalse);
            }

        }
    }

    downloadProductSuccess = (obj,res) => {
        obj.offline_img = res.path();
        this.downloaded = this.downloaded + 1;
        this.setState({downloaded: this.downloaded })
        if(this.downloaded + this.downloadFalse >= Def.product_data.length){
            this.finishDownloadProduct();
        }
    }

    finishDownloadProduct = ()=> {
        if(OfflineHelper.offlineProductData){
            AsyncStorage.setItem('offlineProductData', JSON.stringify(OfflineHelper.offlineProductData));
            this.setState({startDownload: false , isLoading:false});
        }
    }

    downloadProductFalse = (obj,res) => {
        this.downloadFalse = this.downloadFalse + 1;
        this.setState({downloadFalse: this.downloadFalse })
    }



    loadNextPage = (pageIndex) => {
        FlatController.getFlat(this.onGetFlatSuccess, this.onGetProductFalse, false, Def.pageSize, this.state.pageIndex + 1);
    }

    itemClick(item){
        this.props.navigation.navigate('Product', {screen:'product-detail', params: { item: item }});
    }






    displayFilterDate = () => {
        this.setState({ displaySelectDate : true });
    };


    refresh()
    {
        this.setState({ stateCount: Math.random() , data : Def.product_data });
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
        if(this.criteria.building){
            rs = item.building_id == this.criteria.building.id;
        }
        if(rs && this.criteria.customer){
            rs = item.customer_code == this.criteria.customer.code;
        }

        if(rs && this.criteria.status){
            rs = item.status == this.criteria.status['id'];
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
        if(!this.state.startDownload){
            this.setState({isRefresh:true, pageIndex:0, downloaded: 0, downloadFalse : 0});
        }
        this.resetCriteria();
        if(Def.user_info){
            FlatController.getProduct(this.onGetProductSuccess, this.onGetProductFalse);
        }
    };


    resetCriteria = () => {
        this.setState({building: null, customer:null, name: "", deliverDate: null});
        this.criteria = {};
    }


    onGetProductSuccess(data){
        Def.product_data = data["data"];
        let title = "Sản phẩm mẫu";
        AsyncStorage.setItem('product_data', JSON.stringify(Def.product_data));
        this.setState({data:Def.product_data, isRefresh:false});
    }


    onGetProductFalse(data){
        console.log("false data : " + data);
        this.setState({isRefresh:false});
    }



    shouldComponentUpdate(){
        const index = Def.REFESH_SCREEN.indexOf('product-list-screen');

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



    choseCustomerClick = ()=> {
        console.log('Chose Customer Click');
        if(!Def.customerData || Def.customerData.length < 1){
            FlatController.getCustomer(this.getCustomerSuccess, this.getFilterDataFalse);
        } else {
            this.showModal(Def.customerData, 'Chọn Chủ sở hữu', CHOSE_CUSTOMER);
        }

    }

    signInBtnClick(){
        Def.redirect_stack = 'Product';
        Def.redirect_screen = 'product-list-screen';
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
        console.log('Offline Data : ' + JSON.stringify(OfflineHelper.offlineProductData));
        if(!Def.product_data || Def.product_data.length == 0){
            if (Def.product_data.length > 0 && Def.product_data) {
                this.setState({data:Def.product_data});
            } else {
                let userData  = await AsyncStorage.getItem('user_info');
                if(userData){
                    Def.user_info = JSON.parse(userData);
                    Def.username = Def.user_info['user_name'];
                    Def.email = Def.user_info['email'];
                    let productData  = await AsyncStorage.getItem('product_data');
                    productData = productData ? JSON.parse(productData) : [];
                    if(productData && productData.length > 0){
                        Def.product_data = productData;
                        this.setState({data:Def.product_data});
                    } else {
                        await AsyncStorage.setItem('product_data', "");
                        FlatController.getProduct(this.onGetProductSuccess, this.onGetProductFalse);
                    }
                }
            }
            Def.refresh_flat_data = false;
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
                        <Text style={styles.titleStyle}>{ (this.state.data ? this.state.data.length : 0 )+ " Sản phẩm"}</Text>
                    </View>
                </View>
            </View>
        );

        const renderItem = ({item}) => {

            return (
                <View style={{}}>
                    <ProductItemrenderer
                        item ={item} click={this.itemClick}  type={'product-template'}
                        styleImage={{width: (width - 30) / 2, height: (width - 30) / 2}}
                    />
                </View>
            )
        }


        return (

            !Def.user_info ?

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

                </View>
                :
                <View style={{flex:1, paddingTop:5, paddingHorizontal: 10}}>
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
                                        {this.state.downloaded + '/' + Def.product_data.length }
                                    </Text>
                                </View>
                                <View style={{flexDirection : 'row', justifyContent: 'space-between'}}>
                                    <Text>
                                        Thất bại
                                    </Text>
                                    <Text>
                                        {this.state.downloadFalse + '/' + Def.product_data.length }
                                    </Text>
                                </View>
                            </View>

                             : null
                    }
                    <ProgramVerList
                        data={this.state.data}
                        navigation={this.props.navigation}
                        header={ListHeader}
                        styleList={{paddingHorizontal : 10}}
                        refreshControl={
                            <RefreshControl refreshing={this.state.isRefresh} onRefresh={this.onRefresh}/>
                        }
                        renderFunction={renderItem}
                        type={'product-template'}
                        numColumns={2}
                        screen={'product-detail'}
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

export default ProductListScreen;
