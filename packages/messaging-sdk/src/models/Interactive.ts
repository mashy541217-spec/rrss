export interface InlineButton {
  text: string;
  payload?: string;
  url?: string;
}

export interface InlineKeyboard {
  rows: InlineButton[][];
}

export interface ReplyKeyboard {
  rows: string[][];
  resizeKeyboard?: boolean;
  oneTimeKeyboard?: boolean;
}

export interface CallbackQuery {
  id: string;
  fromId: string;
  messageId?: string;
  payload: string;
}
