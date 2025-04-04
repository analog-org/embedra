import React from "react";
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
import { ColorPicker } from "./ui/color-picker";
import { DateTimePicker } from "./ui/date-time-picker";
import { useStore } from '@nanostores/react';
import { embedsStore, addEmbed, removeEmbed, updateEmbed, addField, updateField, removeField, moveEmbed } from "../store/embedStore";
import type { APIEmbed } from 'discord-api-types/v10'; // Use imported types
import { DatePicker } from "./ui/date-picker";

export function EmbedForm() {
  const embeds = useStore(embedsStore);

  const handleColorValue = (value: { hex: string } | string) => {
    try {
      const hex = typeof value === 'object' ? value.hex : value;
      return parseInt(hex.replace("#", ""), 16);
    } catch (e) {
      console.error("Invalid color format", e);
      return 0x0099ff; // Default color on error
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
        {embeds.map((embed: APIEmbed, embedIndex: number) => (
          <Accordion type="single" collapsible className="w-full" key={embedIndex} defaultValue="embed">
            <AccordionItem value="embed">
              <Card className="relative">
                <CardHeader className="flex flex-row items-center justify-between border-b-0 pb-0">
                  <AccordionTrigger className="flex-1 flex items-center justify-between py-0">
                    <CardTitle>Embed {embedIndex + 1}</CardTitle>
                  </AccordionTrigger>
                  <div className="flex space-x-2 ml-4">
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
                <AccordionContent>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="general">
                        <AccordionTrigger>General</AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <div className="grid gap-4"></div>
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
                            <div className="grid gap-2">
                              <Label htmlFor={`timestamp-${embedIndex}`}>
                                Timestamp
                              </Label>
                              <DatePicker
                                date={embed.timestamp ? new Date(embed.timestamp) : undefined}
                                
                                setDate={(date) => {
                                  updateEmbed(
                                    embedIndex,
                                    "timestamp",
                                    // this date should show up as mm/dd/yyyy 
                                    date ? date?.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : undefined
                                  );
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
                                  updateEmbed(embedIndex, "footer", {
                                    text: e.target.value,
                                    icon_url: embed.footer?.icon_url || ""
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
                            {embed.fields?.map((field, fieldIndex) => (
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

                                      <div className="grid gap-2">
                                        <div className="flex items-center gap-2">
                                          <input
                                            type="checkbox"
                                            id={`field-inline-${embedIndex}-${fieldIndex}`}
                                            name={`field-inline-${embedIndex}-${fieldIndex}`}
                                            checked={field.inline || false}
                                            onChange={(e) =>
                                              updateField(
                                                embedIndex,
                                                fieldIndex,
                                                "inline",
                                                e.target.checked
                                              )
                                            }
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

                    <div className="flex justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        {calculateCharCount(embed)} / 6000 characters
                      </div>
                    </div>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>
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
          <p className="text-sm text-yellow-500">Maximum of 10 embeds reached</p>
        )}
      </div>
    </div>
  );

  function calculateCharCount(embed: APIEmbed): number {
    let count = 0;
    if (embed.title) count += embed.title.length;
    if (embed.description) count += embed.description.length;
    if (embed.footer?.text) count += embed.footer.text.length;
    if (embed.author?.name) count += embed.author.name.length;

    embed.fields?.forEach((field) => {
      if (field.name) count += field.name.length;
      if (field.value) count += field.value.length;
    });

    embed.fields?.forEach((field) => {
      if (field.name) count += field.name.length;
      if (field.value) count += field.value.length;
    });

    return count;
  }
}
