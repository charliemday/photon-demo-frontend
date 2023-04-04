import { BASE_FRONTEND_URL } from "./urls";

export const SUCCESS_URL = `${BASE_FRONTEND_URL}/payment/success`;
export const CANCEL_URL = `${BASE_FRONTEND_URL}/payment/cancelled`;


export const PRODUCT_ID = "prodNbqdpDJTwQM9mc"
export const PRICEA = "price_1Mqd31LNdzse6S4D7bqKDjmt"
export const PRICEB = "price_1Mqd26LNdzse6S4DxnEOJbiI"
export const PRICEC = "price_1MqcwiLNdzse6S4DmcArvb5K"

export const PRICING_TABLE_ID = process.env.NEXT_PUBLIC_PRICING_TABLE_ID || "prctbl_1Mqd96LNdzse6S4DufcZjKUy";
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51LHmsRLNdzse6S4DcncvXixQcP906XLoEpkqEPAi5yFQrCaBQ8pwChTMIxex4sRHGfoAF0aKpS7qCoed61KbMUo100bPN8Mj2A";