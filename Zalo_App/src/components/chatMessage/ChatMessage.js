import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { styles } from "./style";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faPhone,
  faVideo,
  faList,
  faEllipsis,
  faLaughWink,
  faChevronLeft,
  faPaperPlane,
  faTrashCan,
  faRotateRight,
  faCheckDouble,
  faCheck,
  faMicrophoneLines,
  faReply,
  faShare,
  faCircleInfo,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-regular-svg-icons";
import { socket } from "../../config/io";
import { useDispatch, useSelector } from "react-redux";
import axios, { setAuthorizationAxios } from "../../config/axios";
import moment from "moment";
import { CommonActions } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { CLOUD_NAME, UPLOAD_PRESET } from "@env";
import { LinearGradient } from "expo-linear-gradient";
import { Video, Audio } from "expo-av";
import { setGroupChatInfo } from "../../redux/groupChatInfoSlice";
import Toast from "react-native-easy-toast";

export const ChatMessage = ({ navigation, route }) => {
  const groupChatInfo = useSelector(
    (state) => state.groupChatInfo.groupChatInfo
  );
  const dispatch = useDispatch();
  const [isText, setIsText] = useState(false);
  const [textMessage, setTextMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { items, flag } = route.params;
  const user = useSelector((state) => state.user);
  const currentId = useSelector((state) => state.user.user?.user?.id);
  const device = useSelector((state) => state.device);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const flatListRef = useRef();
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isUserChoose, setIsUserChoose] = useState(false);
  const [messageIsChoose, setMessageIsChoose] = useState();
  const [loadAgainRecall, setLoadAgainRecall] = useState(false);
  const [loadAgainFocus, setLoadAgainFocus] = useState();
  const [loadAgainChangeAdmin, setLoadAgainChangeAdmin] = useState(false);
  const [loadAgain, setLoadAgain] = useState(false);
  const [isSend, setIsSend] = useState(false);
  const [isMessage, setIsMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingGroupChat, setIsLoadingGroupChat] = useState(true);
  const [textInputHeight, setTextInputHeight] = useState(30);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const videoRefs = useRef([]);
  const [isControl, setIsControl] = useState(false);
  const delayTime = 200;
  const [isMessageRecall, setIsMessageRecall] = useState(false);
  const adminId = groupChatInfo?.administrator;
  const toastRef = useRef();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setLoadAgainFocus(new Date());
    });

    return unsubscribe;
  }, [navigation]);

  //get permissions
  useEffect(() => {
    const getPermission = async () => {
      await Audio.setAudioModeAsync({
        // allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    };

    getPermission();
  }, []);

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

  useEffect(() => {
    if (textMessage !== "") {
      setIsText(true);
    } else {
      setIsText(false);
    }
  }, [textMessage]);

  useEffect(() => {
    setAuthorizationAxios(user.user?.access_token);
  }, [user]);

  // cập nhật cuộn flatlist
  useEffect(() => {
    // if ( messages.length) {
    //     setTimeout(() => scrollToBottomWithOffset(80), 100);
    // }
    // if (isKeyboardOpen === true) {
    //     flatListRef.current.scrollToEnd({animated: true});
    // }
  }, [messages, isLoadingMessages, isKeyboardOpen]);

  // useEffect(() => {
  //     setTimeout(()=> {
  //         if (flatListRef.current) {
  //             flatListRef.current.scrollToEnd({animated: true});
  //         }
  //     }, 500);
  // }, []);

  // Lấy thông tin group chat
  useEffect(() => {
    const getGroupChat = async () => {
      try {
        const response = await axios.get(`/chat/access?chatId=${items._id}`);
        if (response.errCode === 0) {
          dispatch(setGroupChatInfo(response.data));
          setIsLoadingGroupChat(false);
          setLoadAgain(false);
        } else {
          console.log("Error: ", response);
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    if (items.type === "GROUP_CHAT") {
      getGroupChat();
      setLoadAgainChangeAdmin(false);
    }
  }, [items, loadAgainFocus, loadAgainChangeAdmin, loadAgain]);

  // Lấy tin nhắn từ server
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `/chat/message/pagination?chatId=${items._id}&limit=50`
        );
        if (response.errCode === 0) {
          const filteredMessages = response.data.map((item) => ({
            _id: `${item._id}`,
            chat: `${item.chat._id}`,
            sender: item.sender,
            content: item.content,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            isDelete: item.isDelete,
            unViewList: item.unViewList,
            urls: [item.urls],
            type: item.type,
          }));
          setMessages(filteredMessages);
          setIsLoadingMessages(false);
          // setLoadAgain1(false);
          setIsMessage(true);
          setIsLoading(false);
          setLoadAgainRecall(false);
        } else if (response.errCode === 1) {
          setIsMessage(false);
          setIsLoading(false);
        }
      } catch (error) {
        console.log("Error x: ", error);
        resetToScreen(navigation, "Login");
      }
    };

    // if (loadAgain1) {
    //     fetchMessages();
    // }
    fetchMessages();
  }, [items._id, loadAgainRecall]);

  //socket ReceiveMessage
  const handleReceiveMessage = async (data) => {
    if (data.type === "TEXT") {
      // console.log("Receive messgae: ", data.content, "|", data.chat);
      setIsMessage(true);
      setMessages((premessages) => [...premessages, data]);
    } else if (data.type === "IMAGES") {
      // console.log("Receive messgae: ", data.urls, "|", data.chat);
      setIsMessage(true);
      setMessages((premessages) => [...premessages, data]);
    } else if (data.type === "VIDEO") {
      // console.log("Receive messgae: ", data.urls, "|", data.chat);
      setIsMessage(true);
      setMessages((premessages) => [...premessages, data]);
    }
  };

  //socket RecallMessage
  const handleRecallMessage = async (data) => {
    if (data) {
      setLoadAgainRecall(true);
    }
  };

  //socket RecallMessage
  const transferDisbandGroup = async (data) => {
    if (data) {
      setLoadAgainChangeAdmin(true);
    }
  };

  //socket leaveGroup
  const leaveGroup = async (data) => {
    if (data) {
      setLoadAgain(true);
    }
  };

  //socket deleteMember
  const deleteMember = async (data) => {
    if (data) {
      setLoadAgain(true);
      // toastRef.current.props.style.backgroundColor = 'red';
      toastRef.current.show("Bạn đã bị xóa khỏi nhóm", 1500);
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    }
  };

  const dissolutionGroupChat = async (data) => {
    if (data) {
      setLoadAgain(true);
      toastRef.current.show(
        <Text style={{ textAlign: "center", color: "#FFFFFF" }}>
          Nhóm {data.data?.name} đã được giải tán.
        </Text>,
        2000
      );
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    }
  };

  const handleGrantSocket = () => {
    console.log("Grant");
    setLoadAgain(true);
  };

  // socket
  useEffect(() => {
    socket.then((socket) => {
      socket.on("grant", handleGrantSocket);
      socket.on("receive-message", handleReceiveMessage);
      socket.on("receive-modify-message", handleRecallMessage);
      socket.on("transfer-disband-group", transferDisbandGroup);
      socket.on("leave-group", leaveGroup);
      socket.on("delete-member", deleteMember);
      socket.on("dissolutionGroupChat", dissolutionGroupChat);
    });

    return () => {
      socket.then((socket) => {
        socket.off("receive-message", handleReceiveMessage);
        socket.off("receive-modify-message", handleRecallMessage);
        socket.off("transfer-disband-group", transferDisbandGroup);
        socket.off("leave-group", leaveGroup);
        socket.off("delete-member", deleteMember);
        socket.off("dissolutionGroupChat", dissolutionGroupChat);
        socket.off("grant", handleGrantSocket);
      });
    };
  }, []);

  // phát video
  const handleVideoPress = (index) => {
    if (videoRefs.current[index]) {
      videoRefs.current[index].playAsync();
    }
  };

  const handleContentSizeChange = (event) => {
    const { height } = event.nativeEvent.contentSize;
    if (height < 75 && height > 30) {
      setTextInputHeight(height);
    } else if (height <= 30) {
      setTextInputHeight(30);
    }
  };

  //cuộn xuống phần tử cuối cùng trong FlatList
  // const scrollToBottomWithOffset = (offset) => {
  //     if (flatListRef.current) {
  //         const itemCount = messages.length;
  //         const itemHeight = 50;
  //         const listHeight = itemCount * itemHeight;
  //         const bottomOffset = listHeight + offset;
  //         flatListRef.current.scrollToOffset({ offset: bottomOffset, animated: true });
  //     }
  // };

  const openImagePickerAsync = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      console.log("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 1,
      videoExportPreset: ImagePicker.VideoExportPreset.Passthrough,
      videoMaxDuration: 10,
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
          sendToCloud("IMAGES", formData);
        } else if (asset.type === "video") {
          const fileName = asset.uri.split("/").pop();
          formData.append("file", {
            uri: asset.uri,
            name: fileName,
            type: "video/mp4",
          });
          // console.log("formData: ", JSON.stringify(formData));
          sendToCloud("VIDEO", formData);
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
        const ObjectId = objectId();
        const dataSend = {
          _id: ObjectId,
          chat: items._id,
          type: type,
          sender: user.user?.user,
          createdAt: new Date(),
          updatedAt: new Date(),
          unViewList: [],
          isDelete: false,
          urls: [data.secure_url],
          reactions: [],
        };

        // console.log("Data send: ", dataSend);
        setMessages((premessages) => [...premessages, dataSend]);

        const res = await axios.post("/chat/message", {
          ...dataSend,
          sender: user.user?.user.id,
        });

        if (res.errCode === 0) {
          socket.then((socket) => {
            socket.emit("send-message", dataSend);
            socket.emit("issend-message", dataSend);
          });

          setIsMessage(true);
          setTextMessage("");
          // console.log("Send message:", dataSend.urls, "|", dataSend.chat);
        } else {
          console.log("Error 3: ", res);
        }
      } else {
        console.log("Error 2: ", data);
      }
      // console.log('Upload success 2:', data);
    } catch (error) {
      console.log("Error 1: ", error);
    }
  };

  // Gửi message tới máy chủ khi nhấn button
  const sendMessage = async () => {
    const ObjectId = objectId();
    const dataSend = {
      _id: ObjectId,
      chat: items._id,
      type: "TEXT",
      sender: user.user?.user,
      content: `${textMessage}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      unViewList: [],
      isDelete: false,
      reactions: [],
    };

    try {
      // console.log("Data send: ", dataSend);
      setMessages((premessages) => [...premessages, dataSend]);
      const res = await axios.post("/chat/message", {
        ...dataSend,
        sender: user.user?.user.id,
      });

      if (res.errCode === 0) {
        socket.then((socket) => {
          socket.emit("send-message", dataSend);
          socket.emit("issend-message", dataSend);
        });
        setIsMessage(true);
        setTextMessage("");
        // console.log("Send message:", dataSend.content, "|", dataSend.chat);
      } else {
        console.log("Error: ", res);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const deleteMessageForMe = async () => {
    try {
      const res = await axios.put("/chat/message/recall", {
        messageId: messageIsChoose._id,
      });

      if (res.errCode === 0) {
        setLoadAgainRecall(true);
        setModalVisible1(false);
      } else {
        console.log("Error: ", res);
      }
    } catch (error) {}
  };

  const deleteMessage = async () => {
    try {
      const res = await axios.put("/chat/message/deleteMessage", {
        messageId: messageIsChoose._id,
      });

      if (res.errCode === 0) {
        setLoadAgainRecall(true);
        setModalVisible(false);
        socket.then((socket) => {
          socket.emit("modify-message", res.data);
        });
      } else {
        console.log("Error: ", res);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  // render tin nhắn qua FlatList
  const renderItem = ({ item }) => {
    const firstIduserPositions = {};
    let lastSenderId = null;

    messages.forEach((item, index) => {
      if (item.sender.id !== lastSenderId) {
        if (!firstIduserPositions[item.sender.id]) {
          firstIduserPositions[item.sender.id] = [item._id];
        } else {
          firstIduserPositions[item.sender.id].push(item._id);
        }
      }
      lastSenderId = item.sender.id;
    });

    const firstPositionsInCluster = Object.values(firstIduserPositions);
    const flattenedData = firstPositionsInCluster.concat.apply(
      [],
      firstPositionsInCluster
    );
    const firstItemBySender = flattenedData.includes(item._id);

    // Kiểm tra tin nhắn cuối cùng của mỗi user
    const lastItemBySender = {};
    messages.forEach((msg) => {
      lastItemBySender[msg.sender.id] = msg;
    });
    const isLastItem = item === lastItemBySender[item.sender.id];

    // kiểm tra xem tin nhắn có phải là tin nhắn riêng tư không
    if (items.type === "PRIVATE_CHAT") {
      //so sánh phòng chat
      if (item.chat === items._id) {
        //kiểm tra xem tin nhắn đã thu hồi chưa
        if (!item.isDelete) {
          // kiểm tra xem người dùng có xóa tin nhắn không
          if (!item.unViewList.includes(currentId)) {
            if (item.type === "TEXT") {
              if (item.sender?.id === currentId) {
                return (
                  <View style={styles.viewEnd}>
                    <Pressable
                      delayLongPress={delayTime}
                      onLongPress={() => {
                        setModalVisible(true);
                        setIsUserChoose(true);
                        setMessageIsChoose(item), setIsMessageRecall(false);
                      }}
                      style={styles.messsagePressEnd}
                    >
                      <Text style={[styles.textMessagePress]}>
                        {item.content}
                      </Text>
                      {isLastItem && (
                        <Text style={styles.dateTime}>
                          {moment
                            .utc(item.updatedAt)
                            .utcOffset("+07:00")
                            .format("HH:mm")}
                        </Text>
                      )}
                    </Pressable>
                  </View>
                );
              } else {
                return (
                  <View
                    style={[
                      styles.viewStart,
                      firstItemBySender ? { flexDirection: "row" } : {},
                    ]}
                  >
                    {firstItemBySender ? (
                      item.sender.avatar.substring(0, 3) === "rgb" ? (
                        <View
                          style={{
                            height: 20,
                            width: 20,
                            backgroundColor: item.sender.avatar,
                            borderRadius: 20,
                            marginLeft: 5,
                          }}
                        />
                      ) : (
                        <Image
                          source={{ uri: item.sender.avatar }}
                          style={{
                            height: 20,
                            width: 20,
                            borderRadius: 20,
                            marginLeft: 5,
                          }}
                        />
                      )
                    ) : (
                      ""
                    )}
                    <Pressable
                      delayLongPress={delayTime}
                      onLongPress={() => {
                        setModalVisible(true);
                        setIsUserChoose(false);
                        setMessageIsChoose(item);
                      }}
                      style={[
                        styles.messsagePressStart,
                        firstItemBySender ? { marginLeft: 5 } : {},
                      ]}
                    >
                      <Text style={[styles.textMessagePress]}>
                        {item.content}
                      </Text>
                      {isLastItem && (
                        <Text style={styles.dateTime}>
                          {moment
                            .utc(item.updatedAt)
                            .utcOffset("+07:00")
                            .format("HH:mm")}
                        </Text>
                      )}
                    </Pressable>
                  </View>
                );
              }
            } else if (item.type === "IMAGES") {
              if (item.sender?.id === currentId) {
                return (
                  <View style={styles.viewEnd}>
                    <Pressable
                      delayLongPress={delayTime}
                      onLongPress={() => {
                        setModalVisible(true);
                        setIsUserChoose(true);
                        setMessageIsChoose(item), setIsMessageRecall(false);
                      }}
                      style={styles.messsagePressEnd}
                    >
                      <Image
                        source={{ uri: `${item.urls}` }}
                        style={{ width: 200, height: 300, borderRadius: 10 }}
                        resizeMode="contain"
                      />
                    </Pressable>
                    {isLastItem && (
                      <View
                        style={{
                          marginRight: 10,
                          height: 20,
                          width: 50,
                          backgroundColor: "#B0B0B0",
                          alignItems: "center",
                          borderRadius: 25,
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: 12, color: "#ffffff" }}>
                          {moment
                            .utc(item.updatedAt)
                            .utcOffset("+07:00")
                            .format("HH:mm")}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              } else {
                return (
                  <View style={[styles.viewStart]}>
                    <View
                      style={firstItemBySender ? { flexDirection: "row" } : {}}
                    >
                      {firstItemBySender ? (
                        item.sender?.avatar?.substring(0, 3) === "rgb" ? (
                          <View
                            style={{
                              height: 20,
                              width: 20,
                              backgroundColor: item.sender.avatar,
                              borderRadius: 20,
                              marginLeft: 5,
                            }}
                          />
                        ) : (
                          <Image
                            source={{ uri: item.sender.avatar }}
                            style={{
                              height: 20,
                              width: 20,
                              borderRadius: 20,
                              marginLeft: 5,
                            }}
                          />
                        )
                      ) : (
                        ""
                      )}
                      <Pressable
                        delayLongPress={delayTime}
                        onLongPress={() => {
                          setModalVisible(true);
                          setIsUserChoose(false);
                          setMessageIsChoose(item);
                        }}
                        style={[
                          styles.messsagePressStart,
                          firstItemBySender ? { marginLeft: 5 } : {},
                        ]}
                      >
                        <Image
                          source={{ uri: `${item.urls}` }}
                          style={{ width: 200, height: 300, borderRadius: 10 }}
                          resizeMode="contain"
                        />
                      </Pressable>
                    </View>
                    {isLastItem && (
                      <View
                        style={{
                          marginLeft: 30,
                          height: 20,
                          width: 50,
                          backgroundColor: "#B0B0B0",
                          alignItems: "center",
                          borderRadius: 25,
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: 12, color: "#ffffff" }}>
                          {moment
                            .utc(item.updatedAt)
                            .utcOffset("+07:00")
                            .format("HH:mm")}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              }
            } else if (item.type === "VIDEO") {
              if (item.sender?.id === currentId) {
                return (
                  <View style={styles.viewEnd}>
                    <Pressable
                      style={styles.messsagePressEnd}
                      delayLongPress={delayTime}
                      onLongPress={() => {
                        setModalVisible(true);
                        setIsUserChoose(true);
                        setMessageIsChoose(item);
                      }}
                      onPress={() => {
                        if (!isControl) {
                          handleVideoPress(item._id);
                          setIsControl(true);
                        }
                      }}
                    >
                      <Video
                        ref={(videoRef) =>
                          (videoRefs.current[item._id] = videoRef)
                        }
                        style={{ height: 300, width: 200, borderRadius: 10 }}
                        source={{ uri: `${item.urls}` }}
                        useNativeControls={true}
                        resizeMode="contain"
                        isLooping
                      />
                    </Pressable>
                    {isLastItem && (
                      <View
                        style={{
                          marginRight: 15,
                          height: 20,
                          width: 50,
                          backgroundColor: "#B0B0B0",
                          alignItems: "center",
                          borderRadius: 25,
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: 12, color: "#ffffff" }}>
                          {moment
                            .utc(item.updatedAt)
                            .utcOffset("+07:00")
                            .format("HH:mm")}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              } else {
                return (
                  <View style={[styles.viewStart]}>
                    <View
                      style={firstItemBySender ? { flexDirection: "row" } : {}}
                    >
                      {firstItemBySender ? (
                        item.sender?.avatar?.substring(0, 3) === "rgb" ? (
                          <View
                            style={{
                              height: 20,
                              width: 20,
                              backgroundColor: item.sender.avatar,
                              borderRadius: 20,
                              marginLeft: 5,
                            }}
                          />
                        ) : (
                          <Image
                            source={{ uri: item.sender.avatar }}
                            style={{
                              height: 20,
                              width: 20,
                              borderRadius: 20,
                              marginLeft: 5,
                            }}
                          />
                        )
                      ) : (
                        ""
                      )}
                      <Pressable
                        style={[
                          styles.messsagePressStart,
                          firstItemBySender ? { marginLeft: 5 } : {},
                        ]}
                        delayLongPress={delayTime}
                        onLongPress={() => {
                          setModalVisible(true);
                          setIsUserChoose(false);
                          setMessageIsChoose(item), setIsMessageRecall(false);
                        }}
                        onPress={() => {
                          if (!isControl) {
                            handleVideoPress(item._id);
                            setIsControl(true);
                          }
                        }}
                      >
                        <Video
                          ref={(videoRef) =>
                            (videoRefs.current[item._id] = videoRef)
                          }
                          style={{ height: 300, width: 200, borderRadius: 10 }}
                          source={{ uri: `${item.urls}` }}
                          useNativeControls={true}
                          resizeMode="contain"
                          isLooping
                        />
                      </Pressable>
                    </View>

                    {isLastItem && (
                      <View
                        style={{
                          marginLeft: 30,
                          height: 20,
                          width: 50,
                          backgroundColor: "#B0B0B0",
                          alignItems: "center",
                          borderRadius: 25,
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: 12, color: "#ffffff" }}>
                          {moment
                            .utc(item.updatedAt)
                            .utcOffset("+07:00")
                            .format("HH:mm")}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              }
            }
          }
        } else {
          // chỗ này la tin nhắn đã thu hồi
          if (!item.unViewList.includes(currentId)) {
            //so sánh người gửi
            if (item.sender?.id === currentId) {
              return (
                <View style={styles.viewEnd}>
                  {firstItemBySender && <Text style={styles.name}></Text>}
                  <Pressable
                    delayLongPress={delayTime}
                    onLongPress={() => {
                      setModalVisible(true);
                      setIsUserChoose(true);
                      setMessageIsChoose(item), setIsMessageRecall(true);
                    }}
                    style={styles.messsagePressEnd}
                  >
                    <Text style={[styles.textMessagePress, { opacity: 0.7 }]}>
                      Tin nhắn đã được thu hồi
                    </Text>
                    {isLastItem && (
                      <Text style={styles.dateTime}>
                        {moment
                          .utc(item.updatedAt)
                          .utcOffset("+07:00")
                          .format("HH:mm")}
                      </Text>
                    )}
                  </Pressable>
                </View>
              );
            } else {
              return (
                <View
                  style={[
                    styles.viewStart,
                    firstItemBySender ? { flexDirection: "row" } : {},
                  ]}
                >
                  {firstItemBySender ? (
                    item.sender?.avatar?.substring(0, 3) === "rgb" ? (
                      <View
                        style={{
                          height: 20,
                          width: 20,
                          backgroundColor: item.sender.avatar,
                          borderRadius: 20,
                          marginLeft: 5,
                        }}
                      />
                    ) : (
                      <Image
                        source={{ uri: item.sender.avatar }}
                        style={{
                          height: 20,
                          width: 20,
                          borderRadius: 20,
                          marginLeft: 5,
                        }}
                      />
                    )
                  ) : (
                    ""
                  )}
                  <Pressable
                    delayLongPress={delayTime}
                    onLongPress={() => {
                      setModalVisible(true);
                      setIsUserChoose(false);
                      setMessageIsChoose(item);
                    }}
                    style={[
                      styles.messsagePressStart,
                      firstItemBySender ? { marginLeft: 5 } : {},
                    ]}
                  >
                    <Text style={[styles.textMessagePress, { opacity: 0.7 }]}>
                      Tin nhắn đã được thu hồi
                    </Text>
                    {isLastItem && (
                      <Text style={styles.dateTime}>
                        {moment
                          .utc(item.updatedAt)
                          .utcOffset("+07:00")
                          .format("HH:mm")}
                      </Text>
                    )}
                  </Pressable>
                </View>
              );
            }
          }
        }
      }
    } else {
      // khúc này là public chat
      if (item.chat === items._id) {
        //kiểm tra xem tin nhắn đã thu hồi chưa
        if (!item.isDelete) {
          // kiểm tra xem người dùng có xóa tin nhắn không
          if (!item.unViewList.includes(currentId)) {
            //so sánh người gửi
            if (item.type === "TEXT") {
              if (item.sender?.id === currentId) {
                return (
                  <View style={styles.viewEnd}>
                    <Pressable
                      delayLongPress={delayTime}
                      onLongPress={() => {
                        setModalVisible(true);
                        setIsUserChoose(true);
                        setMessageIsChoose(item), setIsMessageRecall(false);
                      }}
                      style={[
                        styles.messsagePressEnd,
                        adminId === item.sender?.id
                          ? { borderWidth: 1, borderColor: "#3483C6" }
                          : "",
                      ]}
                    >
                      <Text style={[styles.textMessagePress]}>
                        {item.content}
                      </Text>
                      {isLastItem && (
                        <Text style={styles.dateTime}>
                          {moment
                            .utc(item.updatedAt)
                            .utcOffset("+07:00")
                            .format("HH:mm")}
                        </Text>
                      )}
                    </Pressable>
                  </View>
                );
              } else {
                return (
                  <View
                    style={[
                      styles.viewStart,
                      firstItemBySender ? { flexDirection: "row" } : {},
                    ]}
                  >
                    {firstItemBySender ? (
                      item.sender?.avatar?.substring(0, 3) === "rgb" ? (
                        <View>
                          <View
                            style={{
                              height: 20,
                              width: 20,
                              backgroundColor: item.sender.avatar,
                              borderRadius: 20,
                              marginLeft: 5,
                            }}
                          />
                          {adminId === item.sender.id ? (
                            <View
                              style={{
                                height: 10,
                                width: 10,
                                backgroundColor: "#7C8596",
                                borderRadius: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                              }}
                            >
                              <FontAwesomeIcon
                                style={{}}
                                size={7}
                                color="yellow"
                                icon={faKey}
                              />
                            </View>
                          ) : (
                            ""
                          )}
                        </View>
                      ) : (
                        <View>
                          <Image
                            source={{ uri: item.sender.avatar }}
                            style={{
                              height: 20,
                              width: 20,
                              borderRadius: 20,
                              marginLeft: 5,
                            }}
                          />
                          {adminId === item.sender.id ? (
                            <View
                              style={{
                                height: 10,
                                width: 10,
                                backgroundColor: "#7C8596",
                                borderRadius: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                              }}
                            >
                              <FontAwesomeIcon
                                style={{}}
                                size={7}
                                color="yellow"
                                icon={faKey}
                              />
                            </View>
                          ) : (
                            ""
                          )}
                        </View>
                      )
                    ) : (
                      ""
                    )}
                    <Pressable
                      delayLongPress={delayTime}
                      onLongPress={() => {
                        setModalVisible(true);
                        setIsUserChoose(false);
                        setMessageIsChoose(item);
                      }}
                      style={[
                        styles.messsagePressStart,
                        firstItemBySender ? { marginLeft: 5 } : {},
                        adminId === item.sender.id
                          ? { borderWidth: 1, borderColor: "#3483C6" }
                          : "",
                      ]}
                    >
                      {firstItemBySender && (
                        <Text style={styles.name}>{item.sender.userName}</Text>
                      )}
                      <Text
                        style={[
                          styles.textMessagePress,
                          firstItemBySender ? { paddingTop: 5 } : {},
                        ]}
                      >
                        {item.content}
                      </Text>
                      {isLastItem && (
                        <Text style={styles.dateTime}>
                          {moment
                            .utc(item.updatedAt)
                            .utcOffset("+07:00")
                            .format("HH:mm")}
                        </Text>
                      )}
                    </Pressable>
                  </View>
                );
              }
            } else if (item.type === "IMAGES") {
              if (item.sender?.id === currentId) {
                return (
                  <View style={[styles.viewEnd, {}]}>
                    <Pressable
                      delayLongPress={delayTime}
                      onLongPress={() => {
                        setModalVisible(true);
                        setIsUserChoose(true);
                        setMessageIsChoose(item), setIsMessageRecall(false);
                      }}
                      style={[
                        styles.messsagePressEnd,
                        adminId === item.sender.id
                          ? { borderWidth: 1, borderColor: "#3483C6" }
                          : "",
                      ]}
                    >
                      <Image
                        source={{ uri: `${item.urls}` }}
                        style={{ width: 200, height: 300, borderRadius: 10 }}
                        resizeMode="contain"
                      />
                    </Pressable>
                    {isLastItem && (
                      <View
                        style={{
                          marginRight: 10,
                          height: 20,
                          width: 50,
                          backgroundColor: "#B0B0B0",
                          alignItems: "center",
                          borderRadius: 25,
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: 12, color: "#ffffff" }}>
                          {moment
                            .utc(item.updatedAt)
                            .utcOffset("+07:00")
                            .format("HH:mm")}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              } else {
                return (
                  <View
                    style={[
                      styles.viewStart,
                      firstItemBySender ? { flexDirection: "" } : {},
                    ]}
                  >
                    {firstItemBySender ? (
                      item.sender?.avatar?.substring(0, 3) === "rgb" ? (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 5,
                          }}
                        >
                          <View>
                            <View
                              style={{
                                height: 20,
                                width: 20,
                                backgroundColor: item.sender.avatar,
                                borderRadius: 20,
                                marginLeft: 5,
                              }}
                            />
                            {adminId === item.sender.id ? (
                              <View
                                style={{
                                  height: 10,
                                  width: 10,
                                  backgroundColor: "#7C8596",
                                  borderRadius: 10,
                                  justifyContent: "center",
                                  alignItems: "center",
                                  position: "absolute",
                                  bottom: 0,
                                  right: 0,
                                }}
                              >
                                <FontAwesomeIcon
                                  style={{}}
                                  size={7}
                                  color="yellow"
                                  icon={faKey}
                                />
                              </View>
                            ) : (
                              ""
                            )}
                          </View>

                          <View
                            style={{
                              backgroundColor: "#FFFFFF",
                              marginLeft: 5,
                              padding: 2,
                              borderRadius: 25,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                opacity: 0.8,
                                paddingLeft: 4,
                                paddingRight: 4,
                              }}
                            >
                              {item.sender.userName}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 5,
                          }}
                        >
                          <View>
                            <Image
                              source={{ uri: item.sender.avatar }}
                              style={{
                                height: 20,
                                width: 20,
                                borderRadius: 20,
                                marginLeft: 5,
                              }}
                            />
                            {adminId === item.sender.id ? (
                              <View
                                style={{
                                  height: 10,
                                  width: 10,
                                  backgroundColor: "#7C8596",
                                  borderRadius: 10,
                                  justifyContent: "center",
                                  alignItems: "center",
                                  position: "absolute",
                                  bottom: 0,
                                  right: 0,
                                }}
                              >
                                <FontAwesomeIcon
                                  style={{}}
                                  size={7}
                                  color="yellow"
                                  icon={faKey}
                                />
                              </View>
                            ) : (
                              ""
                            )}
                          </View>

                          <View
                            style={{
                              backgroundColor: "#FFFFFF",
                              marginLeft: 5,
                              padding: 2,
                              borderRadius: 25,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                opacity: 0.8,
                                paddingLeft: 4,
                                paddingRight: 4,
                              }}
                            >
                              {item.sender.userName}
                            </Text>
                          </View>
                        </View>
                      )
                    ) : (
                      ""
                    )}
                    <Pressable
                      delayLongPress={delayTime}
                      onLongPress={() => {
                        setModalVisible(true);
                        setIsUserChoose(false);
                        setMessageIsChoose(item);
                      }}
                      style={[
                        styles.messsagePressStart,
                        adminId === item.sender.id
                          ? { borderWidth: 1, borderColor: "#3483C6" }
                          : "",
                      ]}
                    >
                      <Image
                        source={{ uri: `${item.urls}` }}
                        style={{ width: 200, height: 300, borderRadius: 10 }}
                        resizeMode="contain"
                      />
                    </Pressable>
                    {isLastItem && (
                      <View
                        style={{
                          marginLeft: 30,
                          height: 20,
                          width: 50,
                          backgroundColor: "#B0B0B0",
                          alignItems: "center",
                          borderRadius: 25,
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: 12, color: "#ffffff" }}>
                          {moment
                            .utc(item.updatedAt)
                            .utcOffset("+07:00")
                            .format("HH:mm")}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              }
            } else if (item.type === "VIDEO") {
              if (item.sender?.id === currentId) {
                return (
                  <View style={styles.viewEnd}>
                    <View style={styles.viewEnd}>
                      <Pressable
                        style={[
                          styles.messsagePressEnd,
                          adminId === item.sender.id
                            ? { borderWidth: 1, borderColor: "#3483C6" }
                            : "",
                        ]}
                        delayLongPress={delayTime}
                        onLongPress={() => {
                          setModalVisible(true);
                          setIsUserChoose(true);
                          setMessageIsChoose(item), setIsMessageRecall(false);
                        }}
                        onPress={() => {
                          if (!isControl) {
                            handleVideoPress(item._id);
                            setIsControl(true);
                          }
                        }}
                      >
                        <Video
                          ref={(videoRef) =>
                            (videoRefs.current[item._id] = videoRef)
                          }
                          style={{
                            height: 300,
                            width: 200,
                            borderRadius: 10,
                            zIndex: 5,
                          }}
                          source={{ uri: `${item.urls}` }}
                          useNativeControls={true}
                          resizeMode="contain"
                          isLooping
                        />
                      </Pressable>
                      {isLastItem && (
                        <View
                          style={{
                            marginRight: 15,
                            height: 20,
                            width: 50,
                            backgroundColor: "#B0B0B0",
                            alignItems: "center",
                            borderRadius: 25,
                            justifyContent: "center",
                          }}
                        >
                          <Text style={{ fontSize: 12, color: "#ffffff" }}>
                            {moment
                              .utc(item.updatedAt)
                              .utcOffset("+07:00")
                              .format("HH:mm")}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              } else {
                return (
                  <View style={[styles.viewStart]}>
                    {firstItemBySender ? (
                      item.sender?.avatar?.substring(0, 3) === "rgb" ? (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 5,
                          }}
                        >
                          <View>
                            <View
                              style={{
                                height: 20,
                                width: 20,
                                backgroundColor: item.sender.avatar,
                                borderRadius: 20,
                                marginLeft: 5,
                              }}
                            />
                            {adminId === item.sender.id ? (
                              <View
                                style={{
                                  height: 10,
                                  width: 10,
                                  backgroundColor: "#7C8596",
                                  borderRadius: 10,
                                  justifyContent: "center",
                                  alignItems: "center",
                                  position: "absolute",
                                  bottom: 0,
                                  right: 0,
                                }}
                              >
                                <FontAwesomeIcon
                                  style={{}}
                                  size={7}
                                  color="yellow"
                                  icon={faKey}
                                />
                              </View>
                            ) : (
                              ""
                            )}
                          </View>
                          <View
                            style={{
                              backgroundColor: "#FFFFFF",
                              marginLeft: 5,
                              padding: 2,
                              borderRadius: 25,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                opacity: 0.8,
                                paddingLeft: 4,
                                paddingRight: 4,
                              }}
                            >
                              {item.sender.userName}
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 5,
                          }}
                        >
                          <View>
                            <Image
                              source={{ uri: item.sender.avatar }}
                              style={{
                                height: 20,
                                width: 20,
                                borderRadius: 20,
                                marginLeft: 5,
                              }}
                            />
                            {adminId === item.sender.id ? (
                              <View
                                style={{
                                  height: 10,
                                  width: 10,
                                  backgroundColor: "#7C8596",
                                  borderRadius: 10,
                                  justifyContent: "center",
                                  alignItems: "center",
                                  position: "absolute",
                                  bottom: 0,
                                  right: 0,
                                }}
                              >
                                <FontAwesomeIcon
                                  style={{}}
                                  size={7}
                                  color="yellow"
                                  icon={faKey}
                                />
                              </View>
                            ) : (
                              ""
                            )}
                          </View>
                          <View
                            style={{
                              backgroundColor: "#FFFFFF",
                              marginLeft: 5,
                              padding: 2,
                              borderRadius: 25,
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 12,
                                opacity: 0.8,
                                paddingLeft: 4,
                                paddingRight: 4,
                              }}
                            >
                              {item.sender.userName}
                            </Text>
                          </View>
                        </View>
                      )
                    ) : (
                      ""
                    )}
                    <Pressable
                      style={[
                        styles.messsagePressStart,
                        firstItemBySender ? { marginLeft: 5 } : {},
                        { marginLeft: 30 },
                        adminId === item.sender.id
                          ? { borderWidth: 1, borderColor: "#3483C6" }
                          : "",
                      ]}
                      delayLongPress={delayTime}
                      onLongPress={() => {
                        setModalVisible(true);
                        setIsUserChoose(false);
                        setMessageIsChoose(item);
                      }}
                      onPress={() => {
                        if (!isControl) {
                          handleVideoPress(item._id);
                          setIsControl(true);
                        }
                      }}
                    >
                      <Video
                        ref={(videoRef) =>
                          (videoRefs.current[item._id] = videoRef)
                        }
                        style={{ height: 300, width: 200, borderRadius: 10 }}
                        source={{ uri: `${item.urls}` }}
                        useNativeControls={true}
                        resizeMode="contain"
                        isLooping
                      />
                    </Pressable>
                    {isLastItem && (
                      <View
                        style={{
                          marginLeft: 30,
                          height: 20,
                          width: 50,
                          backgroundColor: "#B0B0B0",
                          alignItems: "center",
                          borderRadius: 25,
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ fontSize: 12, color: "#ffffff" }}>
                          {moment
                            .utc(item.updatedAt)
                            .utcOffset("+07:00")
                            .format("HH:mm")}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              }
            }
          }
        } else {
          if (!item.unViewList.includes(currentId)) {
            //so sánh người gửi
            if (item.sender?.id === currentId) {
              return (
                <View style={styles.viewEnd}>
                  <Pressable
                    delayLongPress={delayTime}
                    onLongPress={() => {
                      setModalVisible(true);
                      setIsUserChoose(true);
                      setMessageIsChoose(item), setIsMessageRecall(true);
                    }}
                    style={[
                      styles.messsagePressEnd,
                      adminId === item.sender.id
                        ? { borderWidth: 1, borderColor: "#3483C6" }
                        : "",
                    ]}
                  >
                    <Text style={[styles.textMessagePress, { opacity: 0.7 }]}>
                      Tin nhắn đã được thu hồi
                    </Text>
                    {isLastItem && (
                      <Text style={styles.dateTime}>
                        {moment
                          .utc(item.updatedAt)
                          .utcOffset("+07:00")
                          .format("HH:mm")}
                      </Text>
                    )}
                  </Pressable>
                </View>
              );
            } else {
              return (
                <View
                  style={[
                    styles.viewStart,
                    firstItemBySender ? { flexDirection: "row" } : {},
                  ]}
                >
                  {firstItemBySender ? (
                    item.sender?.avatar?.substring(0, 3) === "rgb" ? (
                      <View>
                        <View
                          style={{
                            height: 20,
                            width: 20,
                            backgroundColor: item.sender.avatar,
                            borderRadius: 20,
                            marginLeft: 5,
                          }}
                        />
                        {adminId === item.sender.id ? (
                          <View
                            style={{
                              height: 10,
                              width: 10,
                              backgroundColor: "#7C8596",
                              borderRadius: 10,
                              justifyContent: "center",
                              alignItems: "center",
                              position: "absolute",
                              bottom: 0,
                              right: 0,
                            }}
                          >
                            <FontAwesomeIcon
                              style={{}}
                              size={7}
                              color="yellow"
                              icon={faKey}
                            />
                          </View>
                        ) : (
                          ""
                        )}
                      </View>
                    ) : (
                      <View>
                        <Image
                          source={{ uri: item.sender.avatar }}
                          style={{
                            height: 20,
                            width: 20,
                            borderRadius: 20,
                            marginLeft: 5,
                          }}
                        />
                        {adminId === item.sender.id ? (
                          <View
                            style={{
                              height: 10,
                              width: 10,
                              backgroundColor: "#7C8596",
                              borderRadius: 10,
                              justifyContent: "center",
                              alignItems: "center",
                              position: "absolute",
                              bottom: 0,
                              right: 0,
                            }}
                          >
                            <FontAwesomeIcon
                              style={{}}
                              size={7}
                              color="yellow"
                              icon={faKey}
                            />
                          </View>
                        ) : (
                          ""
                        )}
                      </View>
                    )
                  ) : (
                    ""
                  )}
                  <Pressable
                    delayLongPress={delayTime}
                    onLongPress={() => {
                      setModalVisible(true);
                      setIsUserChoose(false);
                      setMessageIsChoose(item);
                    }}
                    style={[
                      styles.messsagePressStart,
                      firstItemBySender ? { marginLeft: 5 } : {},
                      adminId === item.sender.id
                        ? { borderWidth: 1, borderColor: "#3483C6" }
                        : "",
                    ]}
                  >
                    {firstItemBySender && (
                      <Text style={styles.name}>{item.sender.userName}</Text>
                    )}
                    <Text style={[styles.textMessagePress, { opacity: 0.7 }]}>
                      Tin nhắn đã được thu hồi
                    </Text>
                    {isLastItem && (
                      <Text style={styles.dateTime}>
                        {moment
                          .utc(item.updatedAt)
                          .utcOffset("+07:00")
                          .format("HH:mm")}
                      </Text>
                    )}
                  </Pressable>
                </View>
              );
            }
          }
        }
      }
    }
  };

  function objectId() {
    return (
      hex(Date.now() / 1000) +
      " ".repeat(16).replace(/./g, () => hex(Math.random() * 16))
    );
  }

  function hex(value) {
    return Math.floor(value).toString(16);
  }

  const resetToScreen = (navigation, routeName) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName }],
      })
    );
  };

  const onlineTime = (timeOffline) => {
    const now = moment();
    const createdAt = moment(timeOffline);
    const duration = moment.duration(now.diff(createdAt));
    return duration.days() > 0
      ? `Truy cập ${duration.days()} ngày trước  `
      : duration.hours() > 0
      ? `Truy cập ${duration.hours()} giờ trước  `
      : duration.minutes() > 0
      ? `Truy cập ${duration.minutes()} phút trước  `
      : duration.seconds() > 0
      ? `Truy cập ${duration.seconds()} giây trước  `
      : "Vừa mới truy cập";
  };

  return (
    <View style={[styles.container]}>
      <LinearGradient
        colors={["#008BFA", "#00ACF4"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View
          style={{ flexDirection: "row", height: "55%", alignItems: "center" }}
        >
          <Pressable
            style={{ height: 40, justifyContent: "center", width: 40 }}
            onPress={() => {
              if (flag) {
                navigation.navigate("MainScreen", { screen: "Messages" });
              } else {
                navigation.goBack();
              }
            }}
          >
            <FontAwesomeIcon
              icon={faChevronLeft}
              style={{ marginLeft: 10 }}
              color="#F5F8FF"
              size={20}
            />
          </Pressable>

          <Pressable
            style={{ flex: 1, marginLeft: 5, marginRight: 5 }}
            onPress={() =>
              navigation.navigate("ChatMessageOptions", { items: items })
            }
          >
            <Text numberOfLines={1} style={styles.nameTxt}>
              {items.type === "GROUP_CHAT"
                ? !isLoadingGroupChat
                  ? groupChatInfo.name
                  : ""
                : items.userName}
            </Text>
            <Text style={[styles.stateTxt]}>
              {items.type === "GROUP_CHAT"
                ? "Bấm để xem thông tin"
                : !items.lastedOnline
                ? "Vừa mới truy cập"
                : onlineTime(items.lastedOnline)}
            </Text>
          </Pressable>

          <View
            style={{
              flexDirection: "row",
              width: "25%",
              justifyContent: "space-between",
              marginRight: 10,
            }}
          >
            <Pressable style={[styles.btnOptsIcon, {}]}>
              <FontAwesomeIcon size={20} style={[styles.icon]} icon={faPhone} />
            </Pressable>

            <Pressable style={styles.btnOptsIcon}>
              <FontAwesomeIcon size={21} style={styles.icon} icon={faVideo} />
            </Pressable>

            <Pressable
              style={styles.btnOptsIcon}
              onPress={() => {
                navigation.navigate("ChatMessageOptions", { items: items });
              }}
            >
              <FontAwesomeIcon size={20} style={styles.icon} icon={faList} />
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      <View
        style={[
          styles.body,
          device.device === "ios"
            ? isKeyboardOpen
              ? { paddingBottom: keyboardHeight + 85 + 90 }
              : { paddingBottom: 90 + 85 }
            : "",
        ]}
      >
        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color="black" />
          </View>
        ) : isMessage ? (
          <View>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
              // onContentSizeChange={() => scrollToBottomWithOffset(80)}
              // onLayout={() => scrollToBottomWithOffset(80)}
              style={{ height: "100%" }}
            />
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: 100,
            }}
          >
            <View
              style={{
                backgroundColor: "#FFFFFF",
                height: 150,
                width: "80%",
                borderRadius: 20,
                justifyContent: "center",
              }}
            >
              <View style={{ alignItems: "center" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {items.type === "PRIVATE_CHAT" ? (
                    items.avatar?.substring(0, 3) === "rgb" ? (
                      <View
                        style={{
                          height: 40,
                          width: 40,
                          backgroundColor: items.avatar,
                          borderRadius: 20,
                          marginLeft: 20,
                        }}
                      ></View>
                    ) : (
                      <Image
                        style={{
                          height: 60,
                          width: 60,
                          borderRadius: 30,
                          marginLeft: 20,
                        }}
                        source={{ uri: items.avatar }}
                      ></Image>
                    )
                  ) : // group chat
                  !isLoadingGroupChat ? (
                    <View style={{ height: 60, width: 60, marginLeft: 20 }}>
                      {groupChatInfo.avatar ? (
                        <Image
                          source={{ uri: groupChatInfo.avatar }}
                          style={{ height: 60, width: 60, borderRadius: 30 }}
                        />
                      ) : (
                        groupChatInfo.participants?.map((participant, index) =>
                          index < 4 ? (
                            groupChatInfo.participants?.length <= 3 ? ( // nhoms cos 3 nguowif
                              <View
                                key={index}
                                style={[
                                  { height: 30, width: 30 },
                                  index === 0
                                    ? styles.position0
                                    : index === 1
                                    ? styles.position1
                                    : styles.position2,
                                ]}
                              >
                                {participant.avatar.substring(0, 3) ===
                                "rgb" ? (
                                  <View
                                    style={[
                                      styles.avtGroup,
                                      { backgroundColor: participant.avatar },
                                    ]}
                                  />
                                ) : (
                                  <Image
                                    source={{ uri: participant.avatar }}
                                    style={styles.avtGroup}
                                  />
                                )}
                              </View>
                            ) : groupChatInfo.participants?.length === 4 ? ( //nhoms cos 4 nguoi
                              <View
                                key={index}
                                style={[
                                  { height: 30, width: 30 },
                                  index === 0
                                    ? styles.position0_1
                                    : index === 1
                                    ? styles.position1_1
                                    : index === 2
                                    ? styles.position2_1
                                    : styles.position3_1,
                                ]}
                              >
                                {participant.avatar?.substring(0, 3) ===
                                "rgb" ? (
                                  <View
                                    style={[
                                      styles.avtGroup,
                                      { backgroundColor: participant.avatar },
                                    ]}
                                  />
                                ) : (
                                  <Image
                                    source={{ uri: participant.avatar }}
                                    style={styles.avtGroup}
                                  />
                                )}
                              </View>
                            ) : groupChatInfo.participants?.length > 4 ? ( // nhoms 5 nguoi tro len
                              <View
                                key={index}
                                style={[
                                  { height: 30, width: 30 },
                                  index === 0
                                    ? styles.position0_1
                                    : index === 1
                                    ? styles.position1_1
                                    : index === 2
                                    ? styles.position2_1
                                    : [
                                        styles.position3_1,
                                        {
                                          backgroundColor: "#E9ECF3",
                                          justifyContent: "center",
                                          alignItems: "center",
                                          borderRadius: 15,
                                          height: 28,
                                          width: 28,
                                        },
                                      ],
                                ]}
                              >
                                {participant.avatar?.substring(0, 3) ===
                                "rgb" ? (
                                  <View style={{}}>
                                    {index === 3 ? (
                                      <Text>
                                        {groupChatInfo.participants.length -
                                          index}
                                      </Text>
                                    ) : (
                                      <View
                                        style={[
                                          styles.avtGroup,
                                          {
                                            backgroundColor: participant.avatar,
                                          },
                                        ]}
                                      />
                                    )}
                                  </View>
                                ) : (
                                  <View style={{}}>
                                    {index === 3 ? (
                                      <Text>
                                        {groupChatInfo.participants.length -
                                          index}
                                      </Text>
                                    ) : (
                                      <Image
                                        source={{ uri: participant.avatar }}
                                        style={styles.avtGroup}
                                      />
                                    )}
                                  </View>
                                )}
                              </View>
                            ) : (
                              ""
                            )
                          ) : (
                            ""
                          )
                        )
                      )}
                    </View>
                  ) : (
                    ""
                  )}
                  <Text
                    numberOfLines={1}
                    style={{
                      marginLeft: 20,
                      width: "70%",
                      fontSize: 17,
                      fontWeight: "500",
                    }}
                  >
                    {items.type === "GROUP_CHAT"
                      ? !isLoadingGroupChat
                        ? groupChatInfo.name
                        : ""
                      : items.userName}
                  </Text>
                </View>
                <Text style={{ marginTop: "5%" }}>
                  Chưa có tin nhắn, hãy trò chuyện ngay nào!
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <View
        style={[
          styles.footer,
          device.device === "ios"
            ? isKeyboardOpen
              ? { height: keyboardHeight + 85 }
              : { height: 85 }
            : "",
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
            backgroundColor: "#FFFFFF",
            width: "100%",
          }}
        >
          <Pressable style={{ marginLeft: 10 }}>
            <FontAwesomeIcon size={22} color="#5E5E5E" icon={faLaughWink} />
          </Pressable>

          <TextInput
            onContentSizeChange={handleContentSizeChange}
            value={textMessage}
            multiline={true}
            onChangeText={(text) => {
              setTextMessage(text);
            }}
            style={[styles.messageTxt, { height: textInputHeight }]}
            placeholder="Tin nhắn"
            placeholderTextColor={"#5E5E5E"}
          />

          {isText ? (
            <View>
              <Pressable
                style={{
                  paddingLeft: 10,
                  height: 40,
                  width: 45,
                  justifyContent: "center",
                }}
                onPress={() => sendMessage()}
              >
                <FontAwesomeIcon
                  size={22}
                  color="#0085FF"
                  icon={faPaperPlane}
                />
              </Pressable>
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                width: "30%",
                justifyContent: "space-between",
              }}
            >
              <Pressable style={[styles.btnOpts, {}]}>
                <FontAwesomeIcon size={22} color="#5E5E5E" icon={faEllipsis} />
              </Pressable>

              <Pressable style={styles.btnOpts}>
                <FontAwesomeIcon
                  size={22}
                  color="#5E5E5E"
                  icon={faMicrophoneLines}
                />
              </Pressable>

              <Pressable
                style={styles.btnOpts}
                onPress={() => {
                  openImagePickerAsync();
                }}
              >
                <FontAwesomeIcon size={22} color="#5E5E5E" icon={faImage} />
              </Pressable>
            </View>
          )}
        </View>
      </View>

      {/* Overlay và Modal */}
      {modalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              setModalVisible(false);
            }}
          >
            <Pressable style={styles.modalContent}>
              <View
                style={{ flexDirection: "row", marginTop: 5, flexWrap: "wrap" }}
              >
                {!isMessageRecall ? (
                  <Pressable onPress={() => {}} style={styles.longPress}>
                    <FontAwesomeIcon size={18} color="#6F58A8" icon={faReply} />
                    <Text style={{ fontSize: 13, marginTop: 5 }}>Trả lời</Text>
                  </Pressable>
                ) : (
                  ""
                )}

                {!isMessageRecall ? (
                  <Pressable
                    onPress={() => {
                      navigation.navigate("ShareMessage", {
                        data: {
                          type: messageIsChoose.type,
                          content: messageIsChoose.content,
                          urls: messageIsChoose.urls,
                        },
                      });
                    }}
                    style={styles.longPress}
                  >
                    <FontAwesomeIcon size={18} color="#4879D8" icon={faShare} />
                    <Text
                      style={{
                        fontSize: 13,
                        marginTop: 5,
                        textAlign: "center",
                      }}
                    >
                      Chuyển tiếp
                    </Text>
                  </Pressable>
                ) : (
                  ""
                )}

                <Pressable
                  onPress={() => {
                    setModalVisible1(true);
                    setModalVisible(false);
                  }}
                  style={styles.longPress}
                >
                  <FontAwesomeIcon size={18} color="red" icon={faTrashCan} />
                  <Text style={{ fontSize: 13, marginTop: 5 }}>Xóa</Text>
                </Pressable>

                {isUserChoose ? (
                  !isMessageRecall ? (
                    <Pressable
                      onPress={() => {
                        deleteMessage();
                      }}
                      style={styles.longPress}
                    >
                      <FontAwesomeIcon
                        size={18}
                        color="#F18338"
                        icon={faRotateRight}
                      />
                      <Text style={{ fontSize: 13, marginTop: 5 }}>
                        Thu hồi
                      </Text>
                    </Pressable>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}

                <Pressable onPress={() => {}} style={styles.longPress}>
                  <FontAwesomeIcon
                    size={18}
                    color="#5B5C60"
                    icon={faCircleInfo}
                  />
                  <Text style={{ fontSize: 13, marginTop: 5 }}>Chi tiết</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {modalVisible1 && (
        <View style={styles.overlay}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible1}
            onRequestClose={() => setModalVisible1(false)}
          >
            <View style={[styles.modalContainer, { position: "absolute" }]}>
              <View style={styles.modalContent}>
                <View style={{ flex: 3, justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 20, fontWeight: 600 }}>
                    Xóa tin nhắn cho riêng bạn?
                  </Text>
                  <Text style={{ fontSize: 15 }}>
                    Để xóa cho mọi người, hãy thu hồi tin nhắn
                  </Text>
                  <View
                    style={{
                      height: 1,
                      width: "100%",
                      backgroundColor: "gray",
                    }}
                  >
                    <Text> </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                  }}
                >
                  <Pressable
                    onPress={() => setModalVisible1(false)}
                    style={{
                      height: 30,
                      width: 50,
                      marginRight: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 17, fontWeight: 500 }}>Hủy</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => deleteMessageForMe()}
                    style={{
                      height: 30,
                      width: 50,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{ color: "red", fontSize: 17, fontWeight: 500 }}
                    >
                      Xóa
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}

      <Toast
        style={{ backgroundColor: "green" }}
        ref={toastRef}
        position="center"
      />
    </View>
  );
};
