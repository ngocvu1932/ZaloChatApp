import { Pressable, Text, TextInput, View} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { styles } from './style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowRight, faChevronLeft, faCircle} from '@fortawesome/free-solid-svg-icons'
import Toast from 'react-native-easy-toast';
import { LinearGradient } from 'expo-linear-gradient';

export const RegisterPageL = ({navigation}) => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [isData, setIsData] = useState(true)
  const toastRef = useRef(null);

  useEffect(() => {
    // console.log(name.length, password.length);
    if(name.length > 1 && name.length < 41 && password.length > 5) {
      setIsData(false)
    } else {
      setIsData(true)
    }
  }, [name, password])

  const successHandle = ()=>{
    const check= checkName(name, password);
    if (check) {
      navigation.navigate('RegisterPage2', {name: name, password: password})
    } else {
      toastRef.current.props.style.backgroundColor='red'
      toastRef.current.show('Tên hoặc mật khẩu không hợp lệ', 2000)
    }
  }

  const checkName = (name, password) => {
    const regex = /^[^0-9]{2,}$/;
    if (regex.test(name) && !password.toLowerCase().includes(removeVietnameseDiacriticsAndSpaces(name.toLowerCase()))) {
      return true;
    } else {
      return false;
    }
  }

  function removeVietnameseDiacriticsAndSpaces(str) {
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
    return str.replace(/\s+/g, '');
  }
  
  return (
    <View style={styles.container}>
      <LinearGradient style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#008BFA', '#00ACF4']}>
        <View style={{height: '55%', justifyContent: 'center'}}>
          <Pressable style={styles.pressBack} onPress={()=> {navigation.goBack()}}>
            <FontAwesomeIcon icon={faChevronLeft} style={{marginLeft: 10}} color='#F5F8FF' size={18} />
            <Text style={styles.txtInHeader}>Tạo tài khoản</Text> 
          </Pressable>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <View style={{alignItems: 'center', width: '95%'}}>
          <Text style={{alignSelf: 'flex-start', fontSize: 17, fontWeight: '500', marginTop: 10}}>Tên Zalo</Text>
          <TextInput style={styles.textNameI} placeholder='Gồm 2-40 ký tự, không được số' onChangeText={(name)=>setName(name)} placeholderTextColor={'#7F838E'}></TextInput>

          <Text style={{alignSelf: 'flex-start', fontSize: 17, fontWeight: '500', marginTop: 15}}>Mật khẩu</Text>
          <TextInput style={styles.textNameI} placeholder='Từ 6 kí tự trở lên, không trùng với tên' onChangeText={(password)=>setPassword(password)} placeholderTextColor={'#7F838E'}></TextInput>
        </View>

        <View style={{width: '95%'}}>
          <Text style={[styles.texxt, {marginTop: 20}]}>Lưu ý khi đặt tên:</Text>
          <View style={{marginTop: 8}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FontAwesomeIcon size={10} icon={faCircle} />
              <Text style={styles.texxt}>  Không vi phạm Quy định đặt tên trên Zalo.</Text>
            </View>
            <View style={{flexDirection: 'row',  alignItems: 'center', marginTop: 8}}>
              <FontAwesomeIcon size={10} icon={faCircle} />
              <Text style={styles.texxt}>  Nên sử dụng tên thật giúp bạn bè dễ nhận ra bạn.</Text>
            </View>
          </View>
        </View>

        <Pressable disabled={isData} style={[styles.btnRe, isData ? styles.gray : styles.blue] } onPress={()=>{successHandle()}}>
            <FontAwesomeIcon size={22} icon={faArrowRight} />
        </Pressable>
      </View>

      <Toast ref={toastRef} style={{backgroundColor: 'green'}} position='top'/>
      
    </View>
  )
}

