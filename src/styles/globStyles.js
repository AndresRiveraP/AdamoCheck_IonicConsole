
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
        maxWidth: '52%',
        maxHeight: '52%',
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
        marginTop: '5%',
    },
    boton2:{
        flexDirection : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#043655',
        borderRadius: 50,
        padding: 20,
        marginTop: '8%',
    },
    botonAdmin:{
        width: '20%',
        marginTop: 40,
        marginRight: '8%',
        alignSelf:'flex-end',
        backgroundColor: '#FFF',
        borderRadius: 35,
        paddingVertical: 10,
    }, 
    profi:{
        maxWidth: 40,
        maxHeight: 40,
        resizeMode: 'contain',
    },
    label:{
        color : '#FFF',
        fontSize: 20,
        paddingHorizontal: 50,
    },
    label2:{
        color : '#000',
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Noto Sans, sans-serif',
    }
});