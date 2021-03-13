import {PureComponent} from "react";
import {View} from "react-native";
 
import DefaultProgramImage from "../../../assets/icon/logo-vov.svg";
import React from "react";

class FavoriteProgramItemrenderer extends PureComponent{
    constructor(props) {
        super(props);
    }
    render(){
        const model = this.props.item;
        return (

            <View style={styles.item} >
                {this.props.item.imagePath ? <Image
                    style={styles.tinyLogo}
                    source={{uri:this.props.item.imagePath}}
                />   : <DefaultProgramImage style={styles.itemImage}/>
                
      }
            </View>
        )
    }
}

export default FavoriteProgramItemrenderer;
