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
    Alert,
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

const CHOSE_BUILDING = 0;
const CHOSE_CUSTOMER = 1;


class FlatListScreen extends React.Component {

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
        this.getFilterDataFalse = this.getFilterDataFalse.bind(this)
        this.closeFunction = this.closeFunction.bind(this);
        this.filterDataByCondition = this.filterDataByCondition.bind(this);
        this.filterFunc = this.filterFunc.bind(this);
        let title = "Căn hộ bàn giao";

        this.state = {
            data: Def.flat_data,
            title: title,
            stateCount: 0.0,
            isRefresh : false,
            building: null,
            customer: null,
            name:'',
            displayModal: false,
            filterAttr:"name",
            filterData: [],
            title:"",
            choseMode:0 // 0 chọn dự án, 1 chọn khách hàng

        };
    }

    refresh()
    {
        this.setState({ stateCount: Math.random() , data : Def.flat_data });
    }

    filterDataByCondition = () => {
       let dataFilter =  Def.flat_data.filter(this.filterFunc);
       this.setState({data:dataFilter});
    }

    filterFunc = (item) => {
        let rs = true;
        if(this.state.building){
            rs = item.building_id == this.state.building.id;
        }
        if(rs && this.state.customer){
            rs = item.customer_code == this.state.customer.code;
        }
    }

    onRefresh = () => {
        console.log('Refresh News');
        this.setState({isRefresh:true});
        FlatController.getFlat(this.onGetFlatSuccess, this.onGetDesignFalse);
    };

    onGetFlatSuccess(data){
        console.log("Flat Success !");
        Def.flat_data = data["data"];
        let title = "Danh sách thiết kế";
        design_list = Def.flat_data;
        AsyncStorage.setItem('flat_data', JSON.stringify(Def.flat_data));
        this.setState({data:design_list, isRefresh:false});
    }


    onGetFlatFalse(data){
        console.log("false data : " + data);
        his.setState({isRefresh:false});
    }

    formatText(text){
        let rs = text;
        if(text && text.length > 10){
            rs = text.substring(0, 20) ;
        }
        return rs;
    }


    shouldComponentUpdate(){
        console.log("shouldComponentUpdate list");
        // this.setState({ configMenu: Def.config_news_menu});
        // console.log('SortData ddd:' + JSON.stringify(this.props.route));
        return true;
    }

    choseBuildingClick = ()=> {
        console.log('Chose Building Click');
        if(!Def.buildingData){
            FlatController.getCustomer(this.getBuildingSuccess, this.getFilterDataFalse);
        } else {
            this.showModal([], 'Chọn Dự án', CHOSE_BUILDING);
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
            AsyncStorage.setItem('customerData', JSON.stringify(Def.customerData));
            this.showModal(Def.customerData, 'Chọn Chủ sở hữu', CHOSE_CUSTOMER);

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
        console.log('Chose Building Click');
        if(!Def.customerData){
            FlatController.getCustomer(this.getCustomerSuccess, this.getFilterDataFalse);
        } else {
            this.showModal([], 'Chọn Chủ sở hữu', CHOSE_CUSTOMER);
        }

    }

    showModal =(data, title, type) => {
        this.setState({displayModal:true, title:title, type:type})
    }

    closeFunction = (data) => {
        let state = {displayModal:false};
        if(data){
          this.state.type ?  state['customer'] = data : state['building'] = data;
          this.filterDataByCondition();
        }


        this.setState(state)
    }


    componentDidMount() {
        if(Def.refresh_flat_data || Def.flat_data.length == 0){
            if (Def.flat_data.length > 0 && Def.flat_data) {
                this.setState({data:Def.flat_data});
            } else {
                FlatController.getFlat(this.onGetFlatSuccess, this.onGetDesignFalse);
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
                    <View style={{marginLeft:15, paddingBottom:8}}>
                        <Text style={styles.titleStyle}>{this.state.data.length + " Căn hộ"}</Text>
                    </View>
                </View>
            </View>
        );


        return (
            <View style={{flex:1, paddingTop:5}}>
                <View style={{paddingHorizontal:10, backgroundColor : '#fff', paddingBottom:2}}>
                    <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center', justifyContent:'space-between',paddingHorizontal:10 , paddingVertical: 10, backgroundColor : '#fff', marginTop:5}}
                                      onPress={this.choseBuildingClick}
                    >
                        <Text style={[Style.text_styles.middleText,{}]}>
                            Dự án
                        </Text>
                        <View style={{flexDirection : 'row', alignItems : 'center'}}>

                            <Text style={[Style.text_styles.middleText,{ marginRight : 5}]}>
                                {this.state.building ? this.state.building.name : 'Chọn Dự án'}
                            </Text>
                            <Icon name="angle-right" size={25} color={Style.GREY_TEXT_COLOR} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center', justifyContent:'space-between',paddingHorizontal:10 , paddingVertical: 10, backgroundColor : '#fff', marginTop:5}}
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

                    {/*<TouchableOpacity style={{*/}
                    {/*    flexDirection: 'row',*/}
                    {/*    alignItems: 'center',*/}
                    {/*    justifyContent: 'space-between',*/}
                    {/*    paddingHorizontal: 10,*/}
                    {/*    paddingVertical: 5,*/}
                    {/*    backgroundColor: '#fff',*/}
                    {/*    marginTop: 1*/}
                    {/*}}>*/}
                    {/*    <Text style={[Style.text_styles.middleText, {}]}>*/}
                    {/*        Ngày bàn giao*/}
                    {/*    </Text>*/}
                    {/*    <View style={{flexDirection: 'row', alignItems: 'center'}}>*/}
                    {/*        <TouchableOpacity style={{*/}
                    {/*            marginRight: 5,*/}
                    {/*            height: ITEM_HEIGHT,*/}
                    {/*            justifyContent: 'center',*/}
                    {/*            borderColor: Style.GREY_TEXT_COLOR*/}
                    {/*        }} onPress={() => this.showDateTimePicker('birth_day')}>*/}
                    {/*            <Text style={[Style.text_styles.titleTextNotBold, {*/}
                    {/*                justifyContent: 'center',*/}
                    {/*                paddingLeft: 5,*/}
                    {/*                color: Style.GREY_TEXT_COLOR*/}
                    {/*            }]}>*/}
                    {/*                {this.state.birth_day ? Def.getDateString(this.state.birth_day, "yyyy-MM-dd") : "Chọn ngày sinh"}*/}
                    {/*            </Text>*/}
                    {/*        </TouchableOpacity>*/}
                    {/*        <DateTimePickerModal*/}
                    {/*            isVisible={this.state.isDateTimePickerVisible}*/}
                    {/*            onConfirm={(date) => {*/}
                    {/*                this.handleDatePicked(date);*/}
                    {/*                // this.hideDateTimePicker();*/}
                    {/*            }}*/}
                    {/*            onCancel={this.hideDateTimePicker}*/}
                    {/*            date={this.state.birth_day}*/}
                    {/*            mode={'date'}*/}
                    {/*            display='spinner'*/}
                    {/*            style={{width: 400, opacity: 1, height: 100, marginTop: 540}}*/}
                    {/*            datePickerModeAndroid='spinner'*/}
                    {/*            timePickerModeAndroid='spinner'*/}
                    {/*        />*/}
                    {/*        <Icon name="angle-right" size={25} color={Style.GREY_TEXT_COLOR}/>*/}
                    {/*    </View>*/}
                    {/*</TouchableOpacity>*/}
                    <View style={{ width : width -40, borderWidth : 0, borderBottomWidth:1 ,borderColor:Style.GREY_BACKGROUND_COLOR, flexDirection : 'row',alignItems : 'center', marginHorizontal : 10, marginBottom : 10}}>
                        <Icon style={styles.searchIcon} name="search" size={24} color={Style.GREY_TEXT_COLOR}/>
                        <TextInput value={this.state.name} onChangeText={text => this.setState({ name : text })} placeholder={"Tìm kiếm"} style={[styles.textInput, {marginTop:10, width: width -60}]}>
                        </TextInput>
                    </View>

                    <Modal onRequestClose={() => {this.closeFunction(null)}} visible={this.state.displayModal}  transparent={false} styles={{backgroundColor : 'green'}} >
                        {/*{this.state.choseAddress ?*/}
                        <AutocompleteModal
                            data={this.state.filterData}
                            filterAttr={this.state.filterAttr}
                            closeFunction={this.closeFunction}
                            title={this.state.title}

                        />
                    </Modal>

                </View>
                <ProgramVerList
                    data={this.state.data}
                    navigation={this.props.navigation}
                    header={ListHeader}
                    refreshControl={
                        <RefreshControl refreshing={this.state.isRefresh} onRefresh={this.onRefresh}/>
                    }
                    type={'flat'}
                    numColumns={1}
                    screen={'flat-detail'}
                    itemSeparatorComponent={

                        (({ highlighted }) => (
                            <View
                                style={[
                                    {backgroundColor:Style.GREY_TEXT_COLOR, height:1, width:width -25, marginHorizontal: 10},
                                    highlighted && { marginHorizontal: 10 }
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
    }
});

export default FlatListScreen;
