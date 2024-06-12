import { Dimensions, FlatList, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import React from 'react'
import { styles } from './style'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEllipsis, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faBell, faHeart, faLaughWink, faPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useSelector } from 'react-redux';
import { Video, Audio } from 'expo-av';
import { useRef } from 'react'

export const Timeline = () => {
  const user = useSelector(state => state.user.user.user);
  const videoRefs = useRef(null); 
  const { width } = Dimensions.get('screen')
  const data = [
    {
      id: 1,
      userName: 'Trần Minh Thuận',
      avatar: 'https://res.cloudinary.com/ngocvu1932/image/upload/v1715700002/biaUser/bbm0ddsyfurpqfv7ncvr.jpg',
      url: 'https://res.cloudinary.com/ngocvu1932/video/upload/v1715699641/biaUser/jhtek92jnlfqbldijbge.mp4',
      time: '7 giờ',
      content: 'Tuii cũng muốn chơi phi phai với nobita :v',
    },
    {
      id: 2,
      userName: 'Ngô Ngọc Vũ',
      avatar: 'https://res.cloudinary.com/ngocvu1932/image/upload/v1715700002/biaUser/bbm0ddsyfurpqfv7ncvr.jpg',
      url: 'https://res.cloudinary.com/ngocvu1932/video/upload/v1715699646/biaUser/gad2oawkbgzqph2gwwsw.mp4',
      time: '2 giờ',
      content: 'Nhạc hay quá trờiiiii',
    },
    {
      id: 3,
      userName: 'Nguyễn Hồng Sơn',
      avatar: 'https://res.cloudinary.com/ngocvu1932/image/upload/v1715700002/biaUser/bbm0ddsyfurpqfv7ncvr.jpg',
      url: 'https://res.cloudinary.com/ngocvu1932/video/upload/v1715699650/biaUser/jpuwfw5pnrk4nvwwjdks.mp4',
      time: '17 giờ',
      content: 'Đi phượt thật vui :)',
    },
    {
      id: 4,
      userName: 'Ngô Nhật Thái',
      avatar: 'https://res.cloudinary.com/ngocvu1932/image/upload/v1715700002/biaUser/bbm0ddsyfurpqfv7ncvr.jpg',
      url: 'https://res.cloudinary.com/ngocvu1932/video/upload/v1715699657/biaUser/seokrw054yqjl7jm2fju.mp4',
      time: '1 giờ',
      content: 'Vui thật, nhạc hay quá trời :v',
    },
  ]

  const renderItem = ({item}) => {
    return (
      <Pressable style={{backgroundColor: '#FFFFFF', marginTop: 10, alignItems: 'center'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
          <Image source={{uri: item.avatar}} style={{height: 50, width: 50, borderRadius: 30, marginLeft: 15}}/>

          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={{fontSize: 16, fontWeight: '500'}}>{item.userName}</Text>
            <Text style={{fontSize: 14, opacity: 0.8}}>{item.time}</Text>
          </View>

          <FontAwesomeIcon style={{marginRight: 15}} color='#6D6D6D' size={20} icon={faEllipsis} />
        </View>

        <View style={{alignSelf: 'flex-start', marginLeft: 15, marginTop: 10, marginBottom: 10}}>
          <Text style={{fontSize: 16}}>{item.content}</Text>
        </View>

        <Video
          style={{height: 300, width: width * 0.9, borderRadius: 10}}
          ref={videoRefs}
          source={{uri: item.url}}
          useNativeControls={true}
          resizeMode="contain"
        />

        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '85%', marginTop: 10, marginBottom: 10}}>
          <Pressable style={{flexDirection: 'row', width: '25%', height: 35, backgroundColor: '#EDEDED', justifyContent: 'center', alignItems: 'center', borderRadius: 20}}>
            <FontAwesomeIcon icon={faHeart} size={20} />
            <Text style={{marginLeft: 5, fontSize: 14}}>Thích</Text>
          </Pressable>

          <Pressable style={{flexDirection: 'row', width: '73%', height: 35, backgroundColor: '#EDEDED', justifyContent: 'space-between', alignItems: 'center', borderRadius: 15}}>
            <Text style={{marginLeft: 15, fontSize: 14}}>Nhập bình luận</Text>
            <FontAwesomeIcon style={{marginRight: 10}} icon={faLaughWink} size={20} />
          </Pressable>
        </View>
      </Pressable>
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient style={styles.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#008BFA', '#00ACF4']}>
        <View style={{flexDirection: 'row', height: '55%', width: '100%', alignItems: 'center', justifyContent: 'space-between'}}>
          <FontAwesomeIcon style={{marginLeft: 10}} color='#F1FFFF' size={22} icon={faMagnifyingGlass} />
          <TextInput style={styles.txtInHeader} placeholder='Tìm kiếm' placeholderTextColor={'#FFFFFF'} editable={false}></TextInput>

          <View style={{width: '22%', flexDirection: 'row', justifyContent: 'space-between'}}>
            <Pressable style={{height: 30, width: 30, justifyContent: 'center', alignItems: 'center'}}>
              <FontAwesomeIcon style={{}} color='#F1FFFF' size={22} icon={faPenToSquare} />
            </Pressable>

            <Pressable style={{height: 30, width: 30, justifyContent: 'center', alignItems: 'center', marginRight: 6}}>
              <FontAwesomeIcon style={{}} color='#F1FFFF' size={22} icon={faBell} />
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.body}>
        <Pressable style={styles.pressTodayFeel} >
          {
            user.avatar.substring(0, 3) === 'rgb' ?  
              <View style={{height: 45, width: 45, borderRadius: 30, marginLeft: 15, backgroundColor: user.avatar}} />
            : 
              <Image source={{uri : user.avatar}} style={{height: 45, width: 45, borderRadius: 30, marginLeft: 15}} />
          }
          <Text style={{marginLeft: 10 , fontSize: 18, opacity: 0.8}}>Hôm nay bạn thế nào?</Text>
        </Pressable>

        <FlatList 
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
        />
        {/* <View style={{height: 10}}></View> */}
      </ScrollView>
    </View>
  )
}

