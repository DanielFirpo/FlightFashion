export default ({ env }) => {
  return {
    "schemas-to-ts": {
      enabled: true,
    },
    email: {
      config: {
        provider: "amazon-ses",
        providerOptions: {
          key: env("AWS_SES_KEY"),
          secret: env("AWS_SES_SECRET"),
          amazon: "https://email.us-east-1.amazonaws.com",
        },
        settings: {
          defaultFrom: "danielfirpodev@gmail.com",
          defaultReplyTo: "danielfirpodev@gmail.com",
        },
      },
    },
  };
};
