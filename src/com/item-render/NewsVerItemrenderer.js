import {PureComponent} from "react";
import {View, Button, StyleSheet, Image, Dimensions, Text, TouchableOpacity, Alert} from "react-native";
import React from "react";
import Def from '../../def/Def'
import Style from "../../def/Style";

const {width, height} = Dimensions.get('window');

class NewsVerItemrenderer extends PureComponent{
    constructor(props) {
        super(props);
        this.onClickNews = this.onClickNews.bind(this);
    }

    onClickNews(){
        console.log("onClickNews");
        const model = this.props.item;
        if(model.reader_link) {
            Def.setItemNews(model);
        } else {
            Alert.alert(
                "Thông báo",
                "Tin tức này chưa có dữ liệu âm thanh",
                [
                    { text: "Đồng ý", onPress: () => {
                            return;
                        } }
                ],
                { cancelable: false }
            );
        }
    }

    render(){
        const model = this.props.item;

        return (
            <TouchableOpacity style={styles.item} onPress={
                () => {
                    this.props.click(model);
                }
            }>
                    <View style={styles.imageContainer} >
                        {this.props.item.thumbnail_url ? <Image style={styles.itemImage} source={{uri:model.thumbnail_url}} /> :
                            <Image  style={styles.itemImage}  source={require('../../../assets/icon/logo_vov_16_9.png')}  />}
                    </View>

                    <View style={styles.info}>
                        <Text style={styles.titleInfo}>{model.title}</Text>
                        <View style={styles.listenView}>
                            <Text style={{fontSize:Style.MIDLE_SIZE, color:Style.GREY_TEXT_COLOR , paddingTop:5, paddingRight:5}}>{model.created_at+""}
                            </Text>
                            {/*<TouchableOpacity style={[styles.listenButton, { backgroundColor: model.reader_link ? 'red' : '#cccccc'}]} onPress={this.onClickNews}>*/}
                                {/*<SpeakerIcon style={styles.favoriteIcon}  />*/}
                                {/*<Text style={[styles.infoText,{ marginLeft:5}]}>*/}
                                    {/*Nghe tin tức*/}
                                {/*</Text>*/}
                            {/*</TouchableOpacity>*/}
                        </View>
                    </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        // height : 120,
        paddingRight:15,
        paddingVertical:5,
        flexDirection:'row',
        justifyContent:'space-between',
        marginBottom : 5,
    },

    imageContainer:{
        flex: 1,
        // backgroundColor: "red",
        borderRadius :5,
        justifyContent:'center'
    },
    itemImage: {
        width : width /3.5,
        height : width /5.5,
        borderRadius : 5,
    },
    listenView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems : 'center',
        flex: 1,
    },
    listenButton :{
        justifyContent : 'space-around',alignItems: 'center', flexDirection:'row' , width: width /3,
         paddingHorizontal: 10,
        borderRadius: 5,
        height :30
    }
    ,
    info: {
        marginLeft:20,
        flex: 2.2,
        justifyContent: 'space-around',
        paddingVertical: 5,
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
        width : 20,
        height : 20,
    }
});

export default NewsVerItemrenderer;


