import {PureComponent} from "react";
import {Image, StyleSheet, TouchableOpacity, Text, View,Alert} from "react-native";

import DefaultProgramImage from "../../../assets/icon/logo-vov.svg";
import React from "react";
import FavoriteIcon from "../../../assets/icon/icon-unlike.svg";
import FavoriteIconSelect from "../../../assets/icon/icon-like.svg";


import Def from '../../def/Def'
import Style from "../../def/Style";

class DesignItemrendererOld extends PureComponent{
    state = {
        stateCount: 0.0,
    };
    callbackIndex = 0;
    constructor(props) {
        super(props);
    }
    formatText(text, maxCharacter = 20){
        let rs = text;
        if(text.length > maxCharacter -2){
            rs = text.substring(0, maxCharacter -2) + " ...";
        }
        return rs;
    }
    render(){
        const model = this.props.item;
        const click = this.props.click;
        const FavoriteItem = ()=> {
            if(this.props.favorite ){
                if(model.favorite!=null){
                    return (
                        <FavoriteIconSelect style={styles.favoriteIcon}
                        />)
                } else {
                    return ( <FavoriteIcon style={styles.favoriteIcon}/> )
                }
            }
            return null;
        };

        return (
            <View style={{marginTop : 8, marginRight:5}}>

            <TouchableOpacity style={[styles.itemStyle, this.props.styleImage]} onPress={
                () => {
                    click(model);
                }
            } >
                {model.image_path ?
                    <Image  style={[this.props.styleImage, styles.imageStyle ]}  source={{uri: Def.URL_CONTENT_BASE +  model.image_path}}  />
                    :
                    <DefaultProgramImage style={styles.imageStyle} width={this.props.styleImage.width} height={this.props.styleImage.height}/>
                }
                </TouchableOpacity>
                <View style = {{width:this.props.styleImage.width, marginTop: 5 , justifyContent : 'center',  alignItems: 'flex-start'}}>
                    <Text style={[{paddingVertical:5 , borderRadius : 10 ,bottom:5, fontSize:Style.MIDLE_SIZE}]}>
                        {this.formatText(this.props.type == 'design' ? model.name : model.model, 50)}
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
            borderWidth : 1,
            borderColor : Style.GREY_TEXT_COLOR,

    },
    imageStyle : {
        borderRadius: 10,
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

export default DesignItemrendererOld;
