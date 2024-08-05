---
title: "How Digital Signatures Work"
description: ""
og_image_url: "/img/blog/signature.png"
date: "2024.05.07"
---

# Contents

# What Is A Signature?
First, let's define what a signature is. In it's most basic meaning,
it's a proof of identity. To sign something is equivalent to saying:
"These scribbles represent me, and I agree with, stand by, or verify
whatever is written in this piece of paper."

There are a few problems with analog signatures, though:
 - It's trivial to copy the signature. When you sign a document, you are
 in effect making your "private key" public. Anyone can lift it and
 sign something else without your knowledge.

 - The signature is not bound to the contents of the document. 
 The document can be modified after you sign it, and the signature
 would not reflect that.


# Making It Digital
Digital Signatures make use of asymmetric cryptography, 
i.e. a public and a private key. In the ECDSA scheme, 
the signature is an aggregate of the private key, a nonce,
and a hash of the document. It is represented as a pair of
numbers: **(r, s)**. Then, you can verify the authenticity of
a signature with the document, the corresponding public key,
and **(r, s)**.

This allows for the following properties:
 - The signature is tied to what was signed. Changing a single bit
 will make the signature verification fail.

 - The private key is not made public when you sign something,
 making forgery impossible (if you don't reuse the nonce, that is. This
 is how the PlayStation 3 signing key was extracted).

But how does it actually work?

# The Math Behind It
Let's say Alice wants to sign a contract with Bob. Bob needs to know that:
(a) it was actually Alice that signed it, and (b) that Alice did not sign
a modified contract.

Note: each elliptic curve will generate a different signature. In this case, 
we're using _secp256k1_. I wrote about it in more detail 
[here](/blog/from-dice-to-address/#elliptic-curve-cryptography-basics).

## Sign

Let _z_ be the hash of this contract, _k_ be a random number, _e_ be 
a private key, _n_ the order of the finite field, and G be the generator
point for the curve.

To create a signature, we have to derive _r_ and _s_:

_r_ is the x coordinate of the public key derived from _k_:

_R = kG_\
_r = R<sub>x</sub> mod n_

Note: _r_ must be different from 0. If this is the case, use another nonce.

_s_ incorporates the private key _e_, the hash _z_, the nonce _k_ and _r_:

_s = (z + re)/k mod n_

Note: _s_ must be different from 0. If this is the case, use another
nonce and start from the beggining.

You have created a signature **(r, s)**.

## Verify

Now, to verify a signature, follow this process:

Let _z_ be the hash of the contract, _(r, s)_ the signature, and _P_ the
corresponding public key.

Then, let _u = (z/s) mod n_ and _v = (r/s) mod n_ (this is why _r_ and _s_ 
cannot be 0).

Compute _uG + vP = R_. If _r_ is equal to _R<sub>x</sub>_, then the signature is valid.

I've summarized all of this in this 
[gist](https://gist.github.com/luisschwab/b812ad104172c37c4247842d501667cd):

<script src="https://gist.github.com/luisschwab/b812ad104172c37c4247842d501667cd.js"></script>
