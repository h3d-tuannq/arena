import React from 'react'
import {View, TouchableOpacity, StyleSheet, Text, FlatList, TextInput, Dimensions, Keyboard,Alert} from 'react-native'
import CommentItemrenderer  from "../item-render/CommentItemRenderer"

import NetDailyContent from '../../../Net/NetDailyContent'
import NetMusic from '../../../Net/NetMusic'
import Def from '../../../Def/Def'
import Style from "../../../Def/Style";

const {width, height} = Dimensions.get('window');


function OptionItem(props) {
    return <TouchableOpacity style={styles.optionItem} onPress={()=> {

    }}>
        <Text style={styles.aswText}>
            {props.item}
        </Text>
    </TouchableOpacity>
}

class CommentComponent extends React.Component{
    state = {
        comments: null,
        comment_content:'',
    };

    onContentSuccess(data){
        // console.log("onContentSuccess");
        this.setState({ comments: data["data"]  });
    }

    onContentFailed(data){
        //
    }
    onSendContentSuccess(data){
        // console.log("onSendContentSuccess");
    }

    onSendContentFailed(data){
        //
    }

    constructor(props){
        super(props);
        // console.log(props);
        this.onContentSuccess     = this.onContentSuccess.bind(this);
        this.onContentFailed     = this.onContentFailed.bind(this);
        this.onSendContentSuccess     = this.onSendContentSuccess.bind(this);
        this.onSendContentFailed     = this.onSendContentFailed.bind(this);
        this.sendComment     = this.sendComment.bind(this);
        if(this.props.name == "commentMusic")
            NetMusic.listMusicComment(this.onContentSuccess,this.onContentFailed,this.props.id);
        else
            NetDailyContent.getComments(this.onContentSuccess,this.onContentFailed,this.props.id);
        var defaultHeight = props.listHeight ? props.listHeight :  height;
        console.log('Default Height : ' + defaultHeight);
        this.state = {listHeight:defaultHeight, initHeight:defaultHeight, comments: null, comment_content:''};
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
        this._keyboardDidShow = this._keyboardDidShow.bind(this);

    }



    componentWillMount () {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow (e) {
        console.log('Keyboard show' + this.props.listHeight + ' initHeight: ' + this.state.initHeight);
        let openHeight= this.props.openHeight ? this.props.openHeight : height - e.endCoordinates.height-40 ;
        openHeight = height - e.endCoordinates.height-60;
        if(!this.props.hiddenTitle){
            openHeight -= 30;
        }
        this.setState({listHeight: openHeight});
    }

    _keyboardDidHide () {
        console.log('Keyboard hide ' + this.props.listHeight + ' initHeight: ' + this.state.initHeight);
        this.setState({listHeight: this.state.initHeight});
    }


    sendComment(){
        if(!Def.email ||Def.email == "")
            Alert.alert(
                "Đăng nhập",
                "Vui lòng đăng nhập để thêm được các chương trình/ bài hát ưa thích",
                [
                { text: "Đồng ý", onPress: () => {
                    return;
                } }
                ],
                { cancelable: false }
            );
        if(!Def.email ||Def.email == ""){
            return;
        }

        if(this.state.comment_content.trim().length > 3){
            this.setState({comment_content: ''})
            if(this.props.name == "commentMusic"){

                NetMusic.sendMusicComment(this.onSendContentSuccess,this.onSendContentFailed,this.props.id,this.state.comment_content);
                NetMusic.listMusicComment(this.onContentSuccess,this.onContentFailed,this.props.id);
            }else{
                NetDailyContent.sendComment(this.onSendContentSuccess,this.onSendContentFailed,this.props.id,this.state.comment_content);
                NetDailyContent.getComments(this.onContentSuccess,this.onContentFailed,this.props.id);

            }
        }else{
            alert("Vui lòng nhập bình luận có lớn hơn 3 ký tự");
        }
    }

    render(){
        const renderItem = ({ item }) => (
            <CommentItemrenderer item={item} />
        );



        return (
                <View style={styles.commentView}>
                    {
                        this.props.hiddenTitle ?
                            <View/>
                                :
                        <View style={styles.titleGroup}>
                            <Text style={styles.titleText}>
                                Bình luận
                            </Text>
                        </View>


                    }

                    <FlatList
                        // style={{height : this.state.listHeight ? this.state.listHeight -80 : 250 , marginBottom : 5}}
                        // style={{flex:1}}
                        style={{minHeight:this.props.hiddenTitle ? this.state.listHeight -70 : this.state.listHeight -100}}
                        data={this.state.comments}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        keyboardShouldPersistTaps='always'
                        // ListHeaderComponent={this.props.header}
                        // ListFooterComponent={footer}
                        />

                    <View style={styles.footer}>
                        <TextInput
                            value={this.state.comment_content}
                            style={styles.commentInput}
                            onChangeText={(value) => this.setState({comment_content: value})}
                        />
                        <TouchableOpacity style={styles.commentBtn} onPress={this.sendComment}>
                            <Text style={{color: '#fff', fontSize : Style.TITLE_SIZE, fontWeight : 'bold' }}>
                                Gửi
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                )
    }
}

const styles = StyleSheet.create({

    commentView: {
        // marginHorizontal: 10,
        // backgroundColor : 'red',
        flex : 1
    }
    ,
    titleGroup : {
        justifyContent : 'center'
    },
    titleText: {
        paddingLeft:15,
        fontSize: Style.TITLE_SIZE,
        color: Style.DEFAUT_RED_COLOR,
        fontWeight: 'bold',
    }
    ,


    footer : {
        height : 50,
        marginHorizontal : 10,
        flexDirection : 'row',
        paddingLeft: 2,
        // position:'absolute',
        // bottom:0,
        // zIndex :10

    },
    commentInput : { height: 40, paddingHorizontal : 5 , borderColor: 'gray',  borderWidth: 1, width: width * 0.72 ,  borderRadius : 8 },
    commentBtn : {height: 40, marginLeft: 10,width : 0.2 * width, backgroundColor : Style.DEFAUT_RED_COLOR, borderRadius : 8, justifyContent:'center', alignItems: 'center'}


});

export default CommentComponent;
