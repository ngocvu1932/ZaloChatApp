import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from  'react-native-safe-area-context'
import { styles } from './style'
import { Text, View, Pressable, Switch, Modal, Button, TextInput, Keyboard } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCamera, faChevronLeft, faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from '../../config/axios';
import Toast from 'react-native-easy-toast';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { faImages } from '@fortawesome/free-regular-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import {CLOUD_NAME, UPLOAD_PRESET, FOLDER} from '@env';
import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../redux/userInfoSlice';
import { setUser } from '../../redux/userSlice';
import { socket } from '../../config/io';

export const ProfileOptions = ({navigation, route}) => {
  const {isUser, isFriend } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleChangeAvt, setModalVisibleChangeAvt] = useState(false);
  const [modalVisibleChangeBio, setModalVisibleChangeBio] = useState(false);
  const [typeAvt, setTypeAvt] = useState();
  const toastRef = useRef(null);
  const [isToggled, setToggled] = useState(false);
  const userInfo = useSelector(state => state.userInfo); 
  const user = useSelector(state => state.user); 
  const dispatch = useDispatch();
  const [bio, setBio] = useState(userInfo.userInfo.userInfo.description);
  const [isSave, setIsSave] = useState(false);

  useEffect(() => {
    if (bio !== userInfo.userInfo.userInfo.description) {
      setIsSave(true);
    } else {
      setIsSave(false);
    }
  }, [bio]);

  const handleToggle = () => {
    setToggled(!isToggled);
  }; 

  const handleUnfriend = async () => {
    try {
        const response = await axios.put(`users/friendShip/unfriend`, {userId: userInfo.userInfo?.id})
        if(response.errCode === 0){
            setModalVisible(false);
            socket.then(socket => {
              socket.emit('send-add-friend', 'có nè');
            });
            toastRef.current.show('Xóa bạn bè thành công!', 1000);
            setTimeout(() => {
                navigation.goBack();
            }, 1000)
        }
    } catch (error) {
      console.log('error', error);
    }
  }

  const openImagePicker = async (type, typeAvt) => {
    if (type === 'C') {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        console.log("Permission to access camera roll is required!");
        return;
      }
    
      if (typeAvt === 'Avt') {
        const pickerResult = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

        if (!pickerResult.canceled) {
          const uri = pickerResult.assets[0].uri;
          const manipResult = await ImageManipulator.manipulateAsync(uri, 
              [{ resize: { width: 140, height: 140 } }], 
              { compress: 0.2}
          ); 
          convertImageToBase64(manipResult.uri).then((result) => {
            updateAvatar(result);
          });
        }
      } else if (typeAvt === 'Bia') {
        const pickerResult = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
          allowsMultipleSelection: false,
          selectionLimit: 1,
        });

        if (!pickerResult.canceled) {
          const uri = pickerResult.assets[0].uri;
          const fileName = uri.split('/').pop();
          const formData = new FormData();
          formData.append('upload_preset', UPLOAD_PRESET);
          formData.append("cloud_name", CLOUD_NAME);
          formData.append('folder', FOLDER);
          formData.append('file', {
              uri: uri,
              name: fileName,
              type: 'image/*',
          });
          sendToCloud('IMAGES', formData);
        }
      }
    } else if (type === 'L') {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        console.log("Permission to access camera roll is required!");
        return;
      }
      if (typeAvt === 'Avt') {
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

        if (!pickerResult.canceled) {
          const uri = pickerResult.assets[0].uri;
          const manipResult = await ImageManipulator.manipulateAsync(uri, 
              [{ resize: { width: 140, height: 140 } }], 
              { compress: 0.2}
          ); 
          convertImageToBase64(manipResult.uri).then((result) => {
            updateAvatar(result);
          });
        }
      } else if (typeAvt === 'Bia') {
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
          allowsMultipleSelection: false,
          selectionLimit: 1,
        });

        if (!pickerResult.canceled) {
          const uri = pickerResult.assets[0].uri;
          const fileName = uri.split('/').pop();
          const formData = new FormData();
          formData.append('upload_preset', UPLOAD_PRESET);
          formData.append("cloud_name", CLOUD_NAME);
          formData.append('folder', FOLDER);
          formData.append('file', {
              uri: uri,
              name: fileName,
              type: 'image/*',
          });
          sendToCloud('IMAGES', formData);
        }
      }
    }
  }

  const sendToCloud = async (type, formData) => {
    let typesend = ''
    if (type === 'IMAGES') {
        typesend = 'image';
    } else if (type === 'VIDEO' ) {
        typesend = 'video';
    }
    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${typesend}/upload`, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            },
        });
        const data = await response.json();
        if (data.secure_url) {
          updateBia(data.secure_url);
        } else {
          console.log('Error: ', data);
        }
    } catch (error) {
        console.log("Error 1: ", error);
    }
  };

  const updateBia = async (url) => {
    try {
      const response = await axios.put(`/users/updateInfor`, {coverImage: url});
      if(response.errCode === 0){
        setModalVisibleChangeAvt(false);
        const userInfoCus = {
          ...userInfo.userInfo,
          userInfo: {
              ...userInfo.userInfo.userInfo,
              coverImage: response.data.info.coverImage,
          },
        }
        dispatch(setUserInfo(userInfoCus));
        toastRef.current.show('Đổi ảnh bìa thành công', 1000);
      } else {
        toastRef.current.show('Có lỗi xảy ra!', 1000);
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  const updateAvatar = async (base64) => {
    try {
      const response = await axios.put('/users/avatar', {avatar: base64});
      // console.log(response);
      if (response.errCode === 0) {
        setModalVisibleChangeAvt(false);
        const userInfoCus = {
          ...userInfo.userInfo,
          avatar: response.data.avatar,
        }
        
        const userCus = {
          ...user.user,
          user: {
              ...user.user.user,
              avatar: response.data.avatar,
          }
        };
        try {
          await AsyncStorage.setItem('dataUser', JSON.stringify(userCus));
          dispatch(setUser(userCus));
          dispatch(setUserInfo(userInfoCus));
          toastRef.current.show('Đổi ảnh đại diện thành công!', 1000);
        } catch (error) {
          console.log('Error saving data:', error);
        }
      } else {
        toastRef.current.show('Có lỗi xảy ra!', 1000);
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  const convertImageToBase64 = async (imageUri) => {
    return new Promise((resolve, reject) => {
      try {
        fetch(imageUri)
          .then(response => response.blob())
          .then(blob => {
              const reader = new FileReader();
              reader.onload = () => {
                  resolve(reader.result);
              };
              reader.onerror = error => {
                  reject(error);
              };
              reader.readAsDataURL(blob);
          })
          .catch(error => {
              reject(error);
          });
      } catch (error) {
          reject(error);
      }
    });
  };

  const updateBio = async () => {
    try {
      const response = await axios.put('/users/updateInfor', {description: bio});
      if(response.errCode === 0){
        const userInfoCus = {
          ...userInfo.userInfo,
          userInfo: {
              ...userInfo.userInfo.userInfo,
              description: response.data.info.description,
          },
        }
        setModalVisibleChangeBio(false);
        setIsSave(false);
        dispatch(setUserInfo(userInfoCus));
        toastRef.current.show('Cập nhật giới thiệu thành công!', 1000);
      } else {
        toastRef.current.props.style.backgroundColor = 'red';
        toastRef.current.show('Có lỗi xảy ra!', 1000);
      }
    } catch (error) {
      console.log('error', error);
      toastRef.current.props.style.backgroundColor = 'red';
      toastRef.current.show('Có lỗi xảy ra!', 1000);
    }
  }

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
        <View style={{flexDirection: 'row', height: '55%', alignItems: 'center'}}>
          <Pressable style={styles.btnHeader} onPress={()=>{navigation.goBack()}}>
            <FontAwesomeIcon style={{ marginLeft: 15 }} color='#F1FFFF' size={21} icon={faChevronLeft} />
          </Pressable>
          <Text style={{fontSize:18, fontWeight:'500', color:'white', marginLeft: 10}}>
            {userInfo.userInfo?.userName}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.body}> 
        {isUser ? ( 
            <View style={{width: '100%'}}>
              <Pressable style={[styles.btnOption]} onPress={()=> navigation.navigate('ProfileInfo', {isUser: isUser})}>
                <Text style={styles.txt}>Thông tin</Text>
              </Pressable>

              {renderLine()}

              <Pressable style={[styles.btnOption]} onPress={()=> {setTypeAvt('Avt'); setModalVisibleChangeAvt(true)}}>
                <Text style={styles.txt}>Đổi ảnh đại diện</Text>
              </Pressable>

              {renderLine()}

              <Pressable style={[styles.btnOption]} onPress={()=> {setTypeAvt('Bia');setModalVisibleChangeAvt(true)}}>
                <Text style={styles.txt}>Đổi ảnh bìa</Text>
              </Pressable>

              {renderLine()}

              <Pressable style={[styles.btnOption]} onPress={()=> {setModalVisibleChangeBio(true)}}>
                <Text style={styles.txt}>Cập nhật giới thiệu bản thân</Text>
              </Pressable>

              <View style={{height: 75, backgroundColor: '#FFFFFF', justifyContent: 'flex-end', marginTop: 5}}>
                <Text style={{marginLeft: 20, fontSize: 17, color: '#1B91F3'}}>Cài đặt</Text>
                <Pressable style={[styles.btnOption]} onPress={()=> navigation.navigate('Privacy')}>
                  <Text style={styles.txt}>Quyền riêng tư</Text>
                </Pressable>
              </View>

              {renderLine()}

              <Pressable style={[styles.btnOption]} onPress={()=> navigation.navigate('AccountAndSecurity')}>
                <Text style={styles.txt}>Quản lý tài khoản</Text>
              </Pressable>

              {renderLine()}

              <Pressable style={[styles.btnOption]} onPress={()=> navigation.navigate('Setting')}>
                <Text style={styles.txt}>Cài đặt chung</Text>
              </Pressable>
            </View>
          ) : isFriend ? (
            <View style={{width: '100%'}}>
              <Pressable style={[styles.btnOption]} onPress={()=> navigation.navigate('ProfileInfo', {isUser: isUser})}>
                <Text style={styles.txt}>Thông tin</Text>
              </Pressable>

              {renderLine()}
              
              <Pressable style={[styles.btnOption]} onPress={()=> alert('Đổi tên gợi nhớ')}>
                <Text style={styles.txt}>Đổi tên gợi nhớ</Text>
              </Pressable> 

              {renderLine()}

              <View style={[styles.btnOption, {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}]}>
                <Text style={styles.txt}>Đánh dấu bạn thân</Text>
                <Pressable style={[styles.button, isToggled && styles.toggledButton]} onPress={handleToggle}>
                  <View style={[styles.circleButton, isToggled ? styles.circleButton1 : styles.circleButton]}></View>
                </Pressable> 
              </View>

              {renderLine()}

              <Pressable style={[styles.btnOption]} onPress={()=> alert('Giới thiệu cho bạn')}>
                <Text style={styles.txt}>Giới thiệu cho bạn</Text>
              </Pressable>

              <View style={{height: 58, justifyContent: 'flex-end'}}>
                <Pressable style={[styles.btnOption]} onPress={()=> alert('Giới thiệu cho bạn')}>
                  <Text style={styles.txt}>Báo xấu</Text>
                </Pressable>
              </View>
                            
              {renderLine()}

              <Pressable style={[styles.btnOption]} onPress={()=> setModalVisible(true)}>
                <Text style={[styles.txt, {color: 'red'}]}>Xóa bạn</Text>
              </Pressable>
            </View>
          ) : (
            <View style={{width: '100%'}}>
              <Pressable style={[styles.btnOption]} onPress={()=> alert('Kết bạn')}>
                <Text style={styles.txt}>Kết bạn</Text>
              </Pressable>

              {renderLine()}

              <Pressable style={[styles.btnOption]} onPress={()=> navigation.navigate('ProfileInfo', {isUser: isUser})}>
                <Text style={styles.txt}>Thông tin</Text>
              </Pressable>

              {renderLine()}

              <Pressable style={[styles.btnOption]} onPress={()=> alert('Đổi tên gợi nhớ')}>
                <Text style={styles.txt}>Đổi tên gợi nhớ</Text>
              </Pressable>

              {renderLine()}

              <Pressable style={[styles.btnOption]} onPress={()=> alert('Báo xấu')}>
                <Text style={styles.txt}>Báo xấu</Text>
              </Pressable>

              {renderLine()}

              <Pressable style={[styles.btnOption]} onPress={()=> alert('Quản lý chặn')}>
                <Text style={styles.txt}>Quản lý chặn</Text>
              </Pressable>
            </View>
          )
        }
      </View>

      { modalVisible ? 
        <View style={styles.overlay}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={{flex: 3}}>
                  <Text style={styles.modalText}>Xóa bạn với {userInfo.userInfo.userName}?</Text>
                </View>
                <View style={{flex: 2, flexDirection: 'row', borderRadius: 15}}>
                  <Pressable style={[styles.btnModal]} onPress={()=> setModalVisible(false)}>
                    <Text style={{color: '#147FDF', fontSize: 16}}>Hủy</Text>
                  </Pressable>

                  <Pressable style={[styles.btnModal, {borderLeftWidth: 1}]} onPress={()=> handleUnfriend()}>
                    <Text style={{fontSize: 16, color: 'red'}}>Xóa</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        : ''}
      
      <Toast style={{backgroundColor: 'green'}} ref={toastRef} position='center' />

      {modalVisibleChangeAvt ? 
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleChangeAvt}
            onRequestClose={() => {
                setModalVisible(!modalVisibleChangeAvt);
            }}
        >
            <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
                <Pressable style={{flex: 1}} onPress={()=> setModalVisibleChangeAvt(false)} />
                  <View style={styles.modalContent}>
                    <View style={{height: 6, width: 55, backgroundColor: '#DFE3E6', marginBottom: 10, marginTop: 5, borderRadius: 10}} />
                    <Pressable style={styles.btnOptsAvatar} onPress={()=> openImagePicker('C', typeAvt)}>
                        <FontAwesomeIcon style={{marginLeft: 20}} icon={faCamera} color='#707070' size={22} />
                        <Text style={{fontSize: 17, marginLeft: 15}}>Chụp ảnh mới</Text>
                    </Pressable>

                    {renderLine()}

                    <Pressable style={styles.btnOptsAvatar} onPress={()=> openImagePicker('L', typeAvt)}>
                        <FontAwesomeIcon style={{marginLeft: 20}} icon={faImages} color='#707070' size={22} />
                        <Text style={{fontSize: 17, marginLeft: 15}} >Chọn ảnh trên máy</Text>
                    </Pressable>

                    {renderLine()}
                </View>
            </View>
        </Modal> 
      : ''}

      {modalVisibleChangeBio ?
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleChangeBio}
          onRequestClose={() => {
            setModalVisibleChangeBio(!modalVisibleChangeBio);
          }}
        >
          <Pressable style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)', justifyContent: 'center', alignItems: 'center'}} onPress={()=> Keyboard.dismiss()}>
            <View style={{height: 350, width: '85%', backgroundColor: '#FFFFFF', borderRadius: 20, alignItems: 'center', justifyContent: 'space-between'}}>
              <Pressable style={styles.btnPressCloseModal}  onPress={()=> setModalVisibleChangeBio(false)}>
                <FontAwesomeIcon style={{marginLeft: 10}} icon={faXmark} />
                <Text style={{marginLeft: 10, fontSize: 16, fontWeight: '500'}}>Chỉnh sửa giới thiệu bản thân</Text>
              </Pressable>

              <View style={{width: '90%', flex: 1}}>
                <TextInput style={styles.textBio} value={bio} onChangeText={(text) => {setBio(text)}} multiline={true} numberOfLines={5} maxLength={150} placeholder='Thêm lời giới thiệu của bạn...' />
                <Text style={{position: 'absolute', bottom: 55, right: 10}}>
                  {bio === null ? '0' : bio.length}/150
                </Text>
              </View>

              <View style={{width: '100%', marginBottom: 10, alignItems: 'flex-end'}}>
                <Pressable disabled={!isSave} style={[{height: 35, width: 80, marginRight: 15, justifyContent: 'center', alignItems: 'center', borderRadius: 20}, !isSave ? {backgroundColor: '#C1D4E3'} : {backgroundColor: 'blue',}]} onPress={()=> {updateBio()}}>
                  <Text style={{fontSize: 16}}>Lưu</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
      : '' }
    </View>
  )
}
