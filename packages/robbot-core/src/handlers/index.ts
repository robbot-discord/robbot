import {
  Channel,
  Collection,
  Guild,
  GuildEmoji,
  GuildMember,
  Invite,
  Message,
  MessageReaction,
  Presence,
  Role,
  Snowflake,
  Speaking,
  TextChannel,
  User,
  VoiceState,
  PartialUser,
  PartialGuildMember,
  PartialMessage,
  PartialDMChannel,
  CloseEvent,
} from "discord.js"
import { RateLimitInfo } from "../types"
import { Logger } from "../logging/types"
import { RobBotClient } from "../client"
import { EventHandlers } from "./types"

export const createDefaultHandlers = (client: RobBotClient, logger: Logger): EventHandlers => {
  // per Events section https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelCreate
  const defaultEventHandlers: EventHandlers = {
    channelCreate: (channel: Channel) => {
      logger.debug(`Channel created: <${channel}>`)

      return { channel }
    },
    channelDelete: (channel: Channel) => {
      logger.debug(`Channel deleted: <${channel}>`)

      return { channel }
    },
    channelPinsUpdate: (channel: Channel, time: Date) => {
      logger.debug(`Channel's pins updated. Channel <${channel}>, at ${time}`)

      return { channel, time }
    },
    channelUpdate: (oldChannel: Channel, newChannel: Channel) => {
      logger.debug(`Channel updated from: <${oldChannel}> to <${newChannel}>`)

      return {
        oldChannel,
        newChannel,
      }
    },
    debug: (info: string) => {
      logger.debug(`Debug message received: <${info}>`)

      return { info }
    },
    emojiCreate: (emoji: GuildEmoji) => {
      logger.debug(`Emoji created: <${emoji}>`)

      return { emoji }
    },
    emojiDelete: (emoji: GuildEmoji) => {
      logger.debug(`Emoji deleted: <${emoji}>`)

      return { emoji }
    },
    emojiUpdate: (emoji: GuildEmoji) => {
      logger.debug(`Emoji updated: <${emoji}>`)

      return { emoji }
    },
    error: (error: Error) => {
      logger.error(`Error received: <${error}>`)

      return { error }
    },
    guildBanAdd: (guild: Guild, user: User | PartialUser) => {
      logger.debug(`Ban added for <${user}> in Guild <${guild}>`)

      return { guild, user }
    },
    guildBanRemove: (guild: Guild, user: User | PartialUser) => {
      logger.debug(`Ban removed for <${user}> in Guild <${guild}>`)

      return { guild, user }
    },
    guildCreate: (guild: Guild) => {
      logger.debug(`Guild created: <${guild}>`)

      return { guild }
    },
    guildDelete: (guild: Guild) => {
      logger.debug(`Guild deleted: <${guild}>`)

      return { guild }
    },
    guildIntegrationsUpdate: (guild: Guild) => {
      logger.debug(`Guild integrations updated for: <${guild}>`)

      return { guild }
    },
    guildMemberAdd: (member: GuildMember | PartialGuildMember) => {
      logger.debug(`Guild member added: <${member}>`)

      return { member }
    },
    guildMemberRemove: (member: GuildMember | PartialGuildMember) => {
      logger.debug(`Guild member removed: <${member}>`)

      return { member }
    },
    guildMembersChunk: (members: Collection<Snowflake, GuildMember | PartialGuildMember>, guild: Guild) => {
      logger.debug(`Guild member chunk received: <${members}>, for <${guild}>`)

      return { members, guild }
    },
    guildMemberSpeaking: (member: GuildMember | PartialGuildMember, speaking: Readonly<Speaking>) => {
      logger.debug(`Guild member speaking status change: <${member}> to <${speaking}>`)

      return { member, speaking }
    },
    guildMemberUpdate: (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember | PartialGuildMember) => {
      logger.debug(`Guild member updated. From: <${oldMember}>, to <${newMember}>`)

      return { oldMember, newMember }
    },
    guildUnavailable: (guild: Guild) => {
      logger.debug(`Guild unavailable: <${guild}>`)

      return { guild }
    },
    guildUpdate: (oldGuild: Guild, newGuild: Guild) => ({ oldGuild, newGuild }),
    invalidated: () => {
      logger.debug(`Received "invalidated" event`)

      return {}
    },
    inviteCreate: (invite: Invite) => {
      logger.debug(`Invite created: <${invite}>`)

      return { invite }
    },
    inviteDelete: (invite: Invite) => ({ invite }),
    message: (message: Message) => {
      logger.debug(`Message received: <${message}>`)

      return { message }
    },
    messageDelete: (message: Message | PartialMessage) => {
      logger.debug(`Message deleted: <${message}>`)

      return { message }
    },
    messageDeleteBulk: (messages: Collection<Snowflake, Message | PartialMessage>) => {
      logger.debug(`Messages bulk deleted: <${messages}>`)

      return { messages }
    },
    messageReactionAdd: (messageReaction: MessageReaction, user: User | PartialUser) => {
      logger.debug(`Message reaction added <${messageReaction}> by <${user}>`)

      return { messageReaction, user }
    },
    messageReactionRemove: (messageReaction: MessageReaction, user: User | PartialUser) => ({
      messageReaction,
      user,
    }),
    messageReactionRemoveAll: (message: Message | PartialMessage) => {
      logger.debug(`All reactions removed for: <${message}>`)

      return { message }
    },
    // TODO https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageReactionRemoveEmoji ?
    messageReactionRemoveEmoji: (reaction: MessageReaction) => {
      logger.debug(`Reaction removed: <${reaction}>`)

      return { reaction }
    },
    messageUpdate: (oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) => {
      logger.debug(`Message updated from <${oldMessage}> to <${newMessage}>`)

      return { oldMessage, newMessage }
    },
    presenceUpdate: (oldPresence: Presence | undefined, newPresence: Presence) => {
      logger.debug(`Presence updated from <${JSON.stringify(oldPresence)}> to <${JSON.stringify(newPresence)}>`)

      return { oldPresence, newPresence }
    },
    rateLimit: (rateLimitInfo: RateLimitInfo) => {
      logger.debug(`Received rateLimit event: <${rateLimitInfo}>`)

      return { rateLimitInfo }
    },
    ready: () => {
      logger.info(`Logged in as ${client.user?.tag}!`)

      const activityString = `last updated : ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}`

      client.user
        ?.setActivity(activityString)
        .catch((error) =>
          logger.error(
            `defaultEventHandlers.ready(): Error calling client.user.setActivity() with ${activityString} with error: ${error}`
          )
        )

      return {}
    },
    roleCreate: (role: Role) => {
      logger.debug(`Role created: <${role}>`)

      return { role }
    },
    roleDelete: (role: Role) => {
      logger.debug(`Role deleted: <${role}>`)

      return { role }
    },
    roleUpdate: (oldRole: Role, newRole: Role) => {
      logger.debug(`Role updated from <${oldRole}> to <${newRole}>`)

      return { oldRole, newRole }
    },
    shardDisconnect: (event: CloseEvent, id: number) => {
      logger.debug(`Disconnected from shard id <${id}> with event: <${event}>`)

      return { event, id }
    },
    shardError: (error: Error, shardID: number) => {
      logger.debug(`Error received for shard id <${shardID}>. Error: <${error}>`)

      return { error, shardID }
    },
    shardReady: (id: number, unavailableGuilds?: Set<string>) => {
      logger.debug(`Shard id <${id}> ready, unavailable guilds: <${unavailableGuilds}>`)

      return { id, unavailableGuilds }
    },
    shardReconnecting: (id: number) => {
      logger.debug(`Reconnecting to shard with id <${id}>`)

      return { id }
    },
    shardResume: (id: number, replayedEvents: number) => {
      logger.debug(`Resumed shard with id <${id}>, number of replayed events: <${replayedEvents}>`)

      return { id, replayedEvents }
    },
    typingStart: (channel: Channel | PartialDMChannel, user: User | PartialUser) => {
      logger.debug(`Typing started in <${channel}> by <${user}>`)

      return { channel, user }
    },
    userUpdate: (oldUser: User | PartialUser, newUser: User | PartialUser) => {
      logger.debug(`User updated from <${oldUser}> to <${newUser}>`)

      return { oldUser, newUser }
    },
    voiceStateUpdate: (oldState: VoiceState, newState: VoiceState) => {
      logger.debug(`Voice state updated from: <${oldState}> to <${newState}>`)

      return { oldState, newState }
    },
    warn: (info: string) => {
      logger.warn(`Warn message received: <${info}>`)

      return { info }
    },
    webhookUpdate: (channel: TextChannel) => {
      logger.debug(`Webhook updated: <${channel}>`)

      return { channel }
    },
    // TODO This are not documented...
    disconnect: () => ({}),
    guildMemberAvailable: () => ({}),
    // per Discord.Constants.Events ...
    //   raw: () => ({}),
    //   reconnecting: () => ({}),
    //   resumed: () => ({}),
    //   voiceBroadcastSubscribe: () => ({}),
    //  voiceBroadcastUnsubscribe: () => ({}),
  }

  return defaultEventHandlers
}

export * from "./types"
