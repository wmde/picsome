import { passert } from "../libs/utils"
const { FLICKR_API_KEY } = process.env

export const flickerApiKey = passert({ FLICKR_API_KEY })
