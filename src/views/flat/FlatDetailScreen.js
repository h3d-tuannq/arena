import React from 'react'
import {Text, View, Button, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image, FlatList, TouchableWithoutFeedback, Modal} from 'react-native'
import Def from '../../def/Def'
const {width, height} = Dimensions.get('window');
import Style from '../../def/Style';
import FlatHelper from  '../../def/FlatHelper'

import DeclineDeliverModalForm from  '../../../src/com/modal/DeclineDeliverModalForm'
import SignatureModalForm from  '../../../src/com/modal/SignatureModalForm'

import ProgramVerList from '../../com/common/ProgramVerList';

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

class FlatDetailScreen extends React.Component {

    constructor(props){
        super(props);
        this.formatText    = this.formatText.bind(this);
        this.refresh     = this.refresh.bind(this);
        Def.mainNavigate = this.props.navigation;

        let design_list = [];
        let title = "Gian hàng";

        this.closeFunction = this.closeFunction.bind(this);


        this.state = {
            item: this.props.route.params.item,
            title: title,
            stateCount: 0.0,
            slide_data : carouselItems,
            activeSlide : 0,
            displayDeclineForm : false,
            displaySignatureForm : false,
            type : -1
        };
        this.updateFlatStatus = this.updateFlatStatus.bind(this);

    }

    changeFlatStatus = (type) => {
        if(type == decline_deliver_form) {
            this.setState({displayDeclineForm : true, type:type});
        }
    }

    refresh()
    {
        this.setState({ stateCount: Math.random() });
    }

    updateFlatStatus =(flat) => {
        this.setState({item:flat});
        this.closeFunction();
    };

