import { Messages } from './src/components/messages/Messages';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Contacts } from './src/components/contacts/Contacts';
import { Discovery } from './src/components/discovery/Discovery';
import { Timeline } from './src/components/timeline/Timeline';
import { Me } from './src/components/me/Me';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAddressBook, faClock, faCommentDots, faSnowflake, faUser } from '@fortawesome/free-regular-svg-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from './src/components/login/Login'; 
import { Setting } from './src/components/settings/Setting';
import { AccountAndSecurity } from './src/components/accountAndSecurity/AccountAndSecurity';
import { Privacy } from './src/components/privacy/Privacy';
import { Notification } from './src/components/notification/Notification';
import { SettingMessage } from './src/components/setting_Messages/SettingMessage';
import { SettingCalling } from './src/components/setting_Calling/SettingCalling';
import { SettingTimeline } from './src/components/setting_Timeline/SettingTimeline';
import { SettingContact } from './src/components/settingContact/SettingContact';
import { SettingInfo } from './src/components/settingInfo/SettingInfo';
import { LoginPage } from './src/components/loginPage/LoginPage';
import { useEffect, useState } from 'react';
import { ChatMessage} from './src/components/chatMessage/ChatMessage';
import { ChatMessageOptions } from './src/components/chatMessageOptions/ChatMessageOptions';
import { QRCodeScanner } from './src/components/qrCodeScanner/QRCodeScanner';
import { RegisterPageL } from './src/components/registerPageL/RegisterPageL';
import {RegisterPage2}  from './src/components/registerPage2/RegisterPage2';
import { RegisterAuth } from './src/components/registerAuth/RegisterAuth';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ChangePassword } from './src/components/settingChangePassword/ChangePassword';
import { BACKEND_URL } from '@env'; 
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { useSelector } from 'react-redux';
import  AsyncStorage  from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from './src/redux/userSlice'
import { AddFriend } from './src/components/addFriend/AddFriend';
import { FriendRequest } from './src/components/friendRequest/FriendRequest';
import { FriendRequestReceived } from './src/components/friendRequest/FriendRequestReceived';
import { FriendRequestSent } from './src/components/friendRequest/FriendRequestSent';
import { Profile } from './src/components/profile/Profile';
import { ProfileOptions } from './src/components/profileOptions/ProfileOptions';
import { CreateGroup } from './src/components/createGroup/CreateGroup';
import {ManagerGroupMembers} from './src/components/managerGroupMembers/ManagerGroupMembers';
import { AllMembers } from './src/components/managerGroupMembers/AllMembers';
import { AddMember } from './src/components/createGroup/AddMember';
import { LogBox, Platform } from 'react-native';
import { setDevice } from './src/redux/deviceSlice';
import { ProfileInfo } from './src/components/profileOptions/ProfileInfo';
import { EditProfile } from './src/components/profileOptions/EditProfile';
import { ChangeAdminGroup } from './src/components/managerGroupMembers/ChangeAdminGroup';
import { ShareMessage } from './src/components/chatMessage/ShareMessage';
LogBox.ignoreLogs(['onAnimatedValueUpdate']);
LogBox.ignoreLogs(['No native ExpoFirebaseCore module found']);
LogBox.ignoreLogs(['Possible unhandled promise rejection']);
LogBox.ignoreLogs(['SerializableStateInvariantMiddleware']);

const Tab= createBottomTabNavigator();
const Stack= createNativeStackNavigator();

