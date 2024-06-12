import { Pressable, ScrollView, Text, View } from 'react-native'
import React, { useState } from 'react'
import { styles } from './style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons'
import { LinearGradient } from 'expo-linear-gradient'

export const SettingTimeline = ({navigation}) => {
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
            <Text style={styles.txtInHeader}>Nhật ký</Text> 
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView style={styles.body}>   
        <View style={styles.viewAccount}>
          <Text style={styles.txtTitle}>Tiện ích</Text>
          <Pressable style={[styles.pressBirthDay]} onPress={()=> alert('Phân loại nhật ký')}>
            <Text style={styles.textBirthDay}>Phân loại nhật ký</Text>
            <Text style={{fontSize: 15, marginRight: 15}}>Đang tắt</Text>
          </Pressable>
        </View>

        <View style={styles.viewLogin}>
          <Text style={styles.txtTitle}>Tùy chọn</Text>
          <Pressable style={[styles.pressBirthDay]} onPress={()=> alert('Ptự động phát video')}>
            <Text style={styles.textBirthDay}>Tự động phát video</Text>
            <Text style={{fontSize: 15, marginRight: 15}}>Luôn tự động phát</Text>
          </Pressable>

          {renderLine()}

          <Pressable style={[styles.pressBirthDay]} onPress={()=> alert('Ptự động phát video')}>
            <Text style={styles.textBirthDay}>Tự động phát bài hát</Text>
            <Text style={{fontSize: 15, marginRight: 15}}>Luôn tự động phát</Text>
          </Pressable>

          {renderLine()}

          <View style={[styles.pressBirthDay]}>
            <Text style={styles.textBirthDay}>Gợi ý sticker khi bình luận</Text>
            <Pressable style={[styles.button, isToggled && styles.toggledButton]} onPress={handleToggle}>
              <View style={[styles.circleButton, isToggled ? styles.circleButton1 : styles.circleButton]}></View>
            </Pressable> 
          </View>
        </View>

        <View style={styles.viewSecutity}>
          <Text style={styles.txtTitle}>Quyền riêng tư</Text>
          <Pressable style={[styles.pressBirthDay]} onPress={()=>alert('Chặn xem nhật ký')}>
            <Text style={styles.textBirthDay}>Chặn xem nhật ký</Text>
            <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
          </Pressable>

          {renderLine()}

          <Pressable style={[styles.pressBirthDay]} onPress={()=>alert('Chặn xem  khoảnh khắc')}>
            <Text style={styles.textBirthDay}>Chặn xem khoảnh khắc</Text>
            <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
          </Pressable>

          {renderLine()}

          <Pressable style={[styles.pressBirthDay]} onPress={()=>alert('Ẩn khỏi nhật ký')}>
            <Text style={styles.textBirthDay}>Ẩn khỏi nhật ký</Text>
            <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}

