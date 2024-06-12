import { Pressable, ScrollView, Text, View } from 'react-native'
import React, { useState } from 'react'
import { styles } from './style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons'
import { LinearGradient } from 'expo-linear-gradient'

export const SettingContact = ({navigation}) => {
  const [isToggled, setToggled] = useState(false);

  const handleToggle = () => {
    setToggled(!isToggled);
  }; 
 
  const renderLine = () => (
    <View style={styles.line}>
      <View style={styles.line1} >
        <Text> </Text>
      </View>
      <View style={styles.line2}>
        <Text> </Text>
      </View>
    </View>
  )
  return (
    <View style={styles.container}>
      <LinearGradient style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#008BFA', '#00ACF4']}>
        <View style={{height: '55%', justifyContent: 'center'}}>
          <Pressable style={styles.pressBack} onPress={()=> {navigation.goBack()}}>
            <FontAwesomeIcon icon={faChevronLeft} style={{marginLeft: 10}} color='#F5F8FF' size={20} />
            <Text style={styles.txtInHeader}>Danh bạ</Text> 
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView style={styles.body}>   
        <Pressable style={[styles.pressBirthDay, {height: 70}]} onPress={()=> alert('Phân loại nhật ký')}>
          <View>
            <Text style={styles.textBirthDay}>Cập nhật danh bạ Zalo</Text>
            <Text style={{fontSize: 15, marginLeft: 15}}>Lần gần nhất: 01/01/2024 22:57</Text>
          </View>
          <Text style={{fontSize: 15, marginRight: 15}}>Thủ công</Text>
        </Pressable>

        {renderLine()}

        <Pressable style={[styles.pressBirthDay]} onPress={()=> alert('Hiện liên hệ trong danh bạ')}>
          <Text style={styles.textBirthDay}>Hiện liên hệ trong danh bạ</Text>
          <Text style={{fontSize: 15, marginRight: 15}}>Tất cả liên hệ</Text>
        </Pressable>

        <View style={[styles.viewLogin]}>
          <Text style={styles.txtTitle}>Nguồn tìm kiếm và kết bạn</Text>
          <View style={[styles.pressBirthDay, {height: 75}]}>
            <View>
              <Text style={styles.textBirthDay}>Tự động kết bạn từ danh bạ máy</Text>
              <Text style={{fontSize: 15, marginLeft: 15}}>Thêm liên hệ vào danh bạ Zalo khi cả</Text>
              <Text style={{fontSize: 15, marginLeft: 15}}>2 đều lưu số nhau trên máy</Text>
            </View>
            <Pressable style={[styles.button, isToggled && styles.toggledButton]} onPress={handleToggle}>
              <View style={[styles.circleButton, isToggled ? styles.circleButton1 : styles.circleButton]}></View>
            </Pressable> 
          </View>
          
          {renderLine()}

          <Pressable style={[styles.pressBirthDay]} onPress={()=> alert('Quản lý nguồn tìm kiếm và kết bạn')}>
            <Text style={styles.textBirthDay}>Quản lý nguồn tìm kiếm và kết bạn</Text>
            <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}

