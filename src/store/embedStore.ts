import { atom } from 'nanostores';
import type { APIEmbed } from 'discord-api-types/v10';

// Initial embed state
const initialEmbed: APIEmbed = {
  title: "",
  description: "",
  color: 0x0F52BA, // Sapphire blue color from the example
  fields: [],
  timestamp: new Date().toISOString() // Initialize with current timestamp
};

// Create the store
export const embedsStore = atom<APIEmbed[]>([initialEmbed]);

// Store actions
export function addEmbed() {
  embedsStore.set([...embedsStore.get(), { ...initialEmbed, timestamp: new Date().toISOString() }]);
}

export function removeEmbed(index: number) {
  const newEmbeds = [...embedsStore.get()];
  newEmbeds.splice(index, 1);
  embedsStore.set(newEmbeds);
}

export function updateEmbed(index: number, field: string, value: any) {
  const newEmbeds = [...embedsStore.get()];
  newEmbeds[index] = { ...newEmbeds[index], [field]: value };
  embedsStore.set(newEmbeds);
}

export function addField(embedIndex: number) {
  const newEmbeds = [...embedsStore.get()];
  if (!newEmbeds[embedIndex].fields) {
    newEmbeds[embedIndex].fields = [];
  }
  newEmbeds[embedIndex].fields?.push({ name: "", value: "", inline: false });
  embedsStore.set(newEmbeds);
}

export function updateField(
  embedIndex: number,
  fieldIndex: number,
  field: string,
  value: any
) {
  const newEmbeds = [...embedsStore.get()];
  if (
    newEmbeds[embedIndex].fields &&
    newEmbeds[embedIndex].fields?.[fieldIndex]
  ) {
    newEmbeds[embedIndex].fields![fieldIndex] = {
      ...newEmbeds[embedIndex].fields![fieldIndex],
      [field]: value,
    };
  }
  embedsStore.set(newEmbeds);
}

export function removeField(embedIndex: number, fieldIndex: number) {
  const newEmbeds = [...embedsStore.get()];
  if (newEmbeds[embedIndex].fields) {
    newEmbeds[embedIndex].fields!.splice(fieldIndex, 1);
  }
  embedsStore.set(newEmbeds);
}

export function moveEmbed(index: number, direction: "up" | "down") {
  if (
    (direction === "up" && index === 0) ||
    (direction === "down" && index === embedsStore.get().length - 1)
  ) {
    return;
  }

  const newEmbeds = [...embedsStore.get()];
  const targetIndex = direction === "up" ? index - 1 : index + 1;
  const temp = newEmbeds[targetIndex];
  newEmbeds[targetIndex] = newEmbeds[index];
  newEmbeds[index] = temp;
  embedsStore.set(newEmbeds);
}
