import { Pressable, ScrollView, Text, View } from 'react-native'
import React, { useState } from 'react'
import { styles } from './style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons'
import { LinearGradient } from 'expo-linear-gradient';

export const SettingCalling = ({navigation}) => {
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
            <Text style={styles.txtInHeader}>Cuộc gọi</Text> 
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView style={styles.body}>   
        <View style={styles.viewAccount}>
          <Text style={styles.txtTitle}>Âm thanh</Text>

          <Pressable style={[styles.pressBirthDay, {height: 70}]} onPress={()=> alert('Nhạc chuông')}>
            <View>
              <Text style={styles.textBirthDay}>Nhạc chuông</Text>
              <Text style={{marginLeft: 15, fontSize: 15}}>Zalo (mặc định)</Text>
            </View>
            <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
          </Pressable>

          {renderLine()}

          <Pressable style={[styles.pressBirthDay, {height: 70}]} onPress={()=> alert('Nhạc chờ')}>
            <View>
              <Text style={styles.textBirthDay}>Nhạc chờ</Text>
              <Text style={{marginLeft: 15, fontSize: 15}}>Zalo (mặc định)</Text>
            </View>
            <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
          </Pressable>
        </View>

        <View style={styles.viewLogin}>
          <Text style={styles.txtTitle}>Tùy chọn</Text>

          <View style={[styles.pressBirthDay, {height: 70}]}>
            <View>
              <Text style={styles.textBirthDay}>Thu nhỏ màn hình khi gọi video</Text>
              <Text style={{marginLeft: 15, fontSize: 15}}>Giữ cho video tiếp tục ngay cả khi thoát app</Text>
            </View>
            <Pressable style={[styles.button, isToggled && styles.toggledButton]} onPress={handleToggle}>
              <View style={[styles.circleButton, isToggled ? styles.circleButton1 : styles.circleButton]}></View>
            </Pressable> 
          </View>

          {renderLine()}

          <View style={[styles.pressBirthDay, {height: 70}]}>
            <View>
              <Text style={styles.textBirthDay}>Hiện lịch sử gọi Zalo trên điện thoại</Text>
              <Text style={{marginLeft: 15, fontSize: 15}}>Gọi lại nhanh và miễn phí bằng Zalo</Text>
            </View>
            <Pressable style={[styles.button, isToggled && styles.toggledButton]} onPress={handleToggle}>
              <View style={[styles.circleButton, isToggled ? styles.circleButton1 : styles.circleButton]}></View>
            </Pressable> 
          </View>
        </View>

        <View style={styles.viewSecutity}>
          <Text style={styles.txtTitle}>Quyền riêng tư</Text>
          <Pressable style={[styles.pressBirthDay]} onPress={()=>alert('Cho phép gọi')}>
            <Text style={styles.textBirthDay}>Cho phép gọi điện </Text>
            <Text style={{marginRight: 15, fontSize: 15}} numberOfLines={2}>Bạn bè</Text>
          </Pressable>

          {renderLine()}

          <Pressable style={[styles.pressBirthDay]} onPress={()=>alert('Chặn cuộc gọi')}>
            <Text style={styles.textBirthDay}>Chặn cuộc gọi</Text>
            <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}

