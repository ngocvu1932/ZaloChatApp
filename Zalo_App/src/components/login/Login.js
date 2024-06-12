import { Dimensions, FlatList, Image, Pressable, Text, View } from 'react-native'
import React from 'react'
import { styles } from './style'
import { SafeAreaView } from 'react-native-safe-area-context'


const {width, height} = Dimensions.get('screen')

const data = [
  {
    id: 1,
    img: require('../../../assets/img/1.jpg')
  },
  {
    id: 2,
    img: require('../../../assets/img/2.jpg')
  },
  {
    id: 3,
    img: require('../../../assets/img/3.jpg')
  },
  {
    id: 4,
    img: require('../../../assets/img/4.jpg')
  },
]

export const Login = ({navigation}) => {

  const renderItem = ({item}) => (
    <View style={{zIndex: 0, width: width, justifyContent: 'center', alignItems: 'center'}}>
      <Image source={item.img} style={{height: width * 0.75 ,  width: width}} resizeMode='contain' />
    </View>
  ) 

  return (
    <SafeAreaView style={styles.container}>
      <View style={{flex: 2, width: '100%', alignItems: 'center'}}>
        <Text style={styles.txtZaloX}>Zalo</Text>

        <View >
          <FlatList
            data={data}
            renderItem={renderItem} 
            horizontal
            pagingEnabled
            snapToAlignment='center'
            showsHorizontalScrollIndicator={true}
          ></FlatList>
        </View>
      </View> 

      <View style={{flex: 1, justifyContent: 'center', width: '100%', alignItems: 'center'}}>  
        <Pressable style={[styles.btnLogin, {width: width * 0.7}]} onPress={()=> { navigation.navigate("LoginPage") }}> 
          <Text style={styles.txtLogin}> Đăng nhập </Text>
        </Pressable>  

        <Pressable style={[styles.btnLogin, {marginTop: 15, backgroundColor: '#E9EDF8', width: width * 0.7}]} onPress={()=> { navigation.navigate("RegisterPageL") }}> 
          <Text style={[styles.txtLogin, {color: 'black'}]}> Tạo tài khoản mới </Text>
        </Pressable>   
      </View>
      
    </SafeAreaView>
  )
}

