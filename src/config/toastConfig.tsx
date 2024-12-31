import { JSX} from 'react';
import { Dimensions } from 'react-native';
import Toast, { BaseToast, BaseToastProps, ErrorToast } from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const toastConfig = {
  success: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'green', height: height / 10, width: '75%' }} 
      text1Style={{
        fontSize: height * 0.03,
        fontWeight: 'bold',
        textAlign: 'center',
      }}
      text2Style={{
        fontSize: height * 0.02,
        textAlign: 'center',
      }}
    />
  ),
  error: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <ErrorToast
      {...props}
      style={{ display:'flex', borderLeftColor: 'red', height: height / 10, width: '75%' }} 
      text1Style={{
        fontSize: height * 0.03,
        textAlign: 'center',
        fontWeight: 'bold',
      }}
      text2Style={{
        fontSize: height * 0.02,
        textAlign: 'center',
      }}
    />
  ),
  warning: (props: JSX.IntrinsicAttributes & BaseToastProps) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'orange', height: height / 10, width: '75%' }} 
      text1Style={{
        fontSize: height * 0.03,
        fontWeight: 'bold',
        textAlign: 'center',
      }}
      text2Style={{
        fontSize: height * 0.02,
        textAlign: 'center',
      }}
    />
  ),
};

export default toastConfig;