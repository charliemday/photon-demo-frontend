export const ellipsizeText = (text: string, maxLength: number) => (
    text ? text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text : ''
);