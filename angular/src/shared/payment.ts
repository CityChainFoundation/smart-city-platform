import * as qs from 'qs';
import Big from 'big.js';

export class PaymentRequestData {
  address: string;
  network: string;
  options: any;
}

/** Implements the BIP21 with some extra features. https://github.com/bitcoin/bips/blob/master/bip-0021.mediawiki */
export class PaymentRequest {
  removeHandler(uri: string) {
    return uri.substring(uri.indexOf('://') + 3);
  }

  decode(uri: string): PaymentRequestData {
    if (uri.indexOf('web+pay://') > -1) {
      throw new Error('Invalid BIP21 URI, should not contain :// prefix: ' + uri);
    }

    var urnScheme = uri.slice(0, uri.indexOf(':')).toLowerCase();
    var split = uri.indexOf('?');
    var address = uri.slice(urnScheme.length + 1, split === -1 ? undefined : split);
    var query = split === -1 ? '' : uri.slice(split + 1);
    var options = qs.parse(query);

    if (options['amount']) {
      const optionAmount = <string>options['amount'];

      // It is not allowed to use comma, must use period.
      if (optionAmount.indexOf(',') > -1) {
        throw new Error('Invalid amount.');
      }

      const amount = Big(<string>options['amount']);

      if (amount.lt(0)) {
        throw new Error('Invalid amount.');
      }

      // Parse the amount and verify it's a valid Big value.
      options['amount'] = amount.toJSON();
    }

    return { address: address, network: urnScheme, options: options };
  }

  transform(request: any) {
    const address = request.address;
    const network = request.network;

    const options = request;
    delete options.address;
    delete options.network;

    return { address: address, network: network, options: options };
  }

  encode(request: any): string {
    var address = request.address;
    delete request.address;

    var network = request.network;
    delete request.network;

    var query = qs.stringify(request);

    return network + ':' + address + (query ? '?' : '') + query;
  }

  parseAmount(amount: string) {
    const number = new Big(amount);

    if (number.e < -8) {
      throw new Error('Too many decimals.');
    }

    if (number.e > 10) {
      throw new Error('Too high value.');
    }

    const amountValue = number.times(Math.pow(10, 8));
    return amountValue;
  }
}
