import React from "react";
import EmojiSelector from "react-native-emoji-selector";
import { View } from "react-native";

const EmojiKeyboard = ({ onSelect }) => {
  return (
    <View style={{ height: 300 }}>
      <EmojiSelector
        onEmojiSelected={onSelect}
        showSearchBar={false}
        showTabs={true}
        showHistory={true}
        columns={8}
      />
    </View>
  );
};

export default EmojiKeyboard;