const MainScreen = ({ route }) => { 

  return(  
    <Tab.Navigator 
      initialRouteName={route.params?.screen}
      screenOptions={({route}) => ({
        tabBarIcon: ({ color}) => {
          if (route.name === 'Messages') {
            return <FontAwesomeIcon icon={faCommentDots} size={22} color={color} />;
          } else if (route.name === 'Contacts') {
            return <FontAwesomeIcon icon={faAddressBook} size={22} color={color} />;
          } else if (route.name === 'Discovery') {
            return <FontAwesomeIcon icon={faSnowflake} size={22} color={color} />;
          } else if (route.name === 'Timeline') {
            return <FontAwesomeIcon icon={faClock} size={22} color={color} />;
          } else if (route.name === 'Me') {
            return <FontAwesomeIcon icon={faUser} size={22} color={color} />;
          } 
        },
        headerShown: false,
        tabBarStyle:{paddingBottom: 25, height: '10%', elevation: 0, shadowOpacity: 0, borderTopWidth: 1, borderTopColor: '#D1D1D1'}
      })} 
    >
      <Tab.Screen name="Messages" component={Messages} options={{tabBarLabel: 'Tin nhắn', tabBarLabelStyle:{fontSize: 12}, tabBarBadge: '3'}}/>
      <Tab.Screen name="Contacts" component={Contacts} options={{tabBarLabel: 'Danh bạ', tabBarLabelStyle:{fontSize: 12}, tabBarBadge: undefined }}/>
      <Tab.Screen name="Discovery" component={Discovery} options={{tabBarLabel: 'Khám phá', tabBarLabelStyle:{fontSize: 12}}}/> 
      <Tab.Screen name="Timeline" component={Timeline} options={{tabBarLabel: 'Nhật ký', tabBarLabelStyle:{fontSize: 12}}}/>
      <Tab.Screen name="Me" component={Me} options={{tabBarLabel: 'Cá nhân', tabBarLabelStyle:{fontSize: 12}}}/>
    </Tab.Navigator>
  )
}
 
