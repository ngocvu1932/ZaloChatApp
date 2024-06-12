import React, { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View, Keyboard, Modal, Image } from 'react-native';
import { styles } from './style';
import { LinearGradient } from 'expo-linear-gradient';
import { faCamera, faCircle, faImages, faPencil, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import axios from "../../config/axios";
import { useSelector, useDispatch } from 'react-redux';
import { setUserInfo } from '../../redux/userInfoSlice';
import { setUser } from '../../redux/userSlice';
import Toast from 'react-native-easy-toast';
import { useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export const EditProfile = ({navigation}) => {
    const userInfo = useSelector(state => state.userInfo);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedDate, setSelectedDate] = useState();
    const [genderMale, setGenderMale] = useState(true);
    const [genderFemale, setGenderFemale] = useState(false);
    const [newUserInfo, setNewUserInfo] = useState();
    const [newAvatar, setNewAvatar] = useState();
    const [userUpdate, setUserUpdate] = useState({
        id: userInfo.userInfo?.id,
        userName: userInfo.userInfo?.userName,
        birthdate: userInfo.userInfo?.userInfo.birthdate,
        gender: userInfo.userInfo?.userInfo.gender,
        avatar: userInfo.userInfo?.avatar,
    });
    const [isCheck, setIsCheck] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const toastRef = useRef(null);
    const [modalVisible, setModalVisible] = useState(false);
 
    // kiểm tra thông tin mới 
    useEffect(() => {
        var userUpdateBirth = moment.utc(new Date(userUpdate.birthdate)).utcOffset('+07:00').format('DD/MM/YYYY');
        var userInfoBirth = moment.utc(new Date(userInfo.userInfo?.userInfo.birthdate)).utcOffset('+07:00').format('DD/MM/YYYY');

        if (userUpdate.userName !== userInfo.userInfo?.userName || userUpdateBirth !== userInfoBirth || userUpdate.gender !== userInfo.userInfo?.userInfo.gender || userUpdate.avatar !== userInfo.userInfo?.avatar) {
            setIsUpdate(true);
        } else {
            setIsUpdate(false);
        }
    }, [userUpdate]);

    // kiểm tra giới tính
    useEffect(() => {
        if ( userInfo.userInfo?.userInfo?.gender) {
            setGenderMale(true);
            setGenderFemale(false);
        } else {
            setGenderMale(false);
            setGenderFemale(true);
        }
    }, [userInfo]);

    // dispatch cập nhật thông tin
    useEffect(() => {
        const setData = async () => {
            if (isCheck) {
                const userInfoCus = {
                    ...userInfo.userInfo,
                    avatar: newAvatar,
                    userInfo: {
                        ...userInfo.userInfo.userInfo,
                        birthdate: newUserInfo.info.birthdate,
                        gender: newUserInfo.info.gender,
                    },
                    userName: newUserInfo.userName,
                }
                
                const userCus = {
                    ...user.user,
                    user: {
                        ...user.user.user,
                        userName: newUserInfo.userName,
                        avatar: newAvatar,
                    }
                };
                
                try {
                    await AsyncStorage.setItem('dataUser', JSON.stringify(userCus));
                    dispatch(setUserInfo(userInfoCus));
                    dispatch(setUser(userCus));
                    setIsCheck(false);
                } catch (error) {
                    console.log('Error saving data:', error);
                }
            }
        }

        setData();
    }, [newUserInfo, isCheck, newAvatar]);

    const handleGenderMale = () => {
        if (genderMale === false) {
            setGenderMale(true);
            setGenderFemale(false);
            setUserUpdate(pre => ({...pre, gender: 1}))
        }
    };

    const handleGenderFemale = () => {
        if (genderFemale === false) {
            setGenderMale(false);
            setGenderFemale(true);
            setUserUpdate(pre => ({...pre, gender: 0}))
        }
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setSelectedDate(date);
        setUserUpdate(pre => ({...pre, birthdate: date}));
        hideDatePicker();
    };

    const updateInfo = async () => {
        try {
            const responseAvatar = await axios.put('/users/avatar', {avatar: userUpdate.avatar});
            if (responseAvatar.errCode === 0) {
                setNewAvatar(responseAvatar.data.avatar);
                const response = await axios.put('/users/updateInfor', userUpdate)
                if (response.errCode === 0) {
                    setNewUserInfo(response.data);
                    setIsCheck(true);
                    setIsUpdate(false);
                    toastRef.current.show('Cập nhật thông tin thành công!', 1000);
                    Keyboard.dismiss();
                } else {
                    console.log('error ', response); 
                }
            } else {
                console.log('error ', responseAvatar);
            } 
        } catch (error) {
            console.log('error', error); 
        }
    }

    const openImagePicker = async (type) => {
        if (type === 'C') {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (!permissionResult.granted) {
                console.log("Permission to access camera roll is required!");
                return;
            }
        
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

                setModalVisible(false);

                convertImageToBase64(manipResult.uri).then((result) => {
                    setUserUpdate(pre => ({...pre, avatar: result}));
                });
        }
          
        } else if (type === 'L') {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                console.log("Permission to access camera roll is required!");
                return;
            }
      
            const pickerResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
                allowsMultipleSelection: false,
                selectionLimit: 1,
            });
      
            if (!pickerResult.canceled) {
                const uri = pickerResult.assets[0].uri;
                const manipResult = await ImageManipulator.manipulateAsync(uri, 
                    [{ resize: { width: 140, height: 140 } }], 
                    { compress: 0.2}
                );

                setModalVisible(false);

                convertImageToBase64(manipResult.uri).then((result) => {
                    setUserUpdate(pre => ({...pre, avatar: result}));
                });
            }
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

    const checkBox = (state, text) => {
        return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={[{height: 22, width: 22, borderRadius: 15, borderWidth: 2, justifyContent: 'center', alignItems: 'center'}, state ? {backgroundColor: 'blue', borderColor: 'blue'} : {backgroundColor: '#FFFFFF', borderColor: '#C2C5CA',}]}>
                    {state ? <FontAwesomeIcon size={8} color='#FFFFFF' icon={faCircle} /> : null}
                </View>
                <Text style={{fontSize: 14}}>  {text}</Text>
            </View>
        )
    }

    const renderLine = () => (
        <View style={styles.line}> 
          <View style={[styles.line1, {width: '15%'}]} />
          <View style={[styles.line2, {width: '85%'}]} />
        </View>
    )

    return (
        <View style={styles.container}>
            <LinearGradient style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#008BFA', '#00ACF4']}>
                <View style={{height: '55%', justifyContent: 'center'}}>
                    <Pressable style={{flexDirection: 'row', alignItems: 'center', height: 30}} onPress={()=>{navigation.goBack()}}>
                        <FontAwesomeIcon icon={faXmark} style={{marginLeft: 10}} color='#FFFFFF' size={20} />
                        <Text style={styles.txtInHeader}>Thông tin cá nhân</Text>
                    </Pressable> 
                </View>
            </LinearGradient>

            <View style={styles.body}>
                <View style={{width: '100%', flexDirection: 'row', backgroundColor: '#FFFFFF'}}>
                    {userUpdate.avatar?.substring(0, 3) === 'rgb' ? 
                        <Pressable style={{flex: 1, alignItems: 'center', marginTop: 20}} onPress={() => setModalVisible(true)}>
                            <View style={{height: 60, width: 60, borderRadius: 30, backgroundColor: userInfo.userInfo?.avatar}}>
                                <View style={{position: 'absolute', bottom: 1, right: 2, height: 20, width: 20, borderRadius: 10, backgroundColor: '#FFFFFF', borderColor: '#DADAD8', borderWidth: 2, justifyContent: 'center', alignItems: 'center'}}>
                                    <FontAwesomeIcon color='#94A1AA' size={11} icon={faCamera} />
                                </View>
                            </View>
                        </Pressable> 
                    : 
                        <Pressable style={{flex: 1, alignItems: 'center', marginTop: 20}} onPress={() => setModalVisible(true)}>
                            <View style={{height: 60, width: 60, borderRadius: 30}}>
                                <Image source={{uri: userUpdate.avatar}} style={{height: 60, width: 60, borderRadius: 30}} />
                                <View style={{position: 'absolute', bottom: 1, right: 2, height: 20, width: 20, borderRadius: 10, backgroundColor: '#FFFFFF', borderColor: '#DADAD8', borderWidth: 2, justifyContent: 'center', alignItems: 'center'}}>
                                    <FontAwesomeIcon color='#94A1AA' size={11} icon={faCamera} />
                                </View>
                            </View>
                        </Pressable> 
                    } 

                    <View style={{flex: 3}}>
                        <View style={{flexDirection: 'row', width: '100%', alignItems: 'center', height: 55}}>
                            <TextInput value={userUpdate.userName} onChangeText={(text)=> setUserUpdate(pre => ({...pre, userName: text}))} style={{width: '95%', height: 40, fontSize: 17, borderBottomWidth: 1, borderBottomColor: '#E5E5E5', zIndex: 10}}></TextInput>
                            <FontAwesomeIcon color='#707070' style={{marginLeft: -20}} size={18} icon={faPencil} />
                        </View> 

                        <View style={{flexDirection: 'row', width: '100%', alignItems: 'center'}}>
                            <Pressable style={{ width: '95%', height: 40, justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#E5E5E5', zIndex: 10}} onPress={showDatePicker}> 
                                {!userUpdate.birthdate ? 
                                    selectedDate ? 
                                        <Text style={{ fontSize: 17}}>{moment.utc(selectedDate).utcOffset('+07:00').format('DD/MM/YYYY')}</Text> : 
                                        <Text style={{ fontSize: 17, opacity: 0.7}}>Chưa cập nhật</Text>
                                :
                                    <Text style={{ fontSize: 17}}>{moment.utc(userUpdate.birthdate).utcOffset('+07:00').format('DD/MM/YYYY')}</Text>}
                            </Pressable>

                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={hideDatePicker} 
                            />
                            <FontAwesomeIcon color='#707070' style={{marginLeft: -20}} size={18} icon={faPencil} />
                        </View>

                        <View style={{flexDirection: 'row', width: '50%', height: 40, alignItems: 'center', justifyContent: 'space-between', marginTop: 10}}>
                            <Pressable style={{}} onPress={()=> handleGenderMale()}>
                                {checkBox(genderMale, 'Nam')}
                            </Pressable>

                            <Pressable style={{}} onPress={()=> handleGenderFemale()}>
                                {checkBox(genderFemale, 'Nữ')}
                            </Pressable>
                        </View>
                    </View>
                </View>

                <View style={{width: '100%', height: 80, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center'}}>
                    <Pressable disabled={!isUpdate} style={[{width: '90%', height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20}, isUpdate ? {backgroundColor: 'blue',} : {backgroundColor: '#C1D4E3'}]} onPress={()=> updateInfo()}>
                        <Text style={{fontSize: 18, color: '#FFFFFF', fontWeight: '500'}}>Lưu</Text>
                    </Pressable>
                </View>
            </View>
            <Toast style={{backgroundColor: 'green'}} ref={toastRef} position='center' />

            {modalVisible ? 
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)'}}>
                        <Pressable style={{flex: 1}} onPress={()=> setModalVisible(false)} />
                        <View style={styles.modalContent}>
                            <View style={{height: 6, width: 55, backgroundColor: '#DFE3E6', marginBottom: 10, marginTop: 5, borderRadius: 10}} />
                            <Pressable style={styles.btnOptsAvatar} onPress={()=> openImagePicker('C')}>
                                <FontAwesomeIcon style={{marginLeft: 20}} icon={faCamera} color='#707070' size={22} />
                                <Text style={{fontSize: 17, marginLeft: 15}}>Chụp ảnh mới</Text>
                            </Pressable>

                            {renderLine()}

                            <Pressable style={styles.btnOptsAvatar} onPress={()=> openImagePicker('L')}>
                                <FontAwesomeIcon style={{marginLeft: 20}} icon={faImages} color='#707070' size={22} />
                                <Text style={{fontSize: 17, marginLeft: 15}} >Chọn ảnh trên máy</Text>
                            </Pressable>

                            {renderLine()}
                        </View>
                    </View>
                </Modal> 
            : ''}
        </View>
    )
};