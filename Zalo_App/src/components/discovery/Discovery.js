import {Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import React from 'react'
import { styles } from './style'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronRight, faMagnifyingGlass, faQrcode } from '@fortawesome/free-solid-svg-icons'
import { LinearGradient } from 'expo-linear-gradient'

export const Discovery = () => {
  return (
    <View style={styles.container}>
      <LinearGradient style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#008BFA', '#00ACF4']}>
        <View style={{height: '55%', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between'}}>
          <FontAwesomeIcon style={{marginLeft: 10}} color='#F1FFFF' size={22} icon={faMagnifyingGlass} />
          <TextInput style={styles.txtInHeader} placeholder='Tìm kiếm' placeholderTextColor={'#FFFFFF'} editable={false}></TextInput>
          <Pressable style={{height: 40, width: 40, justifyContent: 'center', alignItems: 'center', marginRight: 5}}>
            <FontAwesomeIcon style={{}} color='#F1FFFF' size={22} icon={faQrcode} />
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView style={styles.body}>
        <Pressable style={styles.pressZaloVideo} >
          <Image source={require('../../../assets/img/zaloVideo.png')} style={{height: 50, width: 50, marginLeft: 15}}></Image>
          <Text style={{marginLeft: -180 , fontSize: 18}}>Zalo Video</Text>
          <FontAwesomeIcon size={20} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
        </Pressable>
      </ScrollView>
    </View>
  )
}

