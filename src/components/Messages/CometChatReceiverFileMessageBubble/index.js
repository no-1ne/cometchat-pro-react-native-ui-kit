/* eslint-disable import/no-named-as-default */
import React from 'react';
import { View, Text, TouchableWithoutFeedback, Alert } from 'react-native';
import CometChatThreadedMessageReplyCount from '../CometChatThreadedMessageReplyCount';
import CometChatReadReceipt from '../CometChatReadReceipt';
import { CometChatMessageReactions } from '../../Messages/Extensions';
import style from './styles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob';
import { CometChatAvatar } from '../../Shared';

export default (props) => {
  const message = { ...props.message, messageFrom: 'receiver' };
  let avatarImg = '';

  if (message.receiverType === 'group') {
    avatarImg = { uri: message.sender.avatar };
  }

  const download = () => {
    RNFetchBlob.config({
      // add option that makes response data to be stored as a file,
      // is much more performant.
      fileCache: true,
      appendExt: props.message.data.attachments[0].ext,
    })
      .fetch('GET', props.message.data.attachments[0].url, {
        // some headers ..
      })
      .then(() => {
        Alert.alert('File Downloaded');
      });
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        {props.message.receiverType === 'group' ? (
          <View style={style.avatarStyle}>
            <CometChatAvatar
              cornerRadius={18}
              borderColor={props.theme.color.secondary}
              borderWidth={0}
              image={avatarImg}
              name={message.sender.name}
            />
          </View>
        ) : null}
        <View>
          {props.message.receiverType === 'group' ? (
            <View style={{ marginBottom: 5 }}>
              <Text>{message.sender.name}</Text>
            </View>
          ) : null}

          <View style={{ minWidth: '65%' }}>
            <TouchableWithoutFeedback
              onPress={download}
              onLongPress={() => props.actionGenerated('openMessageActions', message)}>
              <View
                style={[
                  style.messageWrapperStyle,
                  { backgroundColor: props.theme.backgroundColor.grey },
                ]}>
                <View style={{ flex: 1, marginRight: 4 }}>
                  <Text style={[style.attachmentName]}>
                    {props.message.data.attachments[0].name}
                  </Text>
                </View>
                <Icon name="file-download-outline" size={25} color="#3399FF" />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={style.containerStyle}>
            <View style={style.messageInfoWrapperStyle}>
              <CometChatReadReceipt {...props} message={message} />
              <CometChatThreadedMessageReplyCount {...props} message={message} />
            </View>
          </View>
          <CometChatMessageReactions theme={props.theme} {...props} message={message} />
        </View>
      </View>
    </View>
  );
};