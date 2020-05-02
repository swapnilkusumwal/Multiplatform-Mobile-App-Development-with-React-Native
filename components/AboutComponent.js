import React, { Component } from 'react';
import {View,FlatList,Text,ScrollView} from 'react-native';
import {ListItem,Card} from 'react-native-elements';
import { DISHES } from '../shared/dishes' 
import { LEADERS } from '../shared/leaders';

const state={
    leaders: LEADERS
};
function History (){
        const renderAbout=({item,index}) => {
            return(
                <ListItem
                key={index}
                title={item.name}
                subtitle={item.description}
                hideChevron={true}
                leftAvatar={{source:require('./images/alberto.png')}}
                />
            );
        }
    
        return(
            <ScrollView>
                <Card title="Our History" style={{margin:10}}>
                    <Card body>
                        <Text style={{margin:10}}>Started in 2010, Ristorante con Fusion quickly
                            established itself as a culinary icon par 
                            excellence in Hong Kong. With its unique brand of
                            world fusion cuisine that can be found nowhere 
                            else, it enjoys patronage from the A-list 
                            clientele in Hong Kong.  Featuring four of the best
                            three-star Michelin chefs in the world, you never 
                            know what will arrive on your plate the next time 
                            you visit us.
                        </Text>
                        <Text style={{margin:10}}>The restaurant traces its humble beginnings to 
                            The Frying Pan, a successful chain started by our
                            CEO, Mr. Peter Pan, that featured for the first 
                            time the world's best cuisines in a pan.
                        </Text>
                    </Card>
                </Card>
                
                
                    <Card title="Corporate Leadership">
                        <Card body>
                            <FlatList
                            data={state.leaders}
                            renderItem={renderAbout}
                            keyExtractor={item=>item.id.toString()}/>
                        </Card>
                    </Card>
            </ScrollView>
            
        );
    
}


export default History;