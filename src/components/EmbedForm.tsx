"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { PlusCircle, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "./ui/accordion";



// Discord embed type definitions
interface EmbedFooter {
  text: string;
  icon_url?: string;
}

interface EmbedImage {
  url: string;
}

interface EmbedThumbnail {
  url: string;
}

interface EmbedAuthor {
  name: string;
  url?: string;
  icon_url?: string;
}

interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface DiscordEmbed {
  title?: string;
  description?: string;
  url?: string;
  color?: number;
  timestamp?: string;
  footer?: EmbedFooter;
  image?: EmbedImage;
  thumbnail?: EmbedThumbnail;
  author?: EmbedAuthor;
  fields?: EmbedField[];
}

export function EmbedForm() {
  const [embeds, setEmbeds] = useState<DiscordEmbed[]>([
    {
      title: "",
      description: "",
      color: 0x0099ff,
      fields: [],
    },
  ]);

  const addEmbed = () => {
    setEmbeds([
      ...embeds,
      {
        title: "",
        description: "",
        color: 0x0099ff,
        fields: [],
      },
    ]);
  };

  const removeEmbed = (index: number) => {
    const newEmbeds = [...embeds];
    newEmbeds.splice(index, 1);
    setEmbeds(newEmbeds);
  };

  const updateEmbed = (index: number, field: string, value: any) => {
    const newEmbeds = [...embeds];
    newEmbeds[index] = { ...newEmbeds[index], [field]: value };
    setEmbeds(newEmbeds);
  };

  const addField = (embedIndex: number) => {
    const newEmbeds = [...embeds];
    if (!newEmbeds[embedIndex].fields) {
      newEmbeds[embedIndex].fields = [];
    }
    newEmbeds[embedIndex].fields?.push({ name: "", value: "", inline: false });
    setEmbeds(newEmbeds);
  };

  const updateField = (
    embedIndex: number,
    fieldIndex: number,
    field: string,
    value: any
  ) => {
    const newEmbeds = [...embeds];
    if (
      newEmbeds[embedIndex].fields &&
      newEmbeds[embedIndex].fields?.[fieldIndex]
    ) {
      newEmbeds[embedIndex].fields![fieldIndex] = {
        ...newEmbeds[embedIndex].fields![fieldIndex],
        [field]: value,
      };
    }
    setEmbeds(newEmbeds);
  };

  const removeField = (embedIndex: number, fieldIndex: number) => {
    const newEmbeds = [...embeds];
    if (newEmbeds[embedIndex].fields) {
      newEmbeds[embedIndex].fields!.splice(fieldIndex, 1);
    }
    setEmbeds(newEmbeds);
  };

  const moveEmbed = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === embeds.length - 1)
    ) {
      return;
    }

    const newEmbeds = [...embeds];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = newEmbeds[targetIndex];
    newEmbeds[targetIndex] = newEmbeds[index];
    newEmbeds[index] = temp;
    setEmbeds(newEmbeds);
  };

  const handleColorChange = (index: number, value: any) => {
    // Convert hex color to integer
    try {
      const colorInt = parseInt(value.hex.replace("#", ""), 16);
      updateEmbed(index, "color", colorInt);
    } catch (e) {
      console.error("Invalid color format");
    }
  };

  const getHexColor = (colorInt?: number) => {
    if (colorInt === undefined) return "#0099ff";
    return `#${colorInt.toString(16).padStart(6, "0")}`;
  };

  return (
<div className="container mx-auto py-8">
  <h1 className="text-2xl font-bold mb-6">Discord Embed Builder</h1>

  <div className="space-y-6">
    {embeds.map((embed, embedIndex) => (
      <Card key={embedIndex} className="relative">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Embed {embedIndex + 1}</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => moveEmbed(embedIndex, "up")}
              disabled={embedIndex === 0}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => moveEmbed(embedIndex, "down")}
              disabled={embedIndex === embeds.length - 1}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => removeEmbed(embedIndex)}
              disabled={embeds.length <= 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="general">
              <AccordionTrigger>General</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`title-${embedIndex}`}>Title</Label>
                    <Input
                      id={`title-${embedIndex}`}
                      value={embed.title || ""}
                      onChange={(e) =>
                        updateEmbed(embedIndex, "title", e.target.value)
                      }
                      maxLength={256}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`description-${embedIndex}`}>
                      Description
                    </Label>
                    <Textarea
                      id={`description-${embedIndex}`}
                      value={embed.description || ""}
                      onChange={(e) =>
                        updateEmbed(embedIndex, "description", e.target.value)
                      }
                      maxLength={4096}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor={`url-${embedIndex}`}>URL</Label>
                      <Input
                        id={`url-${embedIndex}`}
                        value={embed.url || ""}
                        onChange={(e) =>
                          updateEmbed(embedIndex, "url", e.target.value)
                        }
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label>Color</Label>
                      <div className="flex gap-2 items-center">
                        <div
                          className="w-10 h-10 rounded border"
                          style={{
                            backgroundColor: getHexColor(embed.color),
                          }}
                        />
                        <Input
                          id={`color-${embedIndex}`}
                          type="color"
                          value={getHexColor(embed.color)}
                          onChange={(e) =>
                            handleColorChange(embedIndex, e.target.value)
                          } 
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`timestamp-${embedIndex}`}>
                      Timestamp
                    </Label>
                    <Input
                      id={`timestamp-${embedIndex}`}
                      type="datetime-local"
                      value={
                        embed.timestamp
                          ? new Date(embed.timestamp)
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      onChange={(e) => {
                        const date = e.target.value
                          ? new Date(e.target.value).toISOString()
                          : undefined;
                        updateEmbed(embedIndex, "timestamp", date);
                      }}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="author">
              <AccordionTrigger>Author</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`author-name-${embedIndex}`}>
                      Author Name
                    </Label>
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
                    <Label htmlFor={`author-url-${embedIndex}`}>
                      Author URL
                    </Label>
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
                    <Label htmlFor={`author-icon-${embedIndex}`}>
                      Author Icon URL
                    </Label>
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
                    <Label htmlFor={`image-url-${embedIndex}`}>
                      Image URL
                    </Label>
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
                    <Label htmlFor={`thumbnail-url-${embedIndex}`}>
                      Thumbnail URL
                    </Label>
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
                    <Label htmlFor={`footer-text-${embedIndex}`}>
                      Footer Text
                    </Label>
                    <Input
                      id={`footer-text-${embedIndex}`}
                      value={embed.footer?.text || ""}
                      onChange={(e) => {
                        const footer = embed.footer || {};
                        updateEmbed(embedIndex, "footer", {
                          ...footer,
                          text: e.target.value,
                        });
                      }}
                      maxLength={2048}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={`footer-icon-${embedIndex}`}>
                      Footer Icon URL
                    </Label>
                    <Input
                      id={`footer-icon-${embedIndex}`}
                      value={embed.footer?.icon_url || ""}
                      onChange={(e) => {
                        const footer = embed.footer || { text: "" };
                        updateEmbed(embedIndex, "footer", {
                          ...footer,
                          icon_url: e.target.value,
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
                  {embed.fields?.map((field, fieldIndex) => (
                    <Card key={fieldIndex} className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">
                          Field {fieldIndex + 1}
                        </h4>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeField(embedIndex, fieldIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label
                            htmlFor={`field-name-${embedIndex}-${fieldIndex}`}
                          >
                            Name
                          </Label>
                          <Input
                            id={`field-name-${embedIndex}-${fieldIndex}`}
                            value={field.name}
                            onChange={(e) =>
                              updateField(
                                embedIndex,
                                fieldIndex,
                                "name",
                                e.target.value
                              )
                            }
                            maxLength={256}
                          />
                        </div>

                        <div className="grid gap-2">
                          <Label
                            htmlFor={`field-value-${embedIndex}-${fieldIndex}`}
                          >
                            Value
                          </Label>
                          <Textarea
                            id={`field-value-${embedIndex}-${fieldIndex}`}
                            value={field.value}
                            onChange={(e) =>
                              updateField(
                                embedIndex,
                                fieldIndex,
                                "value",
                                e.target.value
                              )
                            }
                            maxLength={1024}
                          />
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <input
                            title="Toggle inline field"
                            placeholder="Toggle inline field"
                            type="checkbox"
                            id={`field-inline-${embedIndex}-${fieldIndex}`}
                            checked={field.inline || false}
                            onChange={(e) =>
                              updateField(
                                embedIndex,
                                fieldIndex,
                                "inline",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label
                            htmlFor={`field-inline-${embedIndex}-${fieldIndex}`}
                          >
                            Inline
                          </Label>
                        </div>
                      </div>
                    </Card>
                  ))}

                  <Button
                    variant="outline"
                    onClick={() => addField(embedIndex)}
                    disabled={(embed.fields?.length || 0) >= 25}
                    className="flex items-center gap-2"
                  >
                    <PlusCircle className="h-4 w-4" /> Add Field
                  </Button>

                  {(embed.fields?.length || 0) >= 25 && (
                    <p className="text-sm text-yellow-500">
                      Maximum of 25 fields reached
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>

        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {calculateCharCount(embed)} / 6000 characters
          </div>
          <div className="flex space-x-2">
            <Button variant="default" onClick={() => exportEmbed(embed)}>
              Export JSON
            </Button>
          </div>
        </CardFooter>
      </Card>
    ))}

    <Button
      variant="outline"
      onClick={addEmbed}
      disabled={embeds.length >= 10}
      className="flex items-center gap-2 w-full"
    >
      <PlusCircle className="h-4 w-4" /> Add Embed
    </Button>

    {embeds.length >= 10 && (
      <p className="text-sm text-yellow-500">
        Maximum of 10 embeds reached
      </p>
    )}
  </div>

  <div className="mt-8">
    <Button variant="default" onClick={() => exportAllEmbeds(embeds)}>
      Export All Embeds
    </Button>
  </div>
</div>
  );
  // Helper functions
  function calculateCharCount(embed: DiscordEmbed): number {
    let count = 0;
    if (embed.title) count += embed.title.length;
    if (embed.description) count += embed.description.length;
    if (embed.footer?.text) count += embed.footer.text.length;
    if (embed.author?.name) count += embed.author.name.length;
  
    embed.fields?.forEach((field) => {
      if (field.name) count += field.name.length;
      if (field.value) count += field.value.length;
    });
  
    return count;
  }




  function exportEmbed(embed: DiscordEmbed) {
    const json = JSON.stringify(embed, null, 2);
    downloadJSON(json, `discord-embed-${Date.now()}.json`);
  }

  const exportAllEmbeds = (embeds: DiscordEmbed[]) => {
    const json = JSON.stringify({ embeds }, null, 2);
    downloadJSON(json, `discord-embeds-${Date.now()}.json`);
  };

  function downloadJSON(json: string, filename: string) {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

