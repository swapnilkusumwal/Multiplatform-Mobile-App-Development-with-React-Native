import React, { Component } from 'react';
import { View, Platform,Image,StyleSheet ,ScrollView,Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator,DrawerItemList } from '@react-navigation/drawer';
import Home from './HomeComponent';
import Menu from './MenuComponent';
import Dishdetail from './DishdetailComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import {Icon} from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { connect } from 'react-redux';
import { fetchDishes, fetchComments, fetchPromos, fetchLeaders,postComment,addComment } from '../redux/ActionCreators';
import Reservation from './ReservationComponent';

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  }
}
const mapDispatchToProps = dispatch => ({
    addComment:(dishId, rating, comment, author) => dispatch(addComment(dishId, rating, comment, author)),
    postComment:(dishId, rating, comment, author) => dispatch(postComment(dishId, rating, comment, author)),
    fetchDishes: () => dispatch(fetchDishes()),
    fetchComments: () => dispatch(fetchComments()),
    fetchPromos: () => dispatch(fetchPromos()),
    fetchLeaders: () => dispatch(fetchLeaders())
  })
const CustomDrawerContentComponent=(props)=>{
    return(
    <ScrollView>
        <SafeAreaView style={styles.container}
            forceInset={{top:'always',horizontal:'never'}}>
                <View style={styles.drawerHeader}>
                    <View style={{flex:1}}>
                        <Image source={require('./images/logo.png')}
                            style={styles.drawerImage}/>
                    </View>
                    <View style={{flex:2}}>
                        <Text style={styles.drawerHeaderText}>
                            Ristorante Con Fusion
                        </Text>
                    </View>
                </View>
                <DrawerItemList {...props}/>
        </SafeAreaView>
    </ScrollView>
    );
}

const MenuNavigator = createStackNavigator();

function MenuNavigatorScreen() {
    return(
        <MenuNavigator.Navigator
            initialRouteName='Menu'
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#512DA8"
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    color: "#fff"            
                }
            }}
        >
            <MenuNavigator.Screen
                name="Menu"
                component={Menu}
                options={
                    ({navigation})=>({
                        headerLeft: ()=>(
                            <Icon
                                name='menu'
                                size={24}
                                color='white'
                                onPress={()=>navigation.toggleDrawer()}
                            />
                        )
                    })
                }
            />
            <MenuNavigator.Screen
                name="Dishdetail"
                component={Dishdetail}
                
            />            
        </MenuNavigator.Navigator>
    );
}

const HomeNavigator=createStackNavigator();

function HomeNavigatorScreen() {
    return(
        <HomeNavigator.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#512DA8"
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    color: "#fff"            
                }
            }}
        >
            <MenuNavigator.Screen
                name="Home"
                component={Home}
                options={
                    ({navigation})=>({
                        headerLeft: ()=>(
                            <Icon
                                name='menu'
                                size={24}
                                color='white'
                                onPress={()=>navigation.toggleDrawer()}
                            />
                        )
                    })
                }
            />           
        </HomeNavigator.Navigator>
    );
}


const AboutNavigator=createStackNavigator();

function AboutNavigatorScreen() {
    return(
        <AboutNavigator.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#512DA8"
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    color: "#fff"            
                }
            }}
        >
            <AboutNavigator.Screen
                name="About"
                component={About}
                options={
                    ({navigation})=>({
                        headerLeft: ()=>(
                            <Icon
                                name='menu'
                                size={24}
                                color='white'
                                onPress={()=>navigation.toggleDrawer()}
                            />
                        )
                    })
                }
            />           
        </AboutNavigator.Navigator>
    );
}


const ContactNavigator = createStackNavigator();

function ContactNavigatorScreen() {
    return(
        <ContactNavigator.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#512DA8"
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    color: "#fff"            
                }
            }}
        >
            <ContactNavigator.Screen
                name="Contact"
                component={Contact}
                options={
                    ({navigation})=>({
                        headerLeft: ()=>(
                            <Icon
                                name='menu'
                                size={24}
                                color='white'
                                onPress={()=>navigation.toggleDrawer()}
                            />
                        )
                    })
                }
            />            
        </ContactNavigator.Navigator>
    );
}

const ReservationNavigator = createStackNavigator();

function ReservationNavigatorScreen() {
    return(
        <ReservationNavigator.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#512DA8"
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    color: "#fff"            
                }
            }}
        >
            <ReservationNavigator.Screen
                name="Reservation"
                component={Reservation}
                options={
                    ({navigation})=>({
                        headerLeft: ()=>(
                            <Icon
                                name='menu'
                                size={24}
                                color='white'
                                onPress={()=>navigation.toggleDrawer()}
                            />
                        )
                    })
                }
            />            
        </ReservationNavigator.Navigator>
    );
}

const MainNavigator=createDrawerNavigator();

function MainNavigatorScreen(){
    return(
        <MainNavigator.Navigator
            initialRouteName="Home"
            drawerStyle={{
                backgroundColor:'#D1C4E9'
            }}
            drawerContent={props=>
            <CustomDrawerContentComponent{...props}/>}
        >
            <MainNavigator.Screen
                name="Home" 
                component={HomeNavigatorScreen} 
                options={{
                    drawerIcon:({tintColor})=>(
                        <Icon 
                            name='home'
                            type='font-awesome'
                            size={24}
                            color={tintColor}
                        />
                    )
                }}
                />
            <MainNavigator.Screen 
                name="About Us" 
                component={AboutNavigatorScreen} 
                options={{
                    drawerIcon:({tintColor})=>(
                        <Icon 
                            name='info-circle'
                            type='font-awesome'
                            size={24}
                            color={tintColor}
                        />
                    )
                }}
            />
            <MainNavigator.Screen 
                name="Menu" 
                component={MenuNavigatorScreen} 
                options={{
                    drawerIcon:({tintColor})=>(
                        <Icon 
                            name='list'
                            type='font-awesome'
                            size={24}
                            color={tintColor}
                        />
                    )
                }}
            />
            <MainNavigator.Screen 
                name="Contact Us" 
                component={ContactNavigatorScreen} 
                options={{
                    drawerIcon:({tintColor})=>(
                        <Icon 
                            name='address-card'
                            type='font-awesome'
                            size={22}
                            color={tintColor}
                        />
                    )
                }}
            />
            <MainNavigator.Screen 
                name="Reserve Table" 
                component={ReservationNavigatorScreen} 
                options={{
                    drawerIcon:({tintColor})=>(
                        <Icon 
                            name='cutlery'
                            type='font-awesome'
                            size={24}
                            color={tintColor}
                        />
                    )
                }}
            />
        </MainNavigator.Navigator>
    )
}

class Main extends Component {
    
    componentDidMount() {
        this.props.fetchDishes();
        this.props.fetchComments();
        this.props.fetchPromos();
        this.props.fetchLeaders();
    }
    render() {

        return (
            <NavigationContainer>
                <MainNavigatorScreen/>           
            </NavigationContainer>
        );
    }
}
const styles=StyleSheet.create({
    container:{
        flex:1
    },
    drawerHeader:{
        backgroundColor :'#512DAB',
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        flex : 1,
        flexDirection: 'row'
    },
    drawerHeaderText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold'
      },
      drawerImage: {
        margin: 10,
        width: 80,
        height: 60
      }
});
export default connect(mapStateToProps, mapDispatchToProps)(Main);