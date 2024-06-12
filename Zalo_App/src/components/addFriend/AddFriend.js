import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from  'react-native-safe-area-context'
import { styles } from './style'
import { Text, View, TextInput, Pressable, Image, StatusBar, Keyboard } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRight, faChevronLeft, faQrcode, faUsersViewfinder } from '@fortawesome/free-solid-svg-icons';
import { faAddressBook } from '@fortawesome/free-regular-svg-icons';
import axios from '../../config/axios';
import Toast from 'react-native-easy-toast';
import { useSelector } from 'react-redux';

export const AddFriend = ({navigation}) => {
  const device = useSelector(state => state.device)
  const [phoneNumber, setPhoneNumber] = useState('')
  const toastRef = useRef(null);
  const [isInput, setIsInput] = useState(false)
  const [isInput1, setIsInput1] = useState(false)

  useEffect(() => {
    if(phoneNumber.length > 0) {
      setIsInput(true)
    } else {
      setIsInput(false)
    }
    
  }, [phoneNumber]); 

  const findUserByPhone = async ()=>{
    try {
      const res = await axios.get(`/users/detail?phoneNumber=${phoneNumber}`)
      if(res.errCode === 0){
        navigation.navigate('Profile', {phoneNumber: res.data.phoneNumber})
      } else if(res.errCode === 1){
        toastRef.current.props.style.backgroundColor = 'orange';
        toastRef.current.show('Không tìm thấy người dùng này!', 2000);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  }

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
      <View style={styles.header}>
        <View style={{ height: '55%'}}>
          <Pressable style={styles.btnHeader}  onPress={()=>{navigation.goBack()}}>
            <FontAwesomeIcon style={{ }} color='black' size={22} icon={faChevronLeft} />
            <Text style={styles.txtInHeader}>Thêm bạn</Text>
          </Pressable>
        </View>
      </View> 

      <View style={styles.body}>
        <View style={{height: 1, width: '100%', backgroundColor: '#DFDFDF'}}></View>
        
        <View style={{marginTop: 10, marginBottom: 10}}>
          <Image style={{height: 150, width: 150}} source={require('../../../assets/img/maQRFake.png')}></Image>
        </View>

        <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-around', height: 70, backgroundColor: '#FFFFFF', alignItems: 'center'}}>
          <TextInput keyboardType='numeric' style={[styles.textInput, isInput1 ? {borderColor: '#2561B7'} : {}]} onFocus={()=> setIsInput1(true)} onBlur={()=> setIsInput1(false)} onChangeText={(text)=>setPhoneNumber(text)} placeholder='Nhập số điện thoại' placeholderTextColor={'#AEB2B3'}></TextInput>
          <Pressable disabled={!isInput} style={[styles.btnSearch, isInput ? {backgroundColor: '#0068FF'} : {}]} onPress={()=> findUserByPhone()}>
            <FontAwesomeIcon icon={faArrowRight} size={20} color={isInput ? '#FFFFFF' : '#ACAFB6'} /> 
          </Pressable>
        </View>

        {renderLine()}

        <Pressable style={styles.btnQr} onPress={()=> alert('Quest max Qr')}>    
          <FontAwesomeIcon style={{marginLeft: 20}} icon={faQrcode} size={20} color='#164386' />
          <Text style={{fontSize: 18, marginLeft: 15}}>Quét mã QR</Text>
        </Pressable>

        <Pressable style={[styles.btnQr, {marginTop: 10}]} onPress={()=> alert('Danh bạ máy')}>    
          <FontAwesomeIcon style={{marginLeft: 20}} icon={faAddressBook} size={20} color='#164386' />
          <Text style={{fontSize: 18, marginLeft: 15}}>Danh bạ máy</Text>
        </Pressable>

        {renderLine()}

        <Pressable style={[styles.btnQr]} onPress={()=> alert('Bạn bè có thể quen')}>    
          <FontAwesomeIcon style={{marginLeft: 20}} icon={faUsersViewfinder} size={20} color='#164386' />
          <Text style={{fontSize: 18, marginLeft: 15}}>Bạn bè có thể quen</Text>
        </Pressable>

        <Text style={{fontSize: 15, marginTop: 20}}>Xem lời mời kết bạn đã gửi tại trang Danh bạ Zalo</Text>
      </View>
      <Toast style={{backgroundColor: 'green'}} ref={toastRef} position='center' />
      {device.device === 'ios' ? <StatusBar style="auto" /> : ''}
    </View>
  )
}
