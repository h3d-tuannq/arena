import React from 'react'
import {Text, View, StyleSheet, Dimensions, TouchableOpacity, TextInput} from 'react-native'
import Autocomplete from 'react-native-autocomplete-input'
import Style from "../../def/Style";
const {width,  height} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome5';

import LocationIcon from '../../../assets/icons/Location.svg';

const initData = [
    {"id":1,"code":"ARENA","name":"Arena Cam ranh"},
    {"id":2,"code":"TTCR","name":"Arena Cam ranh2"},
    ];

class AutocompleteModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data :this.props.data && this.props.data.length > 0 ? this.props.data : initData,
            query : ""
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
            <View style={{height: height, paddingBottom :50}}>
                <View style={{justifyContent: 'center', alignItems : 'center', paddingVertical: 10}}>
                    <Text style={Style.text_styles.titleTextNotBold}>
                        {this.props.addressTitle}
                    </Text>
                </View>
                <Autocomplete
                    data={filterData}
                    defaultValue={this.state.query}
                    onChangeText={text => this.setState({ query : text })}
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
                        <View style={{borderWidth : 0,borderBottomWidth:1 ,borderColor:Style.GREY_TEXT_COLOR, flexDirection : 'row',alignItems : 'center', marginHorizontal : 10, marginBottom : 10}}>
                            <Icon style={styles.searchIcon} name="search" size={24} color={Style.GREY_TEXT_COLOR}/>
                            <TextInput onChangeText={text => this.setState({ query : text })} placeholder={"Nhập " + this.props.title} style={[styles.textInput, {marginTop:10}]}>
                            </TextInput>
                        </View>
                    )
                    }
                    keyboardShouldPersistTaps='always'
                    inputContainerStyle={{borderWidth:0}}
                    listStyle={{borderWidth:0}}
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

    textInput : {height: 40, backgroundColor : '#fff', borderColor: "#9e9e9e", borderWidth : 0, borderBottomWidth:0 ,color:'black', fontSize : Style.MIDLE_SIZE, borderRadius: 5, paddingHorizontal: 10  },

});

export default AutocompleteModal;
