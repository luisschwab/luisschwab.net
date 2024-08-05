---
title: "Summer of Bitcoin 2024"
description: "A log of my progress on BDK at Summer of Bitcoin 2024"
og_image_url: ""
date: "2024.05.31"
---

This is a running log of my progress on [Summer of Bitcoin](https://www.summerofbitcoin.org/) 2024. I applied to [BDK](https://bitcoindevkit.org), to work on [this issue](https://github.com/bitcoindevkit/bdk/issues/1371).

# Artifacts
Artifacts produced during the project:
- https://github.com/bitcoin/bitcoin/issues/30478
- https://github.com/bitcoin/bitcoin/pull/30515 (merged)
- https://github.com/rust-bitcoin/rust-bitcoincore-rpc/issues/361
- https://github.com/rust-bitcoin/rust-bitcoincore-rpc/pull/365
- https://github.com/rust-bitcoin/rust-bitcoincore-rpc/pull/366

# Context
Summer of Bitcoin is "a global, online summer internship program focused on introducing university students to bitcoin open-source development and design." It pairs project mentors and interns to work on FOSS projects during summer.

Bitcoin Dev Kit is a project focused on building a concise set of tools & libraries to be used in cross platform Bitcoin wallets. "The `bdk` libraries aim to provide well engineered and reviewed components for Bitcoin based applications. It is built upon the excellent [`rust-bitcoin`](https://github.com/rust-bitcoin/rust-bitcoin) and [`rust-miniscript`](https://github.com/rust-bitcoin/rust-miniscript) crates."

# The Project
Currently, BDK's `bitcoind_rpc` crate requires a full node (unpruned) backend to determine a wallet's balance. This is because the full transaction history for a given set of [descriptors](https://bitcoindevkit.org/descriptors/) is contructed using the `full_scan` method. This method scans the whole chain for matches, and this process yields both past transactions and the currently available UTXOs.

However, it is still possible to determine the balance of these descriptors using a pruned node, via the `scantxoutset` RPC. The UTXO set is an index of all the currently available transaction outputs on the blockchain. It is then just a matter of filtering them to find the ones that belong to the wallet. This won't yield the full transaction history, but it is enough to build transactions that spend the available UTXOs.

For example, you can scan the chain for UTXOs using a set of descriptors in this manner:

```bash
~$ bitcoin-cli scantxoutset start "[\"addr(bc1q5q9344vdyjkcgv79ve3tldz4jmx4lf7knmnx6r)\"]"
{
  "success": true,
  "txouts": 185261159,
  "height": 852742,
  "bestblock": "000000000000000000004bf6339c59b5c789c8bfd00efc1a4d77d948f1ea328a",
  "unspents": [
    {
      "txid": "fae435084345fe26e464994aebc6544875bca0b897bf4ce52a65901ae28ace92",
      "vout": 0,
      "scriptPubKey": "0014a00b1ad58d24ad8433c56662bfb45596cd5fa7d6",
      "desc": "addr(bc1q5q9344vdyjkcgv79ve3tldz4jmx4lf7knmnx6r)#smk4xmt7",
      "amount": 0.00091190,
      "coinbase": false,
      "height": 852741
    }
  ],
  "total_amount": 0.00091190
}
```

You can read my proposal [here](https://docs.google.com/document/d/17-MK89AcdNImohQcnuHKrwdwXRjpt3M093NjoRqEdlk/edit?usp=sharing), the GitHub issue [here](https://github.com/bitcoindevkit/bdk/issues/1371), and my work [here](https://github.com/luisschwab/bdk/tree/feat/implement-full-scan-on-pruned-node).

# Log

Found an [issue](https://github.com/rust-bitcoin/rust-bitcoincore-rpc/issues/361) on [`rust-bitcoincore-rpc`](https://github.com/rust-bitcoin/rust-bitcoincore-rpc). This crate is a wrapper over [`rust-jsonrpc`](https://github.com/apolestra/rust-jsonrpc), with `bitcoind`'s RPCs defined as functions and the JSON types as structs so that `serde` can (de)serialize it.

The issue is as follows: the below snippet is supposed to make the RPC and block until it is done; however, it panics, as if another scan is already in progress, which is not the case. 

```rust
extern crate bitcoincore_rpc;
extern crate bitcoincore_rpc_json;

use bitcoincore_rpc::{Auth, Client, RpcApi};
use bitcoincore_rpc_json::ScanTxOutRequest;

fn main() {
    let client = Client::new(
                         "127.0.0.1",
                         Auth::UserPass("satoshi".to_string(), "satoshi".to_string())
    ).unwrap();

    let scan_txout_request = ScanTxOutRequest::Single("pkh(02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5)".to_string());

    let utxos = client.scan_tx_out_set_blocking(&[scan_txout_request]).unwrap();

    println!("{:?}", utxos);
}
```

```shell
called `Result::unwrap()` on an `Err` value: JsonRpc(Rpc(RpcError { code: -8, message: "Scan already in progress, use action \"abort\" or \"status\"", data: None }))
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
``` 

It turns out that `rust-bitcoincore-rpc` was making two requests. On the underlying `rust-jsonrpc` crate there is a `DEFAULT_TIMEOUT` for HTTP calls set to 15 seconds. After that the request is made again.

I figured this out by making a TCP dump using Wireshark and filtering traffic on port 8332 (the RPC port). The requests in question are the green ones, the first two being the requests and the last one the error response that causes it to fail.
![](/img/blog/tcpdump.png)

All of this is documented in [this issue](https://github.com/rust-bitcoin/rust-bitcoincore-rpc/issues/361).

**Solution**: create a new builder method for `Client` that allows for a custom timeout value:

```rust
/// Creates a client to a bitcoind JSON-RPC server with a custom timeout value, in seconds.
/// Useful when making an RPC that can take a long time e.g. scantxoutset
pub fn new_with_custom_timeout(url: &str, auth: Auth, timeout: u64) -> result::Result<Self, Error> {
    let (user, pass) = auth.get_user_pass()?;

    let user = user.unwrap();
    let pass = pass.unwrap();

    let transport =
        jsonrpc::simple_http::Builder::new()
        .timeout(Duration::from_secs(timeout))
        .url(url)
        .unwrap()
        .auth(user, Some(pass))
        .build();

    let client = jsonrpc::client::Client::with_transport(transport);

    Ok(Client{ client })
}
```

Now, it's possible to create a `Client` with any timeout value: 

```rust
let client = Client::new_with_custom_timeout(
                     "127.0.0.1",
                     Auth::UserPass("satoshi".to_string(), "satoshi".to_string()),
                     500 // seconds
).unwrap();

let scan_txout_request = ScanTxOutRequest::Single("pkh(02c6047f9441ed7d6d3045406e95c07cd85c778e4b8cef3ca7abac09b95c709ee5)".to_string());

let utxos = client.scan_tx_out_set_blocking(&[scan_txout_request]).unwrap();

println!("{:?}", utxos);
```

```shell
ScanTxOutResult { success: Some(true), tx_outs: Some(184545675), height: Some(854378), best_block_hash: Some(000000000000000000031924122f255d7b998f557901677cc68d18e4870bd8d2), unspents: [Utxo { txid: 51641a04be6efae0b16b4779a0ee671adf9d5c742c997d753d7da6b5ae4e8318, vout: 0, script_pub_key: Script(OP_HASH160 OP_PUSHBYTES_20 34464b86299fe4d27aba32680415059f619632bf OP_EQUAL), descriptor: "addr(36TRGhggGdrg6bS11CfkVQwzdqhw1XM3GM)#l8red6em", amount: 1487564 SAT, height: 853117 }, Utxo { txid: aad3e522e1fcf25b59c519c271d07d1c6d45aee78bff608b3232e298a7595a3a, vout: 0, script_pub_key: Script(OP_HASH160 OP_PUSHBYTES_20 34464b86299fe4d27aba32680415059f619632bf OP_EQUAL), descriptor: "addr(36TRGhggGdrg6bS11CfkVQwzdqhw1XM3GM)#l8red6em", amount: 1470501 SAT, height: 853480 }, Utxo { txid: 98e9e27490eb7f825b0b7b551b3799651fec1d58496b97e3dff1adf27b117074, vout: 0, script_pub_key: Script(OP_HASH160 OP_PUSHBYTES_20 34464b86299fe4d27aba32680415059f619632bf OP_EQUAL), descriptor: "addr(36TRGhggGdrg6bS11CfkVQwzdqhw1XM3GM)#l8red6em", amount: 456204 SAT, height: 853613 }, Utxo { txid: 1d60cea5228e8d4348f5149cafe341c94189fa0caee3e78f80a447c66ed749e3, vout: 1, script_pub_key: Script(OP_HASH160 OP_PUSHBYTES_20 34464b86299fe4d27aba32680415059f619632bf OP_EQUAL), descriptor: "addr(36TRGhggGdrg6bS11CfkVQwzdqhw1XM3GM)#l8red6em", amount: 1503668 SAT, height: 853926 }], total_amount: 4917937 SAT }
```

Running this takes a while: 84 seconds on my server, which has an i7 and 16GB of RAM. And takes a lot longer in less powerful hardware. It's up to the developer to set the timeout to a value that makes sense.

I made this [PR](https://github.com/rust-bitcoin/rust-bitcoincore-rpc/pull/365) to `rust-bitcoincore-rpc` to fix this.

---

In parallel, I also made a [PR](https://github.com/bitcoin/bitcoin/pull/30515) to Bitcoin Core, adding two new fields to the `scantxoutset` RPC output:
- blockhash: the blockhash of the block the UTXO was created in. Added this because UTXO height is an imprecise information: in case of a reorg, height doesn't make it possible to determine what chain it belongs to. Blockhash on the other hand is an unique indentifier.
- confirmations: the number of confirmations an UTXO has. Useful for human users: you had to subtract the top-level (chain) height with the UTXOs height (and add 1), now it's already available.

```diff
~$ bitcoin-cli scantxoutset start "[\"addr(bc1q5q9344vdyjkcgv79ve3tldz4jmx4lf7knmnx6r)\"]"
{
  "success": true,
  "txouts": 185259116,
  "height": 853622,
  "bestblock": "00000000000000000002e97d9be8f0ddf31829cf873061b938c10b0f80f708b2",
  "unspents": [
    {
      "txid": "fae435084345fe26e464994aebc6544875bca0b897bf4ce52a65901ae28ace92",
      "vout": 0,
      "scriptPubKey": "0014a00b1ad58d24ad8433c56662bfb45596cd5fa7d6",
      "desc": "addr(bc1q5q9344vdyjkcgv79ve3tldz4jmx4lf7knmnx6r)#smk4xmt7",
      "amount": 0.00091190,
      "coinbase": false,
      "height": 852741,
+     "blockhash": "00000000000000000002eefe7e7db44d5619c3dace4c65f3fdcd2913d4945c13",
+     "confirmations": 882
    }
  ],
  "total_amount": 0.00091190
}
```
---

