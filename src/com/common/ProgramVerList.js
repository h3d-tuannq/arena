import React from 'react'
import {View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions} from 'react-native';

import Style from "../../../src/def/Style";
import Def from "../../../src/def/Def";
import FlatItemrenderer from "../item-render/FlatItemrenderer";
import ProductItemrenderer from "../item-render/ProductItemrenderer";
import RequestRepairRenderer from "../item-render/RequestRepairRenderer";

const {width, height} = Dimensions.get('window');

const PROGRAM_IMAGE_WIDTH = (width - 20) ;
const PROGRAM_IMAGE_HEIGHT = PROGRAM_IMAGE_WIDTH;



class ProgramVerList extends React.Component{
    constructor(props){
        super(props);
        this.sectionClick= this.sectionClick.bind(this);
        this.itemClick = this.itemClick.bind(this);
    }

    sectionClick(){
       console.log('section click');
        // this.props.navigation.navigate(this.props.group,{name: this.props.name});
    }

    itemClick(item){
        let stack = this.props.stack ? this.props.stack :false;
        let screen = this.props.screen ? this.props.screen :'flat-detail';
        console.log("Stack : " + stack);
        console.log("Screen : " + screen);


        if(stack){
            this.props.navigation.navigate(stack, {screen:screen, params: { item: item }});
        } else {
            this.props.navigation.navigate(screen, { item: item });
        }
    }



    render() {
        const {iconStyleHome, titleStyle,titleView, } = styles;
        const renderItem = ({item}) => {
            return (
                <View style={{paddingLeft : 10}}>
                    {
                        this.props.type == 'request-repair'?
                            <RequestRepairRenderer
                                item ={item} click={this.itemClick} canPlayBack={this.props.canPlayBack}
                                styleImage={{width: PROGRAM_IMAGE_WIDTH / 3, height: PROGRAM_IMAGE_WIDTH / 3}}
                                type={this.props.type}
                            /> :
                        this.props.type == 'flat'?
                        <FlatItemrenderer
                        item ={item} click={this.itemClick} canPlayBack={this.props.canPlayBack}
                        styleImage={{width: PROGRAM_IMAGE_WIDTH, height: PROGRAM_IMAGE_HEIGHT}}
                        type={this.props.type}
                        />
                        :
                        <ProductItemrenderer
                            item ={item} click={this.itemClick}
                            styleImage={{width: PROGRAM_IMAGE_WIDTH /2, height: PROGRAM_IMAGE_HEIGHT}}
                            type={this.props.type}
                        />
                    }

                </View>
            )
        };





        return (
            <View style={styles.container}>
                <FlatList
                    style={[this.props.styleList,{ marginBottom :  0 , backgroundColor:'#fff'}]}
                    data={this.props.data ? this.props.data : [] }
                    renderItem={this.props.renderFunction ? this.props.renderFunction :renderItem}
                    keyExtractor={(item,index) => {
                        if(this.props.keyExtractorFunc){
                           return this.props.keyExtractorFunc(item, index);
                        }
                        return ((item.pif ? item.pif.id : item.id) + "" + index.toString() + ( item.selectValue ? item.selectValue + "" : "false"));
                    } }

                    showsHorizontalScrollIndicator={false}
                    numColumns={this.props.numColumns ?  this.props.numColumns : 1}
                    ListHeaderComponent={this.props.header}
                    ListFooterComponent={this.props.footer ? this.props.footer : null}
                    showsVerticalScrollIndicator ={false}
                    ItemSeparatorComponent={this.props.itemSeparatorComponent}

                    onEndReached={() => {this.props.endListReach ? this.props.endListReach() : console.log('list ended');}}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create ({
    container: {
        // marginTop : 5,
        backgroundColor : '#fff',
        alignItems:'center'
    },
    titleStyle: {
        fontSize: Style.TITLE_SIZE,
        color: Style.DEFAUT_RED_COLOR,
        fontWeight: 'bold',
        marginRight : 10
    },
    titleView: {
        paddingVertical : 10,
        flexDirection : 'row',
        alignItems: 'center'
    }
    ,
    iconStyleHome: {
        width: 15, height: 15
    },
    programList: {
        marginBottom : 120,

    }
})

export default ProgramVerList;
