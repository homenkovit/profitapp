export enum Field {
  DESCRIPTION = 'description',
  PRICE = 'price',
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
