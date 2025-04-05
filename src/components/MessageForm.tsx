import React from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { PlusCircle, Trash2, ChevronDown, ChevronUp, ImagePlus } from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { ColorPicker } from "./ui/color-picker";
import { DatePicker } from "./ui/date-picker";
import { useStore } from '@nanostores/react';
import { 
  messageStore,
  addEmbed,
  removeEmbed,
  updateEmbed,
  addField,
  updateField,
  removeField,
  moveEmbed,
  updateMessageContent,
  addAttachment,
  removeAttachment,
  addActionRow,
  addButton,
  updateButton,
  removeButton,
  calculateMessageLength
} from "../store/messageStore";
import type { 
  APIEmbed,
  APIAttachment, 
  APIButtonComponentWithCustomId,
  APIMessageComponent
} from 'discord-api-types/v10';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { MarkdownTextarea } from "./ui/markdown-textarea";

export function MessageForm() {
  const message = useStore(messageStore);

  const handleColorValue = (value: { hex: string } | string) => {
    try {
      const hex = typeof value === 'object' ? value.hex : value;
      return parseInt(hex.replace("#", ""), 16);
    } catch (e) {
      console.error("Invalid color format", e);
      return 0x0099ff;
    }
  };

  const getHexColor = (colorInt?: number) => {
    if (colorInt === undefined) return "#0099ff";
    return `#${colorInt.toString(16).padStart(6, "0")}`;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    for (const file of files) {
      const url = URL.createObjectURL(file);
      
      const attachment: APIAttachment = {
        id: Date.now().toString(),
        filename: file.name,
        size: file.size,
        url,
        proxy_url: url,
        content_type: file.type,
      };

      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          attachment.width = img.width;
          attachment.height = img.height;
          addAttachment(attachment);
        };
        img.src = url;
      } else {
        addAttachment(attachment);
      }
    }
  };

  const isButtonComponent = (component: APIMessageComponent): component is APIButtonComponentWithCustomId => {
    return component.type === ComponentType.Button;
  };

  const renderEmbedFields = (embed: APIEmbed, embedIndex: number) => {
    return embed.fields?.map((field, fieldIndex) => (
      <Accordion
        type="single"
        collapsible
        className="w-full"
        key={fieldIndex}
        defaultValue="field"
      >
        <AccordionItem value="field">
          <AccordionTrigger className="px-4 py-2 hover:no-underline hover:bg-accent rounded-lg group">
            <div className="flex-1">Field {fieldIndex + 1}</div>
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  removeField(embedIndex, fieldIndex);
                }}
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pt-2 pb-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor={`field-name-${embedIndex}-${fieldIndex}`}>Name</Label>
                <Input
                  id={`field-name-${embedIndex}-${fieldIndex}`}
                  value={field.name}
                  onChange={(e) => updateField(embedIndex, fieldIndex, "name", e.target.value)}
                  maxLength={256}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor={`field-value-${embedIndex}-${fieldIndex}`}>Value</Label>
                <Textarea
                  id={`field-value-${embedIndex}-${fieldIndex}`}
                  value={field.value}
                  onChange={(e) => updateField(embedIndex, fieldIndex, "value", e.target.value)}
                  maxLength={1024}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`field-inline-${embedIndex}-${fieldIndex}`}
                    checked={field.inline || false}
                    onChange={(e) => updateField(embedIndex, fieldIndex, "inline", e.target.checked)}
                    aria-label="Make field inline"
                    className="h-4 w-4 rounded border-gray-300 focus:ring-primary"
                  />
                  <Label
                    htmlFor={`field-inline-${embedIndex}-${fieldIndex}`}
                    className="text-sm font-medium leading-none"
                  >
                    Display field inline with others
                  </Label>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ));
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Discord Message Builder</h1>

      <div className="space-y-6">
        {/* Message Content Section */}
        <Card>
          <CardHeader>
            <CardTitle>Message Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <MarkdownTextarea
                  id="content"
                  value={message.content || ""}
                  onChange={(e) => updateMessageContent(e.target.value)}
                  maxLength={2000}
                  placeholder="Type your message content here..."
                  className="min-h-[100px]"
                  aria-label="Message content"
                />
                <div className="text-sm text-muted-foreground text-right">
                  {message.content?.length || 0} / 2000
                </div>
              </div>

              {/* File Upload Section */}
              <div className="grid gap-2">
                <Label>Attachments</Label>
                <div className="flex flex-col gap-4">
                  {message.attachments?.map((attachment, index) => (
                    <div key={attachment.id} className="flex items-center gap-4">
                      <div className="flex-1 truncate">
                        {attachment.filename}
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeAttachment(index)}
                        aria-label={`Remove ${attachment.filename}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                      className="flex items-center gap-2"
                      aria-label="Add attachment"
                    >
                      <ImagePlus className="h-4 w-4" /> Add Attachment
                    </Button>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*,video/*,application/*"
                      aria-label="Upload attachments"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Embeds Section */}
        {message.embeds?.map((embed, embedIndex) => (
          <Card key={embedIndex} className="relative">
            <CardHeader className="flex flex-row items-center justify-between border-b-0 pb-0">
              <CardTitle>Embed {embedIndex + 1}</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveEmbed(embedIndex, "up")}
                  disabled={embedIndex === 0}
                  aria-label="Move embed up"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveEmbed(embedIndex, "down")}
                  disabled={embedIndex === (message.embeds?.length || 0) - 1}
                  aria-label="Move embed down"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeEmbed(embedIndex)}
                  disabled={(message.embeds?.length || 0) <= 1}
                  aria-label="Remove embed"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="general">
                  <AccordionTrigger>General</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`title-${embedIndex}`}>Title</Label>
                      <Input
                        id={`title-${embedIndex}`}
                        value={embed.title || ""}
                        onChange={(e) => updateEmbed(embedIndex, "title", e.target.value)}
                        maxLength={256}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`description-${embedIndex}`}>Description</Label>
                      <Textarea
                        id={`description-${embedIndex}`}
                        value={embed.description || ""}
                        onChange={(e) => updateEmbed(embedIndex, "description", e.target.value)}
                        maxLength={4096}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor={`url-${embedIndex}`}>URL</Label>
                        <Input
                          id={`url-${embedIndex}`}
                          value={embed.url || ""}
                          onChange={(e) => updateEmbed(embedIndex, "url", e.target.value)}
                          placeholder="https://example.com"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Color</Label>
                        <ColorPicker
                          value={getHexColor(embed.color)}
                          onChange={(value: any) => {
                            const colorInt = handleColorValue(value);
                            updateEmbed(embedIndex, "color", colorInt);
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor={`timestamp-${embedIndex}`}>Timestamp</Label>
                      <DatePicker
                        date={embed.timestamp ? new Date(embed.timestamp) : undefined}
                        setDate={(date) => {
                          updateEmbed(
                            embedIndex,
                            "timestamp",
                            date ? date?.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : undefined
                          );
                        }}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="author">
                  <AccordionTrigger>Author</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor={`author-name-${embedIndex}`}>Author Name</Label>
                        <Input
                          id={`author-name-${embedIndex}`}
                          value={embed.author?.name || ""}
                          onChange={(e) => {
                            const author = embed.author || {};
                            updateEmbed(embedIndex, "author", {
                              ...author,
                              name: e.target.value,
                            });
                          }}
                          maxLength={256}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`author-url-${embedIndex}`}>Author URL</Label>
                        <Input
                          id={`author-url-${embedIndex}`}
                          value={embed.author?.url || ""}
                          onChange={(e) => {
                            const author = embed.author || { name: "" };
                            updateEmbed(embedIndex, "author", {
                              ...author,
                              url: e.target.value,
                            });
                          }}
                          placeholder="https://example.com"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`author-icon-${embedIndex}`}>Author Icon URL</Label>
                        <Input
                          id={`author-icon-${embedIndex}`}
                          value={embed.author?.icon_url || ""}
                          onChange={(e) => {
                            const author = embed.author || { name: "" };
                            updateEmbed(embedIndex, "author", {
                              ...author,
                              icon_url: e.target.value,
                            });
                          }}
                          placeholder="https://example.com/icon.png"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="image">
                  <AccordionTrigger>Image</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor={`image-url-${embedIndex}`}>Image URL</Label>
                        <Input
                          id={`image-url-${embedIndex}`}
                          value={embed.image?.url || ""}
                          onChange={(e) => {
                            updateEmbed(embedIndex, "image", {
                              url: e.target.value,
                            });
                          }}
                          placeholder="https://example.com/image.png"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`thumbnail-url-${embedIndex}`}>Thumbnail URL</Label>
                        <Input
                          id={`thumbnail-url-${embedIndex}`}
                          value={embed.thumbnail?.url || ""}
                          onChange={(e) => {
                            updateEmbed(embedIndex, "thumbnail", {
                              url: e.target.value,
                            });
                          }}
                          placeholder="https://example.com/thumbnail.png"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="footer">
                  <AccordionTrigger>Footer</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor={`footer-text-${embedIndex}`}>Footer Text</Label>
                        <Input
                          id={`footer-text-${embedIndex}`}
                          value={embed.footer?.text || ""}
                          onChange={(e) => {
                            updateEmbed(embedIndex, "footer", {
                              text: e.target.value,
                              icon_url: embed.footer?.icon_url || ""
                            });
                          }}
                          maxLength={2048}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`footer-icon-${embedIndex}`}>Footer Icon URL</Label>
                        <Input
                          id={`footer-icon-${embedIndex}`}
                          value={embed.footer?.icon_url || ""}
                          onChange={(e) => {
                            updateEmbed(embedIndex, "footer", {
                              text: embed.footer?.text || "",
                              icon_url: e.target.value
                            });
                          }}
                          placeholder="https://example.com/icon.png"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="fields">
                  <AccordionTrigger>Fields</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div className="grid gap-4">
                      {renderEmbedFields(embed, embedIndex)}
                      <Button
                        variant="outline"
                        onClick={() => addField(embedIndex)}
                        disabled={(embed.fields?.length || 0) >= 25}
                        className="flex items-center gap-2"
                      >
                        <PlusCircle className="h-4 w-4" /> Add Field
                      </Button>
                      {(embed.fields?.length || 0) >= 25 && (
                        <p className="text-sm text-yellow-500">Maximum of 25 fields reached</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}

        <Button
          variant="outline"
          onClick={addEmbed}
          disabled={(message.embeds?.length || 0) >= 10}
          className="flex items-center gap-2 w-full"
          aria-label="Add embed"
        >
          <PlusCircle className="h-4 w-4" /> Add Embed
        </Button>

        {(message.embeds?.length || 0) >= 10 && (
          <p className="text-sm text-yellow-500">Maximum of 10 embeds reached</p>
        )}

        {/* Components (Buttons) Section */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {message.components?.map((row, rowIndex) => (
                <div key={rowIndex} className="flex flex-wrap gap-2 p-4 border rounded-lg">
                  {row.components.map((component, buttonIndex) => {
                    if (isButtonComponent(component)) {
                      const buttonLabel = component.custom_id || "Button";
                      return (
                        <div key={buttonIndex} className="flex items-center gap-2">
                          <Button
                            variant={
                              component.style === ButtonStyle.Primary ? "default" :
                              component.style === ButtonStyle.Secondary ? "secondary" :
                              component.style === ButtonStyle.Danger ? "destructive" :
                              "link"
                            }
                            aria-label={buttonLabel}
                          >
                            {buttonLabel}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeButton(rowIndex, buttonIndex)}
                            aria-label="Remove button"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    }
                    return null;
                  })}
                  {row.components.length < 5 && (
                    <Button
                      variant="outline"
                      onClick={() => addButton(rowIndex)}
                      className="flex items-center gap-2"
                      aria-label="Add button"
                    >
                      <PlusCircle className="h-4 w-4" /> Add Button
                    </Button>
                  )}
                </div>
              ))}

              {(!message.components || message.components.length < 5) && (
                <Button
                  variant="outline"
                  onClick={addActionRow}
                  className="flex items-center gap-2 w-full"
                  aria-label="Add button row"
                >
                  <PlusCircle className="h-4 w-4" /> Add Button Row
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Character Count */}
        <div className="text-sm text-muted-foreground" style={{fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"}}>
          {calculateMessageLength(message)} / 6000 total characters
        </div>
      </div>
    </div>
  );
}
