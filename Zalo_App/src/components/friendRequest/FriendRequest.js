import React, { useEffect } from 'react'
import { View, Pressable, Text, Dimensions } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { styles } from './style'
import { FriendRequestReceived } from './FriendRequestReceived'
import { FriendRequestSent } from './FriendRequestSent'
import { LinearGradient } from 'expo-linear-gradient';

const Tab = createMaterialTopTabNavigator();
export const FriendRequest = ({ navigation }) => {
  const { width } = Dimensions.get('screen');

  useEffect(() => {
    navigation.setOptions({
    });
  }, [navigation]);
  
  return (
    <View style={styles.container}>
      <LinearGradient style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#008BFA', '#00ACF4']}>
        <View style={{height: '55%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <Pressable style={{flexDirection: "row", height: 55, alignItems: "center", justifyContent: 'center'}} onPress={() => { navigation.goBack()}}>
            <FontAwesomeIcon style={{ marginLeft: 10 }} color='#F1FFFF' size={20} icon={faChevronLeft} />
            <Text style={styles.txtInHeader}>Lời mời kết bạn</Text>
          </Pressable>

          <Pressable style={{height: 40, width: 40, justifyContent: 'center', alignItems: 'center'}} onPress={() => {navigation.navigate('AddFriend')}}>
            <FontAwesomeIcon style={{ marginRight: 10 }} color='#F1FFFF' size={21} icon={faUserPlus} />
          </Pressable>
        </View>
      </LinearGradient>

      <Tab.Navigator screenOptions={{
          tabBarLabelStyle: { textTransform: 'none', fontWeight: '500', fontSize: 14 },
          tabBarIndicatorStyle: {backgroundColor: '#1E70E3', height: 2, width: width * 0.5 - 30, marginLeft: 15}
        }} >
        <Tab.Screen name="Đã nhận" component={FriendRequestReceived} />
        <Tab.Screen name="Đã gửi" component={FriendRequestSent} />
      </Tab.Navigator>
    </View>
  )
}
