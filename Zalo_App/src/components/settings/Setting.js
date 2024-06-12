import { Pressable, ScrollView, Text, View } from 'react-native'
import React from 'react'
import { styles } from './style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowRightFromBracket, faBrush, faChevronLeft, faChevronRight, faCircleInfo, faCircleNotch, faCloudArrowDown, faMagnifyingGlass,  faPhone, faShieldVirus, faUserGear, faUserLock } from '@fortawesome/free-solid-svg-icons'
import { faAddressBook, faBell, faCircleQuestion, faClock, faCommentDots } from '@fortawesome/free-regular-svg-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import axios from '../../config/axios'
import { LinearGradient } from 'expo-linear-gradient'

export const Setting = ({navigation}) => {
  const clearAllData = async () => {
    // await AsyncStorage.clear();
    //       console.log('Tất cả dữ liệu đã được xóa thành công!');
    //       resetToScreen(navigation, 'Login');
    try {
      const res = await axios.put('/users/updateOnline', {time: new Date()});
      if (res.errCode === 0) {
        const response = await axios.post('/auth/logout');
        if (response.errCode === 0) {
          await AsyncStorage.clear();
          console.log('Tất cả dữ liệu đã được xóa thành công!');
          resetToScreen(navigation, 'Login');
        } else {
          console.log('Lỗi khi xóa dữ liệu và đăng xuất');
        }
      }
    } catch (error) {
      console.log('Lỗi khi xóa dữ liệu:', error);
    }
  };

  const resetToScreen = (navigation, routeName) => {
    navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{ name: routeName }],
    }));
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
        <View style={{height: '55%', width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}>
          <Pressable style={styles.pressBack} onPress={()=> {navigation.goBack()}}>
            <FontAwesomeIcon icon={faChevronLeft} style={{marginLeft: 10}} color='#F5F8FF' size={20} />
            <Text style={styles.txtInHeader}>Cài đặt</Text> 
          </Pressable>
          <FontAwesomeIcon style={{marginRight: 10}} color='#F1FFFF' size={23} icon={faMagnifyingGlass} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.body}>        
        <Pressable style={styles.pressShield}  onPress={()=>{navigation.navigate('AccountAndSecurity')}}>
          <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#1A66D4' icon={faShieldVirus} />
          <Text style={styles.txtViewShiled}>Tài khoản và bảo mật</Text>
          <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
        </Pressable> 

        {renderLine()}
        
        <Pressable style={styles.pressShield}  onPress={()=>{navigation.navigate('Privacy')}}>
          <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#1A66D4' icon={faUserLock} />
          <Text style={[styles.txtViewShiled]}>Quyền riêng tư</Text>
          <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
        </Pressable>

        <Pressable style={[styles.pressShield, {marginTop: 9, height: 65}]}  onPress={()=>{alert('Dung lượng và dữ liệu')}}>
          <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#1A66D4' icon={faCircleNotch} />
          <View style={{flex: 1, marginLeft: 20}}>
            <Text style={{fontSize: 18}}>Dung lượng và dữ liệu</Text>
            <Text style={{fontSize: 13}}>Quản lý dữ liệu Zalo của bạn</Text>
          </View>
          <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
        </Pressable>

         {renderLine()}

        <Pressable style={[styles.pressShield, { height: 65}]} onPress={()=>{alert('Sao lưu và khôi phục')}}>
          <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#1A66D4' icon={faCloudArrowDown} />
          <View  style={{flex: 1, marginLeft: 20}}>
            <Text style={{fontSize: 18}}>Sao lưu và khôi phục</Text>
            <Text style={{fontSize: 13}}>Bảo vệ tin nhắn khi cài lại Zalo</Text>
          </View>
          <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
        </Pressable>

        <Pressable  style={[styles.pressShield, {marginTop: 9}]}  onPress={()=>{navigation.navigate('Notification')}}>
          <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#1A66D4' icon={faBell} />
          <Text style={[styles.txtViewShiled]}>Thông báo</Text>
          <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
        </Pressable>

         {renderLine()}

        <Pressable style={[styles.pressShield]} onPress={()=>{navigation.navigate('SettingMessage')}}>
          <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#1A66D4' icon={faCommentDots} />
          <Text style={[styles.txtViewShiled]}>Tin nhắn</Text>
          <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
        </Pressable>

         {renderLine()}

        <Pressable style={styles.pressShield}  onPress={()=>{navigation.navigate('SettingCalling')}}>
          <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#1A66D4' icon={faPhone} />
          <Text style={[styles.txtViewShiled]}>Cuộc gọi</Text>
          <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
        </Pressable>

         {renderLine()}

        <Pressable style={styles.pressShield}  onPress={()=>{navigation.navigate('SettingTimeline')}}>
          <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#1A66D4' icon={faClock} />
          <Text style={[styles.txtViewShiled]}>Nhật ký</Text>
          <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
        </Pressable>
        
         {renderLine()}

        <Pressable style={styles.pressShield}  onPress={()=>navigation.navigate('SettingContact')}>
          <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#1A66D4' icon={faAddressBook} />
          <Text style={[styles.txtViewShiled]}>Danh bạ</Text>
          <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
        </Pressable>
        
         {renderLine()}

        <Pressable style={styles.pressShield}  onPress={()=>{alert('Giao diện và ngôn ngữ')}}> 
          <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#1A66D4' icon={faBrush} />
          <Text style={[styles.txtViewShiled]}>Giao diện và ngôn ngữ</Text>
          <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
        </Pressable>

        <Pressable style={[styles.pressShield, {marginTop: 9}]}  onPress={()=>navigation.navigate('SettingInfo')}> 
          <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#1A66D4' icon={faCircleInfo} />
          <Text style={[styles.txtViewShiled]}>Thông tin về Zalo</Text>
          <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
        </Pressable>

        {renderLine()}

        <Pressable style={styles.pressShield}  onPress={()=>{alert('Liên hệ hỗ trợ')}}> 
          <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#1A66D4' icon={faCircleQuestion} />
          <Text style={[styles.txtViewShiled]}>Liên hệ hỗ trợ</Text>
          <View style={{ marginRight: 15, height: 30, width: 30, backgroundColor: '#F1F2F4', justifyContent: 'center', alignItems: 'center', borderRadius: 20}}>
            <FontAwesomeIcon size={16} icon={faCommentDots} />
          </View>
        </Pressable>

        <Pressable style={[styles.pressShield, {marginTop: 9}]}  onPress={()=>{alert('Chuyển tài khoản')}}> 
          <FontAwesomeIcon style={{marginLeft: 15}} size={22} color='#1A66D4' icon={faUserGear} />
          <Text style={[styles.txtViewShiled]}>Chuyển tài khoản</Text>
          <FontAwesomeIcon size={15} color='#6E6E6E' style={{marginRight: 15}} icon={faChevronRight}/>
        </Pressable>

        {renderLine()}

        <View style={styles.viewLogout}> 
          <Pressable style={styles.pressLogout} onPress={()=> clearAllData()}> 
            <FontAwesomeIcon icon={faArrowRightFromBracket} size={20} />
            <Text style={{fontSize: 20, fontWeight: '500'}}> Đăng xuất</Text>
          </Pressable>
        </View>
        <View style={{width: '100%', height: 100}}></View>
      </ScrollView>
    </View>
  )
}