const RootStack = () => {
  const dispatch = useDispatch();
  const [auth, setAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  console.log("Backend url: ", BACKEND_URL);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataGetStorage = await AsyncStorage.getItem('dataUser');
        const data = JSON.parse(dataGetStorage);
        setAuth(true); 
        setIsLoading(false);

        if (data) {
          dispatch(setUser(data));
        }
      } catch (error) { 
        console.error('Error fetching data from AsyncStorage:', error);
      }
    };

    fetchData();

    if (Platform.OS === 'ios') {
      dispatch(setDevice('ios'));
    } else if (Platform.OS === 'android') {
      dispatch(setDevice('android'));
    } else {
      dispatch(setDevice('other'));
    }
  }, [dispatch])

  // socket
  // useEffect(() => {
  //   socket.then(socket => {
  //     socket.emit('setup', user.user?.user); 
  //     socket.on('connected', (data) => {
  //         console.log('Connected to server', data);
  //         socket.emit('join-room', user.user?.user?.id);
  //     });
  //   });

  //   return () => {
  //     socket.then(socket => {
  //       socket.off('connected');
  //     });
  //   };
  // }, [user]);

  if (isLoading) {
    return false;
  }

  return(
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {auth ? (
        <>
          <Stack.Screen name='MainScreen' component={MainScreen}/> 
          <Stack.Screen name='LoginPage' component={LoginPage}/>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name='Setting' component={Setting}/>  
          <Stack.Screen name='AccountAndSecurity' component={AccountAndSecurity}/>
          <Stack.Screen name='Privacy' component={Privacy}/>
          <Stack.Screen name='Notification' component={Notification}/>
          <Stack.Screen name='SettingMessage' component={SettingMessage}/>
          <Stack.Screen name='SettingCalling' component={SettingCalling}/>
          <Stack.Screen name='SettingTimeline' component={SettingTimeline}/>
          <Stack.Screen name='SettingContact' component={SettingContact}/>
          <Stack.Screen name='SettingInfo' component={SettingInfo}/>
          <Stack.Screen name='ChatMessage' component={ChatMessage}/>
          <Stack.Screen name='ChatMessageOptions' component={ChatMessageOptions}/>
          <Stack.Screen name='QRCodeScanner' component={QRCodeScanner}/>
          <Stack.Screen name='RegisterPageL' component={RegisterPageL}/>
          <Stack.Screen name='RegisterPage2' component={RegisterPage2}/>
          <Stack.Screen name='RegisterAuth' component={RegisterAuth}/>
          <Stack.Screen name='ChangePassword' component={ChangePassword}/>
          <Stack.Screen name='AddFriend' component={AddFriend}/>
          <Stack.Screen name='FriendRequest' component={FriendRequest}/>
          <Stack.Screen name='FriendRequestReceived' component={FriendRequestReceived}/>
          <Stack.Screen name='FriendRequestSent' component={FriendRequestSent}/>
          <Stack.Screen name='Profile' component={Profile}/>
          <Stack.Screen name='ProfileOptions' component={ProfileOptions}/>
          <Stack.Screen name='CreateGroup' component={CreateGroup}/>
          <Stack.Screen name='ManagerGroupMembers' component={ManagerGroupMembers}/>
          <Stack.Screen name='AllMembers' component={AllMembers}/>
          <Stack.Screen name='AddMember' component={AddMember}/>
          <Stack.Screen name='ProfileInfo' component={ProfileInfo}/>
          <Stack.Screen name='EditProfile' component={EditProfile}/>
          <Stack.Screen name='ChangeAdminGroup' component={ChangeAdminGroup}/>
          <Stack.Screen name='ShareMessage' component={ShareMessage}/>
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name='LoginPage' component={LoginPage}/>
          <Stack.Screen name='Setting' component={Setting}/>  
          <Stack.Screen name='MainScreen' component={MainScreen}/>  
          <Stack.Screen name='AccountAndSecurity' component={AccountAndSecurity}/>
          <Stack.Screen name='Privacy' component={Privacy}/>
          <Stack.Screen name='Notification' component={Notification}/>
          <Stack.Screen name='SettingMessage' component={SettingMessage}/>
          <Stack.Screen name='SettingCalling' component={SettingCalling}/>
          <Stack.Screen name='SettingTimeline' component={SettingTimeline}/>
          <Stack.Screen name='SettingContact' component={SettingContact}/>
          <Stack.Screen name='SettingInfo' component={SettingInfo}/>
          <Stack.Screen name='ChatMessage' component={ChatMessage}/>
          <Stack.Screen name='ChatMessageOptions' component={ChatMessageOptions}/>
          <Stack.Screen name='QRCodeScanner' component={QRCodeScanner}/>
          <Stack.Screen name='RegisterPageL' component={RegisterPageL}/>
          <Stack.Screen name='RegisterPage2' component={RegisterPage2}/>
          <Stack.Screen name='RegisterAuth' component={RegisterAuth}/>
          <Stack.Screen name='ChangePassword' component={ChangePassword}/>
          <Stack.Screen name='AddFriend' component={AddFriend}/>
          <Stack.Screen name='FriendRequest' component={FriendRequest}/>
          <Stack.Screen name='FriendRequestReceived' component={FriendRequestReceived}/>
          <Stack.Screen name='FriendRequestSent' component={FriendRequestSent}/>
          <Stack.Screen name='Profile' component={Profile}/>
          <Stack.Screen name='ProfileOptions' component={ProfileOptions}/>
          <Stack.Screen name='CreateGroup' component={CreateGroup}/>
          <Stack.Screen name='ManagerGroupMembers' component={ManagerGroupMembers}/>
          <Stack.Screen name='AllMembers' component={AllMembers}/>
          <Stack.Screen name='AddMember' component={AddMember}/>
          <Stack.Screen name='ProfileInfo' component={ProfileInfo}/>
          <Stack.Screen name='EditProfile' component={EditProfile}/>
          <Stack.Screen name='ChangeAdminGroup' component={ChangeAdminGroup}/>
          <Stack.Screen name='ShareMessage' component={ShareMessage}/>

        </>
      ) }
    </Stack.Navigator>
  )
}

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Provider store={store}>
          <RootStack />
        </Provider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
