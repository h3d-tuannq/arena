import React from 'react'
import {
    Text, View, Button, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image, TextInput, FlatList, Modal,
    TouchableWithoutFeedback, Platform
} from 'react-native'
const {width, height} = Dimensions.get('window');
import RequestRepairRenderer from '../../../src/com/item-render/RequestRepairRenderer';
import ProgramVerList from  '../../../src/com/common/ProgramVerList'
import RequestRepairDetailModal from  '../../../src/com/modal/RequestRepairDetailModal'

import Style from '../../def/Style';
import FlatController from "../../controller/FlatController";
import RequestRepairModalForm from "../../com/modal/RequestRepairModalForm";
import FlatHelper from "../../def/FlatHelper";
import Def from "../../def/Def";
import FullImageModal from  '../../../src/com/modal/FullImageModal'


const PROGRAM_IMAGE_WIDTH = (width - 30-8) /2;
const PROGRAM_IMAGE_HEIGHT = (width - 30-8) /2;



class ProductDetailScreen extends React.Component {

    constructor(props){
        super(props);
        this.refresh     = this.refresh.bind(this);
        this.getRequestRepairSuccess = this.getRequestRepairSuccess.bind(this);
        this.getRequestRepairFalse = this.getRequestRepairFalse.bind(this);
        this.itemClick = this.itemClick.bind(this);
        this.openRequestForm = this.openRequestForm.bind(this);
        this.appendRepairItem = this.appendRepairItem.bind(this);
        this.openFixedForm = this.openFixedForm.bind(this);
        this.approveRepair = this.approveRepair.bind(this);
        this.openCommentForm = this.openCommentForm.bind(this);
        this.closeFunction = this.closeFunction.bind(this);

        this.displayFullProduct = this.displayFullProduct.bind(this);


        Def.product_detail_data = this.props.route.params.item;
        let item = this.props.route.params.item;

        this.state = {
            stateCount: 0.0,
            item:this.props.route.params.item,
            activeSlide:0,
            requestRepairs: Def.requestRepairsTree[item.id] ? Def.requestRepairsTree[item.id] : [],
            displayRequestModal:false,
            requestDetail:null,
            displayRequestForm: false,
            requestType:0,
            displayFullProductImg: false,

        };
        Def.mainNavigate = this.props.navigation;
    }

    itemClick = (item) => {
        console.log('item click');
        this.setState({requestDetail:item, displayRequestModal : true});
    };

    displayFullProduct = () => {
        console.log('show full image');
        this.setState({ displayFullProductImg : true});
    }

    appendRepairItem = (data) => {
        let currentList = this.state.requestRepairs;
        if(data['requestRepair']){
            currentList.push(data['requestRepair']);
        }
        if( data['pif']){
            this.setState({requestRepairs : currentList, displayRequestForm : false, item:data['pif']});
        } else {
            this.setState({requestRepairs : currentList, displayRequestForm : false});
        }

    };

    openRequestForm = (type = FlatHelper.REQUEST_TYPE) => {
        console.log("Open Form");
        this.setState({displayRequestForm:true , displayRequestModal: false, requestType: type});
    };

    openFixedForm = (type = FlatHelper.REPAIRED_TYPE) => {
        console.log("Open Form");
        this.setState({displayRequestForm:true , displayRequestModal: false, requestType: type});
    };

    openCommentForm = (type = FlatHelper.COMMENT_TYPE) => {
        console.log("Open Comment Form");
        this.setState({displayRequestForm:true , displayRequestModal: false, requestType: type});
    };


    approveRepair = (status = 1) => {
        if(Def.user_info) {
            FlatController.changeStatusProduct(this.changeStatusSuccess, this.changeStatusFalse, this.state.item.id,  'wsh' , Def.user_info['access_token'] ,2, '', null, status);
        } else  {
            console.log('User info not exits');
        }

    };

    changeStatusSuccess = (data) => {
        if(data['pif']){
           this.setState({ item:data['pif']});
        }

    };

    changeStatusFalse = (data) => {
        console.log('Change Status False');
    };

    closeFunction = () => {
        this.setState({requestDetail:null, displayRequestModal : false , displayRequestForm : false, displayFullProductImg : false });
    };
    getImageForCollection(item){
        let collectionImages;
        if(item.faces){
            let subImgs = item.faces.split(',');
            subImgs = subImgs.map(x => {
                return {image_path:Def.VIETCRAFT_URL_CONTENT_BASE + x}
            });
            collectionImages = subImgs;
        }
        return collectionImages;
    }

