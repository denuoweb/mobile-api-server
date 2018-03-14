const bitcore = require('qtumcore-lib');
const OP_CALL = 194;
const OP_CREATE = 193;
const crypto = require('crypto');

class ContractsHelper {

    /**
     *
     * @param {String} str
     * @returns {boolean}
     */
    static isContractVOutHex(str) {

        try {
            let script = bitcore.Script.fromString(str),
                fChunk = script.chunks.find((chunk) => {
                    return (chunk.opcodenum && [OP_CREATE, OP_CALL].indexOf(chunk.opcodenum) !== -1);
                });
            return !!fChunk;
        } catch (e) {
            return false;
        }

    }

    /**
     *
     * @param {String} str
     * @returns {boolean}
     */
    static isContractCreateVOutHex(str) {

        try {
            let script = bitcore.Script.fromString(str),
                fChunk = script.chunks.find((chunk) => {
                    return (chunk.opcodenum && [OP_CREATE].indexOf(chunk.opcodenum) !== -1);
                });

            return !!fChunk;
        } catch (e) {
            return false;
        }

    }

    /**
     *
     * @param {String} str
     * @returns {boolean}
     */
    static isContractCallVOutHex(str) {

        try {
            let script = bitcore.Script.fromString(str),
                fChunk = script.chunks.find((chunk) => {
                    return (chunk.opcodenum && [OP_CALL].indexOf(chunk.opcodenum) !== -1);
                });

            return !!fChunk;
        } catch (e) {
            return false;
        }

    }

    /**
     *
     * @param {String} hex
     * @return {null|String}
     */
    static getCallContractAddressFromVOutHex(hex) {

        try {
            let script = bitcore.Script.fromString(hex);
            return script.chunks[script.chunks.length - 2]['buf'].toString('hex');
        } catch (e) {
            return null;
        }
    }
    /**
     *
     * @param {String} txid
     * @param {Number} num
     */
    static getContractAddress(txid, num) {

        let reverseTxId = txid.match(/.{2}/g).reverse().join(""),
            buf = new Buffer(4);

        buf.writeUInt32LE(num, 0);
        let nHex = buf.toString('hex'),
            addr = reverseTxId + nHex,
            sha256 = crypto.createHash('sha256').update(addr, 'hex').digest(),
            rpm = crypto.createHash('rmd160').update(sha256).digest();

        return rpm.toString('hex');
    }

    /**
    *
    * @param {String} contractAddress
    * @param {String} networkId - hex
    */
    static getBitAddressFromContractAddress(contractAddress, networkId) {
        try {
            if (/^0x/.test(contractAddress)) {
                contractAddress = contractAddress.slice(contractAddress.length - 40, contractAddress.length);
            }

            var checksum = bitcore.crypto.Hash.sha256sha256(new bitcore.deps.Buffer(networkId + contractAddress, 'hex')),
                hexBitAddress = networkId + contractAddress + checksum.toString('hex').slice(0, 8);

            return bitcore.encoding.Base58.encode(new bitcore.deps.Buffer(hexBitAddress, 'hex'));
        } catch (e) {

            return null;
        }
    }

}

module.exports = ContractsHelper;