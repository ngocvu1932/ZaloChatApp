import { View, Text, Pressable, Modal, FlatList, Image } from 'react-native';
import React, { useRef, useState } from 'react';
import { styles } from './style';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faSearch, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Toast from 'react-native-easy-toast';
import { useSelector } from 'react-redux';
import { setGroupChatInfo } from '../../redux/groupChatInfoSlice';
import { useDispatch } from 'react-redux';
import axios, { setAuthorizationAxios } from '../../config/axios';
import { socket } from '../../config/io';

export const ChangeAdminGroup = ({navigation, route}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const groupChatInfo = useSelector(state => state.groupChatInfo.groupChatInfo);
    const toastRef = useRef(null);
    const dispatch = useDispatch();
    const [idMember, setIdMember] = useState();

    const getGroupChat = async () => {
        try {
            const response = await axios.get(`/chat/access?chatId=${groupChatInfo._id}`);
            if (response.errCode === 0) {
                dispatch(setGroupChatInfo(response.data));
                socket.then(socket => {
                    socket.emit('transfer-disband-group', response.data);
                });
            } else {
                console.log("Error: ", response);
            }
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    const handleGrant = async () => {
        setModalVisible(false);
        try {
            const response = await axios.put(`chat/group/grant`, {
                chatId: groupChatInfo._id,
                memberId: idMember.id
            });

            // console.log("Response: ", response);
            if (response.errCode === 0) {
                toastRef.current.props.style.backgroundColor = 'green';
                toastRef.current.show('Chuyển quyền trưởng nhóm thành công!', 1000);
                getGroupChat();

                setTimeout(() => {
                    navigation.goBack();
                }, 1000);
            } else {
                toastRef.current.props.style.backgroundColor = 'red';
                toastRef.current.show('Có lỗi xảy ra!', 1000);
            }
            
        } catch (error) {
            console.log("Error: ", error);
        }
    }

    const renderItems = ({item}) => {
        return (
            <View>
                {groupChatInfo.administrator !== item.id ? 
                    <Pressable style={{height: 70, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF'}} onPress={()=> {setIdMember(item); setModalVisible(true)}}>
                        {item.avatar.substring(0 ,3) === 'rgb' ? 
                            <View style={{height: 50, width: 50, borderRadius: 30, backgroundColor: item.avatar, marginLeft: 15}}></View>
                        : 
                            <Image style={{height: 50, width: 50, borderRadius: 30, marginLeft: 15}} source={{uri: item.avatar}} />
                        }
                        <Text numberOfLines={1} style={{marginLeft: 10, fontSize: 16}}>{item.userName}</Text>
                    </Pressable> 
                : ''}
            </View>
        )
    };

    return (
        <View style={[styles.container, {backgroundColor: '#F3F4F6'}]}>
            <LinearGradient colors={['#008BFA', '#00ACF4']} style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <View style={{height: '55%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}>
                    <Pressable style={{flexDirection: 'row', alignItems: 'center' }} onPress={()=>{navigation.goBack()}}>
                        <FontAwesomeIcon style={{marginLeft: 10}} color='#F1FFFF' size={21} icon={faChevronLeft} />
                        <Text style={styles.txtInHeader}>Chọn trưởng nhóm mới</Text>
                    </Pressable>

                    <Pressable style={styles.btnPressClose} >
                        <FontAwesomeIcon color='#F1FFFF' size={21} icon={faSearch} />
                    </Pressable>
                </View>
            </LinearGradient>

            <View style={styles.body}>
                <FlatList
                    data={groupChatInfo.participants}
                    renderItem={renderItems}
                    // keyExtractor={(item) => item.id.toString()}
                />
            </View>
            
            {modalVisible ?
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {setModalVisible(false)}}
                    >
                    <Pressable style={[styles.modalContainer, {justifyContent: 'center'}]} onPress={ ()=> setModalVisible(false)}>
                        <View style={[{height: '25%',  width: '65%', backgroundColor: 'white', borderRadius: 15}]}>
                            <View style={{flex: 4, borderBottomWidth: 1, borderBottomColor: '#B1B2B4', alignItems: 'center', justifyContent: 'center'}}>
                                <View style={{width: '90%'}}>
                                    <Text style={{textAlign: 'center', lineHeight: 20, fontWeight: '500', fontSize: 16}}>Chuyển quyền trưởng nhóm cho {idMember.userName}?</Text>
                                    <Text style={{textAlign: 'center', marginTop: 10, lineHeight: 20, fontSize: 14}}>{idMember.userName} sẽ trở thành trưởng nhóm. Bạn sẽ trở thành một thành viên bình thường.</Text>
                                </View>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                                <Pressable style={{flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%', borderRightWidth: 1, borderRightColor: '#B1B2B4'}} onPress={()=> setModalVisible(false)}>
                                    <Text style={{fontSize: 15, color: '#1976DD'}}>Hủy</Text>
                                </Pressable>

                                <Pressable style={{flex: 1, justifyContent: 'center', alignItems: 'center'}} onPress={() => {handleGrant()}}>
                                    <Text style={{fontSize: 15, color: 'red'}}>Chuyển</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Pressable>
                </Modal> : 
            ''}
        <Toast style={{ backgroundColor: 'green' }} ref={toastRef} position='center' />
        </View>
    )
}