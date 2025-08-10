+++
title = "Home"
description = ""
date = "2025-08-08"
template = "index.html"
+++

# Luis Henrique Schwab

Currently, I'm a Computer Engineering student at [University of Brasília](https://ene.unb.br),
where I co-founded [ClubeBitcoinUnB](https://github.com/ClubeBitcoinUnB), a student club
focused on Bitcoin-related  Research, Development and Education. I'm also an open-source developer
funded by the [BitcoinDevKit Foundation](https://bitcoindevkit.com).

I'm interested in permissionless technology that transfers power from third parties
to the individual—trustless money transmission and anonimous communications—,
computer systems and networks, and economics.

## [Blog](/blog)

These are my latest blog posts. Click [here](/blog) to see all my blog posts.

{% include "blog_index_5.html" %}

## Presentations

These are my latest presentations. Click [here](/presentations) to see all my presentations.

TODO

## Lightning Network

You can open a channel to my node on the lightning network[^ln]. The minimum channel size is 1M satoshis,
the base fee is 0 and the fee rate is dynamic.

- Pubkey: [022e6daa0464a77800ef0ad117497d687e21bab35b15672a7f9de7d8541b042f17](https://mempool.luisschwab.net/lightning/node/022e6daa0464a77800ef0ad117497d687e21bab35b15672a7f9de7d8541b042f17)
- IPv4 socket: 209.126.80.42:9735
- Tor[^tor] socket: fp7joq2n66kq5oem3uweaov4ndeu4ulb2mzk6v34zgkrgmradpcmwxyd.onion:9735

[^ln]:
    The [lightning network](https://river.com/learn/what-is-the-lightning-network/)
    is a Bitcoin L2 that enables instant settlement of Bitcoin
    payments in a trustless manner, as it allows unilateral exit of
    either party. It also allows for payments between users without a direct connection,
    by implementing an onion routing schme similar to that of Tor. Read the paper
    [here](https://lightning.network/lightning-network-paper.pdf).
[^tor]:
    [Tor](https://en.wikipedia.org/wiki/Tor_(network))
    is a overlay network that enables anonymous communications,
    powered by volunteer-operated relays which route internet traffic
    via random paths through this relay network.

You can send me some sats via `sats@luisschwab.net`.

## Self-Hosted Stuff

I like to self-host as much as possible, because not your hardware, not your data.
These are my publicly availabe services:

- mempool.space instance: [mempool.luisschwab.net](https://mempool.luisschwab.net)
- Bitcoin DNS seeder[^seed]: [seed.bitcoin.luisschwab.com](https://seed.bitcoin.luisschwab.com:53)
- Nostr relay[^nostr]: [wss://nostr.luisschwab.net](wss://nostr.luisschwab.net)

[^seed]:
    A Bitcoin DNS seeder behaves like regular DNS server;
    but instead of returning IP addresses for a website, for example,
    it returns IP addresses of known, public Bitcoin nodes.
    You can test it out by running `dig seed.bitcoin.luisschwab.com`.
[^nostr]:
    This is my personal nostr relay, only I get to write to it,
    but anyone can read from it. Learn about nostr [here](https://nostr.com).

## Contact

You can get in touch with me through one of these channels;
if you want to encrypt it, use PGP[^pgp]. You can get my key
[here 🔑](/pgp/FC43D25BEDD5EE7C.asc).

- email: luisschwab at protonmail dot com
- npub: [npub1d2x9c0e5gwwg6ask88c87y4v425fh4wz3hwhskvcwzpzdn7dzg5sl4eu8n](https://njump.me/npub1d2x9c0e5gwwg6ask88c87y4v425fh4wz3hwhskvcwzpzdn7dzg5sl4eu8n)
- x: [@luisschwab_](https://x.com/luisschwab_)
- github: [luisschwab](https://github.com/luisschwab)
- codeberg: [luisschwab](https://codeberg.org/luisschwab)

[^pgp]:
    If you don't know what [PGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy),
    is, you probably should. Read about why it's important
    [here](https://nakamotoinstitute.org/pt-br/library/porque-eu-escrevi-o-pgp/).
