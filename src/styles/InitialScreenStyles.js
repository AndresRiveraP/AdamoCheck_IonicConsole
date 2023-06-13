
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    background:{
        flex:1,
        resizeMode: 'cover',
        justifyContent:'space-around',
    },
    container:{
        justifyContent : 'center',
        alignItems: 'center'
    },
    logoA :{
        maxWidth: '50%',
        maxHeight: '50%',
        resizeMode: 'contain',
        alignSelf : 'center'
    },
    boton:{
        flexDirection : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#9cd0de',
        borderRadius: 50,
        padding: 20,
        marginTop: 40,
    },
    boton2:{
        flexDirection : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#043655',
        borderRadius: 50,
        padding: 20,
        marginTop: 40,
    },
    botonAdmin:{
        marginTop: 30,
        alignSelf:'flex-end',
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        borderRadius: 50,
        padding: 15,
        right: 10,
    }, 
    profi:{
        maxWidth: 20,
        maxHeight: 20,
        resizeMode: 'contain',
    },
    label:{
        color : '#FFF',
        fontSize: 16,
        paddingHorizontal: 50,
    },
    label2:{
        color : '#000',
        fontSize: 16,
    }
});