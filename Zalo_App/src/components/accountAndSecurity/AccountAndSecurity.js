import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import React, { useState } from 'react'
import { styles } from './style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faChevronRight, faCircleCheck, faLock,  faMobilePhone,  faMobileScreenButton,  faPhone, faQrcode, faShieldVirus, faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { useSelector } from 'react-redux'
import { LinearGradient } from 'expo-linear-gradient'

export const AccountAndSecurity = ({navigation}) => {
  const user = useSelector(state => state.user);
  const [isToggled, setToggled] = useState(false);

  const handleToggle = () => {
    setToggled(!isToggled);
  };

  const renderLine = () => (
    <View style={styles.line}>
      <View style={styles.line1} >
      </View>
      <View style={styles.line2}>
      </View>
    </View>
  )

  return (
    <View style={styles.container}> 
      <LinearGradient style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#008BFA', '#00ACF4']}>
        <View style={{height: '55%', justifyContent: 'center'}}>
          <Pressable style={styles.pressBack} onPress={()=> {navigation.goBack()}}>
            <FontAwesomeIcon icon={faChevronLeft} style={{marginLeft: 10}} color='#F5F8FF' size={20} />
            <Text style={styles.txtInHeader}>Tài khoản và bảo mật</Text> 
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView style={styles.body}>   
        <View style={styles.viewAccount}>
          <Text style={styles.txtTitle}>Tài khoản</Text>
          <View style={{alignItems: 'center'}} >
            <Pressable style={styles.pressAccount} onPress={()=> {alert('Thông tin cá nhân')}}>
              { user.user?.user?.avatar?.substring(0 ,3) === 'rgb' ? 
                <View style={[styles.avatar, {backgroundColor: user.user?.user?.avatar}]} /> 
              :  
                <Image source={{uri: user.user?.user?.avatar}} style={styles.avatar}></Image>
              }     
              <View style={{flex: 1, marginLeft: 10}}>
                <Text style={styles.txtAllOne}>Thông tin cá nhân</Text>
                <Text numberOfLines={1} style={styles.txtName}>{user.user?.user.userName}</Text>
              </View>
              <FontAwesomeIcon style={{marginRight: 15}} size={15} color='#6E6E6E' icon={faChevronRight}/>
            </Pressable>
          </View> 

          <Pressable style={styles.pressNumberPhone} onPress={()=> {alert('Số điện thoại')}}>
            <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#6E6E6E' icon={faPhone} />
            <View style={styles.viewChild}>
              <Text style={styles.txtChild}>Số điện thoại</Text>
              <Text style={{fontSize: 15}}>{user.user?.user.phoneNumber}</Text>
            </View>
            <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
          </Pressable>
        </View>

        {renderLine()}
         
        <Pressable style={styles.pressPrivacy} onPress={()=> {alert('Định danh tài khoản')}}>
            <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#6E6E6E' icon={faUserCheck} />
            <Text style={[styles.txtChild, {flex: 1, marginLeft: 15}]}>Định danh tài khoản</Text>
            <View style={{flexDirection: "row", alignItems: 'center'}} >
              <FontAwesomeIcon icon={faCircleCheck} size={14} color='#288443'/>
              <Text style={{fontSize: 15, color: '#288443', marginRight: 10}} > Đã định danh</Text> 
            </View>
            <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
        </Pressable>

        {renderLine()}

        <Pressable style={styles.pressPrivacy} onPress={()=> {alert('Mã QR')}}>
            <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#6E6E6E' icon={faQrcode} />
            <Text style={[styles.txtChild, {flex: 1, marginLeft: 15}]}>Mã QR của tôi</Text>
            <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
        </Pressable>

        <View style={styles.viewSecutity}>
          <Text style={styles.txtTitle}>Bảo mật</Text>
          <Pressable style={styles.pressNumberPhone} onPress={()=> {alert('Kiểm tra bảo mật')}}>
            <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#6E6E6E' icon={faShieldVirus} />
            <View style={{flex: 1, marginLeft: 15}}>
              <Text style={styles.txtChild}>Kiểm tra bảo mật</Text>
              <Text style={{fontSize: 16, color: '#288443'}}>Không có vấn đề bảo mật nào</Text>
            </View>
            <FontAwesomeIcon icon={faCircleCheck} style={{marginRight: 10}} size={14} color='#288443'/>
            <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
          </Pressable>
        </View>

        {renderLine()}

        <Pressable style={styles.pressPrivacy} onPress={()=> {alert('Khóa Zalo')}}>
            <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#6E6E6E' icon={faMobileScreenButton} />
            <Text style={[styles.txtChild, {flex: 1, marginLeft: 15}]}>Khóa Zalo</Text>
            <Text style={{fontSize: 15, marginRight: 10}}>Đang tắt</Text>
            <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
        </Pressable>

        <View style={styles.viewLogin}>
          <Text style={styles.txtTitle}>Đăng nhập</Text>
          <View style={styles.pressSecurityTow} onPress={()=> {alert('Bảo mật 2 lớp')}}>
            <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#6E6E6E' icon={faShieldVirus} />
            <View style={{flex: 1, marginLeft: 15}}>
              <Text style={styles.txtChild}>Bảo mật 2 lớp</Text>
              <Text style={{fontSize: 15}}>Thêm hình thức xác nhận để bảo vệ tài khoản khi đăng nhập trên thiết bị mới</Text>
            </View>

            <Pressable style={[styles.button, isToggled && styles.toggledButton]} onPress={handleToggle}>
              <View style={[styles.circleButton, isToggled ? styles.circleButton1 : styles.circleButton]}></View>
            </Pressable>
          </View>
        </View>

        {renderLine()}

        <Pressable style={styles.pressNumberPhone} onPress={()=> {alert('Thiết bị đăng nhập')}}>
          <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#6E6E6E' icon={faMobilePhone} />
          <View style={{flex: 1, marginLeft: 15}}>
            <Text style={styles.txtChild}>Thiết bị đăng nhập</Text>
            <Text style={{fontSize: 15}}>Quản lý các thiết bị bạn sử dụng để đăng nhập Zalo</Text>
          </View>
          <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
        </Pressable>

        {renderLine()}

        <Pressable style={styles.pressPrivacy} onPress={()=> {navigation.navigate('ChangePassword')}}>
            <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#6E6E6E' icon={faLock} />
            <Text style={[styles.txtChild, {flex: 1, marginLeft: 15}]}>Mật khẩu</Text>
            <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
        </Pressable>

        <Pressable style={[styles.pressPrivacy, {marginTop: 9}]} onPress={()=> {alert('Xóa tài khoản')}}>
            <Text style={[styles.txtChild, {marginLeft: 15}]}>Xóa tài khoản</Text>
            <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
        </Pressable>
        <View style={{height: 100, width: '100%'}}></View>
      </ScrollView>
    </View>
  )
}

