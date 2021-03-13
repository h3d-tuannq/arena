import {PureComponent} from "react";
import {Image, StyleSheet, TouchableOpacity, Text, View,Alert} from "react-native";

import DefaultProgramImage from "../../../assets/icon/logo-vov.svg";
import React from "react";
import PlusCircleIcon from "../../../assets/icons/Plus circle.svg";


import Def from '../../def/Def'
import Style from "../../def/Style";

class ProductItemrenderer extends PureComponent{
    state = {
        stateCount: 0.0,

    };

    callbackIndex = 0;

    constructor(props) {
        super(props);
    }


    formatText(text, maxCharacter = 20){
        let rs = text;
        // if(this.props.type == "product"){
        //     rs = text.replace("Sản phẩm ", '');
        // }

        if(text.length > maxCharacter -2){
            rs = text.substring(0, maxCharacter -2) + " ...";
        }
        return rs;
    }


    render(){
        const model = this.props.item;
        const click = this.props.click;
        return (
            <View>

            <TouchableOpacity style={[styles.itemStyle, this.props.styleImage]} onPress={
                () => {
                    click(model);
                }
            } >
                {this.props.favorite ?
                    <TouchableOpacity style={[styles.favoriteIcon, {width:30, height:30, backgroundColor : Style.GREY_TEXT_COLOR, alignItems : 'center', justifyContent:'center', borderRadius: 15}]}
                          onPress={
                              () => {
                                  click(model);
                              }
                          }
                    >
                        <PlusCircleIcon />
                    </TouchableOpacity>
                    :
                    <View/>
                }


                {model.image_path ?
                    <Image  style={[this.props.styleImage, styles.imageStyle ]}  source={{uri: Def.getThumnailImg(model.image_path)}}  />
                    :
                    <DefaultProgramImage style={styles.imageStyle} width={this.props.styleImage.width} height={this.props.styleImage.height}/>
                }

                </TouchableOpacity>

                <View style = {{width:this.props.styleImage.width, justifyContent:'center', alignItems: (this.props.type == 'product' ? 'flex-start' :'center')}}>

                    <Text style={[{position: 'absolute',zIndex:3 , paddingHorizontal : 4 , paddingVertical:1 , borderRadius : 3 ,bottom:5, backgroundColor: this.props.type == 'product' ? Style.DEFAUT_BLUE_COLOR :Style.DEFAUT_RED_COLOR, textAlign: 'center'}, Style.text_styles.whiteTitleText]}>
                          {this.formatText(this.props.type == 'product' ? model.model :model.name, 15)}
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

    },
    imageStyle : {

        borderRadius: 5,
    },

    favoriteIcon : {
        width:20,
        height:20,
        position: 'absolute',
        top:3,
        right: 3,
        zIndex : 10,
        padding : 5,
    }
});

export default ProductItemrenderer;
