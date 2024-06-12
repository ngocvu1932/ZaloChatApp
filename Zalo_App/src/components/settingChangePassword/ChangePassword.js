import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { styles } from './style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import Toast, { DURATION } from 'react-native-easy-toast';
import axios from '../../config/axios'
import { useSelector } from 'react-redux'
import { LinearGradient } from 'expo-linear-gradient'

export const ChangePassword = ({navigation}) => {
  const user = useSelector(state => state.user.user.user);
  const toastRef = useRef(null);
  const [isShow, setIsShow] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPasswordAgain, setNewPasswordAgain] = useState('');
  const [userInfoData, setUserInfoData] = useState({
    userName: null,
    birthdate: null
  });
  const [newData, setNewData] = useState({
    oldPassword: null,
    newPassword: null ,
  });

  useEffect(() => {
    const getInfo = async() => {
      try {
        const response = await axios.get(`/users/detail?phoneNumber=${user.phoneNumber}`);
        if (response.errCode === 0) {
          if (response.data.userInfo.birthdate === null) {
            setUserInfoData({...userInfoData, userName: removeVietnameseDiacriticsAndSpaces(response.data.userName), birthdate: null });
          } else {
            setUserInfoData({...userInfoData, userName: removeVietnameseDiacriticsAndSpaces(response.data.userName), birthdate: response.data.userInfo.birthdate.substring(0, 4)})
          }
        } else {
          setUserInfoData({...userInfoData, userName: null , birthdate: null});
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    if (user) {
      getInfo();
    }
  }, [user]);

  useEffect(() => {
    setNewData({...newData, newPassword: newPassword, oldPassword: oldPassword});
  }, [newPassword, oldPassword]);

  useEffect(() => {
    if (newPassword === '' || oldPassword === '' || newPasswordAgain === '') {
      setIsDone(false);
    } else {
      setIsDone(true);
    }
  }, [newData, newPasswordAgain]);

  const changePassword = async(newPassword) => {
    if (newPassword.newPassword.toLowerCase().includes(userInfoData.userName.toLowerCase()) || newPassword.newPassword.includes(userInfoData.birthdate)) {
      toastRef.current.props.style.backgroundColor = 'red';
      toastRef.current.show('Mật khẩu không được chứa tên hoặc năm sinh của bạn', 2000);
      return false;
    } else {
      try {
        const response = await axios.put('/auth/change-password', { 
          oldPassword: newPassword.oldPassword,
          newPassword: newPassword.newPassword
         });
        return response;
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }
  
  const handleSave = async () => {
    try {
      if (checkNewPassword()) {
        const response = await changePassword(newData);
        if (response.errCode === 0) {
          toastRef.current.show('Đổi mật khẩu thành công', 2000);
          setTimeout(() => {
            navigation.goBack();
          }, 2000);
        } else if (response.errCode === 3)  {
          toastRef.current.props.style.backgroundColor = 'red';
          toastRef.current.show('Mật khẩu hiện tại không chính xác', 2000);
        } 
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const checkNewPassword = () => {
    if (newPassword !== newPasswordAgain) {
      toastRef.current.props.style.backgroundColor = 'red';
      toastRef.current.show('Mật khẩu mới không trùng khớp', 2000);
      return false;
    } else {
      return true;
    }
  };

  function removeVietnameseDiacriticsAndSpaces(str) {
    // Normalize the string and remove diacritics
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
    // Remove spaces
    return str.replace(/\s+/g, '');
  }
  return (
    <View style={styles.container}>
      <LinearGradient style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#008BFA', '#00ACF4']}>
        <View style={{height: '55%', justifyContent: 'center'}}>
          <Pressable style={styles.pressBack} onPress={()=> {navigation.goBack()}}>
            <FontAwesomeIcon icon={faChevronLeft} style={{marginLeft: 10}} color='#F5F8FF' size={20} />
            <Text style={styles.txtInHeader}>Đổi mật khẩu</Text> 
          </Pressable>
        </View>
      </LinearGradient>

      <View style={styles.body}>   
        <View style={{height: 40, backgroundColor: '#F1F2F4', justifyContent: 'center'}}>
          <Text style={{fontSize: 15, marginLeft: 10, marginRight: 10}}>Mật khẩu phải gồm chữ, số hoặc kí tự đặc biệt; không được chứa năm sinh và tên Zalo của bạn.</Text>
        </View>

        <View style={{width:'95%', alignSelf: 'center', marginTop: 10}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 16, color: '#07439B'}}>Mật khẩu hiện tại</Text>
            <Pressable style={{height: 30, width: 50, justifyContent: 'center', alignItems: 'center'}} onPress={()=>setIsShow(!isShow)}>
              <Text style={{fontSize: 16, color: '#7E828D'}}>{isShow ? 'Hiện' : 'Ẩn'}</Text>
            </Pressable>
          </View>
          <TextInput onChangeText={(text)=> setOldPassword(text)} secureTextEntry={isShow} style={{height: 40, fontSize: 18, borderBottomWidth: 1, borderColor: '#DFDFDF'}} placeholder='Nhập mật khẩu hiện tại' placeholderTextColor={'#7B828A'}></TextInput>
        </View>
        
        <View style={{width:'95%', alignSelf: 'center', marginTop: 10}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 16, color: '#07439B'}}>Mật khẩu mới</Text>
          </View>
          <TextInput onChangeText={(text)=> {setNewPassword(text)}} secureTextEntry={isShow} style={{height: 40, fontSize: 18, borderBottomWidth: 1, borderColor: '#DFDFDF'}} placeholder='Nhập mật khẩu mới' placeholderTextColor={'#7B828A'}></TextInput>
          <TextInput onChangeText={(text)=> setNewPasswordAgain(text)} secureTextEntry={isShow} style={{height: 40, fontSize: 18, borderBottomWidth: 1, marginTop: 10, borderColor: '#DFDFDF'}} placeholder='Nhập lại mật khẩu mới' placeholderTextColor={'#7B828A'}></TextInput>
        </View>


        <View style={{alignItems: 'center', marginTop: 50}}> 
          <Pressable disabled={!isDone} onPress={()=>handleSave()} style={[styles.btnDone, isDone ? {backgroundColor: '#008FFF'} : {backgroundColor: '#C1D4E3'}]}>
            <Text style={{fontSize: 18, color: 'white'}}>Cập nhật</Text>
          </Pressable>
        </View>

        <Toast ref={toastRef} style={{backgroundColor: 'green'}} position='top' />
      </View>
    </View>
  )
}

