import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

type TabBarButtonProps = PressableProps & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle> | ((state: { pressed: boolean }) => StyleProp<ViewStyle>);
};

const rippleRadius = 56;

export function TabBarButton({ style, children, ...rest }: TabBarButtonProps) {
  return (
    <Pressable
      {...rest}
      android_ripple={{
        color: 'rgba(32, 32, 32, 0.14)',
        borderless: true,
        radius: rippleRadius,
        foreground: true,
      }}
      style={(state) => {
        const resolvedStyle = typeof style === 'function' ? style(state) : style;

        return [
          resolvedStyle,
          {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 6,
          },
        ];
      }}
    >
      {children}
    </Pressable>
  );
}
