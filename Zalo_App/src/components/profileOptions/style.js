import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
      flex: 1,
      // backgroundColor: '#009AFA',
  },

  header: {
    width: '100%',
    height: 90,
    justifyContent: 'flex-end'
  },

  body: {
    backgroundColor: '#F3F4F6',
    flex: 1,
  },

  txtInHeader: {
    fontSize: 18,
    color: '#F1FFFF',
    width: '60%',
    marginLeft: 15,
  },

  btnHeader: {
    height: 40, 
    width: 40, 
    justifyContent: 'center', 
    alignItems: 'center',
  },

  line1: {
    height: 1,
    width: '5%',
    backgroundColor: '#FFFFFF',
  },

  line2: {
    height: 1,
    backgroundColor: '#E1E1E1',
    width: '95%'
  },

  line: {
    flexDirection: 'row'
  },

  btnOption:{
    justifyContent: 'center',
    height: 50,
    backgroundColor: '#FFFFFF',
  },

  txt:{
    fontSize: 18,
    marginLeft: 20
  },

  button: {
    alignSelf: 'center',
    backgroundColor: '#A8ADB1',
    borderRadius: 15,
    height: 25,
    width: 45,
    marginRight: 15,
    justifyContent: 'center'
  },

  circleButton: {
    height: 20, width: 20, 
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginLeft: 2
  },

  circleButton1: {
    height: 20, width: 20, 
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginLeft: 23
  },

  toggledButton: {
    backgroundColor: 'blue',
  },

  btnModal: {
    width: '50%', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderColor: '#DEDFE3'
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalView: {
    backgroundColor: 'white', 
    height: '13%', 
    width: '70%',
    borderRadius: 15,
  },

  modalText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 15
  },

  btnEdit: {
    height: 35, 
    width: '90%', 
    flexDirection: 'row', 
    backgroundColor: '#E9EDF0', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 20
  },

  OptionsAbove:{
      paddingTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height:150,
  },

  pressFindMessage:{
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 15,
      paddingRight: 15,
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },

  modalContent: {
    width: '100%',
    height: '20%',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    borderTopLeftRadius: 15, 
    borderTopRightRadius: 15,
  },

  btnOptsAvatar: {
    height: '32%', 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '100%'
  },

  btnPressCloseModal: {
    flexDirection: 'row', 
    alignItems: 'center', 
    height: 40, 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DEDFE3',
    width: '100%'
  },

  textBio: {
    height: 200, 
    marginTop: 30, 
    textAlignVertical: 'top',
    fontSize: 16,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#E9EDF0'
  }

});
