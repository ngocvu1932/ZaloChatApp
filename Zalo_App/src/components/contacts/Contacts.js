import React, { useEffect, useState } from 'react'
import { View, TextInput, Pressable, Text, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMagnifyingGlass, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { ContactFriends } from './ContactFriends'
import { ContactGroups } from './ContactGroups'
import { ContactOA } from './ContactOA'
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { styles } from './style';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native'
const Tab = createMaterialTopTabNavigator(); 


export const Contacts = ({ navigation }) => {
  const { width } = Dimensions.get('screen');
  // console.log("width", width);

  // const [loadAgain, setLoadAgain] =useState();
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     setLoadAgain(new Date());
  //   });

  //   return unsubscribe;
  // }, [navigation]);
  
  return ( 
    <View style={styles.container}>
      <LinearGradient style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#008BFA', '#00ACF4']}>
        <View style={{flexDirection: 'row', height: '55%', width: '100%', alignItems: 'center'}}>
          <FontAwesomeIcon style={{ marginLeft: 10 }} color='#F1FFFF' size={22} icon={faMagnifyingGlass} />
          <TextInput style={styles.txtInHeader} placeholder='Tìm kiếm' placeholderTextColor={'#FFFFFF'} editable={false} />
          <Pressable onPress={() => {navigation.navigate('AddFriend')}}>
            <FontAwesomeIcon style={{ marginRight: 10 }} color='#F1FFFF' size={22} icon={faUserPlus} />
          </Pressable> 
        </View>
      </LinearGradient>

      <Tab.Navigator screenOptions={{
        tabBarLabelStyle: { textTransform: 'none', fontWeight: '500', fontSize: 14}, 
        tabBarStyle: {elevation: 1, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: '#D1D1D1'},
        tabBarIndicatorStyle: {backgroundColor: '#1E70E3', height: 2, width: width * 0.333333 - 30, marginLeft: 15}
      }}>
        <Tab.Screen name="Bạn bè" component={ContactFriends} />
        <Tab.Screen name="Nhóm" component={ContactGroups} />
        <Tab.Screen name="OA" component={ContactOA} />
      </Tab.Navigator>  
    </View>
  )
}
