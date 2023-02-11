import React, { useRef, ReactElement, useEffect } from 'react';
import {
  StyleProp,
  ViewStyle,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Text,
  TextStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { timer } from 'rxjs';
import { useUpdateGlobalComponentState } from '../../core/hooks';
import { useFadeAnimationStyle } from '../../hooks';
import { FadeAnimationConfigs, useSlideAnimationStyle } from '../../hooks';
import { SlideAnimationConfig } from '../../hooks/useSlideAnimationStyle';

interface Styles {
  style?: StyleProp<ViewStyle>;
  title?: StyleProp<TextStyle>;
  description?: StyleProp<TextStyle>;
  titleContainer?: StyleProp<ViewStyle>;
}

export interface SimpleSnackbarProps {
  title: string;
  description?: string;
  duration?: number;
  position?: 'top' | 'bottom';
  offsetY?: number;
  translateY?: number;
  onPress?: () => void;
  hideOnPress?: boolean;
  testID?: string;
  leftElement?: ReactElement;
  rightElement?: ReactElement;
  slideAnimationConfig?: Omit<SlideAnimationConfig, 'translateY'>;
  fadeAnimationConfig?: FadeAnimationConfigs;
  styles?: Styles;
}

const SimpleSnackbar: React.FC<SimpleSnackbarProps> = ({
  title,
  description,
  fadeAnimationConfig,
  testID,
  leftElement,
  rightElement,
  onPress,
  styles,
  slideAnimationConfig,
  hideOnPress = true,
  translateY = 30,
  offsetY = 50,
  duration = 2000,
  position = 'top',
}) => {
  const positionStyle = useRef<Record<string, ViewStyle>>({
    bottom: {
      bottom: offsetY,
      position: 'absolute',
      alignSelf: 'center',
    },
    top: {
      top: offsetY,
      position: 'absolute',
      alignSelf: 'center',
    },
  }).current;

  const { hide } = useUpdateGlobalComponentState();

  const { style: slide } = useSlideAnimationStyle({
    ...slideAnimationConfig,
    translateY: position === 'bottom' ? translateY : translateY * -1,
  });

  const { style: fade } = useFadeAnimationStyle(fadeAnimationConfig);

  useEffect(() => {
    const subscription = timer(duration).subscribe(() => {
      hide();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <View
      testID={testID}
      style={StyleSheet.flatten([styles?.style, positionStyle[position]])}>
      <TouchableWithoutFeedback
        onPress={() => {
          onPress && onPress();
          hideOnPress && hide();
        }}>
        <Animated.View style={[slide, fade]}>
          <View style={defaultStyles.container}>
            {leftElement}
            <View
              style={StyleSheet.flatten([
                defaultStyles.titleContainer,
                styles?.titleContainer,
              ])}>
              <Text
                style={StyleSheet.flatten([
                  defaultStyles.title,
                  styles?.title,
                ])}>
                {title}
              </Text>
              {!!description && (
                <Text
                  style={StyleSheet.flatten([
                    defaultStyles.description,
                    styles?.description,
                  ])}>
                  {description}
                </Text>
              )}
            </View>
            {rightElement}
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const defaultStyles = StyleSheet.create({
  container: {
    minWidth: 220,
    minHeight: 50,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    backgroundColor: '#000000dd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    color: '#ffffff',
    fontSize: 14,
    textAlign: 'center',
  },
  titleContainer: {
    flex: 1,
  },
});

export default SimpleSnackbar;
