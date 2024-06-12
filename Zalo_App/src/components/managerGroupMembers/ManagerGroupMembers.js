import { Image, Pressable, ScrollView, Text, View, Switch, Dimensions } from 'react-native'
import React, {useEffect, useRef, useState} from 'react'
import { styles } from './style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMagnifyingGlass, faArrowLeft, faLock, faStar, faUser,faWandMagicSparkles, faBell, faPencil
    ,faClock, 
    faImage,
    faUserPlus,
    faPersonCirclePlus,
    faUserGroup,
    faThumbtack,
    faEyeSlash,
    faPhoneFlip,
    faTrash,
    faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import axios from '../../config/axios'
import Toast from 'react-native-easy-toast'
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { AllMembers } from './AllMembers'
import { GroupManagers } from './GroupManagers'
import { LinearGradient } from 'expo-linear-gradient'

const Tab = createMaterialTopTabNavigator();

export const ManagerGroupMembers = ({navigation, route}) => {
    const {items} = route.params; 
    const {width} = Dimensions.get('screen');
    const toastRef = useRef(null);
    useEffect(() => {
        navigation.setOptions({
        });
      }, [navigation]);

    return (
        <View style={styles.container}>  
            <LinearGradient colors={['#008BFA', '#00ACF4']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
               <View style={{height: '55%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                    <Pressable style={{flexDirection: 'row', alignItems: 'center' }} onPress={()=>{navigation.goBack()}}>
                        <FontAwesomeIcon style={{marginLeft: 10}} color='#F1FFFF' size={21} icon={faChevronLeft} />
                        <Text style={styles.txtInHeader}>Quản lý thành viên</Text>
                    </Pressable>

                    <Pressable style={styles.btnPressClose} onPress={()=> {navigation.navigate('AddMember', {items:items})}}>
                        <FontAwesomeIcon color='#F1FFFF' size={21} icon={faUserPlus} />
                    </Pressable>
               </View>
            </LinearGradient>

            <Tab.Navigator 
                screenOptions={{
                    tabBarLabelStyle: { textTransform: 'none', fontWeight: '500', fontSize: 14}, 
                    tabBarStyle: {elevation: 1, shadowOpacity: 0, borderBottomWidth: 1, borderBottomColor: '#D1D1D1'},
                    tabBarIndicatorStyle: {backgroundColor: '#1E70E3', height: 2, width: width * 0.5 - 30, marginLeft: 15}
                }}>
                <Tab.Screen name="Tất cả">
                    {({navigation }) => <AllMembers navigation={navigation} items={items} />}
                </Tab.Screen>
                <Tab.Screen name="Người quản lý nhóm" component={GroupManagers}/>
            </Tab.Navigator>
        </View>
    )
}
