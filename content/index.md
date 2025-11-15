+++
title = "Home"
description = ""
date = "1970-01-01"
template = "index.html"
+++

# Luis Schwab

[*wave]
[*wave]: ![](/img/wave.jpeg)

Currently, I'm a Computer Engineering student at [University of Brasília](https://ene.unb.br),
where I co-founded [ClubeBitcoinUnB](https://github.com/ClubeBitcoinUnB)[^clube-bitcoin-unb],
a student club focused on Bitcoin-related  Research, Development, and Education.
I'm also an open-source developer funded by the
[BitcoinDevKit Foundation](https://bitcoindevkit.org/foundation/grantees/#luis-schwab).

[^clube-bitcoin-unb]: We hold technical seminars and workshops, and also host [Brasília BitDevs](https://bitdevs.bsb.br).

[*wired-in]
[*wired-in]: ![](/img/wired-in.jpeg)

I'm interested in technology that transfers power from trusted third parties
to the individual—permissionless money transmission and anonimous communications—,
computer systems and networks, and economics.

## [Blog](/blog)

These are my latest blog posts. Click [here](/blog) to see all my blog posts.

{% include "blog/post_index_5.html" %}

## Lightning Network

You can open a channel to the
[_Nabla ∇_&nbsp;&nbsp;](https://mempool.space/lightning/node/023e865073d71c6c054c2bb9c0bdbe59277f065544f4c152cb71c6611cc032c66d)
node on the lightning network[^ln]. Channels must have >=1M sats,
the base fee is 0 and the fee rate is dynamic, based on payment flows.

- Pubkey: 023e865073d71c6c054c2bb9c0bdbe59277f065544f4c152cb71c6611cc032c66d
- IPv4 socket: 195.26.240.213:777
- Tor[^tor] socket: 34g3cxkrfsptujruoel4gx4sdgtxuhvvbimp3ux53lybhzq4fbts75qd.onion:9735

[^ln]:
    The [lightning network](https://river.com/learn/what-is-the-lightning-network/)
    is a Bitcoin L2 that enables instant settlement of Bitcoin
    payments in a trustless manner, as it allows unilateral exit of
    either party. It also allows for payments between users without a direct connection,
    by implementing an onion routing schme similar to that of Tor. Read the paper
    [here](https://lightning.network/lightning-network-paper.pdf).
[^tor]:
    [Tor](https://en.wikipedia.org/wiki/Tor_(network))
    is an overlay network that enables anonymous communicationsa,
    powered by volunteer-operated relays which route internet traffic
    via random paths through this relay network.

You can send me some sats via `sats@luisschwab.net`.

[*eval_apply]
[*eval_apply]: ![](/img/eval-apply.webp)

## Self-Hosted Stuff

These are my publicly availabe services:

- Utreexo Bridge: [utreexod.bitcoin.luisschwab.net:8433/38433]()
- Mempool instance: [mempool.luisschwab.net](https://mempool.luisschwab.net)
- Bitcoin DNS seeder[^seed]: [seed.bitcoin.luisschwab.com:53]()
- O-HTTP relay: [ohttp.luisschwab.net](https://ohttp.luisschwab.net)

[^seed]:
    A Bitcoin DNS seeder behaves like regular DNS server;
    but instead of returning IP addresses for a website, for example,
    it returns IP addresses of known, public Bitcoin nodes.
    You can test it out by running `dig seed.bitcoin.luisschwab.com`.

[*apology]
[*apology]: ![](/img/apology.webp)

## Selected Projects

- [bdk-floresta](https://github.com/luisschwab/bdk-floresta): Floresta-powered chain-source crate for BDK (wip).
- [hashsat](https://github.com/luisschwab/hashsat): bitcoin passphrase cracker.
- [fakhr (فخر)](https://github.com/luisschwab/fakhr): vanity bitcoin address and npub generator.
- [koerier](https://github.com/luisschwab/koerier): self-hosted lightning address server for LND.
- [smaug](https://github.com/luisschwab/smaug): guards your coins and sends you an email if they move.

## Contact

You can get in touch with me through one of these channels;
if you want to encrypt it, use PGP[^pgp]. You can get my key
[here 🔑](/pgp/FC43D25BEDD5EE7C.txt).

- email: biz at luisschwab dot net
- npub: [npub1d2x9c0e5gwwg6ask88c87y4v425fh4wz3hwhskvcwzpzdn7dzg5sl4eu8n](https://njump.me/npub1d2x9c0e5gwwg6ask88c87y4v425fh4wz3hwhskvcwzpzdn7dzg5sl4eu8n)
- x: [@luisschwab_](https://x.com/luisschwab_)
- github: [luisschwab](https://github.com/luisschwab)

[^pgp]:
    If you don't know what [PGP](https://en.wikipedia.org/wiki/Pretty_Good_Privacy),
    is, you probably should. Read about why it's important
    [here](https://nakamotoinstitute.org/pt-br/library/porque-eu-escrevi-o-pgp/).
