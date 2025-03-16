import { atom } from 'nanostores';
import type { 
  APIMessage, 
  APIEmbed, 
  APIAttachment,
  APIMessageComponent,
  APIActionRowComponent,
  APIButtonComponent,
  APIMessageActionRowComponent
} from 'discord-api-types/v10';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';

// Initial message state
export const initialMessage: Partial<APIMessage> = {
  content: "",
  embeds: [{
    title: "Test",
    description: "This is an example embed",
    color: 0x0F52BA,
    fields: [{
      name: "Field 1",
      value: "Value 1",
      inline: false
    }],
    timestamp: new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
    footer: {
      text: "Example footer"
    }
  }],
  attachments: [],
  components: [{
    type: ComponentType.ActionRow,
    components: [{
      type: ComponentType.Button,
      style: ButtonStyle.Primary,
      label: "Click me!",
      custom_id: "example_button"
    }] as APIMessageActionRowComponent[]
  }]
};

// Create the store
export const messageStore = atom<Partial<APIMessage>>(initialMessage);

// Store actions for message content
export function updateMessageContent(content: string) {
  messageStore.set({ ...messageStore.get(), content });
}

// Store actions for embeds
export function addEmbed() {
  const message = messageStore.get();
  const embeds = [...(message.embeds || [])];
  if (embeds.length >= 10) return;

  embeds.push({ ...initialMessage.embeds![0] });
  messageStore.set({ ...message, embeds });
}

export function removeEmbed(index: number) {
  const message = messageStore.get();
  const embeds = [...(message.embeds || [])];
  embeds.splice(index, 1);
  messageStore.set({ ...message, embeds });
}

export function updateEmbed(index: number, field: keyof APIEmbed, value: any) {
  const message = messageStore.get();
  const embeds = [...(message.embeds || [])];
  embeds[index] = { ...embeds[index], [field]: value };
  messageStore.set({ ...message, embeds });
}

export function moveEmbed(index: number, direction: "up" | "down") {
  const message = messageStore.get();
  const embeds = [...(message.embeds || [])];
  
  if (
    (direction === "up" && index === 0) ||
    (direction === "down" && index === embeds.length - 1)
  ) {
    return;
  }

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  const temp = embeds[targetIndex];
  embeds[targetIndex] = embeds[index];
  embeds[index] = temp;
  
  messageStore.set({ ...message, embeds });
}

// Store actions for embed fields
export function addField(embedIndex: number) {
  const message = messageStore.get();
  const embeds = [...(message.embeds || [])];
  if (!embeds[embedIndex].fields) {
    embeds[embedIndex].fields = [];
  }
  embeds[embedIndex].fields?.push({ name: "", value: "", inline: false });
  messageStore.set({ ...message, embeds });
}

export function updateField(
  embedIndex: number,
  fieldIndex: number,
  field: string,
  value: any
) {
  const message = messageStore.get();
  const embeds = [...(message.embeds || [])];
  if (embeds[embedIndex].fields?.[fieldIndex]) {
    embeds[embedIndex].fields![fieldIndex] = {
      ...embeds[embedIndex].fields![fieldIndex],
      [field]: value,
    };
  }
  messageStore.set({ ...message, embeds });
}

export function removeField(embedIndex: number, fieldIndex: number) {
  const message = messageStore.get();
  const embeds = [...(message.embeds || [])];
  if (embeds[embedIndex].fields) {
    embeds[embedIndex].fields!.splice(fieldIndex, 1);
  }
  messageStore.set({ ...message, embeds });
}

// Store actions for attachments
export function addAttachment(attachment: APIAttachment) {
  const message = messageStore.get();
  const attachments = [...(message.attachments || [])];
  attachments.push(attachment);
  messageStore.set({ ...message, attachments });
}

export function removeAttachment(index: number) {
  const message = messageStore.get();
  const attachments = [...(message.attachments || [])];
  attachments.splice(index, 1);
  messageStore.set({ ...message, attachments });
}

// Store actions for components (buttons)
export function addActionRow() {
  const message = messageStore.get();
  const components = [...(message.components || [])];
  if (components.length >= 5) return; // Discord limit

  components.push({
    type: ComponentType.ActionRow,
    components: []
  } as APIActionRowComponent<APIMessageActionRowComponent>);
  
  messageStore.set({ ...message, components });
}

export function addButton(rowIndex: number) {
  const message = messageStore.get();
  const components = [...(message.components || [])] as APIActionRowComponent<APIMessageActionRowComponent>[];
  
  if (!components[rowIndex]) return;
  if (components[rowIndex].components.length >= 5) return; // Discord limit

  const newButton: APIButtonComponent = {
    type: ComponentType.Button,
    style: ButtonStyle.Primary,
    label: "New Button",
    custom_id: `button_${Date.now()}`
  };

  components[rowIndex].components.push(newButton);
  messageStore.set({ ...message, components });
}

export function updateButton(
  rowIndex: number,
  buttonIndex: number,
  field: keyof APIButtonComponent,
  value: any
) {
  const message = messageStore.get();
  const components = [...(message.components || [])] as APIActionRowComponent<APIMessageActionRowComponent>[];
  
  if (!components[rowIndex]?.components[buttonIndex]) return;

  const button = components[rowIndex].components[buttonIndex] as APIButtonComponent;
  components[rowIndex].components[buttonIndex] = { ...button, [field]: value };

  messageStore.set({ ...message, components });
}

export function removeButton(rowIndex: number, buttonIndex: number) {
  const message = messageStore.get();
  const components = [...(message.components || [])] as APIActionRowComponent<APIMessageActionRowComponent>[];
  
  if (!components[rowIndex]?.components[buttonIndex]) return;

  components[rowIndex].components.splice(buttonIndex, 1);
  
  // Remove empty action rows
  if (components[rowIndex].components.length === 0) {
    components.splice(rowIndex, 1);
  }

  messageStore.set({ ...message, components });
}

// Utility function to calculate total character count
export function calculateMessageLength(message: Partial<APIMessage>): number {
  let count = 0;
  
  // Content
  if (message.content) count += message.content.length;
  
  // Embeds
  message.embeds?.forEach(embed => {
    if (embed.title) count += embed.title.length;
    if (embed.description) count += embed.description.length;
    if (embed.footer?.text) count += embed.footer.text.length;
    if (embed.author?.name) count += embed.author.name.length;
    
    embed.fields?.forEach(field => {
      if (field.name) count += field.name.length;
      if (field.value) count += field.value.length;
    });
  });

  return count;
}
