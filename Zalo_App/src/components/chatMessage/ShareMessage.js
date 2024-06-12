import { View, Text, Pressable, FlatList, TextInput, Image } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { styles } from './style';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPaperPlane, faCheck, faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faUser} from '@fortawesome/free-regular-svg-icons'; 
import axios from '../../config/axios';
import { useSelector } from 'react-redux';
import { Video} from 'expo-av';
import Toast from 'react-native-easy-toast';

export const ShareMessage = ({navigation, route}) => {
    const {data} = route.params;
    const [chatData, setChatData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const user = useSelector(state => state.user.user.user);
    const [listChatIsChoose, setListChatIsChoose] = useState([]);
    const videoRef = useRef(null);
    const [isChoose, setIsChoose] = useState(false);
    const toastRef = useRef(null);

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const response = await axios.get('/chat/pagination?limit=100');
                if (response.errCode === 0) { 
                    setChatData(response.data.map(item => ({
                        _id: item._id,
                        type: item.type,
                        name: item.name,
                        groupPhoto: item.groupPhoto,
                        participants: item.participants.map(participant => ({avatar: participant.avatar, userName: participant.userName, id: participant.id})),
                    })));
                    setIsLoading(false);
                } else if (response.errCode === 1) {
                    setChatData([]);
                    setIsLoading(false);
                }
            } catch (error) {
                console.log('Error fetching chat  1:', error);
            }
        };

        fetchChat(); 
    }, []); 

    useEffect(() => {
        if (listChatIsChoose.length === 0) {
            setIsChoose(false);
        } else {
            setIsChoose(true);
        }
    }, [listChatIsChoose]);

    const sendMessages = async () => {
        let flag = 0 ;
        
        for (const element of listChatIsChoose) {
            try {
                const ObjectId = objectId();
                const contentOrUrls = 
                    data.type === 'TEXT' ? 
                        { content: data.content } 
                    :
                    data.type === 'IMAGES' || 'VIDEO' ?
                        typeof data.urls === 'string' ? 
                            {urls: data.urls} 
                        : 
                            { urls: data.urls.map(urlArray => urlArray[0]).join('')}
                    : 
                        {};

                const dataSend = {
                    _id: ObjectId,
                    chat: element._id,
                    type: data.type,
                    sender: user,
                    ...contentOrUrls,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    unViewList: [],
                    isDelete: false,
                    reactions: []
                };
    
                const res = await axios.post('/chat/message', {
                    ...dataSend,
                    sender: user.id,
                });
    
                if (res.errCode === 0) {
                    flag++;
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }

        if (flag === listChatIsChoose.length) {
            toastRef.current.props.style.backgroundColor = 'green';
            toastRef.current.show('Đã chia sẻ', 1500);
            setTimeout(() => {
                navigation.goBack();
            }, 1500);
        } else {
            toastRef.current.props.style.backgroundColor = 'red';
            toastRef.current.show('Gửi tin nhắn thất bại', 2000);
        }
    };

    const handleChooseChat = (item) => {
        setListChatIsChoose(prevList => {
            if (prevList.some(chatId => chatId._id === item._id)) {
                return prevList.filter(chatId => chatId._id !== item._id);
            } else {
                let name;
                let avatar;
                if (item.type === 'GROUP_CHAT') {
                    name = item.name;
                    avatar = item.groupPhoto;
                } else {
                    if (item.participants[0].id === user.id) {
                        name = item.participants[1].userName;
                        avatar = item.participants[1].avatar;
                    } else {
                        name = item.participants[0].userName;
                        avatar = item.participants[0].avatar;
                    }
                }
                
                return [...prevList, {_id : item._id, type: item.type, avatar: avatar, name: name}];
            }
        });
    }

    const renderItem = ({item}) => {
        
        return (
            <Pressable style={styles.pressChooseChat} onPress={()=> {handleChooseChat(item)}}>
                <View style={[styles.viewChoose, listChatIsChoose.some(chatId => chatId._id === item._id) ? {backgroundColor: '#1394FA'} : {}]} >
                    <FontAwesomeIcon style={{color: '#FFFFFF'}} size={19} icon={faCheck} />
                </View>
                {
                    item.type === 'PRIVATE_CHAT' ? 
                        item.participants[0].id === user.id ? 
                            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 15}}>
                                {
                                    item.participants[1].avatar.substring(0, 3) === 'rgb' ? 
                                        <View style={{height: 50, width: 50, borderRadius: 30, backgroundColor: item.participants[1].avatar}} /> 
                                    : 
                                        <Image source={{uri: item.participants[1].avatar}} style={{height: 45, width: 45, borderRadius: 30}}/>
                                }
                                <Text style={{fontSize: 15, marginLeft: 15}}>{item.participants[1].userName}</Text>
                            </View> 
                        : 
                            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 15}}>
                                {
                                    item.participants[0].avatar.substring(0, 3) === 'rgb' ? 
                                        <View style={{height: 50, width: 50, borderRadius: 30, backgroundColor: item.participants[0].avatar}} /> 
                                    : 
                                        <Image source={{uri: item.participants[0].avatar}} style={{height: 45, width: 45, borderRadius: 30}}/>
                                }
                                <Text style={{fontSize: 15, marginLeft: 15}}>{item.participants[0].userName}</Text>
                            </View>
                    : 
                        <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 15}}>
                            <View style={{height: 50, width: 50}}>
                                {
                                    item.groupPhoto !== null ? 
                                        <Image source={{uri: item.groupPhoto}} style={{height: 50, width: 50, borderRadius: 30}}/>
                                    : item.participants?.map((participant, index) => (
                                        index < 4 ? 
                                        item.participants?.length <= 3 ? // nhoms cos 3 nguowif
                                            <View key={index} style={[
                                                {height: 24, width: 24}, 
                                                index === 0 ? styles.position0_3 :
                                                    index === 1 ? styles.position1_3 :
                                                        styles.position2_3
                                                ]}
                                            >
                                                {participant.avatar.substring(0, 3)==='rgb' ? 
                                                    <View style={[styles.avtGroup, {backgroundColor: participant.avatar}]} /> 
                                                : 
                                                    <Image source={{uri: participant.avatar}} style={styles.avtGroup} />
                                                }
                                            </View>
                                        : item.participants?.length === 4 ? //nhoms cos 4 nguoi
                                            <View key={index} style={[
                                            {height: 24, width: 24}, 
                                            index === 0 ? styles.position0_4 :
                                                index === 1 ? styles.position1_4 : 
                                                index === 2 ? styles.position2_4 :
                                                    styles.position3_4
                                            ]}
                                            >
                                            {participant.avatar.substring(0, 3)==='rgb' ? 
                                                <View style={[styles.avtGroup, {backgroundColor: participant.avatar}]} /> 
                                            : 
                                                <Image source={{uri: participant.avatar}} style={styles.avtGroup} />
                                            }
                                            </View>
                                        : item.participants?.length > 4 ? // nhoms 5 nguoi tro len
                                            <View key={index} style={[
                                            {height: 24, width: 24}, 
                                            index === 0 ? styles.position0_4 :
                                                index === 1 ? styles.position1_4 : 
                                                index === 2 ? styles.position2_4 :
                                                [styles.position3_4, {backgroundColor: '#E9ECF3', justifyContent: 'center', alignItems: 'center', borderRadius: 15, height: 28, width: 28}]
                                            ]}
                                            >
                                            {participant.avatar.substring(0, 3)==='rgb' ? 
                                                <View style={{}}>
                                                {index === 3 ? 
                                                    <Text>{item.participants.length - index}</Text> 
                                                : 
                                                    <View style={[styles.avtGroup, {backgroundColor: participant.avatar}]} /> 
                                                }
                                                </View>
                                            : 
                                                <View style={{}}>
                                                {index === 3 ? 
                                                    <Text>{item.participants.length - index}</Text> 
                                                : 
                                                    <Image source={{uri: participant.avatar}} style={styles.avtGroup} />
                                                }
                                                </View>
                                            }
                                            </View>
                                        : ''
                                        : ''
                                    ))
                                }
                            </View>
                            <Text style={{fontSize: 15, marginLeft: 15}}>{item.name}</Text>
                        </View>
                }
            </Pressable>
        )
    }

    const renderItemChoose = ({item}) => {
        return (
            <Pressable style={{justifyContent: 'center', marginLeft: 5}}>
                {
                    item.avatar === null ? 
                        <View style={{height: 50, width: 50, borderRadius: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: 'gray'}}>
                            <FontAwesomeIcon size={20} icon={faUser} />
                            <Pressable style={styles.pressX} onPress={() => {handleChooseChat(item)}}>
                                <FontAwesomeIcon color='#516F87' size={14} icon={faXmark} />
                            </Pressable>
                        </View>
                    :
                    item.avatar.substring(0, 3) === 'rgb' ? 
                        <View style={{height: 50, width: 50, borderRadius: 30}} >
                            <View style={{height: 50, width: 50, borderRadius: 30, backgroundColor: item.avatar}} />
                            <Pressable style={styles.pressX} onPress={() => {handleChooseChat(item)}}>
                                <FontAwesomeIcon color='#516F87' size={14} icon={faXmark} />
                            </Pressable>
                        </View>
                    :  
                        <View style={{height: 50, width: 50, borderRadius: 30}}>
                            <Image source={{uri: item.avatar}} style={{height: 50, width: 50, borderRadius: 30}}/>
                            <Pressable style={styles.pressX} onPress={() => {handleChooseChat(item)}}>
                                <FontAwesomeIcon color='#516F87' size={14} icon={faXmark} />
                            </Pressable>
                        </View>
                }
            </Pressable>
        )
    }

    function objectId() { 
        return hex(Date.now() / 1000) +
            ' '.repeat(16).replace(/./g, () => hex(Math.random() * 16))
    }

    function hex(value) {
        return Math.floor(value).toString(16)
    }

    return (
        <View style={styles.container}>
            <View style={styles.header1}>
                <View style={{flexDirection: 'row', alignItems: 'center', height: '55%'}}>
                    <Pressable onPress={() => {navigation.goBack()}}>
                        <FontAwesomeIcon style={{ marginLeft: 15 }} color='#363636' size={20} icon={faXmark} />
                    </Pressable>
                    <View style={{marginLeft: 15}}>
                        <Text style={{fontSize: 18, fontWeight: '500'}}>Chia sẻ</Text>
                        <Text style={{fontSize: 14, opacity: 0.8}}>Đã chọn: {listChatIsChoose.length}</Text>
                    </View>
                </View>
            </View>

            <View style={[{backgroundColor: '#FFFFFF', paddingBottom: 250}, listChatIsChoose.length !== 0 ? {paddingBottom: 300} : '']}>
                <View style={{backgroundColor: '#E8E8E8', flexDirection: 'row', width: '90%', height: 30 ,marginLeft: '5%', borderRadius: 5, alignItems: 'center', marginTop: 10, marginBottom: 10}}>
                    <FontAwesomeIcon style={{marginRight: -25, zIndex: 1, marginLeft: 10}} size={18} icon={faSearch} />
                    <TextInput style={{width: '90%', height: 30, paddingLeft: 30}} placeholder='Tìm kiếm' />
                </View>
                <FlatList
                    data={chatData}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                />
            </View>

            <View style={styles.viewShareMess}>
                <View style={{flexDirection: 'row', height: '80%'}}>
                    <View style={{width: '80%', justifyContent: 'center'}}>
                        {
                            data.type === 'TEXT' ? 
                                <Text numberOfLines={1} style={{fontSize: 15, marginLeft: 20}}>{data.content}</Text>
                            : data.type === 'IMAGES' ? 
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Image source={{uri: `${data.urls}`}} style={{height: 60, width: 45, marginLeft: 10}} resizeMode='contain' />
                                    <Text style={{fontSize: 15, fontWeight: '500', marginLeft: 10}}>Hình ảnh</Text>
                                </View>
                            : data.type === 'VIDEO' ?
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Video
                                        ref={videoRef}
                                        style={{height: 60, width: 45, marginLeft: 10}}
                                        source={{uri: `${data.urls}`}}
                                        useNativeControls={false}
                                        resizeMode="contain"
                                        isLooping
                                    />
                                    <Text style={{fontSize: 15, fontWeight: '500', marginLeft: 10}}>Video</Text>
                                </View>
                            : ''
                        }
                    </View>
                    <View style={{backgroundColor: 'blue', width: '20%', justifyContent: 'center', alignItems: 'center'}}>
                        <Pressable style={styles.presssend} disabled={!isChoose} onPress={() => sendMessages()}>
                            <FontAwesomeIcon icon={faPaperPlane} color='#FFFFFF'/>
                        </Pressable>
                    </View>
                </View>
                <View style={{height: '20%'}} />
            </View>

            {
                listChatIsChoose.length !== 0 && 
                <View style={styles.viewChooseE}>
                    <FlatList 
                        data={listChatIsChoose}
                        renderItem={renderItemChoose}
                        key={item => item._id}
                        horizontal={true}
                    />
                </View>
            }
            <Toast style={{ backgroundColor: 'green' }} ref={toastRef} position='center' />
        </View>
    )
}