// These reference imports provide type definitions for things like styled-jsx and css modules
/// <reference types="next" />
/// <reference types="next/types/global" />
declare module "*.jpg"
declare module "*.jpeg"
declare module "*.png"

declare module "nodemailer" {
  var nodemailer: NodeMailer
  export = nodemailer
}
