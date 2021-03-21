import React from 'react'
import {View, Text, StyleSheet, Dimensions, Image} from  'react-native'
import Def from "../../def/Def";
import Style from  "../../def/Style"

const {width, height} = Dimensions.get('window');

class RequestRepairRenderer extends React.PureComponent{
    constructor(props){
        super(props);
    }

    render(){
        const {item} =  this.props;
        return (
            <View style={styles.comment}>
                <View style={styles.content}>
                    <View style={styles.imageContainer}>
                    {
                        item.image_path ?
                        <Image  style={[styles.itemImage ]}  source={{uri: Def.getThumnailImg(item.image_path)}}  />
                        :
                        <Image  style={[styles.itemImage ]} source={require('../../../assets/icon/default_arena.jpg')} />
                    }
                    </View>
                    <View style={styles.infoContainer}>
                        <View style={{flexDirection:'row', justifyContent: 'space-between', paddingRight:5}}>
                            <Text style={styles.author}>
                                {item.reporter_id}
                            </Text>
                            <View style={styles.date}>
                            <Text style={{fontSize: Style.SMALL_SIZE, color: Style.GREY_TEXT_COLOR}}>{Def.getDateString(new Date(item.date * 1000), "dd-MM-yyyy")}
                            </Text>
                            </View>
                        </View>
                        <Text style={styles.commentContent}>
                            {item.note ? Def.formatText(item.note , 100) : "" }
                        </Text>
                    </View>


                </View>


            </View>
        )
    }
}

const styles = StyleSheet.create({
    comment: {
       backgroundColor : '#f0f1f2',
       minHeight: 60,
       flexDirection : 'row',
       justifyContent : 'space-between',
       marginVertical :5,
       // marginHorizontal:10,
        borderRadius : 5,
        paddingVertical:5,
        // paddingHorizontal : 10
    },
    content: {
        width : width - 20,
        // paddingLeft : 10,
        flexDirection: 'row'

    },

    itemImage: {
        width : width / 5,
        height : width / 7,
        borderRadius : 5,
    },
    imageContainer: {
       flex:2,
    },

    infoContainer:{
       flex:6,
    },
    author : {
        fontSize : Style.MIDLE_SIZE,
        fontWeight: 'bold',
        marginBottom : 4,
    },
    date: {

    }

});

export default RequestRepairRenderer;
