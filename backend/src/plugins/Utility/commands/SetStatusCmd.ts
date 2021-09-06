import { utilityCmd } from "../types";
import { commandTypeHelpers as ct } from "../../../commandTypes";
import { sendErrorMessage, sendSuccessMessage } from "src/pluginUtils";

export const SetStatusCmd = utilityCmd({
  trigger: ["status", "setstatus", "set-status"],
  description: "Set the bot's activity status.",
  usage: "!status [--status online,idle,dnd,invisible] [--type playing,watching,listening] <message>",
  permission: "can_status",

  signature: {
    activity: ct.string({ catchAll: true, required: true }),
    status: ct.string({ option: true }),
    type: ct.string({ option: true }),
  },

  async run({ message, pluginData, args }) {
    const status: any = args.status || "online";
    const type: any = args.type || "playing";

    if(
      args.type &&
      type !== "playing" ||
      type !== "watching" ||
      type !== "listening" 
    ) {
      sendErrorMessage(
        pluginData,
        message.channel,
        `\`--type\` must be **playing**, **watching** or **listening**`
      )

      return;
    }

    pluginData.client.user!.setPresence({ activities: [{ 
      name: args.activity,
      type: type.toUpperCase()
    }], status });

    const emojis = {
      online: "<:online:884440015084585020>",
      idle: "<:away:884440014711324684>",
      dnd: "<:dnd:884440015101378560>",
      invisible: "<:invisible:884440015172685934>"
    }

    const types = {
      playing: `Playing`,
      watching: `Watching`,
      listening: `Listening to`
    }

    sendSuccessMessage(
      pluginData, 
      message.channel, 
      `Set ${pluginData.client.user!.username}'s status to **${emojis[status]} ${types[type]} ${args.activity}**`
    );
  },
});
