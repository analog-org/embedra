import React from 'react';
import { DiscordCustomEmoji, DiscordTime, DiscordMention } from '@skyra/discord-components-react';



export const parseCustomEmojis = (text: string) => {
  if (!text) return text;
  
  // Regex pattern to match Discord custom emoji format <:name:id>
  const emojiPattern = /<:([^:]+):(\d+)>/g;
  
  // Split text by emoji matches
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  
  while ((match = emojiPattern.exec(text)) !== null) {
    // Add text before the emoji
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    // Add the emoji component
    const emojiName = match[1];
    const emojiId = match[2];
    
    parts.push(
      <DiscordCustomEmoji
        key={`emoji-${emojiId}-${match.index}`}
        name={emojiName}
        url={`https://cdn.discordapp.com/emojis/${emojiId}.webp?size=48`}
      />
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length ? parts : text;
};