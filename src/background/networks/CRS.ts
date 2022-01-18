import { Network } from './network';

export class CRS implements Network {
    id: string = 'CRS';
    name: string = 'Cirrus';
    network: number = 401;
    purpose: number = 44;
    derivationPath: string = `m/44'/401'/0'`;
    messagePrefix = '\x18Bitcoin Signed Message:\n';
    bech32 = 'tb';
    bip32 = {
        public: 0x0488b21e,
        private: 0x0488ade4,
    };
    pubKeyHash = 28;
    scriptHash = 88;
    wif = 0x08; // TODO: Verify if this is still used for CRS.
}