import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E2E9F1',
    },

    header: {
        width: '100%',
        height: 90,
        alignItems: "center",
        justifyContent: 'flex-end',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },

    header1: {
        width: '100%',
        height: 90,
        backgroundColor: '#F7F7F7',
        justifyContent: 'flex-end',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },

    body: {
        flex: 1,
        position: 'absolute',
        top: 90,
        left: 0,
        right: 0,
        backgroundColor: '#E2E9F1',
        width: '100%',
        height: '100%',
        paddingBottom: 90 + 85,
    },

    icon: {
        color: "white",
    },

    nameTxt: {
        color: "white",
        fontSize: 18,
        fontWeight: '500'
    },

    stateTxt: {
        color: "white",
        fontSize: 15,
        opacity: 0.8
    },
  
    footer: {
        width: "100%",
        backgroundColor: '#FFFFFF',
        zIndex: 0,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 85,
    },
   
    messageTxt: {
        flex: 1, 
        fontSize: 18, 
        marginLeft: 10,
        textAlign: 'left',
        width: '90%',
        textAlignVertical: 'center',
    },

    viewEnd: {
        alignItems: 'flex-end', 
        width: '100%',
    },

    viewStart: {
        alignItems: 'flex-start', 
        width: '100%',
    },

    messsagePressEnd: { 
        backgroundColor: '#D0F0FD', 
        borderColor: '#D8DCDD', 
        borderWidth: 1 ,
        maxWidth: '80%', 
        borderRadius: 10, 
        marginRight: 10,  
        marginBottom: 5
    },

    messsagePressStart: { 
        backgroundColor: '#FEFEFE', 
        borderColor: '#D8DCDD', 
        borderWidth: 1 ,
        maxWidth: '80%',
        borderRadius: 10, 
        marginLeft: 30, 
        marginBottom: 5
    },

    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
       
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

    modalContent: {
        height: 250,
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
    },

    textMessagePress: {
        flexWrap: 'wrap', 
        paddingTop: 10, 
        paddingLeft: 10, 
        paddingRight: 10, 
        paddingBottom: 10,
        fontSize: 18
    },

    dateTime: {
        paddingLeft: 10, 
        paddingRight: 5, 
        paddingBottom: 5, 
        marginTop: -5,
        fontSize: 12,
        opacity: 0.5
    },

    longPress: {
        height: 70, 
        width: '25%', 
        justifyContent: 'flex-start', 
        alignItems: 'center', 
        padding: 2,
        // backgroundColor: 'red'
    },

    name: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        fontSize: 12,
        opacity: 0.8
    },

    btnOpts: {
        height: 40, 
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },

    btnOptsIcon: {
        height: 30, 
        width: 30, 
        justifyContent: 'center', 
        alignItems: 'center'
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
        top: 0,
        left: 15,
        zIndex: 6
    },

    position1: {
        position: 'absolute',
        bottom: 7,
        left: 3,
        zIndex: 5
    },

    position2: {
        position: 'absolute',
        bottom: 7,
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
        bottom: 4,
        right: 3,
        zIndex: 4
    },

    position3_2: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 4
    },

    viewShareMess: {
        height: 100, 
        width: '100%', 
        backgroundColor: '#FFFFFF',
        position: 'absolute',
        bottom: 0, 
        left: 0,
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
    },

    position0_3: {
        position: 'absolute',
        top: 0,
        left: 11,
        zIndex: 6
    },

    position1_3: {
        position: 'absolute',
        bottom: 5,
        left: 0,
        zIndex: 5
    },

    position2_3: {
        position: 'absolute',
        bottom: 5,
        right: 3,
        zIndex: 4
    },

    position0_4: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 6
    },

    position1_4: {
        position: 'absolute',
        top: 0,
        right: 5,
        zIndex: 5
    },

    position2_4: {
        position: 'absolute',
        bottom: 5,
        left: 0,
        zIndex: 4
    },

    position3_4: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        zIndex: 4
    },

    pressChooseChat: {
        backgroundColor: '#FFFFFF', 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginTop: 10, 
        marginBottom: 10
    },

    viewChoose: {
        height: 23, 
        width: 23, 
        borderRadius: 23, 
        borderColor: '#C2C7C9',  
        borderWidth: 1, 
        marginLeft: 15, 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    pressX: {
        position: 'absolute', 
        top: 0, 
        right: 0, 
        height: 15, 
        width: 15, 
        borderRadius: 10, 
        backgroundColor: '#DFDFDF', 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderWidth: 1, 
        borderColor: '#FFFFFF'
    },

    viewChooseE: {
        position: 'absolute', 
        zIndex: 10, 
        bottom: 100, 
        left: 0, 
        height: 65, 
        backgroundColor: '#FFFFFF', 
        width: '100%', 
        borderTopWidth: 1, 
        borderColor: '#C2C7C9',
    },

    presssend: {
        height: 55, 
        width: 55, 
        backgroundColor: '#01A1FF', 
        borderRadius: 30, 
        justifyContent: 'center', 
        alignItems: 'center'
    }

})
