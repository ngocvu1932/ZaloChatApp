import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
  Modal,
  TextInput,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { styles } from "./style";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMagnifyingGlass,
  faWandMagicSparkles,
  faPencil,
  faUserPlus,
  faArrowRightFromBracket,
  faUserGroup,
  faThumbtack,
  faChevronLeft,
  faCamera,
  faChevronRight,
  faChartSimple,
  faGear,
  faUsers,
  faUserCheck,
  faLink,
  faUserGear,
  faPhoneVolume,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import {
  faStar,
  faClock,
  faImage,
  faUser,
  faBell,
  faEyeSlash,
  faCircleXmark,
  faTrashCan,
  faImages,
  faPenToSquare,
} from "@fortawesome/free-regular-svg-icons";
import axios from "../../config/axios";
import Toast from "react-native-easy-toast";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { CLOUD_NAME, UPLOAD_PRESET } from "@env";
import { useDispatch } from "react-redux";
import { setGroupChatInfo } from "../../redux/groupChatInfoSlice";
import { socket } from "../../config/io";

export const ChatMessageOptions = ({ navigation, route }) => {
  const { items } = route.params;
  const user = useSelector((state) => state.user.user.user);
  const groupChatInfo = useSelector(
    (state) => state.groupChatInfo.groupChatInfo
  );
  const [isEnabled, setIsEnabled] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const toastRef = useRef(null);
  const [isToggled, setToggled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleChangeName, setModalVisibleChangeName] = useState(false);
  const [groupName, setGroupName] = useState(groupChatInfo?.name);
  const dispatch = useDispatch();
  const [groupsSame, setGroupsSame] = useState(0);

  useEffect(() => {
    const getGroupsSame = async () => {
      try {
        const response = await axios.get(
          `/chat/total-together?friendId=${items.userId}`
        );
        if (response.errCode === 0) {
          setGroupsSame(response.data.length);
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    getGroupsSame();
  }, []);

  const handleToggle = () => {
    setToggled(!isToggled);
  };

  // xóa bạn bè
  const handleUnfriend = async (userId) => {
    const payload = {
      userId: userId,
    };
    try {
      const response = await axios.put(`users/friendShip/unfriend`, payload);
      if (response.errCode === 0) {
        toastRef.current.show("Xóa bạn bè thành công!", 2000);
        setTimeout(() => {
          navigation.navigate("Messages");
        }, 1000);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  //giải tán nhóm
  const handleDissolveGroup = async () => {
    try {
      const response = await axios.post(`/chat/group/dissolution`, {
        _id: items._id,
      });
      if (response.errCode === 0) {
        toastRef.current.props.style.backgroundColor = "green";
        toastRef.current.show("Giải tán nhóm thành công!", 1000);
        socket.then((socket) => {
          socket.emit("dissolutionGroupChat", response.data);
        });
        setTimeout(() => {
          navigation.navigate("MainScreen", { screen: "Messages" });
        }, 1000);
      } else {
        toastRef.current.props.style.backgroundColor = "red";
        toastRef.current.show("Có lỗi xảy ra!", 1000);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  // rời nhóm
  const handleLeaveGroup = async () => {
    try {
      const response = await axios.put(`/chat/group/out`, {
        chatId: items._id,
      });
      if (response.errCode === 0) {
        toastRef.current.props.style.backgroundColor = "green";
        toastRef.current.show("Bạn đã rời nhóm!", 1000);
        socket.then((socket) => {
          socket.emit("leave-group", response);
        });
        setTimeout(() => {
          navigation.navigate("MainScreen", { screen: "Messages" });
        }, 1000);
      } else if (response.errCode === 1) {
        toastRef.current.props.style.backgroundColor = "red";
        toastRef.current.show(
          <Text style={{ textAlign: "center", color: "#FFFFFF" }}>
            Bạn đang là trưởng nhóm, hãy chuyển trưởng nhóm cho thành viên khác!
          </Text>,
          1500
        );
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const openImagePicker = async (type) => {
    if (type === "C") {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
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
        setModalVisible(false);
        const uri = pickerResult.assets[0].uri;
        const manipResult = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 400, height: 400 } }],
          { compress: 1 }
        );
        const fileName = manipResult.uri.split("/").pop();
        const formData = new FormData();
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("cloud_name", CLOUD_NAME);
        formData.append("file", {
          uri: manipResult.uri,
          name: fileName,
          type: "image/*",
        });
        sendToCloud("IMAGES", formData);
      }
    } else if (type === "L") {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
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
        setModalVisible(false);
        const uri = pickerResult.assets[0].uri;
        const manipResult = await ImageManipulator.manipulateAsync(
          uri,
          [{ resize: { width: 400, height: 400 } }],
          { compress: 1 }
        );
        const fileName = manipResult.uri.split("/").pop();
        const formData = new FormData();
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("cloud_name", CLOUD_NAME);
        formData.append("file", {
          uri: manipResult.uri,
          name: fileName,
          type: "image/*",
        });
        sendToCloud("IMAGES", formData);
      }
    }
  };

  const sendToCloud = async (type, formData) => {
    let typesend = "";
    if (type === "IMAGES") {
      typesend = "image";
    } else if (type === "VIDEO") {
      typesend = "video";
    }
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${typesend}/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const data = await response.json();
      console.log("Upload success:", data);
      if (data.secure_url) {
        changeGroupChat(data.secure_url);
      } else {
        toastRef.current.show("Có lỗi xảy ra!", 1000);
      }
    } catch (error) {
      console.log("Error 1: ", error);
      toastRef.current.show("Có lỗi xảy ra!", 1000);
    }
  };

  const changeGroupChat = async (uri) => {
    try {
      const response = await axios.put(`/chat/group`, {
        _id: items._id,
        groupPhoto: uri,
      });
      if (response.errCode === 0) {
        const data = {
          ...groupChatInfo,
          groupPhoto: uri,
        };
        dispatch(setGroupChatInfo(data));
        toastRef.current.show("Thay đổi ảnh nhóm thành công!", 1000);
      } else {
        toastRef.current.pops.style.backgroundColor = "red";
        toastRef.current.show("Có lỗi xảy ra!", 1000);
      }
    } catch (error) {
      console.log("Error: ", error);
      toastRef.current.pops.style.backgroundColor = "red";
      toastRef.current.show("Có lỗi xảy ra!", 1000);
    }
  };

  const changeGroupName = async () => {
    console.log("items: ", items._id, groupName);
    try {
      const response = await axios.put(`/chat/group`, {
        _id: items._id,
        name: groupName,
      });
      if (response.errCode === 0) {
        setModalVisibleChangeName(false);
        const data = {
          ...groupChatInfo,
          name: groupName,
        };
        dispatch(setGroupChatInfo(data));
        toastRef.current.show("Thay đổi tên nhóm thành công!", 1000);
      } else {
        toastRef.current.pops.style.backgroundColor = "red";
        toastRef.current.show("Có lỗi xảy ra!", 1000);
      }
    } catch (error) {
      console.log("Error: ", error);
      toastRef.current.pops.style.backgroundColor = "red";
      toastRef.current.show("Có lỗi xảy ra!", 1000);
    }
  };

  const renderLine = (height) => (
    <View style={styles.line}>
      <View style={[styles.line1, { height: height }]}></View>
      <View style={[styles.line2, { height: height }]}></View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={["#008BFA", "#00ACF4"]}
        style={styles.header}
      >
        <View style={{ height: "55%", justifyContent: "center" }}>
          <Pressable
            style={{ flexDirection: "row", height: 40, alignItems: "center" }}
            onPress={() => {
              navigation.navigate("ChatMessage", { items: items });
            }}
          >
            <FontAwesomeIcon
              style={{ marginLeft: 15 }}
              color="#F1FFFF"
              size={21}
              icon={faChevronLeft}
            />
            <Text style={styles.txtInHeader}>Tùy chọn</Text>
          </Pressable>
        </View>
      </LinearGradient>

      <ScrollView style={styles.body}>
        <View style={{ alignItems: "center", backgroundColor: "#FFFFFF" }}>
          <Pressable
            disabled={items.type === "GROUP_CHAT"}
            style={{ alignItems: "center", marginTop: 20 }}
            onPress={() => {
              navigation.navigate("Profile", {
                phoneNumber: items.phoneNumber,
                isUser: isUser,
              });
            }}
          >
            {items.type === "PRIVATE_CHAT" ? (
              items.avatar.substring(0, 3) === "rgb" ? (
                <View
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 55,
                    backgroundColor: items.avatar,
                  }}
                ></View>
              ) : (
                <Image
                  source={{ uri: items.avatar }}
                  style={{ height: 100, width: 100, borderRadius: 50 }}
                ></Image>
              )
            ) : //else
            groupChatInfo.groupPhoto === null ? (
              <Pressable onPress={() => setModalVisible(true)}>
                <View
                  style={{
                    height: 100,
                    width: 100,
                    borderRadius: 55,
                    backgroundColor: "#ECEDF1",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesomeIcon
                    color="#A8ADB3"
                    size={50}
                    icon={faUserGroup}
                  />
                </View>

                <View
                  style={{
                    height: 28,
                    width: 28,
                    backgroundColor: "#F8F8F8",
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#FFFFFF",
                  }}
                >
                  <FontAwesomeIcon color="#5E5E5E" size={15} icon={faCamera} />
                </View>
              </Pressable>
            ) : (
              <Pressable onPress={() => setModalVisible(true)}>
                <Image
                  source={{ uri: groupChatInfo.groupPhoto }}
                  style={{ height: 100, width: 100, borderRadius: 50 }}
                ></Image>

                <View
                  style={{
                    height: 28,
                    width: 28,
                    backgroundColor: "#F8F8F8",
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#FFFFFF",
                  }}
                >
                  <FontAwesomeIcon color="#5E5E5E" size={15} icon={faCamera} />
                </View>
              </Pressable>
            )}

            <View style={{ marginTop: 10, alignItems: "center" }}>
              {items.type === "GROUP_CHAT" ? (
                <View style={{ flexDirection: "row" }}>
                  <Text
                    numberOfLines={1}
                    style={{ fontSize: 18, fontWeight: "bold", maxWidth: 320 }}
                  >
                    {groupChatInfo.name}
                  </Text>
                  <Pressable
                    style={{
                      width: 30,
                      height: 30,
                      backgroundColor: "#F6F6F6",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 20,
                    }}
                    onPress={() => setModalVisibleChangeName(true)}
                  >
                    <FontAwesomeIcon
                      size={15}
                      color="#0E0E0E"
                      icon={faPenToSquare}
                    />
                  </Pressable>
                </View>
              ) : (
                <Text
                  numberOfLines={1}
                  style={{ fontSize: 18, fontWeight: "bold" }}
                >
                  {items.userName}
                </Text>
              )}
            </View>
          </Pressable>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginTop: 20,
              width: "80%",
              justifyContent: "space-between",
              marginBottom: 15,
            }}
          >
            <Pressable style={styles.pressbtnOP}>
              <View style={styles.iconInPress}>
                <FontAwesomeIcon
                  color="#505050"
                  size={22}
                  icon={faMagnifyingGlass}
                />
              </View>
              <Text style={{ marginTop: 10, textAlign: "center" }}>
                Tìm tin nhắn
              </Text>
            </Pressable>

            {items.type === "PRIVATE_CHAT" ? (
              <Pressable
                onPress={() => {
                  navigation.navigate("Profile", {
                    phoneNumber: items.phoneNumber,
                    isUser: isUser,
                  });
                }}
                style={styles.pressbtnOP}
              >
                <View style={styles.iconInPress}>
                  <FontAwesomeIcon color="#505050" size={22} icon={faUser} />
                </View>
                <Text style={{ marginTop: 10, textAlign: "center" }}>
                  Xem thông tin
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  navigation.navigate("AddMember", { items: items });
                }}
                style={styles.pressbtnOP}
              >
                <View style={styles.iconInPress}>
                  <FontAwesomeIcon
                    color="#505050"
                    size={22}
                    icon={faUserPlus}
                  />
                </View>
                <Text style={{ marginTop: 10, textAlign: "center" }}>
                  Thêm thành viên
                </Text>
              </Pressable>
            )}

            <Pressable style={styles.pressbtnOP}>
              <View style={styles.iconInPress}>
                <FontAwesomeIcon
                  color="#505050"
                  size={22}
                  icon={faWandMagicSparkles}
                />
              </View>
              <Text style={{ marginTop: 10, textAlign: "center" }}>
                Đổi hình nền
              </Text>
            </Pressable>

            <Pressable style={styles.pressbtnOP}>
              <View style={styles.iconInPress}>
                <FontAwesomeIcon color="#505050" size={22} icon={faBell} />
              </View>
              <Text style={{ marginTop: 10, textAlign: "center" }}>
                Tắt thông báo
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          {items.type === "PRIVATE_CHAT" ? (
            <View>
              <Pressable style={styles.btnOpts}>
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faPencil}
                />
                <Text style={styles.txt}>Đổi tên gợi nhớ</Text>
              </Pressable>

              {renderLine(1)}

              <View style={[styles.btnOpts]}>
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faStar}
                />
                <Text style={styles.txt}>Đánh dấu bạn thân</Text>
                <View>
                  <Pressable
                    style={[styles.button, isToggled && styles.toggledButton]}
                    onPress={handleToggle}
                  >
                    <View
                      style={[
                        styles.circleButton,
                        isToggled ? styles.circleButton1 : styles.circleButton,
                      ]}
                    ></View>
                  </Pressable>
                </View>
              </View>

              {renderLine(1)}

              <Pressable style={styles.btnOpts}>
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faClock}
                />
                <Text style={styles.txt}>Nhật ký chung</Text>
                <FontAwesomeIcon
                  style={{ marginRight: 10 }}
                  color="#787D80"
                  size={15}
                  icon={faChevronRight}
                />
              </Pressable>

              <Pressable style={[styles.btnOpts, { marginTop: 10 }]}>
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faImage}
                />
                <Text style={styles.txt}>Ảnh, file, link đã gửi</Text>
                <FontAwesomeIcon
                  style={{ marginRight: 10 }}
                  color="#787D80"
                  size={15}
                  icon={faChevronRight}
                />
              </Pressable>

              <Pressable style={[styles.btnOpts, { marginTop: 10 }]}>
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faImage}
                />
                <Text style={styles.txt}>
                  Tạo nhóm với{" "}
                  {items.type === "GROUP_CHAT"
                    ? groupChatInfo.name
                    : items.userName}
                </Text>
                <FontAwesomeIcon
                  style={{ marginRight: 10 }}
                  color="#787D80"
                  size={15}
                  icon={faChevronRight}
                />
              </Pressable>

              {renderLine(1)}

              <Pressable style={[styles.btnOpts]}>
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faUserPlus}
                />
                <Text style={styles.txt}>
                  Thêm{" "}
                  {items.type === "GROUP_CHAT"
                    ? groupChatInfo.name
                    : items.userName}{" "}
                  vào nhóm
                </Text>
                <FontAwesomeIcon
                  style={{ marginRight: 10 }}
                  color="#787D80"
                  size={15}
                  icon={faChevronRight}
                />
              </Pressable>

              {renderLine(1)}

              <Pressable style={[styles.btnOpts]}>
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faUserGroup}
                />
                <Text style={styles.txt}>Xem nhóm chung ({groupsSame})</Text>
                <FontAwesomeIcon
                  style={{ marginRight: 10 }}
                  color="#787D80"
                  size={15}
                  icon={faChevronRight}
                />
              </Pressable>

              <Pressable style={[styles.btnOpts, { marginTop: 10 }]}>
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faThumbtack}
                />
                <Text style={styles.txt}>Ghim trò chuyện</Text>
                <Pressable
                  style={[styles.button, isToggled && styles.toggledButton]}
                  onPress={handleToggle}
                >
                  <View
                    style={[
                      styles.circleButton,
                      isToggled ? styles.circleButton1 : styles.circleButton,
                    ]}
                  ></View>
                </Pressable>
              </Pressable>

              {renderLine(1)}

              <Pressable style={[styles.btnOpts]}>
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faEyeSlash}
                />
                <Text style={styles.txt}>Ẩn trò chuyện</Text>
                <Pressable
                  style={[styles.button, isToggled && styles.toggledButton]}
                  onPress={handleToggle}
                >
                  <View
                    style={[
                      styles.circleButton,
                      isToggled ? styles.circleButton1 : styles.circleButton,
                    ]}
                  ></View>
                </Pressable>
              </Pressable>

              {renderLine(1)}

              <Pressable style={[styles.btnOpts]}>
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faPhoneVolume}
                />
                <Text style={styles.txt}>Báo cuộc gọi đến</Text>
                <Pressable
                  style={[styles.button, isToggled && styles.toggledButton]}
                  onPress={handleToggle}
                >
                  <View
                    style={[
                      styles.circleButton,
                      isToggled ? styles.circleButton1 : styles.circleButton,
                    ]}
                  ></View>
                </Pressable>
              </Pressable>

              {renderLine(1)}

              <Pressable style={[styles.btnOpts]}>
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faUserGear}
                />
                <Text style={styles.txt}>Cài đặt cá nhân</Text>
                <FontAwesomeIcon
                  style={{ marginRight: 10 }}
                  color="#787D80"
                  size={15}
                  icon={faChevronRight}
                />
              </Pressable>

              <Pressable style={[styles.btnOpts, { marginTop: 10 }]}>
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faTriangleExclamation}
                />
                <Text style={styles.txt}>Báo xấu</Text>
              </Pressable>

              {renderLine(1)}

              <Pressable style={[styles.btnOpts]}>
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faCircleXmark}
                />
                <Text style={styles.txt}>Quản lý chặn</Text>
                <FontAwesomeIcon
                  style={{ marginRight: 10 }}
                  color="#787D80"
                  size={15}
                  icon={faChevronRight}
                />
              </Pressable>

              {renderLine(1)}

              <Pressable style={[styles.btnOpts]}>
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faTrashCan}
                />
                <Text style={styles.txt}>Xóa lịch sử trò chuyện</Text>
              </Pressable>
            </View>
          ) : items.type === "GROUP_CHAT" ? (
            <View>
              <Pressable
                style={[styles.btnOpts, { justifyContent: "space-between" }]}
              >
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faPencil}
                />
                <Text style={styles.txt}>Đổi tên nhóm</Text>
                <FontAwesomeIcon
                  size={15}
                  style={{ marginRight: 10 }}
                  icon={faChevronRight}
                />
              </Pressable>

              {renderLine(1)}

              <Pressable
                style={[styles.btnOpts, { justifyContent: "space-between" }]}
              >
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faImage}
                />
                <Text style={styles.txt}>Ảnh, file, link đã gửi</Text>
                <FontAwesomeIcon
                  size={15}
                  style={{ marginRight: 10 }}
                  icon={faChevronRight}
                />
              </Pressable>

              {renderLine(1)}

              <Pressable
                style={[styles.btnOpts, { justifyContent: "space-between" }]}
              >
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faThumbtack}
                />
                <Text style={styles.txt}>Tin nhắn đã ghim</Text>
                <FontAwesomeIcon
                  size={15}
                  style={{ marginRight: 10 }}
                  icon={faChevronRight}
                />
              </Pressable>

              {renderLine(1)}

              <Pressable
                style={[styles.btnOpts, { justifyContent: "space-between" }]}
              >
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faChartSimple}
                />
                <Text style={styles.txt}>Bình chọn</Text>
                <FontAwesomeIcon
                  size={15}
                  style={{ marginRight: 10 }}
                  icon={faChevronRight}
                />
              </Pressable>

              {groupChatInfo.administrator === user.id ? (
                <Pressable
                  style={[
                    styles.btnOpts,
                    { justifyContent: "space-between", marginTop: 10 },
                  ]}
                >
                  <FontAwesomeIcon
                    style={{ marginLeft: 15 }}
                    color="#787D80"
                    size={20}
                    icon={faGear}
                  />
                  <Text style={styles.txt}>Cài đặt nhóm</Text>
                  <FontAwesomeIcon
                    size={15}
                    style={{ marginRight: 10 }}
                    icon={faChevronRight}
                  />
                </Pressable>
              ) : (
                ""
              )}

              <Pressable
                style={[
                  styles.btnOpts,
                  { justifyContent: "space-between", marginTop: 10 },
                ]}
                onPress={() =>
                  navigation.navigate("ManagerGroupMembers", { items: items })
                }
              >
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faUsers}
                />
                <Text style={styles.txt}>
                  Xem thành viên {`(${groupChatInfo.participants?.length})`}
                </Text>
                <FontAwesomeIcon
                  size={15}
                  style={{ marginRight: 10 }}
                  icon={faChevronRight}
                />
              </Pressable>

              {renderLine(1)}

              <Pressable
                style={[styles.btnOpts, { justifyContent: "space-between" }]}
              >
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faUserCheck}
                />
                <Text style={styles.txt}>Phê duyệt thành viên mới</Text>
                <FontAwesomeIcon
                  size={15}
                  style={{ marginRight: 10 }}
                  icon={faChevronRight}
                />
              </Pressable>

              {renderLine(1)}

              <Pressable
                style={[styles.btnOpts, { justifyContent: "space-between" }]}
              >
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faLink}
                />
                <Text style={styles.txt}>Link tham gia nhóm</Text>
                <FontAwesomeIcon
                  size={15}
                  style={{ marginRight: 10 }}
                  icon={faChevronRight}
                />
              </Pressable>

              <Pressable
                style={[
                  styles.btnOpts,
                  { justifyContent: "space-between", marginTop: 10 },
                ]}
              >
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faThumbtack}
                />
                <Text style={styles.txt}>Ghim trò chuyện</Text>
                <Pressable
                  style={[styles.button, isToggled && styles.toggledButton]}
                  onPress={handleToggle}
                >
                  <View
                    style={[
                      styles.circleButton,
                      isToggled ? styles.circleButton1 : styles.circleButton,
                    ]}
                  ></View>
                </Pressable>
              </Pressable>

              {renderLine(1)}

              <Pressable
                style={[styles.btnOpts, { justifyContent: "space-between" }]}
              >
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faEyeSlash}
                />
                <Text style={styles.txt}>Ẩn trò chuyện</Text>
                <Pressable
                  style={[styles.button, isToggled && styles.toggledButton]}
                  onPress={handleToggle}
                >
                  <View
                    style={[
                      styles.circleButton,
                      isToggled ? styles.circleButton1 : styles.circleButton,
                    ]}
                  ></View>
                </Pressable>
              </Pressable>

              {renderLine(1)}

              <Pressable
                style={[styles.btnOpts, { justifyContent: "space-between" }]}
              >
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faUserGear}
                />
                <Text style={styles.txt}>Cài đặt cá nhân</Text>
                <FontAwesomeIcon
                  size={15}
                  style={{ marginRight: 10 }}
                  icon={faChevronRight}
                />
              </Pressable>

              <Pressable
                style={[
                  styles.btnOpts,
                  { justifyContent: "space-between", marginTop: 10 },
                ]}
              >
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faUserGear}
                />
                <Text style={styles.txt}>Báo xấu</Text>
              </Pressable>

              {renderLine(1)}

              {groupChatInfo.administrator === user.id ? (
                <Pressable
                  style={[styles.btnOpts, { justifyContent: "space-between" }]}
                  onPress={() => navigation.navigate("ChangeAdminGroup")}
                >
                  <FontAwesomeIcon
                    style={{ marginLeft: 15 }}
                    color="#787D80"
                    size={20}
                    icon={faUserGear}
                  />
                  <Text style={styles.txt}>Chuyển quyền trưởng nhóm</Text>
                  <FontAwesomeIcon
                    size={15}
                    style={{ marginRight: 10 }}
                    icon={faChevronRight}
                  />
                </Pressable>
              ) : (
                ""
              )}

              {renderLine(1)}

              <Pressable
                style={[styles.btnOpts, { justifyContent: "space-between" }]}
              >
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#787D80"
                  size={20}
                  icon={faUserGear}
                />
                <Text style={styles.txt}>Xóa lịch sử trò chuyện</Text>
              </Pressable>

              {renderLine(1)}

              <Pressable
                style={[styles.btnOpts, { justifyContent: "space-between" }]}
                onPress={() => handleLeaveGroup()}
              >
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  color="#ED1C24"
                  size={20}
                  icon={faArrowRightFromBracket}
                />
                <Text style={[styles.txt, { color: "#ED1C24" }]}>Rời nhóm</Text>
              </Pressable>

              {renderLine(1)}

              {groupChatInfo.administrator === user.id ? (
                <Pressable
                  style={[styles.btnOpts, { justifyContent: "space-between" }]}
                  onPress={() => handleDissolveGroup()}
                >
                  <FontAwesomeIcon
                    style={{ marginLeft: 15 }}
                    color="#ED1C24"
                    size={20}
                    icon={faUserGear}
                  />
                  <Text style={[styles.txt, { color: "#ED1C24" }]}>
                    Giải tán nhóm
                  </Text>
                </Pressable>
              ) : (
                ""
              )}
            </View>
          ) : (
            ""
          )}
        </View>
        <View style={{ height: 150 }}></View>
      </ScrollView>
      <Toast
        style={{ backgroundColor: "green" }}
        ref={toastRef}
        position="center"
      />

      {modalVisible ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => setModalVisible(false)}
          >
            <Pressable
              style={{
                height: 370,
                width: 350,
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
              }}
            >
              <View style={{ alignItems: "center", marginTop: 15 }}>
                {groupChatInfo.groupPhoto === null ? (
                  <View style={{ height: 200, width: 200 }}>
                    <View
                      style={{
                        height: 200,
                        width: 200,
                        borderRadius: 100,
                        backgroundColor: "#ECEDF1",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FontAwesomeIcon
                        color="#A8ADB3"
                        size={50}
                        icon={faUserGroup}
                      />
                    </View>
                  </View>
                ) : (
                  <View style={{ height: 200, width: 200 }}>
                    <Image
                      source={{ uri: groupChatInfo.groupPhoto }}
                      style={{ height: 200, width: 200, borderRadius: 100 }}
                    ></Image>
                  </View>
                )}
              </View>

              <View style={{ marginTop: 5 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 18,
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  Bạn muốn đổi ảnh nhóm?
                </Text>
              </View>

              <Pressable
                style={{
                  flexDirection: "row",
                  height: 50,
                  alignItems: "center",
                  marginTop: 10,
                }}
                onPress={() => openImagePicker("C")}
              >
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  icon={faCamera}
                  color="#707070"
                  size={20}
                />
                <Text style={{ fontSize: 17, marginLeft: 10 }}>Chụp ảnh</Text>
              </Pressable>

              {renderLine(1)}

              <Pressable
                style={{
                  flexDirection: "row",
                  height: 50,
                  alignItems: "center",
                }}
                onPress={() => openImagePicker("L")}
              >
                <FontAwesomeIcon
                  style={{ marginLeft: 15 }}
                  icon={faImages}
                  size={20}
                  color="#707070"
                />
                <Text style={{ fontSize: 17, marginLeft: 10 }}>
                  Chọn ảnh trên máy
                </Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      ) : (
        ""
      )}

      {modalVisibleChangeName ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleChangeName}
          onRequestClose={() => {
            setModalVisibleChangeName(!modalVisibleChangeName);
          }}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setModalVisibleChangeName(false)}
          >
            <Pressable
              style={{
                height: 180,
                width: 280,
                backgroundColor: "#FFFFFF",
                borderRadius: 20,
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>
                  Đặt tên nhóm
                </Text>
              </View>

              <View style={{ width: "90%", flex: 4, justifyContent: "center" }}>
                <TextInput
                  style={{
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: "#E8E8E8",
                    height: 40,
                    paddingLeft: 5,
                    paddingRight: 5,
                  }}
                  value={groupName}
                  placeholder={"Nhập tên nhóm"}
                  onChangeText={(text) => {
                    setGroupName(text);
                  }}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  flex: 2,
                  borderTopColor: "#E8E8E8",
                  borderTopWidth: 1,
                  width: "100%",
                }}
              >
                <Pressable
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRightWidth: 1,
                    borderRightColor: "#E8E8E8",
                  }}
                  onPress={() => setModalVisibleChangeName(false)}
                >
                  <Text style={{ fontSize: 14 }}>Hủy</Text>
                </Pressable>
                <Pressable
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => changeGroupName()}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: "#0E87FF",
                    }}
                  >
                    Lưu
                  </Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      ) : (
        ""
      )}
    </View>
  );
};
