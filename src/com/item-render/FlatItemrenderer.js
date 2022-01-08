import {PureComponent} from "react";
import {Image, StyleSheet, TouchableOpacity, Text, View, Alert, Dimensions} from "react-native";

const {width, height} = Dimensions.get('window');

import DefaultProgramImage from "../../../assets/icon/logo-vov.svg";

import DefaultProgram from "../../../assets/icon/default_arena.jpg"

import React from "react";
import FavoriteIcon from "../../../assets/icon/icon-unlike.svg";
import FavoriteIconSelect from "../../../assets/icon/icon-like.svg";

import Def from '../../def/Def'
import Style from "../../def/Style";
import FlatHelper from "../../def/FlatHelper";
import Icon from 'react-native-vector-icons/FontAwesome';
import {OfflineHelper} from '../../def/OfflineHelper';

class FlatItemrenderer extends PureComponent{
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
        // console.log('Update : ' + model['update']);

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
            <View>
            <TouchableOpacity style={[styles.itemStyle]} onPress={
                () => {
                    click(model);
                }
            } >

                {/*<Icon name="download"*/}
                {/*      size={20}*/}
                {/*      color={OfflineHelper.checkOffline(model, Def.FlatType) ? "#03fc66" : Style.GREY_TEXT_COLOR}*/}
                {/*      style={{position: 'absolute', right : 10, top: width /8}}*/}

                {/*/>*/}

                {/*<Icon name="trash"*/}
                {/*      size={20}*/}
                {/*      color={OfflineHelper.checkOffline(model, Def.FlatType) ? "#03fc66" : Style.GREY_TEXT_COLOR}*/}
                {/*      style={{position: 'absolute', right : 10, top: width /8 + 40}}*/}

                {/*/>*/}

                <View style={styles.imageContainer}>
                    {(Def.getDesignForFlat(model)) && Def.getDesignForFlat(model).image_path ?
                        <Image  style={[styles.itemImage ]}  source={{uri: Def.getObjImage( Def.getDesignForFlat(model), 0, Def.DesignType)}}  />
                        :
                        <Image  style={[styles.itemImage ]} source={require('../../../assets/icon/default_arena.jpg')} />
                    }

                </View>

                <View style={styles.info}>

                        <View style={{flexDirection:'row', justifyContent:'space-between', paddingRight:10}}>
                            <View style={{flexDirection:'row'}}>
                                <Text>
                                    {"Mã:" + ' '}
                                </Text>
                                <Text style={{fontSize:Style.MIDLE_SIZE , paddingRight:5}}>
                                    {model.code+""}
                                </Text>
                            </View>

                            {/*<View style={{flexDirection:'row', backgroundColor:Style.DEFAUT_RED_COLOR, borderRadius:2, borderColor:'#fff'}}>*/}
                            {/*        <Text style={{fontSize:Style.MIDLE_SIZE, paddingRight:5, color:'#fff'}}>*/}
                            {/*            {FlatHelper.calPassPifStr(model)}*/}
                            {/*        </Text>*/}
                            {/*</View>*/}

                            <View style={{flexDirection:'row', backgroundColor:Style.DEFAUT_RED_COLOR, borderRadius:2, borderColor:'#fff', minWidth : 30 , alignItems: 'center' , justifyContent: 'center'}}>
                                    <Text style={{fontSize:Style.MIDLE_SIZE, paddingRight:5, color:'#fff'}}>
                                        { (typeof model.finance_progress == 'number'  ? typeof model.finance_progress : 0) + '%' }
                                    </Text>
                            </View>

                        </View>


                        <View style={{flexDirection:'row'}}>
                            <Text>
                                {"Trạng thái:" + ' '}
                            </Text>
                            <Text style={{fontSize:Style.MIDLE_SIZE ,  paddingRight:5}}>
                                {Def.getFlatStatusName(model.status)}
                            </Text>
                        </View>

                        <View style={{flexDirection:'row'}}>
                            <Text>
                                {"Dự án:" + ' '}
                            </Text>

