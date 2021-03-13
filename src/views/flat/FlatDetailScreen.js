import React from 'react'
import {Text, View, Button, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image, FlatList} from 'react-native'
import Def from '../../def/Def'
const {width, height} = Dimensions.get('window');
import Style from '../../def/Style';
import ProgramVerList from '../../com/common/ProgramVerList';

const PROGRAM_IMAGE_WIDTH = (width - 30-8) /2;
const PROGRAM_IMAGE_HEIGHT = (width - 30-8) /2;
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

class FlatDetailList extends React.Component {

    constructor(props){
        super(props);
        this.onGetDesignSuccess     = this.onGetDesignSuccess.bind(this);
        this.onGetDesignFalse     = this.onGetDesignFalse.bind(this);

        this.formatText    = this.formatText.bind(this);
        this.refresh     = this.refresh.bind(this);
        this.addToCart = this.addToCart.bind(this);
        Def.mainNavigate = this.props.navigation;

        let design_list = [];
        let title = "Gian hàng";


        this.state = {
            item: this.props.route.params.item,
            title: title,
            stateCount: 0.0,
            slide_data : carouselItems,
            activeSlide : 0
        };

    }

    refresh()
    {
        this.setState({ stateCount: Math.random() });
    }

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


    addToCart = (item) => {
        this.setState({choseProduct:false});
        let store = this.state.item;
        let store_cart = [];

        if(Def.cart_data[store.organ.id]) {
            store_cart = Def.cart_data[store.organ.id];
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
        AsyncStorage.setItem('cart_data', JSON.stringify(Def.cart_data));
    }

    render() {
        const {navigation} = this.props;
        const configMenu = Def.config_design_menu;
        Def.order_number = 20;
        // const ListHeader = () => (
        //     <View>
        //         <View style={{flexDirection: 'row', justifyContent: 'space-between' , alignItems: 'flex-start'}}>
        //             <View style={{marginLeft:15, paddingBottom:8}}>
        //                 <Text style={styles.titleStyle}>{this.state.item.material_relation.length + " Sản phẩm"}</Text>
        //             </View>
        //         </View>
        //     </View>
        // );


        return (
            <View style={{flex:1}}>
                {/*<View style={{height:height /3}}>*/}
                    {/*<WebView*/}
                        {/*ref={(ref) => (this.webview = ref)}*/}
                        {/*originWhitelist={['intent://*', 'https://vr.house3d.com']}*/}
                        {/*onShouldStartLoadWithRequest={this.handleWebViewNavigationStateChange}*/}
                        {/*source={{ uri: this.state.item.panorama_url }}*/}
                    {/*/>*/}
                {/*</View>*/}
                {/*<View style={{flex:1, paddingTop:5}}>*/}
                    {/*<ProgramVerList*/}
                        {/*data={this.state.item.material_relation}*/}
                        {/*navigation={this.props.navigation}*/}
                        {/*header={ListHeader}*/}
                        {/*type={'product'}*/}
                        {/*numColumns={2}*/}
                        {/*stack={'Product'}*/}
                        {/*screen={'product-detail'}*/}
                        {/*addToCart={this.addToCart}*/}
                    {/*/>*/}
                {/*</View>*/}

                <Text>
                    Detail Scheme
                </Text>

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

export default FlatDetailList;
