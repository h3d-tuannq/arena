import React from 'react'
import {Text, View, Button, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image, TextInput, FlatList} from 'react-native'
import Def from '../../def/Def'
const {width, height} = Dimensions.get('window');



import Style from '../../def/Style';
import FlatController from "../../controller/FlatController";

const PROGRAM_IMAGE_WIDTH = width ;
const PROGRAM_IMAGE_HEIGHT = height ;

class FullImageModal extends React.Component {
    render() {
        const {item} = this.props;
        console.log("Item: " + JSON.stringify(item));

        return (
                <View style={styles.imageContainer}>
                    {
                        item.image_path ?
                            <Image  style={[styles.itemImage]}   source={{uri: Def.getThumnailImg(item.image_path)}}  />
                            :
                            <Image  style={[styles.itemImage]} source={require('../../../assets/icon/default_arena.jpg')} />
                    }
                </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        width:width,
        justifyContent : 'center',
        height:height,
        paddingHorizontal: 10,
        backgroundColor : '#fff',
        borderRadius : 10,

        // paddingLeft : 10,
        // flexDirection: 'row'

    },

    itemImage: {
        width : width,
        maxHeight : height,
        height : PROGRAM_IMAGE_WIDTH,
        resizeMode:'contain'
    },
    imageContainer: {
        flex:1,
        // justifyContent : 'center',
        // alignItems : 'center',
        // width : width,
        // height : height,
    },

    infoContainer:{
        marginTop : 20,

        // flex:5
    },
    author : {
        fontSize : Style.MIDLE_SIZE,
        fontWeight: 'bold',
        marginBottom : 4,
    },
    date: {

    }
});

export default FullImageModal;
