import React from 'react'
import {Text, View, Button, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image, TextInput, FlatList} from 'react-native'
import Def from '../../def/Def'
const {width, height} = Dimensions.get('window');
import RequestRepairRenderer from '../../../src/com/item-render/RequestRepairRenderer';
import ProgramVerList from  '../../../src/com/common/ProgramVerList'



import Style from '../../def/Style';
import FlatController from "../../controller/FlatController";

const PROGRAM_IMAGE_WIDTH = (width - 30-8) /2;
const PROGRAM_IMAGE_HEIGHT = (width - 30-8) /2;

class ProductDetailScreen extends React.Component {


    state = {
        stateCount: 0.0,
        configMenu: Def.config_collection_menu,
        item:this.props.route.params.item,
        requestRepairs:[]
    };


    addToCart(item){
        this.setState({choseProduct:false});

        let store = this.state.item;

        let store_cart = [];

        if(Def.cart_data[store.id]) {
            store_cart = Def.cart_data[store.id];
        } else {
            store_cart['store'] = store;
            store_cart['data'] = [];
        }

        const found = store_cart['data'].findIndex(element => element.product.id == item.id);

        if(found !== -1){
            store_cart['data'][found].amount++;
            store_cart['data'][found].selectValue = true;
        } else {
            let orderItem = {
                product:item,
                selectValue: true,
                amount:1,
            }

            store_cart['data'].push(orderItem);
        }
        Def.cart_data[store.id] = store_cart;
    }


    constructor(props){
        super(props);
        this.onGetCollectionSuccess     = this.onGetCollectionSuccess.bind(this);
        this.onGetCollectionFalse     = this.onGetCollectionFalse.bind(this);
        this.formatText    = this.formatText.bind(this);
        this.refresh     = this.refresh.bind(this);

        this.getRequestRepairSuccess = this.getRequestRepairSuccess.bind(this);
        this.getRequestRepairFalse = this.getRequestRepairFalse.bind(this);


        Def.product_detail_data = this.props.route.params.item;
        let item = this.props.route.params.item;

        this.state = {
            stateCount: 0.0,
            item:this.props.route.params.item,
            activeSlide:0,
            requestRepairs: Def.requestRepairsTree[item.id] ? Def.requestRepairsTree[item.id] : []
        };
        Def.mainNavigate = this.props.navigation;

    }
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

    onGetCollectionSuccess(data){
        this.setState({ collection_data: data["data"] });
        Def.collection_data = data["data"];
        Def.config_collection_menu = this.createConfigData(data["data"]) ;
        this.setState({ configMenu: Def.config_collection_menu});
    }

    createConfigData(data){
        console.log("Data : " + JSON.stringify(data));
        var configData = [];
        if(data){
            if(data.viewer_url){
                let viewerUrl =  Def.LIFE_STYLE_BASE + '/viewer-3d/view?id=' + data.id;
                configData.push({key: '3D', type:'3D' ,name_vi:"3D", hidden:0, data:{url_3d:viewerUrl  , url_ar:data["viewer_url"]}});
            }
            configData.push({key: '2D', type:'2D' ,name_vi:"2D", hidden:0, data:this.getImageForCollection(data)});
        }
        return configData;

    }

    onGetCollectionFalse(data){
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

        console.log('get Data Success : ' + JSON.stringify(data));
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
        const productInstance = item ? this.state.item : null;
        const product = productInstance ? productInstance.product : null;

        const renderItem = ({item}) => {
            return (
                <View style={{paddingLeft : 10}}>
                            <RequestRepairRenderer
                                item ={item} click={this.itemClick} canPlayBack={this.props.canPlayBack}
                                styleImage={{width: PROGRAM_IMAGE_WIDTH / 3, height: PROGRAM_IMAGE_WIDTH / 3}}
                                type={this.props.type}
                            />
                    }
                </View>
            )
        }

        // console.log("Slide Product data : " + JSON.stringify(this.state.slide_data) );
        return (
            <View style={{flex:1, backgroundColor:'#fff'}}>
                <View style={{width : width,height:PROGRAM_IMAGE_HEIGHT + 10 , backgroundColor: '#fff', flexDirection : 'row' , paddingBottom:5 }}>
                    <View style={styles.imageContainer}>
                        {product &&  product.image_path ?

                            <Image  style={[styles.itemImage ]}  source={{uri: Def.getThumnailImg(product.image_path)}}  />
                            :
                            <Image  style={[styles.itemImage ]} source={require('../../../assets/icon/default_arena.jpg')} />
                        }
                    </View>
                    <View style={styles.info}>
                        <View style={{flexDirection:'row'}}>
                            <Text>
                                {"Mã sản phẩm:" + ' '}
                            </Text>
                            <Text style={{fontSize:Style.MIDLE_SIZE , paddingRight:5}}>
                                {(productInstance && productInstance.code ? "" : "")}
                            </Text>
                        </View>

                        <View style={{flexDirection:'row'}}>
                            <Text>
                                {"Tên sản phẩm:" + ' '}
                            </Text>
                            <Text style={{fontSize:Style.MIDLE_SIZE , paddingRight:5}}>
                                {(product && product.name ? "" : "")}
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
                    <Text style={{paddingHorizontal : 10}}>
                        {"Mô tả:" + ' '}
                    </Text>
                    <ScrollView style={{maxHeight:120, width:width, paddingHorizontal:10}}>
                        <Text>
                            {product ? product.description : "sdfsdfsdfsdfsdfsdfsdfsdfsdfgfhdfasdfgfgasgfgjđjdjdjdjdjdjjjjjjddsdfsdfsdfsdf" + '\n' +
                                "sdfsdfsdfgfhfjghjhjghjghjghjghjgjghjgjhddddsdfsdfdddddddddddddddddddddddddddddddddddddddđffffffffffffffffffffff" +
                                "sdfsdfsdfsdfsdfsdfsdfsdfsdfgfhdfasdfgfgasgfgjđjdjdjdjdjdjjjjjjddsdfsdfsdfsdf" + '\n' +
                                "sdfsdfsdfgfhfjghjhjghjghjghjghjgjghjgjhddddsdfsdfdddddddddddddddddddddddddddddddddddddddđffffffffffffffffffffff"}
                        </Text>
                    </ScrollView>
                </View>

                <View style={{marginTop:10}}>
                    <Text style={{paddingHorizontal : 10}}>
                        {"Lịch sử chỉnh sửa:" + ' '}
                    </Text>
                    <ProgramVerList
                        data={this.state.requestRepairs}
                        navigation={this.props.navigation}
                        type={'request-repair'}
                        numColumns={1}
                        itemRenderer={RequestRepairRenderer}
                        renderFunction={renderItem}
                        stack={'Flat'}
                        screen={'request-repair-detail'}
                        addToCart={this.addToCart}
                    />


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
        height: 60,
        justifyContent : 'center',
        alignItems: 'center',
    },
    info: {
        marginLeft:5,
        flex: 2.2,
        // backgroundColor : 'red',
        marginTop : 5,
        // justifyContent: 'space-around',
        // paddingVertical: 5,
        // backgroundColor : 'red'
    }

});

export default ProductDetailScreen;
