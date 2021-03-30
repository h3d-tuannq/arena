import React from 'react'
import {Text, View, Button, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Image, FlatList} from 'react-native'
import Def from '../../def/Def'
const {width, height} = Dimensions.get('window');
import Style from '../../def/Style';
import ProgramVerList from '../../com/common/ProgramVerList';
import FlatController from  '../../controller/FlatController';
const PROGRAM_IMAGE_WIDTH = (width - 30-8) ;
const PROGRAM_IMAGE_HEIGHT = (width - 30-8) ;
import AsyncStorage  from '@react-native-async-storage/async-storage'

class FlatListScreen extends React.Component {

    constructor(props){
        super(props);
        this.onGetFlatSuccess     = this.onGetFlatSuccess.bind(this);
        this.onGetFlatFalse     = this.onGetFlatFalse.bind(this);
        this.formatText    = this.formatText.bind(this);
        this.refresh     = this.refresh.bind(this);
        Def.mainNavigate = this.props.navigation;
        Def.refeshFlatList = this.refresh.bind(this);
        let title = "Căn hộ bàn giao";

        this.state = {
            data: Def.flat_data,
            title: title,
            stateCount: 0.0,
        };

    }

    refresh()
    {
        this.setState({ stateCount: Math.random() , data : Def.flat_data });
    }

    onGetFlatSuccess(data){
        Def.flat_data = data["data"];
        let title = "Danh sách thiết kế";
        design_list = Def.flat_data;
        AsyncStorage.setItem('flat_data', JSON.stringify(Def.flat_data));

        this.setState({data:design_list});
    }


    onGetFlatFalse(data){
        console.log("false data : " + data);
    }

    formatText(text){
        let rs = text;
        if(text && text.length > 10){
            rs = text.substring(0, 20) ;
        }
        return rs;
    }


    shouldComponentUpdate(){
        console.log("shouldComponentUpdate list");
        // this.setState({ configMenu: Def.config_news_menu});
        // console.log('SortData ddd:' + JSON.stringify(this.props.route));
        return true;
    }

    componentDidMount() {
        console.log("Component Did Mount list");
        if(Def.refresh_flat_data || Def.flat_data.length == 0){
            if (Def.flat_data.length > 0 && Def.flat_data) {
                this.setState({data:Def.flat_data});
            } else {
                FlatController.getFlat(this.onGetFlatSuccess, this.onGetDesignFalse);
            }
            Def.refresh_flat_data = false;
        }
    }
    render() {
        const {navigation} = this.props;
        const configMenu = Def.config_design_menu;
        Def.order_number = 20;
        const ListHeader = () => (
            <View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between' , alignItems: 'flex-start'}}>
                    <View style={{marginLeft:15, paddingBottom:8}}>
                        <Text style={styles.titleStyle}>{this.state.data.length + " Căn hộ"}</Text>
                    </View>
                </View>
            </View>
        );


        return (
            <View style={{flex:1, paddingTop:5}}>
                <ProgramVerList
                    data={this.state.data}
                    navigation={this.props.navigation}
                    header={ListHeader}
                    type={'flat'}
                    numColumns={1}
                    screen={'flat-detail'}
                    itemSeparatorComponent={

                        (({ highlighted }) => (
                            <View
                                style={[
                                    {backgroundColor:Style.GREY_TEXT_COLOR, height:1, width:width -25, marginHorizontal: 10},
                                    highlighted && { marginHorizontal: 10 }
                                ]}
                            />
                        ))
                    }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        paddingLeft: 15,
        // justifyContent: 'flex-start',
        // marginVertical : 5,
        marginBottom : 125,
        backgroundColor: '#fff'
    },
    slider: {
        justifyContent: 'center',
        paddingTop: 5,
        padding: 8,
        height: 120,
        borderRadius: 5,
        backgroundColor: "#e6e6e6",
        marginRight : 15
    },
    cardStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width-20,
        height: width/2,

    },
    programListStyle : {

    },
    itemImage: {
        width: PROGRAM_IMAGE_WIDTH -5,
        height : PROGRAM_IMAGE_HEIGHT -5,
        borderRadius: 5,
    },
    titleStyle : {
        fontSize : Style.BIG_SIZE,
        color: Style.GREY_TEXT_COLOR,
    }
});

export default FlatListScreen;
