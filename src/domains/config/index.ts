type ConfigType = {
  clientApiPort: number;
  clientAuthSecretOrPrivateKey: string;
  mainDatabaseConnectionUrl: string;
};

export const Config: ConfigType = {
  clientApiPort: 4000,
  clientAuthSecretOrPrivateKey: "dfgh123",
  mainDatabaseConnectionUrl:
    "mongodb+srv://darhankusajn:CRKO6X5VTZ2tdDYU@oqigamaincluster.2qtw85s.mongodb.net/?retryWrites=true&w=majority",
};
