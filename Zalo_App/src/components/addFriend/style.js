import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  }, 
  
  body: {
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  header: {
    width: '100%',
    height: 90,
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-end',
  },

  txtInHeader: {
    fontSize: 18,
    color: 'black',
    marginLeft: 10,
    fontWeight: '500'
  },

  btnHeader: { 
    flexDirection: 'row',
    height: 50,
    width: 160,
    alignItems: 'center',
    marginLeft: 10,
  },  

  btnSearch: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: '#D2D6D9',
  },

  textInput: {
    borderWidth: 1, 
    borderColor: '#B2B2B2', 
    borderRadius: 8, 
    width: '80%', 
    height: 45,
    fontSize: 17, 
    paddingLeft: 20,
  },

  btnQr: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: 50,
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


    phoneInput: {
      width: "80%",
      height: "auto",
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
    },
    addFriendWrapper:{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom:20,
      marginTop:20,
      padding:20
    },
    btnRe: {
      height: 30,
      width: 90,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    blue: {
        backgroundColor: '#127FFF'
    },
    gray: {
        backgroundColor: '#9FE1FF'
    },
    
    encodeEndWrapper:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      height: 40,
      paddingLeft: 15,
    },
    txt:{
      fontSize: 16,
      fontWeight:'500',
    },
    imgWrapper:{
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingLeft: 15,
      paddingRight: 15,
      marginTop: 30,
    }
})