import React from "react";
import { Text, TextProps } from "react-native";
import useThemeStore from "../store/themeStore";

type Props = TextProps & { children: React.ReactNode };


export const Heading = ({ children, style, ...props }: Props) => {
  const { colors } = useThemeStore();
  return (
    <Text
      {...props}
      style={[
        { fontFamily: "MontserratBold", fontSize: 22, color: colors.text },
        style,
      ]}
    >
      {children}
    </Text>
  );
};


export const SubHeading = ({ children, style, ...props }: Props) => {
  const { colors } = useThemeStore();
  return (
    <Text
      {...props}
      style={[
        { fontFamily: "MontserratSemiBold", fontSize: 18, color: colors.text },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const Regular = ({ children, style, ...props }: Props) => {
  const { colors } = useThemeStore();
  return (
    <Text
      {...props}
      style={[
        { fontFamily: "MontserratRegular", fontSize: 13, color: colors.text },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const Body = ({ children, style, ...props }: Props) => {
  const { colors } = useThemeStore();
  return (
    <Text
      {...props}
      style={[
        { fontFamily: "MontserratSemiBold", fontSize: 14, color: colors.text },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const Caption = ({ children, style, ...props }: Props) => {
  const { colors } = useThemeStore();
  return (
    <Text
      {...props}
      style={[
        { fontFamily: "InterMedium", fontSize: 12, color: colors.textMuted },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

export const Mid = ({ children, style, ...props }: Props) => {
  const { colors } = useThemeStore();
  return (
    <Text
      {...props}
      style={[
        { fontFamily: "MontserratBold", fontSize: 15, color: colors.text },
        style,
      ]}
    >
      {children}
    </Text>
  );
};
