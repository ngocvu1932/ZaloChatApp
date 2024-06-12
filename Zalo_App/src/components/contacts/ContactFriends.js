import React, { useEffect, useState } from "react";
import { faCakeCandles, faList, faPhone, faUserPlus, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { View, Text, Pressable, ScrollView, FlatList, Image} from "react-native";
import axios from "../../config/axios";
import { useDispatch, useSelector } from "react-redux";
import { setListFriend } from "../../redux/friendSlice";
import {socket} from '../../config/io';
import { styles } from "./style";

export const ContactFriends = ({ navigation }) => {
  const user = useSelector(state => state.user);
  const currentId = user.user?.user?.id;
  const [friendList, setFriendList] = useState([])
  const dispatch = useDispatch();
  const [loadAgainSocket, setLoadAgainSocket] =useState();
  const [loadAgain, setLoadAgain] =useState(false);
  const [stateListFriend, setStateListFriend] = useState('all');
  const [count, setCount] = useState(0); // count số người online

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoadAgainSocket(new Date());
    });

    return unsubscribe;
  }, [navigation]);

  //socket này có chức năng khi hủy kết bạn thì load lại danh sách bạn bè
  const handleAddFriend = async (data) => {
    if (data) {
      setLoadAgain(true); 
    }
  }

  // socket
  useEffect(() => {
    socket.then(socket => {
      socket.on('need-accept-addFriend', handleAddFriend);
    });

    return () => {
      socket.then(socket => {
        socket.off('need-accept-addFriend', handleAddFriend);
      });
    };
  }, []);

  useEffect(() => {
    let data = [];
    friendList.forEach((item) => {
      if (item.receiver.id === currentId) {
        data.push(item.sender);
      } else if (item.sender.id === currentId) {
        data.push(item.receiver); // Change this line to item.receiver
      }
    });
    const count = data.filter(item => item.lastedOnline === null).length;
    setCount(count);
  }, [friendList]);
 
  // lấy danh sách bạn bè
  useEffect(() => {
    const fetchFriendList = async () => {
      try {
        const response = await axios.get(`/users/friends?limit=10`);
        if (response.errCode === 0) {
          setFriendList(response.data); 
          dispatch(setListFriend(response.data));
          setLoadAgain(false);
        }
      } catch (error) {
        console.log('Error 1', error);
      }
    }
    fetchFriendList();
  }, [loadAgain, loadAgainSocket]);

  const joinChatWithFriend = async (friendId) => {
    try {
      const response = await axios.get(`/chat/private?userId=${friendId}`);
      if(response.errCode === 0){
        if(response.data.participants[0].id === currentId){
          const newItem = {
            _id : response.data._id,
            avatar: response.data.participants[1].avatar,
            phoneNumber: response.data.participants[1].phoneNumber,
            updatedAt: response.data.updatedAt,
            userId: response.data.participants[1].id,
            userName: response.data.participants[1].userName,
            type: response.data.type,
            lastedOnline: response.data.participants[1].lastedOnline,
          }
          navigation.navigate('ChatMessage', {items: newItem}) 
        } else if(response.data.participants[1].id === currentId) {
          const newItem = {
            _id : response.data._id,
            avatar: response.data.participants[0].avatar,
            phoneNumber: response.data.participants[0].phoneNumber,
            updatedAt: response.data.updatedAt,
            userId: response.data.participants[0].id,
            userName: response.data.participants[0].userName,
            type: response.data.type,
            lastedOnline: response.data.participants[0].lastedOnline,
          }
          navigation.navigate('ChatMessage', {items: newItem}) 
        }
      }
      else if(response.errCode === -1){
        try {
          const response = await axios.post('/chat/access', {
            "type": "PRIVATE_CHAT",
            "participants": [currentId, friendId],
            "status": true
          })
          if (response.errCode === 0) {
            if (response.data.participants[0].id === currentId) {
              const data = {
                _id: response.data._id,
                avatar: response.data.participants[1].avatar,
                phoneNumber: response.data.participants[1].phoneNumber,
                type: response.data.type,
                updatedAt: response.data.updatedAt,
                userId: response.data.participants[1].id,
                userName: response.data.participants[1].userName,
                lastedOnline: response.data.participants[1].lastedOnline,
              };
              navigation.navigate('ChatMessage', {items: data});
            } else if (response.data.participants[1].id === currentId) {
              const data = {
                _id: response.data._id,
                avatar: response.data.participants[0].avatar,
                phoneNumber: response.data.participants[0].phoneNumber,
                type: response.data.type,
                updatedAt: response.data.updatedAt,
                userId: response.data.participants[0].id,
                userName: response.data.participants[0].userName,
                lastedOnline: response.data.participants[0].lastedOnline,
              };
              navigation.navigate('ChatMessage', {items: data});
            }
          }
        } catch (error) {
          console.log('Error 5: ', error);
        }
      }
    } catch (error) {
      console.log('Error 2', error);
    }
  }

  const renderLine = (height) => (
    <View style={[styles.line, {height: height}]}>
    </View>
  )

  const renderItem = ({item}) => {
    let data;
    if (item?.sender?.id === currentId) {
      data = item?.receiver;
    } else if (item?.receiver?.id === currentId ) {
      data = item?.sender;
    }
    
    return(
      <>
        {
          stateListFriend === 'all' ? 
            <Pressable style={styles.btnItem} onPress={()=> {joinChatWithFriend(data.id)}}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                {data?.avatar.substring(0, 3) ==='rgb' ? 
                  <View>
                    <View style={{height: 45, width: 45, backgroundColor: data?.avatar, borderRadius: 25, marginLeft: 15}}></View> 
                    {!data?.lastedOnline ? 
                      <View style={{backgroundColor: '#3FD78C', height: 15, width: 15, borderRadius: 10, position: 'absolute', top: 32, left: 47, borderWidth: 2, borderColor: '#ffffff'}}></View> 
                    : ''}
                  </View>
                : 
                  <View>
                    <Image source={{uri: data?.avatar}} style={{height: 45, width: 45, borderRadius: 25, marginLeft: 15}} />
                    {
                      !data?.lastedOnline ? 
                        <View style={{backgroundColor: '#3FD78C', height: 15, width: 15, borderRadius: 10, position: 'absolute', top: 32, left: 47, borderWidth: 2, borderColor: '#ffffff'}}></View> 
                      : 
                      ''
                    }
                  </View>
                }
                <Text style={{marginLeft: 15, fontSize: 16, flex: 1}}>{data?.userName}</Text>
                <View style={{flexDirection: 'row', marginRight: 25}}>
                  <Pressable style={[styles.btnIcon, {marginRight: 5}]}>
                    <FontAwesomeIcon color="#616161" size={19} icon={faPhone} />
                  </Pressable>
                  <Pressable style={[styles.btnIcon, {}]}>
                    <FontAwesomeIcon color="#616161" size={20} icon={faVideo} />
                  </Pressable>
                </View>
              </View>
            </Pressable>
          : 
            !data?.lastedOnline ? 
              <Pressable style={styles.btnItem} onPress={()=> {joinChatWithFriend(data.id)}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                  {data?.avatar.substring(0, 3) ==='rgb' ? 
                    <View>
                      <View style={{height: 45, width: 45, backgroundColor: data?.avatar, borderRadius: 25, marginLeft: 15}}></View> 
                      {!data?.lastedOnline ? 
                        <View style={{backgroundColor: '#3FD78C', height: 15, width: 15, borderRadius: 10, position: 'absolute', top: 32, left: 47, borderWidth: 2, borderColor: '#ffffff'}}></View> 
                      : ''}
                    </View>
                  : 
                    <View>
                      <Image source={{uri: data?.avatar}} style={{height: 45, width: 45, borderRadius: 25, marginLeft: 15}} />
                      {
                        !data?.lastedOnline ? 
                          <View style={{backgroundColor: '#3FD78C', height: 15, width: 15, borderRadius: 10, position: 'absolute', top: 32, left: 47, borderWidth: 2, borderColor: '#ffffff'}}></View> 
                        : 
                        ''
                      }
                    </View>
                  }
                  <Text style={{marginLeft: 15, fontSize: 16, flex: 1}}>{data?.userName}</Text>
                  <View style={{flexDirection: 'row', marginRight: 25}}>
                    <Pressable style={[styles.btnIcon, {marginRight: 5}]}>
                      <FontAwesomeIcon color="#616161" size={19} icon={faPhone} />
                    </Pressable>
                    <Pressable style={[styles.btnIcon, {}]}>
                      <FontAwesomeIcon color="#616161" size={20} icon={faVideo} />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            : ''
        }
      </>
    )
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#FFFFFF'}}>
      <View style={{padding:10}}>
        <Pressable style={styles.btnWrapper} onPress={()=>{ navigation.navigate('FriendRequest') }}>
          <View style={styles.viewIcon}>
            <FontAwesomeIcon size={18} color={"#FFFFFF"} icon={faUserPlus} />
          </View>
          <Text style={styles.btnTxt}>Lời mời kết bạn</Text>
        </Pressable>

        <Pressable style={styles.btnWrapper}>
          <View style={styles.viewIcon}>
            <FontAwesomeIcon size={18} color={"#FFFFFF"} icon={faList} />
          </View>
          <Text style={styles.btnTxt}>Danh bạ máy</Text>
        </Pressable>

        <Pressable style={styles.btnWrapper}> 
          <View style={styles.viewIcon}>
            <FontAwesomeIcon size={18} color={"#FFFFFF"} icon={faCakeCandles} />
          </View>
          <Text style={styles.btnTxt}>Lịch sinh nhật</Text>
        </Pressable>
      </View>

      {renderLine(10)}
      
      <View style={{flexDirection: 'row', marginTop: 10, marginBottom: 10}}>
        <Pressable style={styles.btnSelect} onPress={()=> {setStateListFriend('all')}}> 
          <Text style={{fontWeight: "bold", fontSize:14}}>Tất cả</Text>
          <Text style={{fontSize:16, marginLeft: 10}}>{friendList.length}</Text>
        </Pressable>
        
        <Pressable style={[styles.btnSelect, {width: 130}]} onPress={()=> {setStateListFriend('online')}}> 
          <Text style={{fontWeight: "bold", fontSize:14}}>Mới truy cập</Text>
          <Text style={{fontSize:16, marginLeft: 10}}>
            {count}
          </Text>
        </Pressable>
      </View>

      {renderLine(1)}

      <FlatList
        data={friendList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        scrollEnabled={false}
      ></FlatList>
      <View style={{height: 50, width: '100%'}}></View>
    </ScrollView>
  );
};
