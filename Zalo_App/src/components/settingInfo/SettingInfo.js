import { Pressable, ScrollView, Text, View } from 'react-native'
import React, { useState } from 'react'
import { styles } from './style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faCircleCheck, faPenToSquare} from '@fortawesome/free-solid-svg-icons'
import { faCommentDots } from '@fortawesome/free-regular-svg-icons'
import { LinearGradient } from 'expo-linear-gradient'

export const SettingInfo = ({navigation}) => {
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
            <Text style={styles.txtInHeader}>Thông tin về Zalo</Text> 
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView style={styles.body}>   
        <View style={[styles.pressBirthDay, {height: 70}]}>
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.textBirthDay}>Phiên bản 1.0  </Text>
              <FontAwesomeIcon color='green' icon={faCircleCheck} />
            </View>
            <Text style={{fontSize: 15, marginLeft: 15}}>Bạn đang dùng phiên bản mới nhất</Text>
          </View>
        </View>

        <Pressable style={[styles.pressBirthDay, {marginTop: 9}]} onPress={()=> alert('Hiện liên hệ trong danh bạ')}>
          <Text style={styles.textBirthDay}>Zalo A-Z: Hướng dẫn sử dụng</Text>
          <View style={{ marginRight: 15, height: 30, width: 30, backgroundColor: '#F1F2F4', justifyContent: 'center', alignItems: 'center', borderRadius: 20}}>
            <FontAwesomeIcon size={16} icon={faPenToSquare} />
          </View>
        </Pressable>

        {renderLine()}

        <Pressable style={[styles.pressBirthDay]} onPress={()=> alert('Hiện liên hệ trong danh bạ')}>
          <Text style={styles.textBirthDay}>Liên hệ hỗ trợ</Text>
          <View style={{ marginRight: 15, height: 30, width: 30, backgroundColor: '#F1F2F4', justifyContent: 'center', alignItems: 'center', borderRadius: 20}}>
            <FontAwesomeIcon size={16} icon={faCommentDots} />
          </View>
        </Pressable>

        {renderLine()}

        <Pressable style={[styles.pressBirthDay]} onPress={()=> alert('Gửi Qos')}>
          <Text style={styles.textBirthDay}>Gửi Qos</Text>
        </Pressable>

        <Pressable style={[styles.pressBirthDay, {marginTop: 9}]} onPress={()=> alert('Điều khoản sử dụng')}>
          <Text style={styles.textBirthDay}>Điều khoản sử dụng</Text>
        </Pressable>
        
      </ScrollView>
    </View>
  )
}

