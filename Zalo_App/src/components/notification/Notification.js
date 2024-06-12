import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import React, { useState } from 'react'
import { styles } from './style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMobilePhone, faLock,  faChevronLeft, faChevronRight, faShieldVirus, faCalendarDays, faUserClock, faPhone, faBan, faUserGear } from '@fortawesome/free-solid-svg-icons'
import { faCalendarPlus, faComment, faCommentDots, faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { LinearGradient } from 'expo-linear-gradient';

export const Notification = ({navigation}) => {
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
            <Text style={styles.txtInHeader}>Thông báo</Text> 
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView style={styles.body}>   
        <View style={styles.viewAccount}>
          <Text style={styles.txtTitle}>Trò chuyện 2 người</Text>
          <View style={[styles.pressBirthDay]}>
            <Text style={styles.textBirthDay}>Báo tin nhắn mới từ trò chuyện</Text>
            <Pressable style={[styles.button, isToggled && styles.toggledButton]} onPress={handleToggle}>
              <View style={[styles.circleButton, isToggled ? styles.circleButton1 : styles.circleButton]}></View>
            </Pressable> 
          </View>

          {renderLine()}

          <View style={[styles.pressBirthDay]}>
            <Text style={styles.textBirthDay}>Xem trước tin nhắn từ trò chuyện</Text>
            <Pressable style={[styles.button, isToggled && styles.toggledButton]} onPress={handleToggle}>
              <View style={[styles.circleButton, isToggled ? styles.circleButton1 : styles.circleButton]}></View>
            </Pressable> 
          </View>
        </View>

        <View style={styles.viewSecutity}>
          <Text style={styles.txtTitle}>Trò chuyện nhóm</Text>
          <Pressable style={styles.pressBirthDay} onPress={()=> alert('Báo tin nhắn từ nhóm')}>
            <Text style={styles.textBirthDay}>Báo tin nhắn từ nhóm</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: 15, marginRight: 10}}>Đang bật</Text>
              <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
            </View>
          </Pressable>
        </View>

        <View style={styles.viewLogin}>
          <Text style={styles.txtTitle}>Cuộc gọi</Text>
          <View style={[styles.pressBirthDay]}>
            <Text style={styles.textBirthDay}>Báo cuộc gọi đến</Text>
            <Pressable style={[styles.button, isToggled && styles.toggledButton]} onPress={handleToggle}>
              <View style={[styles.circleButton, isToggled ? styles.circleButton1 : styles.circleButton]}></View>
            </Pressable> 
          </View>

          {renderLine()}

          <Pressable style={[styles.pressBirthDay, {height: 70}]} onPress={()=> alert('Tắt thông báo')}>
            <View>
              <Text style={styles.textBirthDay}>Tắt thông báo cuộc gọi từ bạn bè</Text> 
              <Text style={{fontSize: 15, marginLeft: 15}}>0 người</Text>            
            </View>
          </Pressable>
        </View>

        <View style={styles.viewSearchAndF}>
          <Text style={styles.txtTitle}>Nhật ký</Text>
          <Pressable style={styles.pressBirthDay} onPress={()=> alert('Báo hoạt động mới của bạn bè')}>
            <Text style={styles.textBirthDay}>Báo hoạt động mới của bạn bè</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: 15, marginRight: 10}}>Đang tắt</Text>
              <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
            </View>
          </Pressable>
        </View>

        <View style={styles.viewSearchAndF}>
          <Text style={styles.txtTitle}>Sự kiện</Text>
          <Pressable style={styles.pressBirthDay} onPress={()=> alert('Báo hoạt động mới của bạn bè')}>
            <Text style={styles.textBirthDay}>Báo cho tôi về sinh nhật của bạn bè</Text>
            <Pressable style={[styles.button, isToggled && styles.toggledButton]} onPress={handleToggle}>
              <View style={[styles.circleButton, isToggled ? styles.circleButton1 : styles.circleButton]}></View>
            </Pressable> 
          </Pressable>
        </View>

        <View style={styles.viewEnd}>
          <Text style={styles.txtTitle}>Thông báo trong Zalo</Text>
          <View style={styles.pressBirthDay}>
            <Text style={styles.textBirthDay}>Phát âm báo tin nhắn mới trong Zalo</Text>
            <Pressable style={[styles.button, isToggled && styles.toggledButton]} onPress={handleToggle}>
              <View style={[styles.circleButton, isToggled ? styles.circleButton1 : styles.circleButton]}></View>
            </Pressable> 
          </View>

          {renderLine()}

          <View style={styles.pressBirthDay}>
            <Text style={styles.textBirthDay}>Rung khi tin nhắn mới trong Zalo</Text>
            <Pressable style={[styles.button, isToggled && styles.toggledButton]} onPress={handleToggle}>
              <View style={[styles.circleButton, isToggled ? styles.circleButton1 : styles.circleButton]}></View>
            </Pressable> 
          </View>

          {renderLine()}

          <View style={styles.pressBirthDay}>
            <Text style={styles.textBirthDay}>Xem trước tin nhắn mới trong Zalo</Text>
            <Pressable style={[styles.button, isToggled && styles.toggledButton]} onPress={handleToggle}>
              <View style={[styles.circleButton, isToggled ? styles.circleButton1 : styles.circleButton]}></View>
            </Pressable> 
          </View>
        </View>
        <View style={{width: '100%', height: 200}}></View>
      </ScrollView>
    </View>
  )
}

