import {v2 as cloudinary} from "cloudinary"
import { getEnvProperty } from "../utils/getEnvPropery.utils"

cloudinary.config({
    cloud_name : getEnvProperty("CLOUDINARY_CLOUD_NAME"),
    api_key : getEnvProperty("CLOUDINARY_API_KEY"),
    api_secret : getEnvProperty("CLOUDINARY_API_SECRET")
})

export {cloudinary}
