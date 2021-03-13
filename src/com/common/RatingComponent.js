import React from 'react'
import {View, TouchableOpacity, StyleSheet , Text } from 'react-native'

import StarIconSelected from '../../../assets/icon/icon-rate_red.svg';
import StarIcon from '../../../assets/icon/icon-rate.svg';
import Style from "../../../src/def/Style";

class RatingComponent extends React.Component{


    onRatingSuccess(data){
        console.log("onRatingSuccess");
        //console.log(data);
        NetDailyContent.getRating(this.onGetRatingSuccess,this.onGetRatingFailed,this.state.content_id);

    }

    onRatingFailed(data){
        console.log("onRatingFailed");
        //console.log(data);

    }

    onGetRatingSuccess(data){
        console.log("onGetRatingSuccess");
        //console.log(data);


        if(data['data']['avg'] && data['data']['count'])
        this.setState({
            rating:data['data']['avg'],
            rating_count:data['data']['count']
        },
            console.log(this.state)
        );
    }

    onGetRatingFailed(data){
        console.log("onGetRatingFailed");

    }

    constructor(props){
        super(props);
        console.log(props);
        this.onRatingSuccess     = this.onRatingSuccess.bind(this);
        this.onRatingFailed     = this.onRatingFailed.bind(this);

        this.onGetRatingSuccess     = this.onGetRatingSuccess.bind(this);
        this.onGetRatingFailed     = this.onGetRatingFailed.bind(this);
        this.sendRating     = this.sendRating.bind(this);
        this.getRating     = this.getRating.bind(this);
        this.state = {
            rating:0 ,
            rating_count:0 ,
            user_rating:0 ,
            content_id:this.props.id,
            answered:false

        };




    }
    componentDidMount() {
        console.log("componentDidMount");
        this.getRating();
    }
    getRating(){
        NetDailyContent.getRating(this.onGetRatingSuccess,this.onGetRatingFailed,this.state.content_id)
    }
    sendRating(user_rating){
        if(!this.state.answered)
            this.setState({
                user_rating: user_rating,
                answered:true
            }, () => {
                NetDailyContent.sendRating(this.onRatingSuccess,this.onRatingFailed,this.state.content_id,this.state.user_rating);
            });

    }

    render(){
        console.log(this.state);
        return (
            <View style={styles.rating}>
                <View style={styles.titleGroup}>
                    <Text style={styles.titleText}>
                        Rating
                    </Text>
                    <Text style={styles.pointText}>
                        {this.state.rating} ({this.state.rating_count} đánh giá)
                    </Text>
                </View>

                <View style={styles.groupBtn} onPress={()=>this.sendRating.bind(this,1)}>
                    <TouchableOpacity style={styles.starBtn}>
                        {this.state.user_rating >= 1?<StarIconSelected style={styles.starIcon} />:<StarIcon style={styles.starIcon} />}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.starBtn} onPress={this.sendRating.bind(this,2)}>
                        {this.state.user_rating >= 2?<StarIconSelected style={styles.starIcon} />:<StarIcon style={styles.starIcon} />}
                    </TouchableOpacity >

                    <TouchableOpacity style={styles.starBtn} onPress={this.sendRating.bind(this,3)}>
                        {this.state.user_rating >= 3?<StarIconSelected style={styles.starIcon} />:<StarIcon style={styles.starIcon} />}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.starBtn} onPress={this.sendRating.bind(this,4)}>
                        {this.state.user_rating >= 4?<StarIconSelected style={styles.starIcon} />:<StarIcon style={styles.starIcon} />}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.starBtn} onPress={this.sendRating.bind(this,5)}>
                        {this.state.user_rating >= 5?<StarIconSelected style={styles.starIcon} />:<StarIcon style={styles.starIcon} />}
                    </TouchableOpacity>

                </View>
            </View>)
    }
}

const styles = StyleSheet.create({
    rating: {
        height : 85,
        paddingTop:10,
        marginHorizontal: 10,
        paddingLeft : 5,

    },
    groupBtn: {
        flexDirection : 'row',
        // paddingHorizontal : 10,
        marginTop : 20,

    },

    titleGroup : {
        flexDirection: 'row',
        alignItems : 'center'
    },

    starBtn: {
        width: 35,
        height: 35,
        marginRight : 8,

    },

    starIcon: {
        width: 30,
        height: 30,


    },
    titleText: {
        fontSize: Style.TITLE_SIZE,
        color: Style.DEFAUT_RED_COLOR,
        fontWeight: 'bold',
    }
    ,
    pointText: {
        fontSize : Style.TITLE_SIZE,
        color: '#b3b3b3',
        marginLeft : 20,
    }


});

export default RatingComponent;
