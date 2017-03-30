let async = require('async'),
	logger = require('log4js').getLogger('Outputs Controller'),
	InsightApi = require("../Services/InsightApi"),
    bs58 = require('bs58');


class OutputsControllers {

    constructor() {
        logger.info('Init');
    }

    getUnspentByAddress(cb, data) {


        InsightApi.getUnspentAddresses([data._get.address], (error, body) => {
            cb(error, this._formatAddresses(body));
    	});

	}

	getUnspentByAddresses(cb, data) {

		let addresses = data._get.addresses && Array.isArray(data._get.addresses) ? data._get.addresses : [];

		if (addresses.length) {

            InsightApi.getUnspentAddresses(addresses, (error, body) => {
                cb(error, this._formatAddresses(body));
        	});

		} else {
            cb(error, []);
		}

	}

	_formatAddresses(addresses) {
    	var newAddresses = [];

        addresses.forEach(function (address) {

            let bytes = bs58.decode(address.address);

            while(bytes.length < 25) {
            	bytes = Buffer.concat([new Buffer('\0'), bytes]);
            }

            newAddresses.push({
                address: address.address,
                tx_hash: address.txid,
                vout: address.vout,
                txout_scriptPubKey: address.scriptPubKey,
                amount: address.amount,
                block_height: address.height ? address.height : -1,
                pubkey_hash: bytes.slice(1, 21).toString('hex'),
                confirmations: address.confirmations
            });

		});

    	return newAddresses;
	}

}

module.exports = OutputsControllers;