    closeFunction = () => {
        if(this.state.type == decline_deliver_form) {
            this.setState({displayDeclineForm : false});
        }

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


    onGetDesignFalse(data){
        console.log("false data : " + data);
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
        return true;
    }



    render() {
        const {navigation} = this.props;
        const {item} = this.state;
        const configMenu = Def.config_design_menu;
        Def.order_number = 20;
        const ListHeader = () => (
            <View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between' , alignItems: 'flex-start'}}>
                    <View style={{marginLeft:15, paddingBottom:8}}>
                        <Text style={styles.titleStyle}>{(this.state.item.productInstanceFlat ? this.state.item.productInstanceFlat.length : 0) + " Sản phẩm"}</Text>
                    </View>
                </View>
            </View>
        );
        return (
            <View style={{flex:1}}>
                <View style={{width : width,height:PROGRAM_IMAGE_HEIGHT + 80 , backgroundColor: '#fff', flexDirection : 'row' , paddingBottom:5 }}>
                    <View style={styles.imageContainer}>
                        {item.design && item.design.image_path ?
                            <Image  style={[styles.itemImage ]}  source={{uri: Def.getThumnailImg(item.design.image_path)}}  />
                            :
                            <Image  style={[styles.itemImage ]} source={require('../../../assets/icon/default_arena.jpg')} />
                        }

                        <View style = {{marginTop : 10, width:PROGRAM_IMAGE_WIDTH, justifyContent:'flex-start'  }}>

                            <Text style={[{   paddingVertical:1 , borderRadius : 3 ,bottom:5, backgroundColor:  Style.DEFAUT_BLUE_COLOR, textAlign: 'center'}, Style.text_styles.whiteTitleText]}>
                                {Def.formatText(item.code, 15)}
                            </Text>
                        </View>

                    </View>
                    <View style={styles.info}>
                        <View style={{flexDirection:'row'}}>
                            <Text>
                                {"Tình trạng:" + ' '}
                            </Text>
                            <Text style={{fontSize:Style.MIDLE_SIZE ,  paddingRight:5 , width: width /2 - 60}}>
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
                                {item.handover ? item.handover.username+"" : ""}
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



                        <View style={{flexDirection:'row'}}>
                            <Text>
                                {"Khách hàng:" + ' '}
                            </Text>
                            <Text style={{fontSize:Style.MIDLE_SIZE, paddingRight:5}}>
                                { item.customer? item.customer.name+"" : ""}
                            </Text>
                        </View>

                        <View style={{flexDirection:'row'}}>
                            <Text>
                                {"Ngày bàn giao:" + ''}
                            </Text>

                            <Text style={{fontSize:Style.MIDLE_SIZE, paddingRight:5}}>
                                { item.deliver_date ? Def.getDateString(new Date(item.deliver_date *1000), "dd-MM-yyyy") : ""}
                            </Text>
                        </View>


                        <View style={{flexDirection:'row'}}>
                            <Text>
                                {"Deadline hoàn thiện:" + ''}
                            </Text>

                            <Text style={{fontSize:Style.MIDLE_SIZE, paddingRight:5}}>
                                { item.deliver_date ? Def.getDateString(new Date(item.deliver_date *1000), "dd-MM-yyyy") : "Không có"}
                            </Text>
                        </View>


                    </View>

                </View>
                <View style={{flex:1, paddingTop:5 , paddingBottom : 5 }}>
                    <ProgramVerList
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
                                                          onPress={() => this.openFixedForm(1)}>
                                            <Text style={Style.text_styles.whiteTitleText}>
                                                Ký nhận
                                            </Text>
                                        </TouchableOpacity> : null
                                }

                                {FlatHelper.canSendRequestRepair(this.state.item, Def.user_info) ?
                                    <TouchableOpacity style={Style.button_styles.buttonFlatStyle}
                                                      onPress={this.openRequestForm}>
                                        <Text style={Style.text_styles.whiteTitleText}>
                                            Gửi biên bản
                                        </Text>
                                    </TouchableOpacity> : null
                                }
                                {
                                    FlatHelper.canDone(this.state.item,Def.user_info) ?
                                        <TouchableOpacity style={Style.button_styles.buttonFlatStyle}
                                                          onPress={() => this.openFixedForm(1)}>
                                            <Text style={Style.text_styles.whiteTitleText}>
                                                Hoàn thành
                                            </Text>
                                        </TouchableOpacity> : null
                                }



                                {
                                    FlatHelper.canChangeDeliverStatus(this.state.item,Def.user_info)  ?
                                        <TouchableOpacity style={Style.button_styles.buttonFlatStyle}
                                                          onPress={() => this.openFixedForm(1)}>
                                            <Text style={Style.text_styles.whiteTitleText}>
                                                Đủ điều kiện
                                            </Text>
                                        </TouchableOpacity> : null
                                }

                                {
                                    FlatHelper.canPerformDelivering(this.state.item,Def.user_info) ?
                                        <TouchableOpacity style={Style.button_styles.buttonFlatStyle}
                                                          onPress={() => this.openFixedForm(1)}>
                                            <Text style={Style.text_styles.whiteTitleText}>
                                                Thực hiện bàn giao
                                            </Text>
                                        </TouchableOpacity> : null
                                }

                                {
                                    FlatHelper.canCompleteProfile(this.state.item,Def.user_info) ?
                                        <TouchableOpacity style={Style.button_styles.buttonFlatStyle}
                                                          onPress={() => this.openFixedForm(1)}>
                                            <Text style={Style.text_styles.whiteTitleText}>
                                                Hoàn thiện hồ sơ
                                            </Text>
                                        </TouchableOpacity> : null
                                }

                                {
                                    FlatHelper.canRepairAfterSigned(this.state.item,Def.user_info) ?
                                        <TouchableOpacity style={Style.button_styles.buttonFlatStyle}
                                                          onPress={() => this.openFixedForm(1)}>
                                            <Text style={Style.text_styles.whiteTitleText}>
                                                Sửa chữa sau bàn giao
                                            </Text>
                                        </TouchableOpacity> : null
                                }

                                {
                                    FlatHelper.canRollbackFinalDone(this.state.item,Def.user_info)  ?
                                        <TouchableOpacity style={Style.button_styles.buttonFlatStyle}
                                                          onPress={() => this.openFixedForm(1)}>
                                            <Text style={Style.text_styles.whiteTitleText}>
                                                Chưa đủ điều kiện
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

                <Modal  onRequestClose={this.closeFunction}  transparent={false}  visible={this.state.displaySignatureForm} >
                    <TouchableOpacity  onPress={this.closeFunction} style={[styles.requestSignatureModalView, {justifyContent:'center', alignItems: 'center'}]}  activeOpacity={1}>
                        {/*<TouchableWithoutFeedback activeOpacity={1}  style={{width : width * 0.8, height :0.5*height,  alignItems: "center",*/}
                            {/*justifyContent : 'center', zIndex: 3}} onPress ={ (e) => {*/}
                            {/*// props.closeFun(props.selectedDate)*/}
                            {/*console.log('prevent click');*/}
                            {/*e.preventDefault()*/}
                        {/*}}>*/}
                            <View style={{zIndex : 5 }}>
                                <SignatureModalForm updateFlatStatus={this.updateFlatStatus} flat={this.state.item}  />
                            </View>

                        {/*</TouchableWithoutFeedback>*/}

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
        flex: 2,
        borderRadius :5,
        // justifyContent:'center',
        padding: 10,
        marginTop:5,
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
        marginLeft:5,
        flex: 2.5,
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
