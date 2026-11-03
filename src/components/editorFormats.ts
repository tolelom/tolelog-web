export type FormatType = 'heading' | 'bold' | 'italic' | 'strikethrough' | 'code' | 'link';

export const FORMAT_MARKS: Record<FormatType, readonly [before: string, after: string]> = {
    heading: ['## ', ''],
    bold: ['**', '**'],
    italic: ['*', '*'],
    strikethrough: ['~~', '~~'],
    code: ['`', '`'],
    link: ['[', '](url)'],
};

export const SHORTCUT_FORMATS: Record<string, FormatType> = {
    b: 'bold',
    i: 'italic',
    k: 'link',
    '`': 'code',
};
