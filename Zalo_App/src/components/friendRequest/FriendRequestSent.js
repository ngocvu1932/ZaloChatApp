import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import axios from "../../config/axios";
import moment from "moment";
import { styles } from "./style";
import { socket } from "../../config/io";

export const FriendRequestSent = ({ navigation }) => {
  const [loadAgain, setLoadAgain] = useState(false);
  const [listFriendRequestSent, setListFriendRequestSent] = useState([]);
  const [loadAgainSocket, setLoadAgainSocket] =useState();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoadAgainSocket(new Date());
      setLoadAgain(new Date());
    });

    return unsubscribe;
  }, [navigation]);

  //socket
  const handleAddFriend = async (data) => {
    // console.log('data', data);
    setLoadAgain(true);
  }

  // console.log('listFriendRequestSent', listFriendRequestSent);

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

  // lấy lời mời đã gửi
  useEffect(()=> {
    const getAllFriendRequestSent = async () => {
      try {
        const response = await axios.get('/users/notifications/friendShip/sentInvited');
        if (response.errCode === 0) { 
          setListFriendRequestSent(response.data); 
          setLoadAgain(false);
        } else { 
          console.log('Error 2:', response);
        }
      } catch (error) {
        console.log('Error 1:', error);
      }
    }
    
    getAllFriendRequestSent();
  }, [loadAgain])

  // Send request add friend and recall request add friend
  const sendRequestAddFriend = async (idUserGet) => {
    try {
      const response = await axios.post(`/users/friendShip`, {
        userId: idUserGet, 
        content: 'Xin chào, tôi muốn kết bạn với bạn'
      });

      if (response.errCode === 3) {
        setLoadAgain(new Date());
        socket.then(socket => {
          socket.emit('send-add-friend', {createdAt: new Date()});
        });
      } else {
        setLoadAgain(new Date());
      }
    } catch (error) {
      console.log('Error 4: ', error.message);
    }
  };

  const renderItem = ({item}) => {
    const now = moment();
    const createdAt = moment(item.createdAt);
    const duration = moment.duration(now.diff(createdAt));
    return (
      <Pressable style={styles.btnMain} onPress={()=> {navigation.navigate('Profile', {phoneNumber: item.friendShip.receiver.phoneNumber})}}>
        {item.friendShip?.receiver?.avatar.substring(0, 3) === 'rgb' ? 
            <View style={[styles.viewAvt, {backgroundColor: item.friendShip.receiver.avatar}]} />
          : 
            <Image source={{uri: item.friendShip?.receiver?.avatar}} style={[styles.viewAvt]} />
        }
        <View style={{flex: 1, marginLeft: 10}}>
          <Text style={{fontSize: 16, fontWeight: 400}}>{item.friendShip.receiver.userName}</Text>
          <Text style={{fontSize: 14}}>{duration.days() > 0 ? `${duration.days()} ngày trước  ` : duration.hours() > 0 ? `${duration.hours()} giờ trước  ` : duration.minutes() > 0 ? `${duration.minutes()} phút trước  ` : duration.seconds() > 0 ? `${duration.seconds()} giây trước  ` : 'Ngay bây giờ  ' }</Text>
        </View>

        <Pressable style={styles.btnRecall} onPress={()=> sendRequestAddFriend(item.friendShip.receiver.id)}>
          <Text style={{fontSize: 15}}>Thu hồi</Text>
        </Pressable>
      </Pressable>
    )
  }

  return (
    <View style={{height:"100%", backgroundColor:'white'}}>
      <FlatList
        data={listFriendRequestSent}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      ></FlatList>
      
    </View>
  );
};