import React from "react";
import {
  DiscordCustomEmoji,
  DiscordTime,
  DiscordMention,
  DiscordBold,
  DiscordItalic, 
  DiscordUnderlined,
  DiscordSubscript,
  DiscordCode,
  DiscordSpoiler,
  DiscordQuote,
  DiscordLink
} from "@skyra/discord-components-react";

// Define a type for component generator functions
type ComponentGenerator = (match: RegExpExecArray) => React.ReactNode;

// Define a parser rule with regex and component generator
interface ParserRule {
  regex: RegExp;
  generator: ComponentGenerator;
}

// Collection of parser rules
const parserRules: ParserRule[] = [
  // Custom emoji rule
  {
    regex: /<:([^:]+):(\d+)>/g,
    generator: (match) => (
      <DiscordCustomEmoji
        key={`emoji-${match[2]}-${match.index}`}
        name={match[1]}
        url={`https://cdn.discordapp.com/emojis/${match[2]}.webp?size=48`}
      />
    ),
  },
  // User mention rule
  {
    regex: /<@?(\d+)>/g,
    generator: (match) => (
      <DiscordMention
        key={`mention-user-${match[1]}-${match.index}`}
        type="user"
      >
        {match[1]}
      </DiscordMention>
    ),
  },
  // Role mention rule
  {
    regex: /<@&(\d+)>/g,
    generator: (match) => (
      <DiscordMention
        key={`mention-role-${match[1]}-${match.index}`}
        type="role"
      >
        {match[1]}
      </DiscordMention>
    ),
  },
  // Channel mention rule
  {
    regex: /<#(\d+)>/g,
    generator: (match) => (
      <DiscordMention
        key={`mention-channel-${match[1]}-${match.index}`}
        type="channel"
      >
        {match[1]}
      </DiscordMention>
    ),
  },
  // Timestamp rule
  {
    regex: /<t:(\d+)(?::([tTdDfFR]))?>/g,
    generator: (match) => {
      const timestamp = parseInt(match[1], 10);
      const format = match[2] || "f";
      const date = new Date(timestamp * 1000); // Discord timestamps are in seconds, JS uses milliseconds

      let formattedTime = "";
      switch (format) {
        case "t": // Short Time (e.g. 2:30 PM)
          formattedTime = date.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "numeric",
          });
          break;
        case "T": // Long Time (e.g. 2:30:20 PM)
          formattedTime = date.toLocaleTimeString();
          break;
        case "d": // Short Date (e.g. 01/01/2022)
          formattedTime = date.toLocaleDateString();
          break;
        case "D": // Long Date (e.g. January 1, 2022)
          formattedTime = date.toLocaleDateString(undefined, {
            dateStyle: "long",
          });
          break;
        case "f": // Short Date/Time (e.g. January 1, 2022 2:30 PM)
          formattedTime =
            date.toLocaleDateString(undefined, { dateStyle: "long" }) +
            " " +
            date.toLocaleTimeString(undefined, {
              hour: "numeric",
              minute: "numeric",
            });
          break;
        case "F": // Long Date/Time (e.g. Monday, January 1, 2022 2:30 PM)
          formattedTime =
            date.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }) +
            " " +
            date.toLocaleTimeString(undefined, {
              hour: "numeric",
              minute: "numeric",
            });
          break;
        case "R": // Relative Time (e.g. 2 hours ago)
          const now = new Date();
          const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // diff in seconds

          if (diff < 60) formattedTime = `${diff} seconds ago`;
          else if (diff < 3600)
            formattedTime = `${Math.floor(diff / 60)} minutes ago`;
          else if (diff < 86400)
            formattedTime = `${Math.floor(diff / 3600)} hours ago`;
          else if (diff < 2592000)
            formattedTime = `${Math.floor(diff / 86400)} days ago`;
          else if (diff < 31536000)
            formattedTime = `${Math.floor(diff / 2592000)} months ago`;
          else formattedTime = `${Math.floor(diff / 31536000)} years ago`;
          break;
        default:
          formattedTime = date.toLocaleString();
      }

      return (
        <DiscordTime key={`time-${timestamp}-${match.index}`}>
          {formattedTime}
        </DiscordTime>
      );
    },
  },
  // Bold text rule
  
  // Add more rules here as needed
];

/**
 * Parse text and replace Discord-specific patterns with React components
 * @param text Input text with Discord markdown/formatting
 * @returns An array of text fragments and React components
 */
export const parseText = (text: string | React.ReactNode): React.ReactNode => {
  if (!text) return text;

  let parts: React.ReactNode[] = [text];

  // Apply each rule sequentially
  parserRules.forEach((rule) => {
    parts = applyParserRule(parts, rule);
  });

  return parts;
};

/**
 * Apply a single parser rule to an array of text fragments
 */
const applyParserRule = (
  parts: React.ReactNode[],
  rule: ParserRule
): React.ReactNode[] => {
  const result: React.ReactNode[] = [];

  for (const part of parts) {
    // Only process string parts
    if (typeof part !== "string") {
      result.push(part);
      continue;
    }

    const text = part;
    const textParts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    // Reset regex state
    rule.regex.lastIndex = 0;

    while ((match = rule.regex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        textParts.push(text.substring(lastIndex, match.index));
      }

      // Add the component for this match
      textParts.push(rule.generator(match));

      lastIndex = match.index + match[0].length;
    }

    // Add any remaining text
    if (lastIndex < text.length) {
      textParts.push(text.substring(lastIndex));
    }

    // Add all parts from this text fragment
    result.push(...(textParts.length ? textParts : [text]));
  }

  return result;
};

/**
 * Legacy function for compatibility - only parses emojis
 */
export const parseCustomEmojis = (text: string): React.ReactNode => {
  if (!text) return text;

  const emojiRule = parserRules.find((rule) =>
    rule.regex.toString().includes("([^:]+):(\\d+)")
  );

  if (!emojiRule) {
    // Fallback to simple text if rule not found
    return text;
  }

  // Reset the regex state
  emojiRule.regex.lastIndex = 0;

  // Apply only the emoji rule
  return applyParserRule([text], emojiRule);
};

/**
 * Add a custom parser rule
 * @param regex Regular expression to match
 * @param generator Function to generate React component from match
 */
export const addParserRule = (
  regex: RegExp,
  generator: ComponentGenerator
): void => {
  parserRules.push({ regex, generator });
};
