import React from 'react'
import {Text, View, StyleSheet, Dimensions, TouchableOpacity, TextInput} from 'react-native'
import Autocomplete from 'react-native-autocomplete-input';
import MyAutocompleteInput from './MyAutocompleteInput';
import Style from "../../def/Style";
const {width,  height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome5';
import DownBackButton from  '../../../assets/icon/icon-down-black.svg';

import LocationIcon from '../../../assets/icons/Location.svg';

const initData = [
    {"id":1,"code":"ARENA","name":"Arena Cam ranh"},
    {"id":2,"code":"TTCR","name":"Arena Cam ranh2"},
    ];

const BUILD_TYPE = 0;
const CUSTOMER_TYPE = 1;



class AutocompleteModal extends React.Component {
    constructor(props){
        super(props);
        let data = this.props.data && this.props.data.length > 0 ? (this.props.data) : initData;
        if(data[0].id != -1){
            let firstItem = {
                'id' : -1
            };
            firstItem[this.props.filterAttr] = "Bỏ chọn",
                data.unshift(firstItem);
        }

        this.state = {
            data :this.props.data && this.props.data.length > 0 ? (this.props.data) : initData,
            query : "",
            type: 0
        };
    }

    filterData = (query) => {
        const { data } = this.state;
        if (query === '' || query === null) {
            return data;
        }

        const regex = new RegExp(`${query.trim()}`, 'i');
        return data.filter(item => item[this.props.filterAttr].search(regex) >= 0);
    }

    item_click = (item) => {
        this.props.closeFunction(item);
    }


    render() {
        const filterData = this.filterData(this.state.query);
        return (
            <View style={{height: height, paddingBottom :50, marginTop: 10}}>
                <View style={{justifyContent: 'center', alignItems : 'center', paddingVertical: 10}}>
                    <Text style={Style.text_styles.titleTextNotBold}>
                        {this.props.title}
                    </Text>
                </View>

                <View
                    style={{
                        position: 'absolute',zIndex:50 ,right: 5,
                        top: 10,
                        backgroundColor: '#fff',}}>
                    <TouchableOpacity style={{
                        paddingLeft:0, paddingRight:10, flexDirection:'row', justifyContent : 'center', paddingVertical:10,
                        marginTop: 40,

                    }}
                                      onPress={()=> {
                                          console.log('Close Autocomple click');
                                          this.props.closeFunction();
                                      }}
                    >
                        <DownBackButton width={Style.BACK_ICON_SIZE -2} height={Style.BACK_ICON_SIZE -5}/>
                        {/*<Text>*/}
                        {/*    Back*/}
                        {/*</Text>*/}
                    </TouchableOpacity>

                </View>
                <MyAutocompleteInput
                    data={filterData}
                    keyExtractor={(item,index) => "hoz" + index}
                    renderItem={({ item, i }) => (
                        <TouchableOpacity style={styles.itemStyle} onPress={() => {
                            this.item_click(item)
                        }}>
                            <LocationIcon width={25} height={25} style={{padding:5}}/>
                            <Text style={{paddingHorizontal:10}} >{item[this.props.filterAttr] + ""}</Text>
                        </TouchableOpacity>
                    )}
                    renderTextInput={()=> (
                        <View style={{
                            borderWidth : 0,borderBottomWidth:1 ,borderColor:Style.GREY_TEXT_COLOR,

                            flexDirection : 'row',alignItems : 'center', marginHorizontal : 10, marginBottom : 10,
                            marginLeft : 15,
                        }}>
                            <Icon style={styles.searchIcon} name="search" size={20} color={Style.GREY_TEXT_COLOR}/>

                            <TextInput onChangeText={text => this.setState({ query : text })}
                                       placeholder={" " + this.props.title}
                                       placeholderTextColor="#000"
                                       style={[styles.textInput, {marginTop:10}]}>

                            </TextInput>

                        </View>
                    )
                    }

                    style={{alignItems: 'center'}}

                    listStyle={{borderWidth:0, paddingLeft: 15}}

                />

            </View>
        );
    }

}

const styles = StyleSheet.create({
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
    },
    itemStyle :{
        height : 40,
        flexDirection:'row',
        alignItems : 'center',

    },
    searchIcon : {
        // padding:5,
        marginTop :10,
        // backgroundColor: 'red',
    },

    textInput : {height: 35,  borderColor: "#9e9e9e", borderWidth : 0, borderBottomWidth:0 ,color:'black', fontSize : Style.MIDLE_SIZE, borderRadius: 5, paddingHorizontal: 5  },

});

export default AutocompleteModal;
