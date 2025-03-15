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
  DiscordActionRow
} from '@skyra/discord-components-react';
import type { 
  APIEmbed,
  APIEmbedField,
  APIAttachment,
  APIMessageActionRowComponent,
  APIButtonComponent
} from 'discord-api-types/v10';
import { ButtonStyle } from 'discord-api-types/v10';

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
  
  const message: APIMessage = {
    id: '1',
    type: 0,
    content: '',
    channel_id: '1',
    author: mockUser,
    timestamp: new Date().toISOString(),
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

  const renderEmbedFields = (fields?: APIEmbedField[]) => {
    if (!fields?.length) return null;
    return (
      <DiscordEmbedFields>
        {fields.map((field, index) => (
          <DiscordEmbedField
            key={index}
            fieldTitle={field.name}
            inline={field.inline}
          >
            {field.value}
          </DiscordEmbedField>
        ))}
      </DiscordEmbedFields>
    );
  };

  const renderEmbed = (embed: APIEmbed) => {
    return (
      <DiscordEmbed
        embedTitle={embed.title}
        url={embed.url}
        color={embed.color?.toString(16)}
      >
        <div>{embed.description}</div>
        {embed.thumbnail && (
          <img
            slot="thumbnail"
            src={embed.thumbnail.url}
            alt="Thumbnail"
          />
        )}
        {embed.image && (
          <img
            slot="image"
            src={embed.image.url}
            alt="Embed image"
          />
        )}
        {embed.author && (
          <div slot="author">
            {embed.author.icon_url && (
              <img
                src={embed.author.icon_url}
                alt="Author"
                style={{ height: 24, width: 24, borderRadius: '50%', marginRight: 8 }}
              />
            )}
            {embed.author.url ? (
              <a href={embed.author.url}>{embed.author.name}</a>
            ) : (
              embed.author.name
            )}
          </div>
        )}
        {renderEmbedFields(embed.fields)}
        {embed.footer && (
          <div slot="footer">
            {embed.footer.icon_url && (
              <img
                src={embed.footer.icon_url}
                alt="Footer"
                style={{ height: 20, width: 20, borderRadius: '50%', marginRight: 8 }}
              />
            )}
            {embed.footer.text}
            {embed.timestamp && (
              <span style={{ marginLeft: 8 }}>
                {new Date(embed.timestamp).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
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
        <div key={`embed-${index}`}>{renderEmbed(embed)}</div>
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
  );
}
