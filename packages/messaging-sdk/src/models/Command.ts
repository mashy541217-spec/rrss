export interface CommandArgument {
  name: string;
  value: string;
}

export interface CommandContext {
  messageId: string;
  conversationId: string;
  senderId: string;
}

export interface BotCommand {
  command: string;
  description?: string;
}

export interface CommandExecution {
  command: string;
  arguments: CommandArgument[];
  context: CommandContext;
}
