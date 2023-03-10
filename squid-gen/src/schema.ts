/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Generator config
 */
export interface Config {
  /**
   * Source Squid Archive for an EVM network. Can be a URL or an alias. See docs.subsquid.io/archives/overview.
   */
  archive: string;
  /**
   * ContractJSONs defining the exact data to extract from each contract.
   */
  contracts: {
    /**
     * Contract string ID. Can contain spaces.
     */
    name: string;
    /**
     * Contract address. Implementation address for proxies.
     */
    address: string;
    /**
     * Proxy contract address.
     */
    proxy?: string;
    /**
     * Path or URL to the contract JSON ABI. If omitted, it will be retrieved from Etherscan by address.
     */
    abi?: string;
    /**
     * One or multiple contract events to be indexed. true indexes all events defined in the ABI; false indexes none. Default: false.
     */
    events?: string[] | boolean;
    /**
     * One or multiple contract functions to be indexed. true indexes all functions defined in the ABI; false indexes none. Default: false.
     */
    functions?: string[] | boolean;
    /**
     * Range of blocks to index. Default: all from the genesis.
     */
    range?: {
      from?: number;
      to?: number;
    };
  }[];
  /**
   * Etherscan API-compatible endpoint to fetch contract ABI by a known address. Default: https://api.etherscan.io/.
   */
  etherscanApi?: string;
}
