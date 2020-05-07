import React, { Component } from 'react';
import { Text, View,FlatList ,StyleSheet,Button,Modal,Alert,PanResponder, Share} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Card,Icon ,Input} from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import {postFavorite,postComment,addComment} from '../redux/ActionCreators';
import { Rating} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites,
    }
};

const mapDispatchToProps = dispatch=>({
    postFavorite:(dishId)=>dispatch(postFavorite(dishId)),
    postComment:(dishId,rating,comment,author)=>dispatch(postComment(dishId,rating,comment,author)),
    addComment:(dishId,rating,comment,author)=>dispatch(addComment(dishId,rating,comment,author))
});

function RenderDish(props) {

    const dish = props.dish;
    
    handleViewRef=ref=>this.view=ref;

    const recognizeDrag=({moveX,moveY,dx,dy})=>{
        if(dx < -100)
            return true;
        return false;
    };
    const recognizeLeftDrag=({moveX,moveY,dx,dy})=>{
        if(dx > 100)
            return true;
        return false;
    };
    const panResponder=PanResponder.create({
        onStartShouldSetPanResponder:(e,gestureState)=>{
            return true;
        },
        onPanResponderGrant:()=>{this.view.rubberBand(1000)
            .then(endState=>console.log(endState.finished? 'finished': 'cancelled'));
        },
        onPanResponderEnd:(e,gestureState)=>{
            if(recognizeDrag(gestureState))
                Alert.alert(
                    'Add to Favorites?',
                    'Are you sure you wish to add '+dish.name+' to your favorites?',
                    [
                        {
                            text:'Cancel',
                            onPress: ()=>console.log("Cancel pressed"),
                            style: 'cancel'
                        },
                        {
                            text: 'Ok',
                            onPress: ()=>props.favorite ? console.log('Already Favourite') : props.onPress()
                        }
                    ],
                    {cancelable:false}
                )
            else if(recognizeLeftDrag(gestureState))
                props.onSlide();
            return true;
        }
    });

    const shareDish=(title,message,url)=>{
        Share.share({
            title:title,
            message:title+': '+message+' '+url,
            url:url
        },
        {
            dialogTitle:'Share '+title
        })
    };

    if (dish != null) {
        return(
            <Animatable.View animation='fadeInDown' duration ={2000} delay={1000}
                {...panResponder.panHandlers}
                ref={this.handleViewRef}>
                <Card
                featuredTitle={dish.name}
                image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={{flexDirection:'row',justifyContent:'center'}}>
                        <Icon
                            raised
                            reverse
                            name={props.favorite?'heart':'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already Favourite') : props.onPress()}
                        />
                        <Icon
                            raised
                            reverse
                            name='pencil'
                            type='font-awesome'
                            color='#512AD8'
                            onPress={()=>props.onSelect()}
                        />
                        <Icon
                            raised
                            reverse
                            name='share'
                            type='font-awesome'
                            color='#51D2A8'
                            onPress={()=>shareDish(dish.name,dish.description,baseUrl+dish.image)}
                        />
                    </View> 
                </Card>
            </Animatable.View>
        );
    }
    else {
        return(<View></View>);
    }
}
function RenderComments(props){
    const comments=props.comments;

    const renderCommentItem =({item,index})=>{
        return(
            <View key={index} style={{margin:10}}>
                <Text style={{fontSize: 14}}>
                    {item.comment}
                </Text>
                <Text style={{fontSize:12}}>
                    {item.rating} Stars
                </Text>
                <Text style={{fontSize:12}}>
                    {'-- '+item.author+', '+item.date}
                </Text>
            </View>
        )
    }

    return (
        <Animatable.View animation='fadeInUp' duration ={2000} delay={1000}>
        
        <Card title="Comments">
            <FlatList
                data={comments}
                renderItem={renderCommentItem}
                keyExtractor={item=>item.id.toString()}
            />
        </Card>
        </Animatable.View>
    )
}
class Dishdetail extends Component {

    constructor(props){
        super(props);
        this.state={
            showModal:false,
            rating:0,
            author:'',
            comment:''
        }
    }
    
    markFavorite(dishId){
        this.props.postFavorite(dishId);
    }
    resetModal(){
        this.setState({
            showModal:false,
            rating:0,
            author:'',
            comment:''
        })
    }
    toggleModal() {
        this.setState({showModal: !this.state.showModal})
    }
    submitComment(dishId) {
        console.log(JSON.stringify(this.state));
        this.toggleModal();
        this.resetModal();
        this.props.postComment(dishId, this.state.rating, this.state.comment, this.state.author);
    }
    render() {
        const dishId = this.props.route.params.dishId;
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    onSelect={()=>this.toggleModal()}
                    onSlide={()=>this.toggleModal()}/>
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType={"fade"} transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={()=>this.toggleModal()}>
                        <View style={styles.modal}>
                            <Text style = {styles.modalTitle}>Your Feedback</Text>
                            <View>
                                <Rating showRating
                                    ratingCount={5}
                                    type = "star"
                                    startingValue = {0}
                                    imageSize = {40}
                                    onFinishRating = {(rating) => this.setState({rating: rating})}
                                    />
                            </View>
                            <View>
                                <Input
                                    placeholder='Author'
                                    leftIcon={
                                        <Icon
                                        name='user-o'
                                        type='font-awesome'
                                        size={24}
                                        color='black'
                                        />
                                    }
                                    onChangeText={(value)=>this.setState({author:value})}
                                    />
                            </View>
                            <View>
                                <Input
                                    placeholder='Comment'
                                    leftIcon={
                                    <Icon
                                    name='comment-o'
                                    type='font-awesome'
                                    size={24}
                                    color='black'
                                    />
                                }
                                onChangeText={(value)=>this.setState({comment:value})}
                                />
                            </View>
                            <View>
                                <Button
                                    color="#512DA8"
                                    title="Submit" 
                                    onPress={()=>this.submitComment(dishId)}
                                />
                            </View>
                            <View> 
                                <Button onPress={()=>this.toggleModal()}
                                    color="#512DA8"
                                    title="Close" 
                                />    
                            </View>
                        </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles=StyleSheet.create({
    formRow:{
        alignItems : 'center',
        justifyContent : 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20,
    },
    formLabel:{
        fontSize:18,
        flex:2
    },
    formItem:{
        flex:1
    },
    modal: {
        justifyContent: 'center',
        margin: 20,
        padding:20
     },
     modalTitle: {
         fontSize: 24,
         fontWeight: 'bold',
         backgroundColor: '#512DA8',
         textAlign: 'center',
         color: 'white',
         marginBottom: 20
     },
     modalText: {
         fontSize: 18,
         margin: 10
     }
});
export default connect(mapStateToProps,mapDispatchToProps)(Dishdetail);