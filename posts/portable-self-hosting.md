---
title: "Portable Self-Hosting"
description: ""
og_image_url: "/img/blog/diogenes.jpg"
date: "2024.08.01"
---

A how-to guide on self-hosting on the go.

Maybe you have some stuff you want to run on your own metal, but don't have a public IP available, have one but don't want to dox it, or just move around a lot and want to take it along with you.

This is just my own setup, YMMV.

![](/img/blog/self-host-diagram-inv.png)

# BoM
1. VPS (even a $5/mo droplet will do)
2. Mikrotik RB750r2 (or any router with Wireguard support)

# VPS setup
First, acquire a VPS. It can be very weak, since it will simply forward traffic (1GB of RAM is more than enough). 

To connect everything, I used Wireguard. Install it:
```shell
$ apt install wireguard
```

Wireguard works by creating a network interface and associating peers with it. Each peer has his own private/public key pair, used to encrypt and authenticate packets.

The VPS will serve as the VPN "server" (Wireguard follows the peer model, but the VPS is the only peer publicly reachable, so all others must start a handshake with him). First, let's create two key pairs:
```shell
$ wg genkey | tee privkey-server | wg pubkey > pubkey-server

$ wg genkey | tee privkey-mikrotik | wg pubkey > pubkey-mikrotik
```

Now create the interface, filling the Private Key field with the key generated before:
```shell
/etc/wireguard/wg0.conf

[Interface]
Address = 10.10.10.1/24
ListenPort = 51820
PrivateKey = <privkey-server>
PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
# MikroTik
PublicKey = <pubkey-mikrotik>
AllowedIPs = 10.10.10.2/32
AllowedIPs = <Mikrotik's LAN subnet> # This allows packets with these IPs on the tunnel
```

Now enable the interface:
```shell
$ wg-quick up wg0
```

The VPN subnet is 10.10.10.0/24, the server VPN interface will be 10.10.10.1, the Mikrotik VPN interface will be 10.10.10.2.

Now, it's necessary to add a static route on the VPS, pointing traffic bound to the Mikrotik's LAN to the  wg0 interface (else it would go to the default gateway and get dropped):
```shell
$ ip route add <Mikrotik LAN subnet> via 10.10.10.1 dev wg0
```

# Mikrotik setup
Note: you could do this using anything that supports wireguard (pfSense, a simple linux host, etc.)

Create a new Wireguard interface:
![](/img/blog/mikrotik-create-interface.png)

Add the server as a peer:
![](/img/blog/mikrotik-add-peer.png)

They should make a handshake. You can check it via:
```shell
$ wg
interface: wg0
  public key: <pubkey-server>
  private key: (hidden)
  listening port: 51820

peer: <pubkey-mikrotik>
  endpoint: <ip:port>
  allowed ips: 10.10.10.2/32
  latest handshake: 5 seconds ago
  transfer: 134.06 MiB received, 2.51 GiB sent
```

Likewise, you need to add a route from this side as well. Packets destined to 10.10.10.0/24 should be routed to the Wireguard interface, instead of the deafault gateway:
![](/img/blog/mikrotik-add-route.png)

\
It's also possible to create a routing table and rule to forward all traffic to wg0. Simply create a new routing table, add a route with destination address of 0.0.0.0/0 (any address) pointing to the wg0 gateway, and then a rule where packets with source address equal to the LAN network lookup the alternative table.

# Adding extra clients
Now, for every extra client, like a phone or laptop, create a new key pair and add the peer on both VPS and client.

# Forwarding
To make services accessible via the internet, you can simply use a reverse proxy like nginx or Caddy on the VPS, and point it directly to the LAN IP of the service. It should traverse the tunnel and reach your local network.

\
You should now be able to plug in your router anywhere while having your services available on the same public IP.
