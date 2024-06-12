import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./style";
import {
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  Keyboard,
  FlatList,
  StatusBar,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faCamera,
  faCheck,
  faChevronLeft,
  faChevronRight,
  faLink,
  faMagnifyingGlass,
  faPersonCirclePlus,
  faPhone,
  faQrcode,
  faSearch,
  faUserGroup,
  faUserPlus,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import axios from "../../config/axios";
import Toast from "react-native-easy-toast";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../config/io";
import { setListFriend } from "../../redux/friendSlice";
import { setGroupChatInfo } from "../../redux/groupChatInfoSlice";

export const AddMember = ({ navigation, route }) => {
  const { items } = route.params;
  const device = useSelector((state) => state.device);
  const currentId = useSelector((state) => state.user.user.user.id);
  const groupChatInfo = useSelector(
    (state) => state.groupChatInfo.groupChatInfo
  );
  const dispatch = useDispatch();
  const [loadAgain, setLoadAgain] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const [isKeyboardNumber, setIsKeyboardNumber] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const toastRef = useRef(null);
  const [listId, setListId] = useState([]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        setIsKeyboardOpen(true);
        setKeyboardHeight(event.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardOpen(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // lấy danh sách bạn bè
  useEffect(() => {
    const fetchFriendList = async () => {
      console.log("Lấy danh sach bạn bè");
      try {
        const response = await axios.get(`/users/friends?limit=10`);
        if (response.errCode === 0) {
          setFriendList(response.data);
          dispatch(setListFriend(response.data));
          setLoadAgain(false);
        }
      } catch (error) {
        console.log("Error 1", error);
      }
    };
    fetchFriendList();
  }, []);

  // kiểm tra xem có chọn thành viên nào không
  useEffect(() => {
    if (listId.length > 0) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [listId]);

  const chooseMember = (id, avatar, name) => {
    const existingIndex = listId.findIndex((item) => item.id === id);

    if (existingIndex !== -1) {
      setListId(listId.filter((item) => item.id !== id));
    } else {
      setListId([...listId, { id, avatar, name }]);
    }
  };

  const getGroupChat = async () => {
    try {
      const response = await axios.get(`/chat/access?chatId=${items._id}`);
      if (response.errCode === 0) {
        dispatch(setGroupChatInfo(response.data));
      } else {
        console.log("Error: ", response);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleAddMember = async () => {
    console.log(
      "List id:",
      listId.map((item) => item.id)
    );
    try {
      const response = await axios.put(`/chat/addMembers`, {
        members: listId.map((item) => item.id),
        chatId: items._id,
      });
      console.log("Response:", response);
      if (response.errCode === 0) {
        getGroupChat();
        setListId([]);
        setModalVisible(false);
        toastRef.current.show("Thêm thành viên thành công", 2000);
        socket.then((socket) => {
          socket.emit("add-member", response.data);
          socket.emit("leave-group", response.data);
        });
      }
    } catch (error) {
      console.log("Error adding member:", error);
    }
  };

  const renderItem = ({ item }) => {
    let data;
    if (item?.sender?.id === currentId) {
      data = item?.receiver;
    } else if (item?.receiver?.id === currentId) {
      data = item?.sender;
    }

    return (
      <View>
        {groupChatInfo.participants
          ?.map((item) => item.id)
          .includes(data?.id) ? (
          ""
        ) : (
          <Pressable
            style={[styles.btnChooseMember, { marginTop: 10, marginBottom: 0 }]}
            onPress={() => chooseMember(data?.id, data?.avatar, data?.userName)}
          >
            <View
              style={{
                width: "90%",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View
                style={[
                  styles.viewCheck,
                  listId.map((item) => item.id).includes(data?.id)
                    ? { backgroundColor: "#1194FE", borderColor: "#1194FE" }
                    : {},
                ]}
              >
                <FontAwesomeIcon color="#FFFFFF" icon={faCheck} size={18} />
              </View>
              {data?.avatar?.substring(0, 3) === "rgb" ? (
                <View
                  style={{
                    height: 50,
                    width: 50,
                    backgroundColor: data?.avatar,
                    borderRadius: 25,
                    marginLeft: 15,
                  }}
                />
              ) : (
                <Image
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                    marginLeft: 15,
                  }}
                  source={{ uri: data?.avatar }}
                />
              )}
              <Text style={{ fontSize: 16, marginLeft: 15 }}>
                {data?.userName}
              </Text>
            </View>
          </Pressable>
        )}
      </View>
    );
  };

  const renderItemChooseMember = ({ item }) => {
    return (
      <Pressable
        key={item.id}
        style={{ justifyContent: "center", marginLeft: 10 }}
        onPress={() => chooseMember(item.id, item.avatar)}
      >
        {item.avatar.substring(0, 3) === "rgb" ? (
          <View style={{}}>
            <View
              style={{
                height: 55,
                width: 55,
                borderRadius: 30,
                backgroundColor: item.avatar,
              }}
            ></View>
            <View
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                height: 18,
                width: 18,
                borderRadius: 10,
                backgroundColor: "#E5E4E0",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#FFFFFF",
              }}
            >
              <FontAwesomeIcon size={13} color="#6B849A" icon={faXmark} />
            </View>
          </View>
        ) : (
          <View style={{}}>
            <Image
              source={{ uri: item.avatar }}
              style={{ height: 55, width: 55, borderRadius: 30 }}
            />
            <View
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                height: 18,
                width: 18,
                borderRadius: 10,
                backgroundColor: "#E5E4E0",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 2,
                borderColor: "#FFFFFF",
              }}
            >
              <FontAwesomeIcon size={13} color="#6B849A" icon={faXmark} />
            </View>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{ flexDirection: "row", alignItems: "center", height: "55%" }}
        >
          <Pressable
            onPress={() => {
              navigation.goBack();
            }}
          >
            <FontAwesomeIcon
              style={{ marginLeft: 15 }}
              color="#363636"
              size={20}
              icon={faXmark}
            />
          </Pressable>
          <View style={{ marginLeft: 15 }}>
            <Text style={{ fontSize: 18, fontWeight: "500" }}>
              Thêm vào nhóm
            </Text>
            <Text style={{ fontSize: 14, opacity: 0.8 }}>
              Đã chọn: {listId.length}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.body,
          modalVisible ? { paddingBottom: 90 } : "",
          device.device === "ios"
            ? isKeyboardOpen
              ? { paddingBottom: keyboardHeight + 90 }
              : ""
            : "",
        ]}
      >
        <View
          style={{
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 15,
            marginTop: 20,
          }}
        >
          <FontAwesomeIcon
            style={{ marginRight: -25, zIndex: 2 }}
            color="#878789"
            size={17}
            icon={faSearch}
          />
          <TextInput
            keyboardType={isKeyboardNumber ? "numeric" : "default"}
            style={styles.textInputSearch}
            placeholder="Tìm tên hoặc số điện thoại"
            placeholderTextColor={"#878789"}
          />
          <Pressable
            style={styles.btnChangeStyleKeyboard}
            onPress={() => setIsKeyboardNumber(!isKeyboardNumber)}
          >
            <Text style={{ fontSize: 12, color: "#878789" }}>
              {isKeyboardNumber ? "ABC" : "123"}
            </Text>
          </Pressable>
        </View>

        <ScrollView>
          <Pressable
            style={{
              height: 60,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottomWidth: 1,
              borderBottomColor: "#DFDFDF",
            }}
          >
            <View
              style={{
                height: 45,
                width: 45,
                backgroundColor: "#E9ECF3",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 10,
                borderRadius: 25,
              }}
            >
              <FontAwesomeIcon color="#5D9CD1" size={16} icon={faLink} />
            </View>
            <Text style={{ flex: 1, marginLeft: 10, fontSize: 15 }}>
              Mời vào nhóm bằng link
            </Text>
            <FontAwesomeIcon
              size={15}
              color="#BDBDBF"
              style={{ marginRight: 10 }}
              icon={faChevronRight}
            />
          </Pressable>

          <FlatList
            data={friendList}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </ScrollView>
      </View>

      {modalVisible ? (
        <View
          style={[
            styles.viewModal,
            device.device === "ios"
              ? isKeyboardOpen
                ? { height: keyboardHeight + 90 }
                : ""
              : "",
          ]}
        >
          <View style={{ height: "80%" }}>
            <View style={{ flexDirection: "row", height: 80 }}>
              <View style={{ width: "80%" }}>
                <FlatList
                  data={listId}
                  renderItem={renderItemChooseMember}
                  keyExtractor={(item) => item.id}
                  horizontal={true}
                />
              </View>
              <View
                style={{
                  width: "20%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Pressable
                  style={[styles.btnCreateGroup]}
                  onPress={() => {
                    handleAddMember();
                  }}
                >
                  <FontAwesomeIcon
                    color="#FFFFFF"
                    size={23}
                    icon={faArrowRight}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      ) : (
        ""
      )}
      <Toast
        style={{ backgroundColor: "green" }}
        ref={toastRef}
        position="center"
      />
      {device.device === "ios" ? <StatusBar style="auto" /> : ""}
    </View>
  );
};
