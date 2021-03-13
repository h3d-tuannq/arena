import React from 'react'
import {View, Text, StyleSheet, Dimensions} from  'react-native'
import Style from "../../../Def/Style";

const {width, height} = Dimensions.get('window');

class CommentItemRenderer extends React.PureComponent{
    constructor(props){
        super(props);
    }

    render(){
        const {item} =  this.props;
        return (
            <View style={styles.comment}>
                <View style={styles.content}>
                    <Text style={styles.author}>
                        {item.name}
                    </Text>
                    <Text style={styles.commentContent}>
                        {item.content}
                    </Text>

                </View>
                <View style={styles.date}>
                    <Text style={{fontSize: Style.SMALL_SIZE, color: Style.GREY_TEXT_COLOR}}>{item.create_datetime.split(" ")[1] + " " + (item.create_datetime.split(" ")[0]).split("-")[2] + "/"+ (item.create_datetime.split(" ")[0]).split("-")[1] + "/"+ (item.create_datetime.split(" ")[0]).split("-")[0] }
                    </Text>
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
       marginHorizontal:10,
        borderRadius : 5,
        paddingVertical:5,
        // paddingHorizontal : 10
    },
    content: {
        paddingLeft : 10,

    },
    author : {
        fontSize : Style.MIDLE_SIZE,
        fontWeight: 'bold',
        marginBottom : 4,
    },
    date: {

    }

});

export default CommentItemRenderer;
