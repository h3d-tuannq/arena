import {PureComponent} from "react";
import {Image, StyleSheet, TouchableOpacity, Text, View,Alert, Dimensions} from "react-native";

import DefaultProgramImage from "../../../assets/icon/logo-vov.svg";
import React from "react";
import PlusCircleIcon from "../../../assets/icons/Plus circle.svg";


import Def from '../../def/Def'
import Style from "../../def/Style";
import Icon from 'react-native-vector-icons/FontAwesome';
import {OfflineHelper} from '../../def/OfflineHelper';

const {width,height} = Dimensions.get('window');

const PROGRAM_IMAGE_WIDTH = (width - 30-8) /2;
const PROGRAM_IMAGE_HEIGHT = (width - 30-8) /2;

class ProductItemrenderer extends PureComponent{
    state = {
        stateCount: 0.0,

    };

    callbackIndex = 0;

    constructor(props) {
        super(props);
    }
    render(){
        const model = this.props.item;
        const click = this.props.click;
        const product = this.props.type == 'product-template' ? model : model.productInstance.product;
        return (
            <View style={{justifyContent : 'center', alignItems:'center' , marginVertical : 3 , marginLeft:1}}>

            <TouchableOpacity style={[styles.itemStyle]} onPress={
                () => {
                    click(model);
                }
            } >

                {
                    this.props.type == "product" ?
                         <View style={[styles.favoriteIcon, {width:30, height:10 , alignItems: 'center', justifyContent: 'flex-end', flexDirection:'row'} ]}>
                             {
                                 OfflineHelper.checkPifOfflineChange(this.props.item) ?
                                     <Icon color={Style.DEFAUT_RED_COLOR}
                                           name="wifi"
                                           size={10}
                                           // style={{ position : 'absolute', right : 2, top: 3, borderRadius: 5}}
                                         // style={[styles.favoriteIcon, {width:10, height:10, backgroundColor : '#FFAE00', position : 'absolute', right : 2, top: 3, borderRadius: 5}]}
                                     >
                                     </Icon> : null

                             }
                            <TouchableOpacity style={[{}, {width:10, height:10 , marginLeft: 3, backgroundColor : Def.ProductStatusColor[model.status], alignItems : 'center', justifyContent:'center', borderRadius: 5}]}>
                            </TouchableOpacity>

                        </View>
                     : this.props.type == 'product-template' ?
                            OfflineHelper.checkOffline(this.props.item, Def.ProductType) ?
                                <View style={[styles.favoriteIcon, {width:40, height:20 , alignItems: 'center', justifyContent: 'flex-end', flexDirection:'row'} ]}>
                                    {

                                            <Icon name="download" size={20}
                                                  color="#03fc66"
                                                  style={{}}/>

                                    }

                                </View>
                                : null
                     : null
                }
                {
                    product && product.image_path ?

                        <Image  style={[styles.itemImage ]}  source={{uri: Def.getObjImage(product, 0, Def.ProductType)}}  />
                        :
                        <Image  style={[styles.itemImage ]} source={require('../../../assets/icon/default_arena.jpg')} />

                }
                    </TouchableOpacity>


                <View style = {{width:this.props.styleImage.width, justifyContent:'center', alignItems: (this.props.type == 'product' ? 'flex-start' :'center')}}>

                    <Text style={[{position: 'absolute',zIndex:3 , paddingHorizontal : 5 , left : 5 , paddingVertical:1 , borderRadius : 3 ,bottom:5, backgroundColor: this.props.type == 'product' ? Style.DEFAUT_BLUE_COLOR :Style.DEFAUT_RED_COLOR, textAlign: 'center'}, Style.text_styles.whiteTitleText]}>
                          {Def.formatText(this.props.type == 'product' ? (model.productInstance && model.productInstance.product ? model.productInstance.product.name : model.productInstance.product) :product.name, 15)}
                    </Text>
                </View>
            </View>

        )
    }
}
const  styles = StyleSheet.create({
    itemStyle : {
            borderRadius: 5,
            marginRight: 5,
            alignItems : 'flex-start',
            marginTop: 5,
            justifyContent : 'center',
            borderWidth : 2,
            borderColor : Style.DEFAUT_BLUE_COLOR

    },


    favoriteIcon : {
        width:20,
        height:20,
        position: 'absolute',
        top:3,
        right: 0,
        zIndex : 10,
        padding : 5,

    } ,
    itemImage: {
        width: PROGRAM_IMAGE_HEIGHT -5,
        height : PROGRAM_IMAGE_HEIGHT -5,
        borderRadius: 5,
    },
});

export default ProductItemrenderer;
