export enum Field {
  DESCRIPTION = 'description',
  PRICE = 'price',
}

export interface ValidationFields {
  isDescriptionInvalid: boolean,
  isPriceInvalid: boolean,
}

const htmlEscapes: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

const htmlUnEscapes: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
};

export const encodeText = (text: string): string => {
  return text.replace(/[&<>"']/g, function(match) {
      return htmlEscapes[match];
  });
};

export const decodeText = (text: string | undefined): string | undefined => {
  if (!text) {
    return undefined;
  }

  return text.replace(/&(amp|lt|gt|quot|#39);/g, function(match) {
    return htmlUnEscapes[match];
  });
}

export const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (['+','-','e',',','.'].includes(e.key)) {
    e.preventDefault();
  }
}

export const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  e.preventDefault();
  e.currentTarget.value = e.clipboardData.getData('text/plain').replace(/[^0-9]/g, '');
}