import React,{Component} from 'react';
import {Alert,Text,View,StyleSheet,Picker,Switch,Button,Platform} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import {Notifications} from 'expo';
import * as Permissions from 'expo-permissions';
import * as Calendar from 'expo-calendar';
import DateTimePickerModal from "react-native-modal-datetime-picker";

class Reservation extends Component{
    constructor(props){
        super(props);
        this.state={
            guests: 1,
            smoking:false,
            date:"Select Date",
            realDate:new Date(),
            realTime:new Date(),
            fullTime:new Date(),
            isVisibleDate:false,
            isVisibleTime:false,
            time:"Select Time"
        }
    }
    onChangeDate = (selectedDate) => {
        let date1=selectedDate.toString().split(' ');
        let date2=date1[0]+" "+date1[1]+" "+date1[2]+" "+date1[3];
        let full=this.state.fullTime.toString().split(' ');
        full[0]=date1[0];
        full[1]=date1[1];
        full[2]=date1[2];
        full[3]=date1[3];
        full=full.join(" ");
        full=new Date(full);
        this.setState({
            date:date2,
            isVisibleDate: false,
            realDate: selectedDate,
            fullTime:full
        })
    };
    
    onChangeTime=(selectedTime)=>{
        let currDate=selectedTime.toString();
        let date1=currDate.split(' ');
        let time1=date1[4].split(":");
        let intTime=parseInt(time1[0],10);
        let time2=time1[0]+":"+time1[1];
        let full=this.state.fullTime.toString().split(' ');
        full[4]=date1[4];
        full=full.join(" ");
        full=new Date(full);
        console.log(full);
        if(intTime<=11){
            time2=time1[0]+":"+time1[1]+" AM";
        }
        else{
            var hrs=(parseInt(time1[0],10)-12);
            if(hrs==0)
                hrs="12";
            else if(hrs<=9 && hrs!=0)
                hrs="0"+hrs.toString();
            else
                hrs.hrs.toString();
            time2=hrs+":"+time1[1]+" PM";
        }
        this.setState({
            time:time2,
            realTime: selectedTime,
            isVisibleTime:false,
            fullTime:full
        })
    }
    static navigationOptions={
        title:'Reserve Table'
    }
    resetForm(){
        this.setState({
            guests: 1,
            smoking:false,
            date:"Select Date",
            realDate:new Date(),
            realTime:new Date(),
            isVisibleDate:false,
            isVisibleTime:false,
            time:"Select Time"
        });
    }
    handleReservation(){
        this.addReservationToCalendar();
        Alert.alert(
            'Your Reservation OK?',
            'Number of Guests: '+this.state.guests+"\nSmoking? "+this.state.smoking+"\nDate and Time: "+this.state.fullTime,
            [
                {
                    text:'Cancel',
                    onPress: ()=>this.resetForm(),
                    style: 'cancel'
                },
                {
                    text: 'Ok',
                    onPress: ()=>{
                        this.presentLocalNotification(this.state.fullTime);
                        this.resetForm()
                    }
                }
            ],
            {cancelable:false}
        )
        console.log(JSON.stringify(this.state));
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        return permission;
    }

    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for '+ date + ' requested',
            ios: {
                sound: true,
                _displayInForeground: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        });
    }

    async getDefaultCalendarSource() {
        const calendars = await Calendar.getCalendarsAsync();
        const defaultCalendars = calendars.filter(each => each.source.name === 'Default');
        return defaultCalendars[0].source;
    }

    async obtainCalendarPermission() {
        let permission = await Permissions.getAsync(Permissions.CALENDAR);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.CALENDAR);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to calendar');
            }
        }
        return permission;
    }

    async addReservationToCalendar() {
        
        await this.obtainCalendarPermission();
        
        let dateCurr = Date.parse(this.state.fullTime);
        let endDate = new Date(dateCurr + 3600 * 2 * 1000);
        
        const defaultCalendarSource=Platform.OS==='ios'?await this.getDefaultCalendarSource()
        : { isLocalAccount: true, name: 'Expo Calendar' };
        
        const defaultCalendarId=await Calendar.createCalendarAsync({
            title: 'Your Reservation at Con Fusion',
            color: 'blue',
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: defaultCalendarSource.id,
            source : defaultCalendarSource,
            name: 'internalCalendarName',
            ownerAccount: 'personal',
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });

        await Calendar.createEventAsync(defaultCalendarId, {
            title: 'Con Fusion Table Reservation',
            startDate: this.state.fullTime,
            endDate: endDate,
            timeZone: 'Asia/Hong_Kong',
            location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
        });
    }

    render(){
        return(
            <ScrollView>
                <Animatable.View animation="zoomIn" duration={1000} >
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Number of Guests</Text>
                    <Picker 
                        style={styles.formItem} 
                        selectedValue={this.state.guests}
                        onValueChange={(itemValue,itemIndex)=> this.setState({guests:itemValue})}
                    >
                        <Picker.Item label='1' value='1'/>
                        <Picker.Item label='2' value='2'/>
                        <Picker.Item label='3' value='3'/>
                        <Picker.Item label='4' value='4'/>
                        <Picker.Item label='5' value='5'/>
                        <Picker.Item label='6' value='6'/>
                    </Picker>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Smoking/Non-Smoking</Text>
                    <Switch style={styles.formItem}
                        value={this.state.smoking}
                        trackColor='#512DA8'
                        onValueChange={(value)=> this.setState({smoking:value})}>
                    </Switch>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Date</Text>
                    <View style={{flex:2}}>
                    <Button title={this.state.date.toString()} onPress={()=>this.setState({isVisibleDate:true})} />
                        <DateTimePickerModal
                            isVisible={this.state.isVisibleDate}
                            mode="date"
                            onConfirm={this.onChangeDate}
                            onCancel={()=>this.setState({isVisibleDate:false})}
                        />
                    </View>
                </View>
                <View style={styles.formRow}>
                    <Text style={styles.formLabel}>Time</Text>
                    <View style={{flex:2}}>
                    <Button title={this.state.time.toString()} onPress={()=>this.setState({isVisibleTime:true})} />
                        <DateTimePickerModal
                            isVisible={this.state.isVisibleTime}
                            mode="time"
                            onConfirm={this.onChangeTime}
                            onCancel={()=>this.setState({isVisibleTime:false})}
                        />
                    </View>
                </View>
                <View style={styles.formRow}>
                    <Button
                        title='Reserve'          
                        color='#512DA8'
                        onPress={()=>this.handleReservation()}
                        accessibilityLabel='Learn more about this purple button'
                    />
                    
                </View>
                </Animatable.View>
            </ScrollView>
        )
    }
}

const styles=StyleSheet.create({
    formRow:{
        alignItems : 'center',
        justifyContent : 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 10,
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

export default Reservation;