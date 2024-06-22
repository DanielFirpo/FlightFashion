export default ({ env }) => {
  return {
    "schemas-to-ts": {
      enabled: true,
    },
    email: {
      config: {
        provider: "strapi-provider-email-resend",
        providerOptions: {
          apiKey: env("RESEND_API_KEY"), // Required
        },
        settings: {
          defaultFrom: "danielfirpodev@gmail.com",
          defaultReplyTo: "danielfirpodev@gmail.com",
        },
      },
    },
  };
};
