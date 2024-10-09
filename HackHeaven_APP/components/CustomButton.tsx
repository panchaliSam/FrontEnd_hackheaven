import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

interface CustomeButtonProps{
    onPress: () => void;
    title: string;
    textStyles?: string;
    cotainerStyles?: string;
}

const CustomButton = ({
    onPress,
    title,
    textStyles = "",
    cotainerStyles = "",
}: CustomeButtonProps) => {
  return (
    <TouchableOpacity
        activeOpacity={0.7}
        className={`bg-white rounded-xl min-h-[62px] justify-center items-center ${cotainerStyles}`}
        onPress={onPress}
    >
      <Text
        className={`text-primary font-semibold text-lg ${textStyles}`}
      >{title}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton