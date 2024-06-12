import { Dimensions, Image, Pressable, Text, View } from "react-native"
import { styles } from "./style"
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft, faPencil } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import moment from "moment";

export const ProfileInfo = ({navigation, route}) => {
    const {height} = Dimensions.get('screen');
    const {isUser} = route.params;
    const userInfo = useSelector(state => state.userInfo); 

    const renderLine = () => (
        <View style={styles.line}> 
          <View style={styles.line1} >
          </View>
          <View style={styles.line2}>
          </View>
        </View>
    )

    return(
        <View style={styles.container}> 
            {/* thanh option */}
            <View style={{position: 'absolute', top: '4.5%', left: 0, right: 0, zIndex: 10, width: '100%'}}>
                <Pressable style={{height: 40, width: 40, justifyContent: 'center', alignItems: 'center'}} onPress={()=> {navigation.goBack()}}>
                    <FontAwesomeIcon color='#F1FFFF' size={20} icon={faChevronLeft} />
                </Pressable>
            </View>

            {/* avtt */}
            <View style={{position: 'absolute', top: '23%', left: 0, right: 0, zIndex: 10, width: '100%'}}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 10}}>
                    {userInfo.userInfo?.avatar.substring(0, 3) === 'rgb' ? (
                        <View style={{height: 55, width: 55, backgroundColor: userInfo.userInfo.avatar, borderRadius: 30, borderWidth: 2, borderColor: '#FFFFFF'}}></View>
                    ): 
                        <Image source={{uri : userInfo.userInfo.avatar }} style={{height: 55, width: 55, borderRadius: 30, borderWidth: 2, borderColor: '#FFFFFF'}} />
                    }
                    <Text style={{fontSize: 20, color: '#FFFFFF', fontWeight: '500', marginLeft: 10}}>{ userInfo.userInfo?.userName}</Text>
                </View>
            </View>

            <View style={{width: '100%', height: height * 0.3}}>
                <View style={{width: '100%', height: '100%', zIndex: 0}}>
                {userInfo.userInfo?.userInfo?.coverImage.includes('localhost') ?
                    <Image source={{uri: 'https://res.cloudinary.com/ngocvu1932/image/upload/v1714486268/bgVsCode/kbdwbuprkwqyz54zovxu.jpg'}} style={{height:"100%", width:"100%"}} />
                : 
                    <Image source={{uri: userInfo.userInfo?.userInfo?.coverImage}} style={{height:"100%", width:"100%"}} />
                }
                </View> 
            </View>

            {/* Thông tin cá nhân */}
            <View style={{backgroundColor: '#FFFFFF'}}>
                <Text style={{marginLeft: 15, marginTop: 15, fontSize: 15, fontWeight: '600'}}>Thông tin cá nhân</Text>
                <View style={{flexDirection: 'row', height: 45, alignItems: 'center'}}>
                    <Text style={{flex: 1, fontSize: 15, opacity: 0.7, marginLeft: 15}}>Giới tính</Text>
                    <Text style={{flex: 2, fontSize: 15}}>
                        {userInfo.userInfo?.userInfo?.gender ? 'Nam' : 'Nữ'}
                    </Text>
                </View>

                {renderLine()}

                <View style={{flexDirection: 'row', height: 45, alignItems: 'center'}}>
                    <Text style={{flex: 1, fontSize: 15, opacity: 0.7, marginLeft: 15}}>Ngày sinh</Text>
                    <Text style={{flex: 2, fontSize: 15}}>
                        {userInfo.userInfo?.userInfo?.birthdate ? moment.utc(userInfo.userInfo?.userInfo?.birthdate).utcOffset('+07:00').format('DD/MM/YYYY') : 'Chưa cập nhật'}
                    </Text>
                </View>

                {renderLine()}

                <View style={{flexDirection: 'row', height: 45, alignItems: 'center'}}>
                    <Text style={{flex: 1,fontSize: 15, opacity: 0.7, marginLeft: 15}}>Điện thoại</Text>
                    <Text style={{flex: 2, fontSize: 15}}>{isUser ? userInfo.userInfo?.phoneNumber : '**********'}</Text>
                </View>

                <View style={{width: '100%', alignItems: 'flex-end', marginBottom: 10}}>
                    <Text style={{width: '65%', fontSize: 13, opacity: 0.7}}>Số điện thoại chỉ hiển thị khi bạn có lưu số người này trong danh bạ</Text>
                </View>

                {isUser ? 
                    <View style={{alignItems: 'center', marginBottom: 20, marginTop: 10}}>
                        <Pressable style={styles.btnEdit} onPress={()=> navigation.navigate('EditProfile', {isUser: isUser})}>
                            <FontAwesomeIcon icon={faPencil} size={20} color='#000000'/>
                            <Text>   Chỉnh sửa</Text>
                        </Pressable>
                    </View> : ''}
            </View>
        </View>
    )
}