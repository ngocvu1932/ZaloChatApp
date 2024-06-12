import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
  },

  header: {
    width: '100%',
    height: 90,
    backgroundColor: 'red',
    justifyContent: 'flex-end',
  },

  body: {
    backgroundColor: '#FFFFFF',
    // backgroundColor: 'blue',
    flex: 1,
  },

  btnSelectChat: {
    backgroundColor: '#FFFFFF', 
    height: 80, 
    marginBottom: 1, 
    alignItems: 'center' ,
    justifyContent: 'center',
  },

  icon: {
    marginLeft: 10,
    color: 'white'
  },

  searchTxt: {
    color: "white",
    fontSize: 17,
    width: "70%",
    marginLeft: 10,
    height: 40,
  },

  searchBtnWrapper: {
    flexDirection: "row",
    marginLeft: 15,
    backgroundColor: 'red'
  },

  lastMessage_content: {
    fontSize: 16,
    color: 'grey',
    // fontWeight:200
  },

  time: {
    fontSize: 14,
    color: 'grey',
    marginTop: "10px",
    right: "10px",
    color: "black"
  },

  actionIcons: {
    flexDirection: 'row',
    marginRight: 10
  },

  line1: {
    height: 1,
    backgroundColor: '#FFFFFF',
    width: '20%'
  },

  line2: {
    height: 1,
    backgroundColor: '#F1F2F4',
    width: '80%'
  },

  line: {
    flexDirection: 'row'
  },

  
  avtGroup: {
    height: 30, 
    width: 30, 
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFFFFF'
  },

  position0: {
    position: 'absolute',
    top: 2,
    left: 15,
    zIndex: 6
  },

  position1: {
    position: 'absolute',
    bottom: 5,
    left: 3,
    zIndex: 5
  },

  position2: {
    position: 'absolute',
    bottom: 5,
    right: 3,
    zIndex: 4
  },

  position0_1: {
    position: 'absolute',
    top: 3,
    left: 3,
    zIndex: 6
  },

  position1_1: {
    position: 'absolute',
    top: 3,
    right: 3,
    zIndex: 5
  },

  position2_1: {
    position: 'absolute',
    bottom: 3,
    left: 3,
    zIndex: 3
  },

  position3_1: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    zIndex: 4
  },


});