    refresh()
    {
        this.setState({ stateCount: Math.random() });
    }
    shouldComponentUpdate(){
        return true;
    }
    componentDidMount(){
        if(this.state.requestRepairs.length == 0) {
           if(Def.requestRepairsTree && Def.requestRepairsTree[this.state.item.id]) {
               console.log('Isset on  request Tree');
               this.setState({requestRepairs:Def.requestRepairsTree[this.state.item.id]});
           } else {
               console.log('Not Isset on  request Tree : ' + this.state.item.id);
               FlatController.getRequestRepair(this.getRequestRepairSuccess, this.getRequestRepairFalse , this.state.item.id);
               // this.setState({requestRepairs:Def.requestRepairsTree[this.state.item.id]});
           }
        }
    }

    getRequestRepairSuccess(data){

        // console.log('get Data Success : ' + JSON.stringify(data));
        if( data['result']  && data['request_repairs']){
            Def.requestRepairsTree[this.state.item.id] = data['request_repairs'];
            this.setState({requestRepairs:Def.requestRepairsTree[this.state.item.id]});
        }
    }

    getRequestRepairFalse(data){
        console.log("getRequestRepairFalse : " + JSON.stringify(data));
    }



    getNewDataByConfigKey(key){

    }
    render() {
        const {navigation} = this.props;
        const item = this.state.item;

        // console.log("Slide Product data : " + JSON.stringify(this.state.slide_data) );
        return (
            <View style={{flex:1, backgroundColor:'#fff'}}>
                <View style={{width : width,height:PROGRAM_IMAGE_HEIGHT + 10 , backgroundColor: '#fff', flexDirection : 'row' , paddingBottom:5 }}>
                    <View style={styles.imageContainer}>
                        <TouchableOpacity onPress={this.displayFullProduct}>
                        {item &&  item.image_path ?

                                <Image  style={[styles.itemImage ]}  source={{uri: Def.getObjImage(item, 0, Def.ProductType)}}  />

                            :
                            <Image  style={[styles.itemImage ]} source={require('../../../assets/icon/default_arena.jpg')} />
                        }
                        </TouchableOpacity>
                    </View>
                    <View style={styles.info}>

                        <View style={{flexDirection:'row'}}>
                            <Text style={[{fontSize:Style.TITLE_SIZE , paddingRight:5}, Style.text_styles.titleTextNotBold]}>
                                {(item && item.name ? item.name : "")}
                            </Text>
                        </View>


                        <View style={{flexDirection:'row'}}>
                            <Text>
                                {"Trạng thái:" + ' '}
                            </Text>
                            <Text style={{fontSize:Style.MIDLE_SIZE ,  paddingRight:5}}>
                                {Def.getProductStatusName(item.status)+""}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={{flexDirection:'column'}}>
                    <ScrollView style={{maxHeight:120, width:width, paddingHorizontal:10, minHeight:60}}>
                        <Text>
                            {item ? item.description : "Sản phẩm chưa có mô tả"}
                        </Text>
                    </ScrollView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    modalStyle: {
        width : width,
        height: 300,
        marginTop : 20,
        backgroundColor:'green'
    },

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
        width: width,
        height: width * 0.8,


    },
    programListStyle : {

    },
    productInfo : {
        paddingHorizontal : 10,
        paddingVertical:5,
    },

    cardImg: {
        width: width,
        paddingVertical :5,
        height: width * 0.8,
        borderRadius : 5,
        paddingHorizontal:2,
        borderWidth: 1,
        borderColor : Style.DEFAUT_BLUE_COLOR
    },

    imageContainer:{
        flex: 2,
        borderRadius :5,
        justifyContent:'center',
        padding: 10,
        marginTop:5,
    },


    itemImage: {
        width: PROGRAM_IMAGE_WIDTH -5,
        height : PROGRAM_IMAGE_HEIGHT -5,
        borderRadius: 5,
    },
    bookingBtn : {
        backgroundColor: Style.DEFAUT_RED_COLOR,
        height: 45,
        justifyContent : 'center',
        alignItems: 'center',
        flex:1, paddingHorizontal : 10,
        marginHorizontal : 10,
        borderRadius:10
    },
    info: {
        marginLeft:5,
        flex: 2.2,
        // backgroundColor : 'red',
        marginTop : 5,
        // justifyContent: 'space-around',
        // paddingVertical: 5,
        // backgroundColor : 'red'
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
    }


});

export default ProductDetailScreen;
