module.exports = {
  // Configure networks (e.g., development using Ganache)
  networks: {
    // Local Ganache instance
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ganache port
      network_id: "*",       // Any network (default: none)
    },

    // Example for deploying to Ethereum's Ropsten testnet (needs Infura and Metamask setup)
    ropsten: {
      provider: () => new HDWalletProvider(
        process.env.MNEMONIC, // Your wallet seed phrase (Metamask or other)
        `https://ropsten.infura.io/v3/${process.env.INFURA_API_KEY}` // Infura API key
      ),
      network_id: 3,       // Ropsten's network id
      gas: 5500000,        // Gas limit
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: false for public nets)
    },
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    timeout: 100000
  },

  // Configure compilers
  compilers: {
    solc: {
      version: "0.8.0",    // Fetch exact version from solc-bin (default: Truffle's built-in solc)
      settings: {          // See the Solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 200
        },
      }
    }
  },

  // Truffle DB is disabled by default. To enable it, change `enabled: false` to `enabled: true`
  // Truffle DB will let you store & query data for your projects
  db: {
    enabled: false
  }
};
