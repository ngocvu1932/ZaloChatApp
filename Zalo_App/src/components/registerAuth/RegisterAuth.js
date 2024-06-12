import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { styles } from './style';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRight, faChevronLeft, faCommentSms, faL} from '@fortawesome/free-solid-svg-icons'
import axios from '../../config/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast, { DURATION } from 'react-native-easy-toast';
import { CommonActions } from '@react-navigation/native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import firebase from 'firebase/compat/app';
import { firebaseConfig } from '../../utils/firebase_config'
import { LinearGradient } from 'expo-linear-gradient';


export const RegisterAuth = ({navigation, route}) => {
  const {name, password} = route.params;
  var phone = route.params.phone;
  const [confirm, setConfirm] = useState(route.params.confirm);
  const [code , setCode] = useState('');   
  const [loading, setLoading] = useState(false);

  if (phone.startsWith("+84")) {
    phone = "0" + phone.slice(3);
  }
  const [isCode, setIsCode] = useState(true)
  const toastRef = useRef(null);

  const [userData, setUserData] = useState({
    userName: '',
    phoneNumber: '',
    password: password,
  });

  useEffect(()=>{
    if (code.length == 6) {
      setIsCode(false)
    } else {
      setIsCode(true)
    }
  }, [code])

  useEffect(() => {
    setUserData({userName: name, phoneNumber: phone, password: password})
  }, [name, phone])

  const confirmCode = async () => {
    setLoading(true);
    try {
      const credentials = firebase.auth.PhoneAuthProvider.credential(
        confirm,
        code
      );
      firebase
        .auth()
        .signInWithCredential(credentials)
        .then( async (result) => {
          await successRegisterHandle();
        })
        .catch((error) => {
          setLoading(false);
          toastRef.current.props.style.backgroundColor = 'red';
          toastRef.current.show('Vui lòng kiểm tra lại OTP!', 1999);
          console.log('Invalid code', error);
          setCode('')
        });

    } catch (error) {
      setLoading(false);
      toastRef.current.props.style.backgroundColor = 'red';
      toastRef.current.show('Mã đã hết hạn!', 1999);
      console.log('Invalid credentials', error);
    }
  };

  const registerUser = async (userData) => {
    try {
      const response = await axios.post(`/auth`, userData);
      return response
    } catch (error) {
      console.error("Error register: ", error);
    }
  };

  async function successRegisterHandle(){
    const res = await registerUser(userData);

    if (res.errCode === 0) {
      setLoading(false);
      toastRef.current.show('Đăng kí thành công!', 1999);
      setTimeout(() => {
        resetToScreen(navigation, 'Login');
      }, 2000);
    } else {
      setLoading(false);
      toastRef.current.props.style.backgroundColor = 'red';
      toastRef.current.show('Số điện thoại đã tồn tại!', 3000);
    }
  }

  const resetToScreen = (navigation, routeName) => {
    navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{ name: routeName }],
    }));
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <LinearGradient style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#008BFA', '#00ACF4']}>
        <View style={{height: '55%', justifyContent: 'center'}}>
          <Pressable style={styles.pressBack} onPress={()=> {navigation.goBack()}}>
            <FontAwesomeIcon icon={faChevronLeft} style={{marginLeft: 10}} color='#F5F8FF' size={19} />
            <Text style={styles.txtInHeader}>Xác thực</Text> 
          </Pressable>
        </View>
      </LinearGradient>
      
      <View style={styles.body}>
        <View style={{backgroundColor: '#F9FAFE', width: '100%', height: 50, justifyContent: 'center'}} >
          <Text style={{fontSize: 15, marginLeft: 20}}>Vui lòng không chia sẻ mã xác thực để tránh mất tài khoản</Text>
        </View>

        <View style={{alignItems: 'center', marginTop: 30}}>
          <FontAwesomeIcon size={70} color='gray' icon={faCommentSms} />
          <Text style={{fontSize: 18, fontWeight: 500, marginTop: 15}}>Đã gửi mã xác thực đến số {phone}</Text>
          <Text style={{fontSize: 15, marginTop: 10}}>Điền mã xác đã nhận vào ô bên dưới</Text>
        </View>

        <TextInput style={styles.inputt} placeholder='Mã xác thực' value={code} onChangeText={(code) => setCode(code)} ></TextInput>

        <Pressable style={styles.btnReCode} onPress={()=>{alert('Gửi lại mã')}}>
          <Text style={{color: 'blue', fontSize: 15}}>Gửi lại mã</Text>
        </Pressable>

        <Pressable disabled={isCode} style={[styles.btnRe, isCode ? styles.gray : styles.blue]} onPress={() => {confirmCode()} }>
          <Text style={{fontSize: 20}}>Tiếp tục</Text>
        </Pressable>
      </View>
      <Toast style={{backgroundColor: 'green'}} ref={toastRef} position='center' />

      {
        loading && 
        <View style={{position: 'absolute', top: 0, right: 0, left: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.3)', justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size='large' colors='black'/>
        </View>
      }
      
    </SafeAreaProvider>
  )
}

