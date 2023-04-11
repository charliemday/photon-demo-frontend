export const cleanUrl = (url: string) => url.replace("https://", "").replace(".com", "").replace("/", "").replace("sc-domain:", "").replace("www.", "")
