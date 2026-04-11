+++
title = "Network Operations"
description = ""
date = "1970-01-01"
template = "index.html"
+++

# Network Operations

Below are publicly available infrastructure that I operate.

## Bitcoin Nodes

| Network    | Implementation | Version | IPv4 Socket            |
| ---------- | -------------- | ------- | ---------------------- |
| `Bitcoin`  | `Bitcoin Core` | `v30.2` | `195.26.240.213:8333`  |
| `Signet`   | `Bitcoin Core` | `v30.2` | `195.26.240.213:38333` |
| `Testnet4` | `Bitcoin Core` | `v30.2` | `195.26.240.213:48333` |
| `Testnet3` | `Bitcoin Core` | `v30.2` | `195.26.240.213:28333` |

## Utreexo Bridges

Utreexo bridges are needed for generating and attaching Merkle inclusion proofs to
blocks and transactions, which CSNs[^csn] require for block and transaction validation.

[`utreexod`](https://github.com/utreexo/utreexod) is a Utreexo-enabled
[`btcd`](https://github.com/btcsuite/btcd)-fork.

[^csn]:
    CSN stands for _Compact State Node_. These are nodes that don't keep
    neither UTXO set nor blocks, but only the roots of the Utreexo Merkle
    forest. As such, they need to be provided with Merkle inclusion proofs
    for these blocks and transactions in order to verify that transaction
    inputs were contained in the UTXO set at a specific height (for block
    validation) or that transaction inputs are contained in the UTXO set
    (for mempool transaction validation). [Floresta](https://github.com/getfloresta/Floresta)
    is an implementation of a CSN.

| Network   | Implementation | Version  | IPv4 Socket            |
| --------- | -------------- | -------- | ---------------------- |
| `Bitcoin` | `utreexod`     | `v0.5.0` | `195.26.240.213:8433`  |
| `Signet`  | `utreexod`     | `v0.5.0` | `195.26.240.213:38433` |

## Lightning Node

I operate the [Nabla ∇](https://mempool.space/lightning/node/023e865073d71c6c054c2bb9c0bdbe59277f065544f4c152cb71c6611cc032c66d)
node in the Lighting Network.

You can send me some sats through my lightning address `sats@luisschwab.net`.

|             |                                                                      |
| ----------- | -------------------------------------------------------------------- |
| Pubkey      | `023e865073d71c6c054c2bb9c0bdbe59277f065544f4c152cb71c6611cc032c66d` |
| IPv4 Socket | `195.26.240.213:777`                                                 |
| Tor Socket  | `34g3cxkrfsptujruoel4gx4sdgtxuhvvbimp3ux53lybhzq4fbts75qd:9735`      |

## Payjoin Mailroom

I host an instance of [`payjoin-mailroom`](https://github.com/payjoin/rust-payjoin/tree/master/payjoin-mailroom),
which combines an OHTTP Relay[^ohttp] and a Payjoin Directory[^pj-dir] in a single binary.
This is used as a rendezvous point for collaborativelly building multi-party transactions.

| Implementation     | Version  | Host                                                         |
| ------------------ | -------- | ------------------------------------------------------------ |
| `payjoin-mailroom` | `v0.1.1` | [`mailroom.luisschwab.net`](https://mailroom.luisschwab.net) |

[^ohttp]:
    Oblivious HTTP is a protocol for encrypting and sending HTTP messages from a client
    to a gateway by way of a trusted relay service, in a manner that mitigates the use of
    metadata such as IP address and connection information for client identification. Read
    more about OHTTP [here](https://ietf-wg-ohai.github.io/oblivious-http/draft-ietf-ohai-ohttp.html).

[^pj-dir]:
    A Payjoin Directory replaces the requirement for a receiver to host a secure
    public endpoint for interactions. HTTP clients access the directory server
    using an asynchronous protocol and authenticated, encrypted payloads. The
    design preserves complete Payjoin receiver functionality, including payment
    output substitution. Read more about it [here](https://bips.dev/77).

## Mempool.space Instance

A self-hosted instance of [`mempool.space`](https://mempool.space).

| Implementation | Version  | Host                                                       |
| -------------- | -------- | ---------------------------------------------------------- |
| `mempool`      | `v3.2.1` | [`mempool.luisschwab.net`](https://mempool.luisschwab.net) |

## Bitcoin DNS Seeder

I run a [modified](https://github.com/luisschwab/utreexo-seeder) version of
Peter Wuille's `bitcoin-seeder` with added support for
[BIP-0183 service bits](https://github.com/kcalvinalvin/bips/blob/bd1e2425872450b4b9d80cdcb47874d9659a3bda/bip-0183.md#signaling).

| Network   | Implementation                                                   | Version | Host                             |
| --------- | ---------------------------------------------------------------- | ------- | -------------------------------- |
| `Bitcoin` | [`utreexo-seeder`](https://github.com/luisschwab/utreexo-seeder) | N/A     | `seed.bitcoin.luisschwab.com:53` |
