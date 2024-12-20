import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

export const scaleWidthSize = (size: number) => {
  return (width / guidelineBaseWidth) * size;
};

export const scaleHeightSize = (size: number) => {
  return (height / guidelineBaseHeight) * size;
};

export const scaleFontSize = (size: number) => {
  return (width / guidelineBaseWidth) * size;
};
