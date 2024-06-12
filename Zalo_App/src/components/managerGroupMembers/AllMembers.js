import {
  View,
  Text,
  FlatList,
  Modal,
  ActivityIndicator,
  StatusBar,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Pressable } from "react-native";
import axios from "../../config/axios";
import {
  faClose,
  faKey,
  faMessage,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useSelector } from "react-redux";
import { socket } from "../../config/io";
import { styles } from "./style";
import Toast from "react-native-easy-toast";
import { setGroupChatInfo } from "../../redux/groupChatInfoSlice";
import { useDispatch } from "react-redux";

export const AllMembers = ({ navigation, items }) => {
  const currentId = useSelector((state) => state.user.user.user.id);
  const user = useSelector((state) => state.user);
  const device = useSelector((state) => state.device);
  const groupChatInfo = useSelector(
    (state) => state.groupChatInfo.groupChatInfo
  );
  const [members, setMembers] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const [idMember, setIdMember] = useState();
  const toastRef = useRef(null);
  const [loadAgain, setLoadAgain] = useState(false);
  const [idAdmin, setIdAdmin] = useState(0);
  const [heightModal, setHeightModal] = useState(0);
  const dispatch = useDispatch();

  // lấy danh sách thành viên từ redux
  useEffect(() => {
    setMembers(groupChatInfo.participants);
    setIdAdmin(groupChatInfo.administrator);
    setLoadAgain(false);
    setIsLoading(false);
  }, [loadAgain, groupChatInfo]);

  const handleChooseMember = (item) => {
    if (currentId === item.id) {
      navigation.navigate("Profile", {
        phoneNumber: item.phoneNumber,
        isUser: true,
      });
    } else if (currentId === idAdmin) {
      setModalVisible(true);
      setIdMember(item);
      setHeightModal(0);
    } else {
      setModalVisible(true);
      setIdMember(item);
      setHeightModal(1);
    }
  };

  // const handleGrantGroup = async () => {
  //   try {
  //     const response = await axios.put(`/chat/grantGroupLeader`, {
  //       chatId: items._id,
  //       memberId: idMember
  //     });
  //     if (response.errCode === 0) {
  //       console.log('Bổ nhiệm làm nhóm trưởng thành công')
  //       getListGroupChat()
  //     }
  //   } catch (error) {
  //     console.log('Error deleting member:', error)
  //   }
  // }

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

  const handleRemoveMember = async () => {
    setModalVisible(false);
    try {
      const response = await axios.put(`/chat/message/deleteMemer`, {
        chatId: items._id,
        memberId: idMember.id,
      });

      if (response.errCode === 0) {
        getGroupChat();
        setLoadAgain(true);
        toastRef.current.props.style.backgroundColor = "green";
        toastRef.current.show("Xóa thành viên thành công!", 1000);
        socket.then((socket) => {
          socket.emit("delete-member", response.data);
        });
      } else {
        toastRef.current.props.style.backgroundColor = "red";
        toastRef.current.show("Xóa thành viên thất bại!", 1000);
      }
    } catch (error) {
      console.log("Error deleting member:", error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <Pressable
        style={styles.btnChooseMember}
        onPress={() => {
          handleChooseMember(item);
        }}
      >
        {item.avatar?.substring(0, 3) === "rgb" ? (
          <View style={{ height: 55, width: 55, marginLeft: 15 }}>
            <View
              style={{
                height: 55,
                width: 55,
                backgroundColor: item.avatar,
                borderRadius: 30,
              }}
            ></View>
            {item.id === idAdmin ? (
              <View
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 15,
                  backgroundColor: "#848A96",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                }}
              >
                <FontAwesomeIcon size={10} color="yellow" icon={faKey} />
              </View>
            ) : (
              ""
            )}
          </View>
        ) : (
          <View style={{ height: 55, width: 55, marginLeft: 15 }}>
            <Image
              source={{ uri: item.avatar }}
              style={{ height: 55, width: 55, borderRadius: 30 }}
            />
            {item.id === idAdmin ? (
              <View
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 15,
                  backgroundColor: "#848A96",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                }}
              >
                <FontAwesomeIcon size={10} color="yellow" icon={faKey} />
              </View>
            ) : (
              ""
            )}
          </View>
        )}

        <View
          style={{
            height: 45,
            justifyContent: "space-between",
            marginLeft: 15,
          }}
        >
          <Text style={{ fontSize: 17 }}>
            {item.id === currentId ? "Bạn" : item.userName}
          </Text>
          <Text style={{ fontSize: 14, opacity: 0.7 }}>
            {item.id === idAdmin ? "Trưởng nhóm" : "Thêm bởi trưởng nhóm"}
          </Text>
        </View>
      </Pressable>
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View style={{ height: "100%" }}>
      <View style={{ padding: 10, backgroundColor: "#FFFFFF" }}>
        <Text style={{ color: "#008BFA", fontWeight: "400" }}>
          Thành viên ({members.length})
        </Text>
      </View>

      <FlatList
        data={members}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      {modalVisible ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <Pressable
            style={styles.modalContainer}
            onPress={() => setModalVisible(false)}
          >
            <View
              style={[
                styles.modalContent,
                heightModal ? { height: 230 } : { height: 330 },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  height: 55,
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: "#DFE0E4",
                }}
              >
                <Text style={{ color: "#FFFFFF", width: 50 }}> X </Text>
                <Text style={{ fontSize: 16, fontWeight: "500" }}>
                  Thông tin thành viên
                </Text>
                <Pressable
                  style={styles.btnPressClose}
                  onPress={() => setModalVisible(false)}
                >
                  <FontAwesomeIcon color="#545557" size={25} icon={faClose} />
                </Pressable>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    height: 70,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {idMember.avatar?.substring(0, 3) === "rgb" ? (
                    <View style={{ height: 55, width: 55, marginLeft: 15 }}>
                      <View
                        style={{
                          height: 55,
                          width: 55,
                          backgroundColor: idMember.avatar,
                          borderRadius: 30,
                        }}
                      ></View>
                      {idMember.id === idAdmin ? (
                        <View
                          style={{
                            height: 20,
                            width: 20,
                            borderRadius: 15,
                            backgroundColor: "#848A96",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                          }}
                        >
                          <FontAwesomeIcon
                            size={10}
                            color="yellow"
                            icon={faKey}
                          />
                        </View>
                      ) : (
                        ""
                      )}
                    </View>
                  ) : (
                    <View style={{ height: 55, width: 55, marginLeft: 15 }}>
                      <Image
                        source={{ uri: idMember.avatar }}
                        style={{ height: 55, width: 55, borderRadius: 30 }}
                      />
                      {idMember.id === idAdmin ? (
                        <View
                          style={{
                            height: 20,
                            width: 20,
                            borderRadius: 15,
                            backgroundColor: "#848A96",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                          }}
                        >
                          <FontAwesomeIcon
                            size={10}
                            color="yellow"
                            icon={faKey}
                          />
                        </View>
                      ) : (
                        ""
                      )}
                    </View>
                  )}
                </View>

                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 16,
                    flex: 1,
                    marginLeft: 15,
                    fontWeight: "600",
                  }}
                >
                  {idMember.userName}
                </Text>

                <View style={{ flexDirection: "row", marginRight: 15 }}>
                  <Pressable style={[styles.btnPressOpts, { marginRight: 10 }]}>
                    <FontAwesomeIcon color="#525459" size={16} icon={faPhone} />
                  </Pressable>

                  <Pressable style={[styles.btnPressOpts]}>
                    <FontAwesomeIcon
                      color="#525459"
                      size={16}
                      icon={faCommentDots}
                    />
                  </Pressable>
                </View>
              </View>

              <Pressable
                style={styles.btnPressOpts1}
                onPress={() => {
                  setModalVisible(false);
                  navigation.navigate("Profile", {
                    phoneNumber: idMember.phoneNumber,
                    isUser: false,
                  });
                }}
              >
                <Text style={{ fontSize: 15, marginLeft: 15 }}>
                  Xem trang cá nhân
                </Text>
              </Pressable>

              {groupChatInfo.administrator === currentId ? (
                <View>
                  <Pressable style={styles.btnPressOpts1}>
                    <Text style={{ fontSize: 15, marginLeft: 15 }}>
                      Bổ nhiệm làm phó nhóm
                    </Text>
                  </Pressable>

                  <Pressable style={styles.btnPressOpts1}>
                    <Text style={{ fontSize: 15, marginLeft: 15 }}>
                      Chặn thành viên
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.btnPressOpts1}
                    onPress={() => {
                      handleRemoveMember();
                    }}
                  >
                    <Text
                      style={{ fontSize: 15, marginLeft: 15, color: "red" }}
                    >
                      Xóa khỏi nhóm
                    </Text>
                  </Pressable>
                </View>
              ) : (
                ""
              )}
            </View>
          </Pressable>
        </Modal>
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