                            <Text style={{fontSize:Style.MIDLE_SIZE ,  paddingRight:5}}>
                                {Def.getBuildingForFlat(model) ? Def.getBuildingForFlat(model).name+"" : ""}
                            </Text>
                        </View>
                        <View style={{flexDirection:'row'}}>
                            <Text>
                                {"Chủ sở hữu:" + ' '}
                            </Text>
                            <Text style={{fontSize:Style.MIDLE_SIZE, paddingRight:5}}>
                                {Def.getCustomerForFlat(model) ? Def.getCustomerForFlat(model).name+"" : ""}
                                {/*{ model.customer? model.customer.name+"" : ""}*/}
                            </Text>
                        </View>

                        <View style={{flexDirection:'row'}}>
                            <Text>
                                {"Ngày bàn giao: "}
                            </Text>

                            <Text style={{fontSize:Style.MIDLE_SIZE, paddingRight:5}}>
                                { model.deliver_date ? Def.getDateString(new Date(model.deliver_date *1000), "dd-MM-yyyy hh:mm") : ""}
                            </Text>
                        </View>
                </View>

                <View style={{flex:0.2 , justifyContent: 'flex-start', height: width/5}}>
                    {
                        Def.NetWorkMode ?
                        <TouchableOpacity disabled={true}>
                            <Icon name="download" size={20}
                                  color={OfflineHelper.checkOffline(model, Def.FlatType) ? "#03fc66" : Style.GREY_TEXT_COLOR}
                                  style={{}}/>
                        </TouchableOpacity>
                            : null

                    }
                    {
                        !Def.NetWorkMode && OfflineHelper.checkOffline(model, Def.FlatType) ?
                        <TouchableOpacity
                            onPress={()=> {
                                if(this.props.itemHandleFunc && this.props.itemHandleFunc.removeOfflineItem){
                                    console.log('Remote offline item');
                                    this.props.itemHandleFunc.removeOfflineItem(model);
                                }
                            }}
                            style={{width:30, height: 30, marginTop:5, paddingVertical: 10, paddingLeft:5, marginLeft: -5}} >
                            <Icon name="trash" size={20}
                                  style={{}}/>
                        </TouchableOpacity>
                        : null
                    }

                    {
                        !Def.NetWorkMode && ((model['update'] == 1 || model['update'] == '1') )?
                        <TouchableOpacity
                            onPress={()=> {
                                if(this.props.itemHandleFunc && this.props.itemHandleFunc.resetOfflineFlat){
                                    console.log('reset offline flat');
                                    this.props.itemHandleFunc.resetOfflineFlat(model);
                                }
                            }}
                            style={{width:30, height: 30, marginTop:5, paddingVertical: 10, paddingLeft:5, marginLeft: -5}} >
                            <Icon name="retweet" size={20}
                                  style={{}}/>
                        </TouchableOpacity> : null
                    }

                </View>


                </TouchableOpacity>

            </View>

        )
    }
}

const  styles = StyleSheet.create({
    itemStyle : {
            borderRadius: 5,
            marginRight: 5,
            alignItems : 'flex-start',
            marginTop: 10,
            paddingVertical : 10,
            flexDirection : 'row',
    },
    imageStyle : {

        borderRadius: 5,
    },

    imageContainer:{
        flex: 1,
        borderRadius :5,
        justifyContent:'center'
    },
    itemImage: {
        width : width /4,
        height : width /4,
        borderRadius : 5,
        borderWidth : 2,
        borderColor : Style.GREY_TEXT_COLOR,
    },


    info: {
        marginLeft:5,
        flex: 2.6,
        // justifyContent: 'space-around',
        // paddingVertical: 5,
        // backgroundColor : 'red'
    },
    titleInfo : {
        fontWeight: 'bold',
        fontSize : Style.NORMAL_SIZE,
        paddingBottom : 8,
        flex: 1,
    },
    infoText : {
        fontSize : Style.NORMAL_SIZE,
        color: '#ffffff'
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

export default FlatItemrenderer;
