+++
title = "Making Caddy Listen"
description = "A guide on configuring Caddy to work with TCP and HTTP on the same port"
date = "2026-03-09"
template = "blog/blog.html"
tags = ["netops"]
+++

{% include "blog/toc.html" %}

# Making Caddy Listen

While deploying a [Payjoin Mailroom](https://github.com/payjoin/rust-payjoin/tree/master/payjoin-mailroom),
I ran into the issue where Caddy's `layer4` plugin would take over port 443, impeding any traffic to regular
HTTP hosts. This blog is a simple note to self (which might be useful to others) on how to correctly configure
Caddy to listen on the same port for both TCP and HTTP traffic.

## The Issue

Caddy has a plugin called `layer4`, which is used to route TCP traffic in addition to its default HTTP routing.

The problem is that when you bind something to port $P$ using `layer4`, it will completely take over port $P$.
And since the Mailroom users expect to connect to it on the default HTTPS port 443 (albeit over TCP), we need to
figure out a way to configure Caddy to listen for all traffic on that port, figure out what should be routed
to the Mailroom host, and route everything else to the default HTTP handler.

This is perfectly possible, but documentation is lacking (I wasted more time than I'd like to admit on this).

## The Solution

We achieve this by using the `servers` block, a `listener_wrapper` directive, and SNI[^sni]:

[^sni]:
    From [Wikipedia](https://en.wikipedia.org/wiki/Server_Name_Indication): "Server Name Indication (SNI)
    is an extension to the Transport Layer Security (TLS) computer networking protocol by which a client 
    indicates which hostname it is attempting to connect to at the start of the handshaking process.

```
{
    # Intercept traffic on port 443 and check if it matches any
    # SNI below, then route non-matches to Caddy's HTTP handler
    servers :443 {
        listener_wrappers {
            layer4 {
                @mailroom tls sni mailroom.luisschwab.net
                route @mailroom {
                    proxy 192.168.0.100:8080
                }
                route {
                    # Route non-matches to Caddy's HTTP handler
                }
            }
            tls
        }
    }
}
```

The flow can be modelled as such:

```text
                                   Caddy
                     +-------------------------------+
                     |  +-------------------------+  |
                     |  | layer4: match on SNI    |  |
TCP/HTTP (:443) ---> |  |          v              |  | 443/TCP
                     |  | mailroom.luisschwab.net +--+--------------> [Payjoin Mailroom]
                     |  +-------------------------+  |
                     |      |                        |
                     |      | Route non-matches      |
                     |      | to the HTTP handler    |
                     |      V                        |
                     |  +-------------------------+  |          +---> [Virtual Host #00]
                     |  |                         |  | 443/HTTP |
                     |  |      HTTP handler       +---+---------+---> [Virtual Host #01]
                     |  |                         |  |          |
                     |  +-------------------------+  |          +---> [Virtual Host #02]
                     +-------------------------------+          |
                                                                ...
```

That's it.

You can use my `Payjoin Mailroom` instance at [`mailroom.luisschwab.net`](https://mailroom.luisschwab.net).
