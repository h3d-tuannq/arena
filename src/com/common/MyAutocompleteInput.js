import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet , FlatList} from 'react-native';


class MyAutoCompleteInput extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          data: props.data,
          query: '',
        };
    }
    render(){
        return (
            <View style={this.props.containerStyle ? this.props.containerStyle : {flex:1} }>
                {
                    this.props.renderTextInput()
                }
                <FlatList
                    data={this.props.data}
                    renderItem={this.props.renderItem}
                    keyExtractor={ this.props.keyExtractor ? this.props.keyExtractor : item => item.id}
                    style={this.props.listStyle ? this.props.listStyle : {}}
                    numColumns={this.props.numColumns ? this.props.numColumns : 1}
                />

            </View>

        );
    }
}

export default MyAutoCompleteInput;
