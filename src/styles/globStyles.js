
import { StyleSheet, PixelRatio} from "react-native";

function sp(size) {
    return PixelRatio.getFontScale() * size;
}

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
        maxWidth: '60%',
        flexDirection : 'row',
        justifyContent: 'center',
        backgroundColor: '#9cd0de',
        borderRadius: 50,
        padding: 20,
        marginTop: '5%',
    },
    boton2:{
        maxWidth: '60%',
        flexDirection : 'row',
        justifyContent: 'center',
        backgroundColor: '#043655',
        borderRadius: 50,
        padding : 20,
        marginTop: '8%',
    },
    botonAdmin:{
        width: '30%',
        marginTop: 40,
        marginRight: '8%',
        alignSelf:'flex-end',
        backgroundColor: '#FFF',
        borderRadius: 35,
        paddingVertical: 10,
    }, 
    profi:{
        maxWidth: 30,
        maxHeight: 30,
        resizeMode: 'contain',
    },
    label:{
        color : '#FFF',
        fontSize: sp(15),
        paddingHorizontal: 40,
    },
    label2:{
        color : '#000',
        textAlign: 'center',
        fontSize: sp(16),
        fontFamily: 'Noto Sans, sans-serif',
    }
});