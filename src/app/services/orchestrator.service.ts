import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UIState } from './ui-state.service';
import { CommunicationService } from './communication.service';
import { Account, State } from '../interfaces';
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class OrchestratorService {
    constructor(
        private communication: CommunicationService,
        private uiState: UIState,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        console.log('OrchestratorService constructor.');
        // this.eventHandlers();
    }

    initialize() {
        console.log('OrchestratorService wiring up listeners.');
        this.eventHandlers();
    }

    private eventHandlers() {
        this.communication.listen('wallet-locked', () => this.router.navigateByUrl('/'));
        // this.communication.listen('unlocked', () => this.uiState.unlocked = true);

        // Whenever the UI-state changes, update it.
        // this.communication.listen('ui-state', (value: any) => {
        //     console.log('ui-state updated!');
        //     this.uiState.persisted = value;
        // });

        // Whenever the state is updated, we'll update in the UI.
        this.communication.listen('state', (state: State) => {
            console.log('state', state);
            this.uiState.initialized = true;
            this.uiState.action = state.action;
            this.uiState.persisted = state.persisted;
            this.uiState.persisted$.next(this.uiState.persisted);
            this.uiState.unlocked = state.unlocked;
        });

        // When an action is triggered from the content script / background.
        this.communication.listen('action', (action: string) => {
            console.log('action', action);
            this.uiState.action = action;
        });

        // When a wallet is removed, we must update UI.
        this.communication.listen('wallet-removed', (value: any) => {
            // We'll always redirect to root when a wallet is removed.
            this.router.navigateByUrl('/');

            // this.uiState.persisted.wallets.splice(this.uiState.persisted.activeWalletIndex, 1);

            // if (this.uiState.hasWallets) {
            //   this.uiState.persisted.activeWalletIndex = 0;
            // } else {
            //   this.uiState.persisted.activeWalletIndex = -1;
            // }

            // await this.uiState.save();


        });

        // When a wallet is removed, we must update UI.
        this.communication.listen('error', (value: { exception: any, message: string }) => {
            this.snackBar.open('Error: ' + value.message, 'Hide', {
                duration: 8000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
            });
        });

        // When a wallet is removed, we must update UI.
        this.communication.listen('account-removed', (value: any) => {
            if (this.uiState.hasAccounts) {
                this.router.navigateByUrl('/account/view/' + this.uiState.activeWallet?.activeAccountIndex);
            } else {
                this.router.navigateByUrl('/account/create');
            }
        });
    }

    setActiveWalletId(id: string) {
        this.communication.send('set-active-wallet-id', { id });
    }

    setActiveAccountId(index: number) {
        // Update local state as well.
        if (this.uiState.activeWallet) {
            this.uiState.activeWallet.activeAccountIndex = index;
        }

        this.communication.send('set-active-account', { index });
    }

    setLockTimer(minutes: number) {
        this.communication.send('set-lock-timer', { minutes });
    }

    setAccountName(id: string, index: number, name: string) {
        this.communication.send('set-account-name', { id, index, name });
    }

    setWalletName(id: string, name: string) {
        this.communication.send('set-wallet-name', { id, name });
    }

    unlock(id: string, password: string) {
        this.communication.send('wallet-unlock', { id, password });
    }

    removeAccount(id: string, index: number) {
        this.communication.send('account-remove', { id, index });
    }

    lock(id: string) {
        this.communication.send('wallet-lock', { id });
    }

    createAccount(account: Account) {
        this.communication.send('account-create', account);
    }
}