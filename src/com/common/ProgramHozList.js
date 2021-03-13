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
const PROGRAM_IMAGE_WIDTH = (width - 15) /2.5;
const PROGRAM_IMAGE_HEIGHT = (width - 15) /2.5;

const CATE_IMAGE_WIDTH = width * 0.7;
const CATE_IMAGE_HEIGHT = width * 0.6;



class ProgramHozList extends React.Component {
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
        this.props.navigation.navigate(this.props.group,{name: this.props.name,title: this.props.title ,data: this.props.data} );
        // this.props.clickHandle(this.props.group, this.props.name, 'test title' );
    }

    itemClick(item){
        console.log("itemClick(item))))))))))))))))))))))))))))))))))))))))))))))))");

        ////console.log(item);
        //console.log(this.props.data);

        let stack = this.props.stack ? this.props.stack :false;
        let screen = this.props.screen ? this.props.screen :'player';
        if(stack){
            console.log("itemClick(item)STACKKKKKKKKKKKKKKKKKKKK");
            ////console.log(item);
            //console.log(this.props.data);
            console.log(`${stack}, {screen:${screen}, params: { item: ${item}, data : this.props.data }`);
            this.props.navigation.navigate(stack, {screen:screen, params: { item: item, data : this.props.data }});
        } else {
            console.log("itemClick(item)NOT STACKKKKKKKKKKKKKKKKKKKK");
            console.log(`this.props.navigation.navigate(${screen}, { item: item, data : this.props.data })`);
            this.props.navigation.navigate(screen, { item: item, data : this.props.data });
        }

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
                    <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'space-between' , flex : 1}}
                                      onPress={this.sectionClick}
                    >
                     {/*{this.props.programType == 'music' ? <MusicWishlistIcon style={styles.icon}/>: (this.props.group == "Favorite" ? <WishlistIcon style={styles.icon}/>  : <LogoIconSmall style={styles.icon}/> )}*/}


                    <View style={styles.titleView} onPress={this.sectionClick} >
                        <Text style={styles.titleStyle}>{this.props.title}</Text>
                        {/*<IconArrow  style={iconStyleHome}  />*/}
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={titleView} onPress={this.sectionClick} >
                        <Text style={{fontSize : Style.NORMAL_SIZE ,marginRight : 10 , color : Style.DEFAUT_RED_COLOR , borderWidth : 1 ,padding : 2, paddingHorizontal : 5,  borderRadius: 5, borderColor : Style.DEFAUT_RED_COLOR}}>{"Xem tất cả"}</Text>

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
          paddingBottom : 10,
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
        //   backgroundColor : 'red',
        //   width : width * 0.9,

        marginRight : 5,
      },
      titleView: {
        paddingVertical : 10,
        flexDirection : 'row',
        alignItems: 'center',
        marginLeft : 5,

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

export default ProgramHozList;
