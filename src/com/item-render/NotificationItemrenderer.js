import React from 'react'
import {View, Text, StyleSheet, Dimensions,Linking,TouchableOpacity, Image} from  'react-native'
import PlusCircleIcon from "../../../assets/icons/Plus circle.svg";


import Def from '../../def/Def'
import Style from "../../def/Style";

const {width, height} = Dimensions.get('window');

class NotificationItemrenderer extends React.PureComponent{
    constructor(props){
        super(props);
        this.goLink = this.goLink.bind(this);

        // this.onChannelSuccess = this.onChannelSuccess.bind(this);
        // this.onChannelErr = this.onChannelErr.bind(this);
        // this.onProgramSuccess = this.onProgramSuccess.bind(this);
        // this.onProgramErr = this.onProgramErr.bind(this);
    }

    onChannelSuccess(data){
        console.log('NotificationItemrenderer onChannelSuccess');
        //console.log(data);
        item = data['data'];

        Def.mainNavigate.navigate('PlayRadio', {screen:'commonPlayRadio', params: { item: item, data : [item] }});
    }
    onChannelErr(data){}
    onProgramSuccess(data){
        console.log('NotificationItemrenderer onProgramSuccess');
        console.log(data['data']);
        Def.setItemDailyContent(data['data']);
    }
    onProgramErr(data){}

    goLink(link){
        //alert(link);
        if(link.startsWith("http")){
            Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
        } else if(link.startsWith("vov://channel")){
            id = link.replace("vov://channel/",'');
            //alert(`channel ${id}`);


            if(Def.channels_data_radio)
                Object.entries(Def.channels_data_radio).map((prop, key) => {

                    for(let i = 0; i < prop[1].length; i++){
                        console.log(`${prop[1][i]['id']} - ${id}`);
                        if(parseInt(prop[1][i]['id']) == parseInt(id))
                            Def.mainNavigate.navigate('PlayRadio', {screen:'commonPlayRadio', params: { item: prop[1][i], data : prop[1] }});
                    }
                });


            //NetChannel.getChannelById(this.onChannelSuccess,this.onChannelErr,id);
            //
        }else if(link.startsWith("vov://program")){
            id = link.replace("vov://program/",'');

            //alert(`program ${id}`);
            NetDailyContent.getContent(this.onProgramSuccess,this.onProgramErr,id);
        }
    }

    render(){
        const {item} =  this.props;
        return (
            <TouchableOpacity onPress={this.goLink.bind(this,item.link)} style={styles.noti}>
                <View style={styles.imageContainer} >
                    {item.image ? <Image style={styles.itemImage} source={{uri:item.image}} /> :
                        <Image  style={styles.itemImage}  source={require('../../../assets/icon/eurotile_notification.jpg')}  />}
                </View>
                <View style={styles.info}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {item.title}
                        </Text>
                        <Text style={styles.date}>{item.created_at ? Def.getDateString(new Date(item.created_at * 1000), "dd-MM-yyyy") : ""}
                        </Text>

                    </View>

                    <View style={styles.content}>
                        <Text style={{fontSize : Style.NORMAL_SIZE}}>
                            {item.body}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    noti: {
        backgroundColor : '#f0f1f2',
        minHeight: 60,
        marginVertical :5,
        // marginHorizontal:10,
        borderRadius : 5,
        flexDirection: 'row',

    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems:'center'
    },
    imageContainer:{
        flex: 1,
        // backgroundColor: "red",
        // borderRadius :5,
        justifyContent:'center'
    },
    itemImage: {
        width : width / 5,
        height : width / 7,
        borderRadius : 5,
    },
    title : {
        fontSize : Style.MIDLE_SIZE,
        fontWeight: 'bold',
        marginBottom : 4,
        // flex: 1,
    },
    date: {
        // flex: 1,
        fontSize : Style.SMALL_SIZE,
    },
    content: {
    },
    info : {
        flex: 3.5,
        // backgroundColor: 'red',
        paddingHorizontal:5,
    }

});

export default NotificationItemrenderer;
