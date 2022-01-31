import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import * as bip39 from 'bip39';
import { Base64 } from 'js-base64';
import { NetworkLoader } from '../../background/network-loader';
import { Network } from '../../background/networks';
import { Account, Wallet } from '../interfaces';
import { Environments } from '../../environments/environments';

@Injectable({
    providedIn: 'root'
})
export class NetworksService {

    networks: Network[];
    allNetworks: Network[];

    constructor() {
        const networkLoader = new NetworkLoader();
        this.networks = networkLoader.getNetworks(environment.networks);
        this.allNetworks = networkLoader.getAllNetworks();
    }

    getDerivationPathForNetwork(network: Network) {
        return `m/${network.purpose}'/${network.network}'`;;
    }

    getDerivationPathForAccount(account: Account) {
        return `m/${account.purpose}'/${account.network}'/${account.index}'`;;
    }

    /** Get the network definition based upon the id, e.g. BTC, STRAX, CRS, CITY. */
    getNetworkById(id: string) {
        const network = this.networks.find(w => w.id == id);
        return network;
    }

    /** Get the network definition based upon the id, e.g. BTC, STRAX, CRS, CITY. The purpose defaults to 44. */
    getNetwork(network: number, purpose: number = 44) {
        return this.networks.find(w => w.network == network && w.purpose == purpose);
    }

    /** Used to display options on first wallet unlock. User can pick which of these default accounts they want to activate on their wallet. */
    getDefaultAccounts(wallet: Wallet) {
        let accounts: Account[] = [];

        switch (environment.instance) {
            case Environments.Blockcore:
                accounts = [{
                    selected: true,
                    index: 0,
                    name: 'Stratis',
                    type: 'coin',
                    network: 105105,
                    purpose: 44,
                    purposeAddress: 44,
                    icon: 'paid',
                    state: {
                        balance: 0,
                        retrieved: null,
                        receive: [],
                        change: []
                    }
                }, {
                    selected: true,
                    index: 0,
                    name: 'Cirrus',
                    type: 'coin',
                    network: 401,
                    purpose: 44,
                    purposeAddress: 44,
                    icon: 'paid',
                    state: {
                        balance: 0,
                        retrieved: null,
                        receive: [],
                        change: []
                    }
                }
                    // , {
                    //     index: 0,
                    //     name: 'City Coin',
                    //     type: 'coin',
                    //     network: 1926,
                    //     purpose: 44,
                    //     purposeAddress: 44,
                    //     icon: 'paid',
                    //     state: {
                    //         balance: 0,
                    //         retrieved: null,
                    //         receive: [],
                    //         change: []
                    //     },
                    // }, {
                    //     index: 0,
                    //     name: 'Identity',
                    //     type: 'other',
                    //     network: 616,
                    //     purpose: 302,
                    //     purposeAddress: 302,
                    //     icon: 'account_circle',
                    //     state: {
                    //         balance: 0,
                    //         retrieved: null,
                    //         receive: [],
                    //         change: []
                    //     },
                    // }, {
                    //     index: 0,
                    //     name: 'Nostr',
                    //     type: 'other',
                    //     network: 1237,
                    //     purpose: 44,
                    //     purposeAddress: 44, // TODO: Nostr should have custom derived address, add this ability (schnorr signature)
                    //     icon: 'account_circle',
                    //     state: {
                    //         balance: 0,
                    //         retrieved: null,
                    //         receive: [],
                    //         change: []
                    //     },
                    // }
                ];
                break;
            case Environments.CoinVault:
                accounts = [{
                    index: 0,
                    selected: true,
                    name: 'Stratis',
                    type: 'coin',
                    network: 105105,
                    purpose: 44,
                    purposeAddress: 44,
                    icon: 'account_circle',
                    state: {
                        balance: 0,
                        retrieved: null,
                        receive: [],
                        change: []
                    },
                }, {
                    index: 0,
                    selected: true,
                    name: 'Cirrus',
                    type: 'coin',
                    network: 401,
                    purpose: 44,
                    purposeAddress: 44,
                    icon: 'account_circle',
                    state: {
                        balance: 0,
                        retrieved: null,
                        receive: [],
                        change: []
                    },
                }];
                break;
            case Environments.SmartCityPlatform:
                accounts = [{
                    index: 0,
                    selected: true,
                    name: 'City Coin',
                    type: 'coin',
                    network: 1926,
                    purpose: 44,
                    purposeAddress: 44,
                    icon: 'paid',
                    state: {
                        balance: 0,
                        retrieved: null,
                        receive: [],
                        change: []
                    },
                }, {
                    index: 0,
                    selected: true,
                    name: 'Identity',
                    type: 'other',
                    network: 616,
                    purpose: 302,
                    purposeAddress: 302,
                    icon: 'account_circle',
                    state: {
                        balance: 0,
                        retrieved: null,
                        receive: [],
                        change: []
                    },
                }, {
                    index: 0,
                    name: 'Nostr',
                    type: 'other',
                    network: 1237,
                    purpose: 44,
                    purposeAddress: 44, // TODO: Nostr should have custom derived address, add this ability (schnorr signature)
                    icon: 'account_circle',
                    state: {
                        balance: 0,
                        retrieved: null,
                        receive: [],
                        change: []
                    },
                }];
                break;
        }

        return accounts;
    }
}