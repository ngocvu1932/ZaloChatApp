
import { Pressable, Text, TextInput, View} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { styles } from './style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import axios, { setAuthorizationAxios } from '../../config/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-easy-toast';
import { CommonActions } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userSlice';
import { LinearGradient } from 'expo-linear-gradient';

export const LoginPage = ({navigation}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const [isFillText, setIsFillText] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState(''); 
  const toastRef = useRef(null); 
  const dispatch = useDispatch();

  const loginFunc =  async (phoneNumber, password) => {
    try {
      const response = await axios.post(`/auth/login`, {
        phoneNumber: phoneNumber,
        password: password
      });
      
      return response;
    } catch (error) { 
      console.log('Error during login func:', error);
      throw error;
    } 
  }

  const verifyUser = async (id, phoneNumber) => {
    try {
        const response = await axios.post(`/auth/verify`, { id, phoneNumber });
        return response;
    } catch (error) {
        console.error('Error during user verification:', error);
        throw error;
    }
  };

  const loginHandleSuccess = async () => {
    try {
      const phoneCheck = setPhoneCheck(phone);
      if (phoneCheck) {
        const loginResponse = await loginFunc(phone, password);
        const id = loginResponse.data?.id;     

        if (id != null) {
          const verifyResponse = await verifyUser(id, phone);

          if (verifyResponse.errCode === 0) {
            const data = verifyResponse.data;
            try {
              // console.log("data", typeof data);
              await AsyncStorage.setItem('dataUser', JSON.stringify(data));
              dispatch(setUser(data));
              setAuthorizationAxios(data.access_token);
              console.log('LoginPage: Login successfully');
              resetToScreen(navigation, 'MainScreen'); 
            } catch (error) {
              console.error('Error saving authentication info:', error);
            }
          }
        } else {
          toastRef.current.show('Tài khoản hoặc mật khẩu không hợp lệ!', 2000);
        }
      } else {
        toastRef.current.show('Số điện thoại không hợp lệ!', 2000);
      }
    } catch (error) {
      console.log('Error during login:', error.message);
    }
  } 

  // Trong một component hoặc bất kỳ nơi nào muốn thực hiện việc xóa các màn hình trước đó
  const resetToScreen = (navigation, routeName) => {
    navigation.dispatch(CommonActions.reset({
      index: 0,
      routes: [{ name: routeName }],
    }));
  };

  const handleToggle = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }; 

  useEffect(() => {
    if (phone.length > 0 && password.length > 0) {
      setIsFillText(false);
    } else {
      setIsFillText(true);
    }
  }, [phone, password]);

  const setPhoneCheck = (data) => {
    const regex = /^0{1}[0-9]{9}$/;
    if (!regex.test(data) || data.length != 10) {
      return false;
    }
    return true;
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#008BFA', '#00ACF4']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <View style={{height: '60%', justifyContent: 'center'}}>
          <Pressable style={styles.pressBack} onPress={()=> {navigation.goBack()}}>
            <FontAwesomeIcon icon={faChevronLeft} style={{marginLeft: 10}} color='#F5F8FF' size={20} />
            <Text style={styles.txtInHeader}>Đăng nhập</Text> 
          </Pressable>
        </View>
      </LinearGradient>
      
      <View style={styles.body}>
        <View style={{height: 40, backgroundColor: '#F9FAFE', justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 14}}>Vui lòng nhập số điện thoại và mật khẩu để đăng nhập</Text>
        </View>

        <View style={{marginTop: 40, alignItems: 'center'}}>
          <TextInput style={styles.inputt} placeholder='Số điện thoại' placeholderTextColor={'#818A91'} onChangeText={(text)=> {setPhone(text)}}></TextInput>
          <View style={{width: '100%', justifyContent: 'center', flexDirection: 'row'}}>
            <TextInput style={[styles.inputt, {marginTop:10}]} placeholder='Mật khẩu' placeholderTextColor={'#818A91'} secureTextEntry={isPasswordVisible} onChangeText={(text)=> {setPassword(text)}}></TextInput>
            <Pressable onPress={()=> handleToggle()} style={{height: 50, width: 50,justifyContent: 'center', alignItems: 'center', marginLeft: -50}}>
              <Text style={{fontSize: 14, fontWeight: 500, color: '#7B848B'}}>{isPasswordVisible ? "Hiện" : "Ẩn"}</Text>
            </Pressable>
          </View>

          <Pressable onPress={()=> alert('Lấy lại mật khẩu')} style={{marginTop: 20, alignSelf: 'flex-start', marginLeft: 20, height: 30}}>
            <Text style={{fontSize: 16, color: '#33A1FF'}}>Lấy lại mật khẩu</Text>
          </Pressable>

          <Pressable disabled={isFillText} onPress={loginHandleSuccess} style={[styles.btnLogin, isFillText ? styles.gray : styles.blue]}>
            <Text style={{fontSize: 20, color: 'white', fontWeight: '500'}}>Đăng nhập</Text>
          </Pressable>
        </View>

        <Toast ref={toastRef} position='top' />

      </View>
      
    </SafeAreaView>
  )
}