import React, { useEffect, useRef, useState } from "react";
import { styles } from "./style";
import {
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  Keyboard,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowRight,
  faCamera,
  faCheck,
  faSearch,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import axios from "../../config/axios";
import Toast from "react-native-easy-toast";
import { useDispatch, useSelector } from "react-redux";
import { CommonActions } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { CLOUD_NAME, UPLOAD_PRESET } from "@env";
import { socket } from "../../config/io";

export const CreateGroup = ({ navigation }) => {
  const listFriend = useSelector((state) => state.listFriend.listFriend);
  const currentId = useSelector((state) => state.user.user.user.id);
  const user = useSelector((state) => state.user);
  const device = useSelector((state) => state.device);
  const [searchText, setSearchText] = useState("");
  const [groupName, setGroupName] = useState("");
  const toastRef = useRef(null);
  const [isFocus, setIsFocus] = useState(false);
  const [isKeyboardNumber, setIsKeyboardNumber] = useState(false);
  const [listId, setListId] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [linkImageGroup, setLinkImageGroup] = useState(null);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

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

  const openImagePickerAsync = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      console.log("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      selectionLimit: 1,
      aspect: [1, 1],
    });

    if (!pickerResult.canceled) {
      const formData = new FormData();
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("cloud_name", CLOUD_NAME);
      for (const asset of pickerResult.assets) {
        if (asset.type === "image") {
          const fileName = asset.uri.split("/").pop();
          formData.append("file", {
            uri: asset.uri,
            name: fileName,
            type: "image/*",
          });
          // console.log("formData: ", JSON.stringify(formData));
          setIsLoadingImage(true);
          sendToCloud("IMAGES", formData);
        } else if (asset.type === "video") {
          toastRef.current.props.style.backgroundColor = "red";
          toastRef.current.show("Chỉ cho phép ảnh!", 1000);
        }
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

      if (data.secure_url) {
        setLinkImageGroup(data.secure_url);
        setIsLoadingImage(false);
      } else {
        console.log("Error 2: ", data);
        setIsLoadingImage(false);
      }
    } catch (error) {
      console.log("Error 1: ", error);
    }
  };

  const createGroup = async () => {
    if (listId.length >= 2) {
      try {
        const response = await axios.post("/chat/group", {
          name: groupName
            ? groupName
            : `${user.user.user.userName}, ` +
              listId.map((item) => item.name).join(", "),
          type: "GROUP_CHAT",
          participants: listId.map((item) => item.id),
          groupPhoto: linkImageGroup ? linkImageGroup : null,
        });

        if (response.errCode === 0) {
          const data = {
            _id: response.data?._id,
            userName: response.data?.name,
            avatar: response.data?.groupPhoto,
            updatedAt: response.data?.updatedAt,
            userId: response.data?.participants[0]?.id,
            type: "GROUP_CHAT",
            lastedMessage: response.data?.lastedMessage,
            administrator: response.data?.administrator,
          };

          socket.then((socket) => {
            socket.emit("new-chat", response.data);
            socket.emit("leave-group", response.data);
            socket.emit("join-room", response.data?._id);
          });

          toastRef.current.props.style.backgroundColor = "green";
          toastRef.current.show("Tạo nhóm thành công!", 1000);

          setTimeout(() => {
            navigation.navigate("ChatMessage", {
              items: data,
              flag: "CreateGroup",
            });
          }, 1000);
        } else {
          toastRef.current.props.style.backgroundColor = "red";
          toastRef.current.show("Tạo nhóm thất bại!", 1000);
        }
      } catch (error) {
        console.log("Error creating group:", error);
      }
    } else {
      toastRef.current.props.style.backgroundColor = "red";
      toastRef.current.show("Nhóm phải có từ 2 thành viên!", 1000);
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
      <Pressable
        style={styles.btnChooseMember}
        onPress={() => chooseMember(data?.id, data?.avatar, data?.userName)}
      >
        <View
          style={{ width: "90%", flexDirection: "row", alignItems: "center" }}
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
          <Text style={{ fontSize: 16, marginLeft: 15 }}>{data?.userName}</Text>
        </View>
      </Pressable>
    );
  };

  const renderItemChooseMember = ({ item }) => {
    return (
      <Pressable
        key={item.id}
        style={{ justifyContent: "center", marginLeft: 10 }}
        onPress={() => chooseMember(item.id, item.avatar)}
      >
        {item.avatar?.substring(0, 3) === "rgb" ? (
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

  const resetToScreen = (navigation, routeName, data) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: routeName,
            params: data,
          },
        ],
      })
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
            <Text style={{ fontSize: 18, fontWeight: "500" }}>Nhóm mới</Text>
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
          style={{ flexDirection: "row", padding: 16, alignItems: "center" }}
        >
          <Pressable
            style={styles.btnChooseImage}
            onPress={() => openImagePickerAsync()}
          >
            {isLoadingImage ? (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="black" />
              </View>
            ) : linkImageGroup ? (
              <View>
                <Image
                  style={{ height: 60, width: 60, borderRadius: 30 }}
                  source={{ uri: linkImageGroup }}
                ></Image>
                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
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
                  <FontAwesomeIcon size={13} color="#6B849A" icon={faCamera} />
                </View>
              </View>
            ) : (
              <FontAwesomeIcon
                style={{}}
                color="#898A8C"
                size={30}
                icon={faCamera}
              />
            )}
          </Pressable>
          <TextInput
            style={[
              styles.textInputNameGroup,
              isFocus
                ? { borderBottomWidth: 1, borderBottomColor: "#5DBCD2" }
                : {},
            ]}
            placeholderTextColor={"#828387"}
            placeholder="Đặt tên nhóm"
            onChangeText={(text) => setGroupName(text)}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
          ></TextInput>
          {isFocus ? (
            <Pressable
              style={{
                height: 30,
                width: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => Keyboard.dismiss()}
            >
              <FontAwesomeIcon color="#029AFD" size={22} icon={faCheck} />
            </Pressable>
          ) : (
            ""
          )}
        </View>

        <View
          style={{
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 15,
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

        <FlatList
          data={listFriend}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
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
                  disabled={isLoadingImage}
                  style={[
                    styles.btnCreateGroup,
                    isLoadingImage ? { backgroundColor: "#C1D4E3" } : {},
                  ]}
                  onPress={() => {
                    createGroup();
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
