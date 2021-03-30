import {PureComponent} from "react";
import {Image, StyleSheet, TouchableOpacity, Text, View,Alert, Dimensions} from "react-native";

import DefaultProgramImage from "../../../assets/icon/logo-vov.svg";
import React from "react";
import CheckBox from '@react-native-community/checkbox';


import Def from '../../def/Def'
import Style from "../../def/Style";

const {width,height} = Dimensions.get('window');

const PROGRAM_IMAGE_WIDTH = (width - 30-8) /2;
const PROGRAM_IMAGE_HEIGHT = (width - 30-8) /2;

class MailProductItemrenderer extends PureComponent{


    callbackIndex = 0;

    checkBoxChange = (newValue) => {
        this.setState({selectValue : newValue});
        let item = this.state.item;
        item.selectValue = newValue;
        this.setState({item: item});
        // this.props.itemChange(item);
    }

    constructor(props) {
        super(props);
        this.state =  {
            item : this.props.item,
            stateCount: 0.0,
            selectValue: this.props.item.selectValue
        };
    }
    render(){
        const model = this.props.item ? this.props.item.pif : null;
        const click = this.props.click;
        return (
            <View style={{justifyContent : 'center', alignItems:'center' , marginVertical : 3 , marginLeft:1}}>

            <TouchableOpacity style={[styles.itemStyle]}>
                {
                    model.productInstance && model.productInstance && model.productInstance.product.image_path ?

                        <Image  style={[styles.itemImage ]}  source={{uri: Def.getThumnailImg(model.productInstance.product.image_path)}}  />
                        :
                        <Image  style={[styles.itemImage ]} source={require('../../../assets/icon/default_arena.jpg')} />

                }
                </TouchableOpacity>

                <CheckBox
                style={styles.checkBoxStyle}
                disabled={false}
                value={this.state.selectValue}
                onValueChange={(newValue) => this.checkBoxChange(newValue)}
                />
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
        right: 3,
        zIndex : 10,
        padding : 5,
    } ,
    itemImage: {
        width: PROGRAM_IMAGE_HEIGHT -5,
        height : PROGRAM_IMAGE_HEIGHT -5,
        borderRadius: 5,
    },
    checkBoxStyle: {
        // marginTop: width/15
        position: 'absolute',zIndex:3 , paddingHorizontal : 5 , left : 5 , paddingVertical:1 , borderRadius : 3 ,bottom:5
    },
});

export default MailProductItemrenderer;
