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
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 m-2 ${className}`}
    >
      {title && (
        <Text className="text-lg font-semibold text-gray-800 dark:text-gray-50 mb-2">
          {title}
        </Text>
      )}
      <View className="flex-1 gap-2">{children}</View>
    </CardWrapper>
  );
};

export default Card;
