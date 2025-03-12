import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  onPress,
  className = '',
}) => {
  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      onPress={onPress}
      className={`bg-white rounded-lg shadow-md p-4 m-2 ${className}`}
    >
      {title && (
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          {title}
        </Text>
      )}
      <View className="flex-1">{children}</View>
    </CardWrapper>
  );
};

export default Card;