import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import React, { useState } from 'react'
import { styles } from './style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faMobilePhone, faLock,  faChevronLeft, faChevronRight, faShieldVirus, faCalendarDays, faUserClock, faPhone, faBan, faUserGear } from '@fortawesome/free-solid-svg-icons'
import { faCalendarPlus, faComment, faCommentDots, faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { LinearGradient } from 'expo-linear-gradient'

export const Privacy = ({navigation}) => {
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
            <Text style={styles.txtInHeader}>Quyền riêng tư</Text> 
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView style={styles.body}>   
        <View style={styles.viewAccount}>
          <Text style={styles.txtTitle}>Cá nhân</Text>
          <Pressable style={styles.pressBirthDay} onPress={()=> alert('sinh nhật')}>
            <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#6E6E6E' icon={faCalendarDays} />
            <Text style={styles.textBirthDay}>Sinh nhật</Text>
            <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
          </Pressable>

          {renderLine()}

          <Pressable style={styles.pressBirthDay} onPress={()=> alert('Hiện trạng thái truy cập')}>
            <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#6E6E6E' icon={faUserClock} />
            <Text style={styles.textBirthDay}>Hiện trạng thái truy cập</Text>
            <Text style={{fontSize: 15, marginRight: 15}}>Đang bật</Text>
          </Pressable>
        </View>

        <View style={styles.viewSecutity}>
          <Text style={styles.txtTitle}>Tin nhắn và cuộc gọi</Text>
          <Pressable style={styles.pressBirthDay} onPress={()=> alert('Hiện trạng thái "Đã xem')}>
            <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#6E6E6E' icon={faComment} />
            <Text style={styles.textBirthDay}>Hiện trạng thái "Đã xem"</Text>
            <Text style={{fontSize: 15, marginRight: 15}}>Đang bật</Text>
          </Pressable>

          {renderLine()}

          <Pressable style={styles.pressBirthDay} onPress={()=> alert('Cho phép nhắn tin')}>
            <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#6E6E6E' icon={faCommentDots} />
            <Text style={styles.textBirthDay}>Cho phép nhắn tin</Text>
            <Text style={{fontSize: 15, marginRight: 15}}>Mọi người</Text>
          </Pressable>

          {renderLine()}

          <Pressable style={styles.pressBirthDay} onPress={()=> alert('Cho phép gọi điện')}>
            <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#6E6E6E' icon={faPhone} />
            <Text style={styles.textBirthDay}>Cho phép gọi điện</Text>
            <Text style={{fontSize: 15, marginRight: 15}}>Mọi người</Text>
          </Pressable>
        </View>

        {renderLine()}

        <View style={styles.viewLogin}>
          <Text style={styles.txtTitle}>Nhật ký</Text>
          <Pressable style={styles.pressBirthDay} onPress={()=> alert('Cho phép xem và bình luận')}>
            <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#6E6E6E' icon={faPenToSquare} />
            <Text style={styles.textBirthDay}>Cho phép xem và bình luận</Text>
            <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
          </Pressable>
        </View>

        <Pressable style={[styles.pressBirthDay, {marginTop: 9}]} onPress={()=> alert('Chặn và ẩn')}>
          <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#6E6E6E' icon={faBan} />
          <Text style={styles.textBirthDay}>Chặn và ẩn</Text>
          <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
        </Pressable>

        <View style={styles.viewSearchAndF}>
          <Text style={styles.txtTitle}>Nguồn tìm kiếm và kết bạn</Text>

          <Pressable style={[styles.pressBirthDay, {height: 80}]} onPress={()=> alert('ự động kết bạn từ danh bạ máy')}>
            <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#6E6E6E' icon={faPenToSquare} />
            <View style={{flex: 1, marginLeft: 15}}>
              <Text style={{fontSize: 18}}>Tự động kết bạn từ danh bạ máy</Text>
              <Text style={{fontSize: 15}}>Thêm liên hệ vào danh bạ Zalo</Text>
            </View> 
            <Pressable style={[styles.button, isToggled && styles.toggledButton]} onPress={handleToggle}>
              <View style={[styles.circleButton, isToggled ? styles.circleButton1 : styles.circleButton]}></View>
            </Pressable> 
          </Pressable>

          {renderLine()}

          <Pressable style={styles.pressBirthDay} onPress={()=> alert('sinh nhật')}>
              <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#6E6E6E' icon={faUserGear} />
              <Text style={styles.textBirthDay}>Quản lý nguồn tìm kiếm và kết bạn</Text>
              <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
          </Pressable>
        </View>

        <View style={styles.viewEnd}>
          <Text style={styles.txtTitle}>Quyền của tiện ích</Text>
          <Pressable style={styles.pressBirthDay} onPress={()=> alert('Tiện ích')}>
            <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#6E6E6E' icon={faCalendarPlus} />
            <Text style={styles.textBirthDay}>Tiện ích</Text>
            <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
          </Pressable>
        </View>
        <View style={{height: 100, width: '100%'}}></View>
      </ScrollView>
    </View>
  )
}

