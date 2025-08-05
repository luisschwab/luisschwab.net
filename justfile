_default:
    @just --list

build:
    cargo build

check:
    cargo +nightly fmt --all -- --check
    cargo check
    cargo clippy

clean:
    rm -f build/*
    rm -rf target

fmt:
    cargo +nightly fmt
