declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      /** MongoDB connection string (Atlas on Vercel; required on Vercel including build). */
      MONGODB_URI?: string
      /** Alias for MONGODB_URI supported by some templates. */
      DATABASE_URI?: string
      /** Opt in to destructive full seed (deletes collections) when NODE_ENV=production */
      ALLOW_DANGEROUS_SEED?: string
      /** Show template seed button in admin on production (still blocked unless ALLOW_DANGEROUS_SEED) */
      NEXT_PUBLIC_SHOW_ADMIN_SEED_BUTTON?: string
      NEXT_PUBLIC_SERVER_URL: string
      VERCEL_PROJECT_PRODUCTION_URL: string
      // Email Configuration (Nodemailer)
      SMTP_HOST?: string
      SMTP_PORT?: string
      SMTP_SECURE?: string
      SMTP_USER?: string
      SMTP_PASSWORD?: string
      SMTP_FROM?: string
      SMTP_FROM_NAME?: string
      SMTP_REJECT_UNAUTHORIZED?: string
      /** When false, Payload verifies SMTP on startup (local testing only). Default: skip verify. */
      SMTP_SKIP_VERIFY?: string
      // Contact Information
      CONTACT_EMAIL?: string
      CONTACT_PHONE?: string
      /** Site-wide 503 maintenance: no APIs, static HTML from middleware */
      MAINTENANCE_MODE?: string
      /** Same as MAINTENANCE_MODE; use if Edge middleware does not see non-public env */
      NEXT_PUBLIC_MAINTENANCE_MODE?: string
      /** Retry-After seconds (default 3600) */
      MAINTENANCE_RETRY_AFTER?: string
      /** WhatsApp wa.me digits (country code, no +); overrides phone derivation */
      MAINTENANCE_WHATSAPP_NUMBER?: string
      // Other
      CRON_SECRET?: string
      // AWS S3 Storage - Required for Vercel deployment
      S3_BUCKET?: string
      S3_ACCESS_KEY_ID?: string
      S3_SECRET_ACCESS_KEY?: string
      S3_REGION?: string
      S3_PREFIX?: string
      // ClickUp Sales Pipeline
      CLICKUP_API_TOKEN?: string
      CLICKUP_LIST_ID?: string
      CLICKUP_TRAINING_PLATFORM_LIST_ID?: string
      CLICKUP_ASSIGNEE_CONTACT_EMAIL?: string
      CLICKUP_ASSIGNEE_QUOTE_EMAIL?: string
      CLICKUP_ASSIGNEE_CONTACT_USER_ID?: string
      CLICKUP_ASSIGNEE_QUOTE_USER_ID?: string
      CLICKUP_ASSIGNEE_TRAINING_INTEREST_EMAIL?: string
      CLICKUP_ASSIGNEE_TRAINING_INTEREST_USER_ID?: string
      CLICKUP_TASK_TIMEZONE?: string
      // Training platform (lists + optional field label overrides)
      TRAINING_CLICKUP_USERS_LIST_ID?: string
      TRAINING_CLICKUP_PROGRESS_LIST_ID?: string
      TRAINING_CLICKUP_PAYMENTS_LIST_ID?: string
      // remove.bg integration
      REMOVE_BG_API_KEY?: string
      // STC Pay / Amazon Payment Services (product checkout)
      STC_PAYMENT_ENV?: string
      STC_PAYMENT_MERCHANT_IDENTIFIER?: string
      STC_PAYMENT_ACCESS_CODE?: string
      STC_PAYMENT_SHA_REQUEST_PHRASE?: string
      STC_PAYMENT_SHA_RESPONSE_PHRASE?: string
      STC_PAYMENT_SHA_TYPE?: string
      STC_PAYMENT_DIGITAL_WALLET?: string
      WHATSAPP_ACCESS_TOKEN?: string
      WHATSAPP_PHONE_NUMBER_ID?: string
      WHATSAPP_API_VERSION?: string
      SALES_TEAM_WHATSAPP_NUMBER?: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
