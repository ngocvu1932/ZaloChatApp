import { Pressable, Text, TextInput, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { styles } from './style';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import firebase from 'firebase/compat/app';
import { firebaseConfig } from '../../utils/firebase_config'
import { LinearGradient } from 'expo-linear-gradient';

export const RegisterPage2 = ({ navigation, route }) => {
  const { name, password } = route.params;
  const [isData, setIsData] = useState(true);
  const [isChecked1, setIsChecked1] = useState(true);
  const [isChecked2, setIsChecked2] = useState(true);
  const toastRef = useRef(null);
  var [phoneNumber, setPhoneNumber] = useState('');
  const recaptchaVerifiedRef = useRef(null);

  useEffect(()=>{
    if(phoneNumber.length == 10 && isChecked1 && isChecked2){
      setIsData(false)
    }else{
      setIsData(true)
    }
  }, [phoneNumber, isChecked1, isChecked2])

  const setPhoneCheck = (data) => {
    // console.log("data phone check", data);
    const regex = /^0{1}[0-9]{9}$/;
    if (!regex.test(data) || data.length != 10) {
      return false;
    }
    return true;
  }

  const sendVerification = () => {
    const check = setPhoneCheck(phoneNumber);
    if(check){
      if(phoneNumber.startsWith("0")){
        phoneNumber = `+84${phoneNumber.slice(1)}`
        setPhoneNumber(phoneNumber);
        console.log("phone number",phoneNumber);
      }
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      phoneProvider
        .verifyPhoneNumber(phoneNumber, recaptchaVerifiedRef.current)
        .then((confirmation) => {
          navigation.navigate('RegisterAuth', { name: name, password: password, phone: phoneNumber, confirm: confirmation });
        })
    }else{
      toastRef.current.show('Số điện thoại không hợp lệ!', 2000);
      console.log("Số điện thoại không hợp lệ!");
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#008BFA', '#00ACF4']}>
        <View style={{height: '55%', justifyContent: 'center'}}>
          <Pressable style={styles.pressBack} onPress={()=> {navigation.goBack()}}>
            <FontAwesomeIcon icon={faChevronLeft} style={{marginLeft: 10}} color='#F5F8FF' size={19} />
            <Text style={styles.txtInHeader}>Tạo tài khoản</Text> 
          </Pressable>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <View style={{ backgroundColor: '#F9FAFE', width: '100%', height: 30, justifyContent: 'center' }}>
          <Text style={{ fontSize: 15, marginLeft: 20 }}>Nhập số điện thoại của bạn để tạo tài khoản mới</Text>
        </View>

        <TextInput style={styles.inputt} placeholder='Số điện thoại' onChangeText={setPhoneNumber} />

        <View style={{ width: '90%' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
            <BouncyCheckbox
              size={18}
              fillColor="blue"
              unfillColor="#FFFFFF"
              innerIconStyle={{ borderWidth: 1, borderColor: "gray" }}
              onPress={(isChecked) => { setIsChecked1(isChecked); }}
            />
            <Text style={{ fontSize: 15 }}>Tôi đồng ý với các điều khoản sử dụng của Zalo</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <BouncyCheckbox
              size={18}
              fillColor="blue"
              unfillColor="#FFFFFF"
              innerIconStyle={{ borderWidth: 1, borderColor: "gray" }}
              onPress={(isChecked) => { setIsChecked2(isChecked); }}
            />
            <Text style={{ fontSize: 15 }}>Tôi đồng ý với điều khoản Mạng xã hội của Zalo</Text>
          </View>
        </View>

        <Pressable disabled={isData} style={[styles.btnRe, isData ? styles.gray : styles.blue]} onPress={() => sendVerification()} >
          <FontAwesomeIcon size={23} icon={faArrowRight} />
        </Pressable>
      </View>
      {/* Toast component here */}
      <FirebaseRecaptchaVerifierModal ref={recaptchaVerifiedRef} firebaseConfig={firebaseConfig} />   
    </View>
  )
}