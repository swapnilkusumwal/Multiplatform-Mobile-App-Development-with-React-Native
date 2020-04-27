import React, { Component } from 'react';
import { Text, View } from 'react-native';

class Home extends Component{
    
    static navigationOptions = {
        title: 'Menu'
    };

    render(){
        return(
            <View>
                <Text>Home Component</Text>
            </View>
        );
    }
}

export default Home;