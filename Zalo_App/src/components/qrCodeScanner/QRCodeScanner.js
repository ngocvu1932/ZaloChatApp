import React, { useState, useEffect } from "react";
import { Text, View, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { styles } from "./style";
import { socket } from "../../config/io";
import { useSelector } from "react-redux";

export const QRCodeScanner = ({navigation}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [text, setText] = useState("Hướng camera về phía mã QR");
  const [isConnected, setIsConnected] = useState(false);
  const user = useSelector((state) => state.user.user.user);

  const askForCameraPermission = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  };

  useEffect(() => {
    socket.then((socket) => {
      socket.emit("setup");
      socket.on("connected", () => {
        console.log("Socket connected");
        setIsConnected(true);
      });
    });
    askForCameraPermission();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setText(data);
    socket.then((socket) => {
      socket.emit("join-qr-room", data);
      socket.on("joined", (room) => {
        console.log("room", room);
        if (room) {
          socket.emit("scan-success", {
            phoneNumber: user.phoneNumber,
            id: user.id,
            avatar: user.avatar,
            room: room,
            userName: user.userName,
          });
        } 
      });
    });
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 10 }}>No access to camera</Text>
        <Button
          title={"Allow Camera"}
          onPress={() => askForCameraPermission()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.barcodebox}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={{ height: 400, width: 400 }}
        />
      </View>
      <Text style={styles.maintext}>{text}</Text>

      {scanned && (
        <Button
          title={"Quét lại?"}
          onPress={() => setScanned(false)}
          color="tomato"
        />
      )}
    </View>
  );
};
