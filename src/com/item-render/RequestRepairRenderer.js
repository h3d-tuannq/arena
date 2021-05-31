import React from 'react'
import {View, Text, StyleSheet, Dimensions, Image, TouchableOpacity} from  'react-native'
import Def from "../../def/Def";
import Style from  "../../def/Style"
import Icon from 'react-native-vector-icons/FontAwesome';

const {width, height} = Dimensions.get('window');

class RequestRepairRenderer extends React.PureComponent{
    constructor(props){
        super(props);
    }

    render(){
        const {item} =  this.props;
        return (
            <TouchableOpacity style={styles.comment} onPress={() => {
                if(item.image_path){
                    // this.props.click(item)
                }
            }}>
                <View style={styles.content}>
                    {
                        item['offlineMode'] == 1?
                            <Icon color={Style.DEFAUT_RED_COLOR}
                                  name="wifi"
                                  size={10}
                                  style={{ position : 'absolute', right : 2, top: 3, borderRadius: 5}}
                                  // style={[styles.favoriteIcon, {width:10, height:10, backgroundColor : '#FFAE00', position : 'absolute', right : 2, top: 3, borderRadius: 5}]}
                            >
                            </Icon> : null

                    }

                    <View style={styles.infoContainer}>
                        <View style={{flexDirection:'row', justifyContent: 'space-between', paddingHorizontal:5 , width : width -30}}>
                            <Text style={styles.author}>
                                {item.reporter ? item.reporter.username :  item.offlineItem == 1 ? Def.user_info.username: item.reporter_id}
                            </Text>
                            <View style={styles.date}>
                            <Text style={{fontSize: Style.SMALL_SIZE, color: Style.GREY_TEXT_COLOR}}>{Def.getDateString(new Date(item.status == 1 ?  item.completed_repair *1000 : item.date * 1000), "dd-MM-yyyy hh:mm")}
                            </Text>
                            </View>
                        </View>
                        <Text style={styles.commentContent}>
                            {item.note ? Def.formatText(item.note , 100): "" }
                        </Text>

                    </View>



                </View>

                <View style={styles.imageContainer}>
                    {
                        item.image_path ?(
                            <Image  style={[styles.itemImage ]}  source={{uri:  item.offlineItem == 1 ? item.image_path : Def.getObjImage(item, Def.OFFLINE_PRIORITY, Def.REQUESTREPAIRTYPE)}}  />
                            )
                            : null
                    }
                </View>



            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    comment: {
       backgroundColor : '#f0f1f2',
       minHeight: 60,
       // flexDirection : 'row',
       justifyContent : 'space-between',
       marginVertical :5,
       // marginHorizontal:10,
        borderRadius : 5,
        paddingVertical:5,
        marginHorizontal : 10,
        // paddingHorizontal : 10
    },
    content: {
        // width : width - 20,
        // paddingLeft : 10,
        // flexDirection: 'row',

    },

    itemImage: {
         maxWidth : width - 30,
         height : height /4,
         // maxHeight : height /3,
        // height : width / 7,
       // resizeMode : 'center',
        borderRadius : 5,
        backgroundColor: 'red'
    },
    imageContainer: {
       // flex:2,
       //  maxWidth : width - 30,
       //  marginTop : 5,
       //  backgroundColor: 'red'
        // height : height /4,
    },

    commentContent : {
        paddingHorizontal:5
    },

    infoContainer:{
       // flex:6,
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
