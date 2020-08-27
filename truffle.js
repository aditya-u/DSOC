var HDWalletProvider = require("@truffle/hdwallet-provider");
const MNEMONIC = '<your private wallet key>';
compilers: {
  solc: {
    settings: {
      evmVersion: "byzantium"
    }
  }
}

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    elastos: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, " https://rpc.elaeth.io/")
      },
      network_id: 3,
      gas: 2000000
    }
  }
};
