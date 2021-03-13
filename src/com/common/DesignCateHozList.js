import React, {PureComponent} from 'react'
import {Text, View , FlatList , Button , StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import IconArrow from '../../../assets/icon/icon_arrow.svg'
import LogoIconSmall from '../../../assets/icon/icon-vov-small.svg'
import WishlistIcon from '../../../assets/icon/icon-wishlist.svg'
import MusicWishlistIcon from '../../../assets/icon/icon-catalog-music.svg'

import DefaultProgramImage from '../../../assets/icon/logo-vov.svg'
import CollectionItemrenderer from '../item-render/CollectionItemrenderer'
import DesignItemrenderer from '../item-render/DesignItemrenderer'
import CategoryItemrenderer from '../item-render/CategoryItemrenderer'

import Style from "../../../src/def/Style";

const {width, height} = Dimensions.get('window');
const PROGRAM_IMAGE_WIDTH = (width - 15) /1.5;
const PROGRAM_IMAGE_HEIGHT = (width - 15) /2.5;

const CATE_IMAGE_WIDTH = width * 0.7;
const CATE_IMAGE_HEIGHT = width * 0.6;



class DesignCateHozList extends React.Component {
    constructor(props){
        super(props);
        this.sectionClick = this.sectionClick.bind(this);
      this.itemClick = this.itemClick.bind(this);
      this.refresh = this.refresh.bind(this);
    }

    refresh()
    {
        this.props.refresh();
    }


    sectionClick(){
        console.log(this.props.group + ' - ' + this.props.name);
        //console.warn(this.props.data );
        this.props.navigation.navigate(this.props.group,{name: this.props.name, data: this.props.data} );
        // this.props.clickHandle(this.props.group, this.props.name, 'test title' );
    }

    itemClick(item){
        console.log("itemClick(item)))))))))))))))))))))))))))))))))))))))))))))))) : " + JSON.stringify(item));
        let stack = this.props.stack ? this.props.stack :false;
        console.log("Screen" + this.props.screen);
        let screen = this.props.screen ? this.props.screen :'design-list';
        if(stack){
            console.log(`${stack}, {screen:${screen}, params: { item: ${item}, data : this.props.data }`);
            this.props.navigation.navigate(stack, {screen:screen, params: { item: item }});
        } else {
            console.log(`this.props.navigation.navigate(${screen}, { item: item, data : this.props.data })`);
            this.props.navigation.navigate(screen, { item: item});
        }
        // this.props.refresh();
    }


    render() {
        const {iconStyleHome, titleStyle,titleView, } = styles;
        const favorite = this.props.favorite;
        const minusSize = this.props.programType == 'music' ? 12 : 5;
        const type = this.props.type;
        const renderItem = ({ item }) => (
               <View>
                   {type == 'cate' ?
                       <CategoryItemrenderer
                           click={this.itemClick}
                           refresh={this.refresh}
                           item={item}
                           favorite={favorite}
                           styleImage={{width: CATE_IMAGE_WIDTH - minusSize, height: CATE_IMAGE_HEIGHT - minusSize}}
                           type={this.props.type}
                       />
                       : type == 'design' ?
                    <DesignItemrenderer
                       click={this.itemClick}
                       refresh={this.refresh}
                       item={item}
                       favorite={favorite}
                       styleImage={{width: PROGRAM_IMAGE_WIDTH - minusSize, height: PROGRAM_IMAGE_HEIGHT - minusSize}}
                       type={this.props.type}
                   /> :

                   <CollectionItemrenderer
                           click={this.itemClick}
                           refresh={this.refresh}
                           item={item}
                           favorite={favorite}
                           styleImage={{width: PROGRAM_IMAGE_WIDTH - minusSize, height: PROGRAM_IMAGE_HEIGHT - minusSize}}
                           type={this.props.programType}
                   />

               }
                </View>


        );
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'space-between' , alignItems: 'flex-start'}}
                                      onPress={this.sectionClick}
                    >

                    <View style={titleView} onPress={this.sectionClick} >
                        <Text style={titleStyle}>{this.props.title}</Text>
                    </View>
                    </TouchableOpacity>
                </View>


                {   this.props.data ?
                    <FlatList
                        // style={{height: this.props.programType == 'music' ? PROGRAM_IMAGE_HEIGHT + 20 : PROGRAM_IMAGE_HEIGHT}}
                        horizontal={true}
                        data={this.props.data}
                        renderItem={renderItem}
                        keyExtractor={(item,index) => "hoz" + index}
                        showsHorizontalScrollIndicator={false}


                    /> : <View><Text style={styles.nodataText}>{"Bạn chưa thêm " + this.props.title.toLowerCase() + "."}</Text></View>
                }
            </View>
        )
    }

}

const styles = StyleSheet.create ({
      container: {
        // marginTop : 25,
          backgroundColor: '#ffffff',
          paddingBottom : 15,
      },
      item: {
        backgroundColor: '#ffffff',
        // width: (width - 60) / 2.5,
        // height : (width - 60 ) / 2.5,
        borderRadius: 5,
        justifyContent : 'center',
        marginRight: 8,
      },
    icon: {
      width : 20,
      height : 20
    },
      titleStyle: {
        fontSize : Style.BIG_SIZE,
        // color: Style.GREY_TEXT_COLOR,
        // fontWeight: 'bold',
        marginRight : 10
      },
      titleView: {
        paddingTop : 10,
        paddingBottom : 3,
        flexDirection : 'row',
        // alignItems: 'center',
        marginLeft : 0,

      }
      ,
      iconStyleHome: {
          width: 15, height: 15
      },
      nodataText: {
          fontSize : Style.MIDLE_SIZE,
          color: '#b3b3b3',
          marginLeft : 25
      }


})

export default DesignCateHozList;
