import { utilityCmd } from "../types";
import { commandTypeHelpers as ct } from "../../../commandTypes";
import { sendSuccessMessage } from "src/pluginUtils";

export const SetStatusCmd = utilityCmd({
  trigger: ["status", "setstatus", "set-status"],
  description: "Set the bot's activity status.",
  usage: "!status <message> [--status=online,idle,dnd,invisible]",
  permission: "can_status",

  signature: {
    activity: ct.string({ catchAll: true, required: true }),
    status: ct.string({ option: true }),
  },

  async run({ message, pluginData, args }) {
    const status = args.status || "online";

    message.client.user.setPresence({ activities: [{ 
      name: args.activity
    }], status });

    const emojis = {
      online: "<:online:884440015084585020>",
      idle: "<:away:884440014711324684>",
      dnd: "<:dnd:884440015101378560>",
      invisible: "<:invisible:884440015172685934>"
    }

    sendSuccessMessage(
      pluginData, 
      message.channel, 
      `Set ${message.client.user.username}'s status to **${emojis[status]} ${args.activity}**`
    );
  },
});
