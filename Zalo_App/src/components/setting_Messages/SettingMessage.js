import { Pressable, ScrollView, Text, View } from 'react-native'
import React, { useState } from 'react'
import { styles } from './style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons'
import { LinearGradient } from 'expo-linear-gradient';

export const SettingMessage = ({navigation}) => {
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
            <Text style={styles.txtInHeader}>Tin nhắn</Text> 
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView style={styles.body}>   
        <View style={styles.viewAccount}>
          <Text style={styles.txtTitle}>Tiện ích</Text>
          <Pressable style={[styles.pressBirthDay]} onPress={()=> alert('Quản lý tin nhắn nhanh')}>
            <Text style={styles.textBirthDay}>Quản lý tin nhắn nhanh</Text>
            <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
          </Pressable>

          {renderLine()}

          <View style={[styles.pressBirthDay]}>
            <Text style={styles.textBirthDay}>Gợi ý gửi nhanh ảnh mới chụp</Text>
            <Pressable style={[styles.button, isToggled && styles.toggledButton]} onPress={handleToggle}>
              <View style={[styles.circleButton, isToggled ? styles.circleButton1 : styles.circleButton]}></View>
            </Pressable> 
          </View>

          {renderLine()}

          <View style={[styles.pressBirthDay]}>
            <Text style={styles.textBirthDay}>Gợi ý gửi sticker khi soạn tin nhắn</Text>
            <Pressable style={[styles.button, isToggled && styles.toggledButton]} onPress={handleToggle}>
              <View style={[styles.circleButton, isToggled ? styles.circleButton1 : styles.circleButton]}></View>
            </Pressable> 
          </View>
        </View>

        <View style={styles.viewSecutity}>
          <Text style={styles.txtTitle}>Quyền riêng tư</Text>
          <Pressable style={styles.pressBirthDay} onPress={()=> alert('Chặn tin nhắn')}>
            <Text style={styles.textBirthDay}>Chặn tin nhắn</Text>
            <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
          </Pressable>

          {renderLine()}

          <Pressable style={styles.pressBirthDay} onPress={()=> alert('Ẩn trò chuyện')}>
            <Text style={styles.textBirthDay}>Ẩn trò chuyện</Text>
            <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
          </Pressable>
        </View>

        <View style={styles.viewLogin}>
          <Text style={styles.txtTitle}>Tùy chọn</Text>
          <View style={[styles.pressBirthDay]}>
            <Text style={styles.textBirthDay}>Ghi nhớ chất lượng ảnh và video cho lần gửi sau</Text>
            <Pressable style={[styles.button, isToggled && styles.toggledButton]} onPress={handleToggle}>
              <View style={[styles.circleButton, isToggled ? styles.circleButton1 : styles.circleButton]}></View>
            </Pressable> 
          </View>

          {renderLine()}

          <View style={[styles.pressBirthDay, {height: 70}]}>
            <View>
              <Text style={styles.textBirthDay}>Thả biểu tượng cảm xúc</Text>
              <Text style={{marginLeft: 15, fontSize: 15}}>Hiện nút thả biểu tượng cảm xúc trong</Text>
              <Text style={{marginLeft: 15, fontSize: 15}}>trò chuyện</Text>
            </View>
            <Pressable style={[styles.button, isToggled && styles.toggledButton]} onPress={handleToggle}>
              <View style={[styles.circleButton, isToggled ? styles.circleButton1 : styles.circleButton]}></View>
            </Pressable> 
          </View>

           {renderLine()}

          <View style={[styles.pressBirthDay]}>
            <Text style={styles.textBirthDay}>Tự động phát tin nhắn thoại</Text>
            <Pressable style={[styles.button, isToggled && styles.toggledButton]} onPress={handleToggle}>
              <View style={[styles.circleButton, isToggled ? styles.circleButton1 : styles.circleButton]}></View>
            </Pressable> 
          </View>

          {renderLine()}

          <Pressable style={[styles.pressBirthDay]} onPress={()=> alert('Tuwj dodojng phast')}>
            <Text style={styles.textBirthDay}>Tự động phát video</Text>
            <Text style={{marginRight: 15, fontSize: 15}}>Luôn tự động phát</Text>
          </Pressable>

           {renderLine()}
          
          <Pressable style={styles.pressBirthDay} onPress={()=> alert('Báo hoạt động mới của bạn bè')}>
            <Text style={styles.textBirthDay}>Tự động tải về</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: 15, marginRight: 10}}>Đang bật</Text>
              <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
            </View>
          </Pressable>

          {renderLine()}

          <View style={[styles.pressBirthDay, {height: 70}]}>
            <View>
              <Text style={styles.textBirthDay}>Khôi phục trò chuyện vừa xóa</Text>
              <Text style={{marginLeft: 15, fontSize: 15}}>Chỉ khôi phục được trò chuyện vừa xóa</Text>
              <Text style={{marginLeft: 15, fontSize: 15}}>trong vòng 5s</Text>
            </View>
            <Pressable style={[styles.button, isToggled && styles.toggledButton]} onPress={handleToggle}>
              <View style={[styles.circleButton, isToggled ? styles.circleButton1 : styles.circleButton]}></View>
            </Pressable> 
          </View>
        </View>
        <View style={{width: '100%', height: 100}}></View>
      </ScrollView>
    </View>
  )
}

