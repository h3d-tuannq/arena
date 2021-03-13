import React from 'react'
import {Text, View, StyleSheet, Dimensions, TouchableOpacity, TextInput} from 'react-native'
import Style from "../../def/Style";
import Def from "../../def/Def";
const {width,  height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome5';

import LocationIcon from '../../../assets/icons/Location.svg';

import ProductItemRenderer from '../../com/item-render/ProductItemrenderer';

const PROGRAM_IMAGE_WIDTH = (width - 30-8) /2;
const PROGRAM_IMAGE_HEIGHT = (width - 30-8) /2;
const type = 'product';

const initData = [
    {"id":1,"city_code":1,"city_name":"Tiền Giang"},
    {"id":2,"city_code":2,"city_name":"Hưng Yên"},
    {"id":3,"city_code":3,"city_name":"Hà Nội"},
    {"id":4,"city_code":4,"city_name":"TP Hồ Chí Minh"},
    {"id":61,"city_code":61,"city_name":"Yên Bái"},{"id":62,"city_code":62,"city_name":"Điện Biên"},{"id":63,"city_code":63,"city_name":"Hà Giang"},{"id":64,"city_code":64,"city_name":"Chưa rõ"}];

class ProductAutocomplete extends React.Component {
    constructor(props){
        super(props);
        console.log("Product Data : " + this.props.data.length);
        console.log("Product Datas : " + Def.product_data.length);
        this.state = {
            data : this.props.data.length > 0 ? this.props.data : Def.product_data,
            query : ""
        };
        // this.onEndReached = this.onEndReached.bind(this);
     }

    filterData = (query) => {
        const { data } = this.state;
        if (query === '' || query === null) {
            return data.length < 50 ? data: data.slice(0,50);
        }

        const regex = new RegExp(`${query.trim()}`, 'i');
        return data.filter(item => item[this.props.filterAttr].search(regex) >= 0);
    }

    onEndReached(){
        console.log('End Flatlist : ');
    }


    render() {

        const click = this.props.itemClick;
        const filterData = this.filterData(this.state.query);
        const renderItem = ({ item }) => (
            <ProductItemRenderer click={()=> {click(item)}} type={"product"} item={item} favorite={true} styleImage={{width:PROGRAM_IMAGE_WIDTH -2, height:PROGRAM_IMAGE_HEIGHT-5, marginRight:6, marginBottom : 5 }} />
        );

        return (
                <View style={{height: height-Style.HEADER_HEIGHT +20, width: width,marginTop: Style.HEADER_HEIGHT, borderTopLeftRadius :20, borderTopRightRadius :20 , backgroundColor:'#fff', alignItems:'center', paddingBottom:20}}>
                        <Autocomplete
                              data={filterData}
                              defaultValue={this.state.query}
                              onChangeText={text => this.setState({ query : text })}
                              keyExtractor={(item,index) => "hoz" + index}
                              renderItem={renderItem}
                              renderTextInput={()=> (
                                  <View style={{ width : width -20, borderWidth : 0, borderBottomWidth:1 ,borderColor:Style.GREY_BACKGROUND_COLOR, flexDirection : 'row',alignItems : 'center', marginHorizontal : 10, marginBottom : 10}}>
                                      <Icon style={styles.searchIcon} name="search" size={24} color={Style.GREY_TEXT_COLOR}/>
                                      <TextInput onChangeText={text => this.setState({ query : text })} placeholder={"Nhập mã sản phẩm"} style={[styles.textInput, {marginTop:10, width: width -50}]}>
                                      </TextInput>
                                  </View>
                                )
                              }
                             flatListProps = {{
                                 numColumns : 2,
                                 alignItems : 'center',
                                 onEndReached : this.onEndReached,
                                 marginBottom:10,

                             }}
                             inputContainerStyle={{borderWidth:0}}
                             listStyle={{borderWidth:0, marginBottom:50}}

                        />
                </View>
        );
    }

}

const styles = StyleSheet.create({
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
    },
    itemStyle :{
        height : 40,
        flexDirection:'row',
        alignItems : 'center',

    },
    searchIcon : {
        // padding:5,
        marginTop :10,
        // backgroundColor: 'red',
    },

    textInput : {height: 40, backgroundColor : '#fff', borderColor: "#9e9e9e", borderWidth : 0, borderBottomWidth:0 ,color:'black', fontSize : Style.MIDLE_SIZE, borderRadius: 5, paddingHorizontal: 10  },

});

export default ProductAutocomplete;
