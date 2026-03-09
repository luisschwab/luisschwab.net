+++
title = "Home"
description = ""
date = "1970-01-01"
template = "index.html"
+++

# Luis Schwab

I work as an open-source Bitcoin developer, currently funded by the
[BitcoinDevKit Foundation](https://bitcoindevkit.org/foundation/grantees/#luis-schwab),
working mainly on [BDK](https://github.com/bitcoindevkit) and [Floresta](https://github.com/getfloresta/Floresta).

I'm also a Computer Engineering undergrad at Universidade de Brasília, 
where I co-founded [ClubeBitcoinUnB](https://github.com/ClubeBitcoinUnB),
a student club focused on Bitcoin Research, Development, and Education.

## [Blog](/blog)

These are my latest blog posts. Click [here](/blog) to see all my blog posts.

{% include "blog/post_index_5.html" %}

## Utreexo Bridges

I host Utreexo bridges which you can connect to:

- Bitcoin: `utreexod.bitcoin.luisschwab.net:8433`
- Signet: `utreexod.signet.luisschwab.net:38433`
- Testnet4: `tbd`

## Lightning Network

You can open a channel to the
[_Nabla ∇_&nbsp;&nbsp;](https://mempool.space/lightning/node/023e865073d71c6c054c2bb9c0bdbe59277f065544f4c152cb71c6611cc032c66d)
node on the lightning network. Channels must have >=1M sats,
the base fee is 0 and the fee rate is dynamic, based on payment flows.

- Pubkey: `023e865073d71c6c054c2bb9c0bdbe59277f065544f4c152cb71c6611cc032c66d`
- IPv4: `nabla.bitcoin.luisschwab.net:777`
- Tor: `34g3cxkrfsptujruoel4gx4sdgtxuhvvbimp3ux53lybhzq4fbts75qd.onion:9735`

You can send me some sats via keysend or `sats@luisschwab.net`.

## Payjoin Mailroom

I host an instance of [`payjoin-mailroom`](https://github.com/payjoin/rust-payjoin/tree/master/payjoin-mailroom), which combines an OHTTP Relay[^ohttp] and a Payjoin Directory[^pj-dir]
in a single binary. This is used as a rendezvous point for collaborativelly building multi-party
transactions.

- Mailroom: `mailroom.luisschwab.net`

[^ohttp]:
    Oblivious HTTP is a protocol for encrypting and sending HTTP messages from a client to a gateway by way of a trusted relay service, in a manner that mitigates the use of metadata such as IP address and connection information for client identification. Read more about
    OHTTP [here](https://ietf-wg-ohai.github.io/oblivious-http/draft-ietf-ohai-ohttp.html).

[^pj-dir]:
    A Payjoin Directory replaces the requirement for a receiver to host a secure public endpoint for interactions. HTTP clients access the directory server using an asynchronous protocol and authenticated, encrypted payloads. The design preserves complete Payjoin receiver functionality, including payment output substitution. Read more about it
    [here](https://bips.dev/77).

## Contact

You can get in touch with me through one of these channels;
if you want to encrypt it, use PGP[^pgp]. You can get my key
[here 🔑](/pgp/FC43D25BEDD5EE7C.txt).

- email: biz at luisschwab dot net
- x: [@luisschwab_](https://x.com/luisschwab_)
- keybase: [luisschwab](https://keybase.io/luisschwab)
- github: [luisschwab](https://github.com/luisschwab)
- npub: [npub1d2x9c0e5gwwg6ask88c87y4v425fh4wz3hwhskvcwzpzdn7dzg5sl4eu8n](https://njump.me/npub1d2x9c0e5gwwg6ask88c87y4v425fh4wz3hwhskvcwzpzdn7dzg5sl4eu8n)

[^pgp]:
    If you don't know what [PGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy),
    is, you probably should. Read about why it's important
    [here](https://nakamotoinstitute.org/library/why-i-wrote-pgp/).
