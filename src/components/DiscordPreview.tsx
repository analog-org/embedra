import type { APIMessage, APIUser } from "discord-api-types/v10";
import { MessageFlags } from "discord-api-types/v10";
import { useStore } from "@nanostores/react";
import { messageStore } from "../store/messageStore";
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
  DiscordEmbedFooter,
  DiscordCustomEmoji,
  DiscordMention,
} from "@skyra/discord-components-react";
import type {
  APIEmbed,
  APIEmbedField,
  APIAttachment,
  APIMessageActionRowComponent,
  APIButtonComponent,
} from "discord-api-types/v10";
import { parseText } from "@/lib/parseUtils";
import React from "react";
import { ButtonStyle } from "discord-api-types/v10";
import { DayPicker } from "react-day-picker";

const mockUser: APIUser = {
  id: "1234567890",
  username: "Preview Bot",
  discriminator: "0000",
  global_name: "Preview Bot",
  avatar: null,
  bot: true,
  system: false,
  verified: true,
};



export function DiscordPreview() {
  const $message = useStore(messageStore);

  const getHexColor = (colorInt?: number) => {
    if (!colorInt) return undefined;
    return `#${colorInt.toString(16).padStart(6, "0")}`;
  };

  const previewMessage: APIMessage = {
    id: "1",
    type: 0,
    content: $message.content || "",
    channel_id: "1",
    author: mockUser,
    timestamp: new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }),
    edited_timestamp: null,
    tts: false,
    mention_everyone: false,
    mentions: [],
    mention_roles: [],
    attachments: $message.attachments || [],
    embeds: $message.embeds || [],
    components: $message.components || [],
    pinned: false,
    flags: MessageFlags.Ephemeral,
  };

  const renderAttachment = (attachment: APIAttachment, index: number) => {
    const isImage = attachment.content_type?.startsWith("image/");
    const isVideo = attachment.content_type?.startsWith("video/");

    return (
      <DiscordAttachment
        key={`attachment-${attachment.id || index}`}
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
              maxWidth: "300px",
              height: "auto",
            }}
          />
        ) : isVideo ? (
          <video
            src={attachment.url}
            controls
            style={{
              maxWidth: "300px",
              height: "auto",
            }}
          />
        ) : (
          attachment.filename
        )}
      </DiscordAttachment>
    );
  };

  const renderButton = (
    component: APIMessageActionRowComponent,
    index: number
  ) => {
    if (component.type !== 2 || !("style" in component)) return null;

    // Button with URL
    if ("url" in component) {
      return (
        <DiscordButton
          key={`button-url-${index}`}
          type={mapButtonStyle(component.style)}
          disabled={component.disabled}
          url={component.url}
        >
          {component.label || "Link"}
        </DiscordButton>
      );
    }

    // Button with custom_id
    if ("custom_id" in component) {
      return (
        <DiscordButton
          key={`button-custom-${index}`}
          type={mapButtonStyle(component.style)}
          disabled={component.disabled}
        >
          {component.label || component.custom_id}
        </DiscordButton>
      );
    }

    // Fallback
    return (
      <DiscordButton
        key={`button-${index}`}
        type={mapButtonStyle(component.style)}
        disabled={component.disabled}
      >
        Button
      </DiscordButton>
    );
  };

  const mapButtonStyle = (
    style: ButtonStyle
  ): "primary" | "secondary" | "success" | "destructive" => {
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
        author={mockUser.username}
        avatar={mockUser.avatar || undefined}
        bot={mockUser.bot}
        verified={mockUser.verified}
        timestamp={previewMessage.timestamp}
      >
        <div>
          {previewMessage.content
            .split("\n")
            .map((line, i) => (line ? <p key={i}>{parseText(line)}</p> : <br key={i} />))}
        </div>

        {/* Render embeds directly without Fragment wrapper */}

        <div>
          {previewMessage.embeds?.map((embed, index) => (
            <DiscordEmbed
              key={`embed-${index}`}
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
                  {embed.description
                    .split("\n")
                    .map((line, i) =>
                      line ? <p key={i}>{line}</p> : <br key={i} />
                    )}
                </DiscordEmbedDescription>
              )}

              {embed.fields && embed.fields.length > 0 && (
                <DiscordEmbedFields slot="fields">
                  {embed.fields.map((field, fieldIndex) => (
                    <DiscordEmbedField
                      key={fieldIndex}
                      fieldTitle={field.name}
                      inline={field.inline}
                      inlineIndex={field.inline ? fieldIndex + 1 : undefined}
                    >
                      {field.value
                        .split("\n")
                        .map((line, i) =>
                          line ? <p key={i}>{line}</p> : <br key={i} />
                        )}
                    </DiscordEmbedField>
                  ))}
                </DiscordEmbedFields>
              )}

              <DiscordEmbedFooter
                slot="footer"
                footerImage={embed.footer?.icon_url}
                timestamp={embed.timestamp || undefined}
              >
                <div>{embed.footer?.text || " "}</div>
              </DiscordEmbedFooter>
            </DiscordEmbed>
          ))}
        </div>

        {/* Render attachments */}

        <div>
          <DiscordAttachments slot="attachments">
            {previewMessage.attachments.map((attachment, index) =>
              renderAttachment(attachment, index)
            )}
          </DiscordAttachments>
        </div>

        <div>
          {previewMessage.components?.map((row, rowIndex) => (
            <DiscordActionRow key={`row-${rowIndex}`} slot="components">
              {row.components.map((component, compIndex) => {
                if (component.type !== 2 || !("style" in component))
                  return null;

                // Button with URL
                if ("url" in component) {
                  return (
                    <DiscordButton
                      key={`button-url-${compIndex}`}
                      type={mapButtonStyle(component.style)}
                      disabled={component.disabled}
                      url={component.url}
                    >
                      {component.label || "Link"}
                    </DiscordButton>
                  );
                }

                // Button with custom_id
                if ("custom_id" in component) {
                  return (
                    <DiscordButton
                      key={`button-custom-${compIndex}`}
                      type={mapButtonStyle(component.style)}
                      disabled={component.disabled}
                    >
                      {component.label || component.custom_id}
                    </DiscordButton>
                  );
                }

                // Fallback
                return (
                  <DiscordButton
                    key={`button-${compIndex}`}
                    type={mapButtonStyle(component.style)}
                    disabled={component.disabled}
                  >
                    Button
                  </DiscordButton>
                );
              })}
            </DiscordActionRow>
          ))}
        </div>
      </DiscordMessage>
    </DiscordMessages>
  );
}
