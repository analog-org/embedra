import type { APIMessage, APIUser } from 'discord-api-types/v10';
import { MessageFlags } from 'discord-api-types/v10';
import { useStore } from '@nanostores/react';
import { embedsStore } from '../store/embedStore';
import {
  DiscordAttachment,
  DiscordAttachments,
  DiscordButton,
  DiscordEmbed,
  DiscordEmbedField,
  DiscordEmbedFields,
  DiscordMessage,
  DiscordMessages,
  DiscordActionRow,
  DiscordEmbedDescription,
  DiscordEmbedFooter
} from '@skyra/discord-components-react';
import type { 
  APIEmbed,
  APIEmbedField,
  APIAttachment,
  APIMessageActionRowComponent,
  APIButtonComponent
} from 'discord-api-types/v10';
import React from 'react';
import { ButtonStyle } from 'discord-api-types/v10';
import { DayPicker } from "react-day-picker"

const mockUser: APIUser = {
  id: '1234567890',
  username: 'Preview Bot',
  discriminator: '0000',
  global_name: 'Preview Bot',
  avatar: null,
  bot: true,
  system: false,
  verified: true
};

export function DiscordPreview() {
  const embeds = useStore(embedsStore);

  const getHexColor = (colorInt?: number) => {
    if (!colorInt) return undefined;
    return `#${colorInt.toString(16).padStart(6, "0")}`;
  };
  
  const message: APIMessage = {
    id: '1',
    type: 0,
    content: '',
    channel_id: '1',
    author: mockUser,
    timestamp: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
    edited_timestamp: null,
    tts: false,
    mention_everyone: false,
    mentions: [],
    mention_roles: [],
    attachments: [],
    embeds,
    pinned: false,
    flags: MessageFlags.Ephemeral,
  };

  const renderEmbed = (embed: APIEmbed) => {
    return (
      <DiscordEmbed
        slot="embeds"
        embedTitle={embed.title}
        url={embed.url}
        color={getHexColor(embed.color)}
        authorImage={embed.author?.icon_url}
        authorName={embed.author?.name}
        authorUrl={embed.author?.url}
        image={embed.image?.url}
        thumbnail={embed.thumbnail?.url}
      >
        {embed.description && (
          <DiscordEmbedDescription slot="description">
            {embed.description}
          </DiscordEmbedDescription>
        )}
        
        {embed.fields && embed.fields.length > 0 && (
          <DiscordEmbedFields slot="fields">
            {embed.fields.map((field, index) => (
              <DiscordEmbedField
                key={index}
                fieldTitle={field.name}
                inline={field.inline}
              >
                {field.value.split('\n').map((line, i) => 
                  line ? <p key={i}>{line}</p> : <br key={i} />
                )}
              </DiscordEmbedField>
            ))}
          </DiscordEmbedFields>
        )}
        
          <DiscordEmbedFooter
            slot="footer"
            footerImage={embed.footer?.icon_url}
            timestamp={embed.timestamp}
          >
            {embed.footer?.text}
          </DiscordEmbedFooter>
    
      </DiscordEmbed>
    );
  };

  const renderAttachment = (attachment: APIAttachment) => {
    const isImage = attachment.content_type?.startsWith('image/');
    const isVideo = attachment.content_type?.startsWith('video/');

    return (
      <DiscordAttachment
        key={attachment.id}
        url={attachment.url}
        height={attachment.height ?? undefined}
        width={attachment.width ?? undefined}
        alt={attachment.description || attachment.filename}
      >
        {isImage ? (
          <img
            src={attachment.url}
            alt={attachment.description || attachment.filename}
            style={{
              maxWidth: '100%',
              height: 'auto'
            }}
          />
        ) : isVideo ? (
          <video
            src={attachment.url}
            controls
            style={{
              maxWidth: '100%',
              height: 'auto'
            }}
          />
        ) : (
          attachment.filename
        )}
      </DiscordAttachment>
    );
  };

  const renderActionRow = (components: APIMessageActionRowComponent[]) => {
    return (
      <DiscordActionRow>
        {components.map((component, index) => {
          if (component.type === 2 && 'style' in component) {
            // Type guard for button with URL
            if ('url' in component) {
              return (
                <DiscordButton
                  key={index}
                  type={mapButtonStyle(component.style)}
                  disabled={component.disabled}
                  url={component.url}
                >
                  {component.label || 'Link'}
                </DiscordButton>
              );
            }
            // Type guard for button with custom_id
            if ('custom_id' in component) {
              return (
                <DiscordButton
                  key={index}
                  type={mapButtonStyle(component.style)}
                  disabled={component.disabled}
                >
                  {component.label || component.custom_id}
                </DiscordButton>
              );
            }
            // Fallback for other button types
            return (
              <DiscordButton
                key={index}
                type={mapButtonStyle(component.style)}
                disabled={component.disabled}
              >
                Button
              </DiscordButton>
            );
          }
          return null; // Handle other component types as needed
        })}
      </DiscordActionRow>
    );
  };

  const mapButtonStyle = (style: ButtonStyle): "primary" | "secondary" | "success" | "destructive" => {
    switch (style) {
      case ButtonStyle.Primary:
        return "primary";
      case ButtonStyle.Secondary:
        return "secondary";
      case ButtonStyle.Success:
        return "success";
      case ButtonStyle.Danger:
        return "destructive";
      default:
        return "primary";
    }
  };

  return (
    <DiscordMessages>
      <DiscordMessage
        author={message.author.username}
        avatar={message.author.avatar || undefined}
        bot={message.author.bot}
        verified={message.author.verified}
        timestamp={message.timestamp}
      >
        {message.content}
        
        {/* Render embeds */}
        {message.embeds?.map((embed, index) => (
          <React.Fragment key={`embed-${index}`}>
            {renderEmbed(embed)}
          </React.Fragment>
        ))}

        {/* Render attachments */}
        {message.attachments?.length > 0 && (
          <DiscordAttachments>
            {message.attachments.map(attachment => renderAttachment(attachment))}
          </DiscordAttachments>
        )}

        {/* Render components (buttons, etc.) */}
        {message.components?.map((row, index) => (
          <div key={`row-${index}`}>
            {renderActionRow(row.components)}
          </div>
        ))}
      </DiscordMessage>
    </DiscordMessages>
  );
}
