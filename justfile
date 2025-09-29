alias c  := check
alias f  := fmt

_default:
    @just --list

build-dev: clean
    mkdir -p build
    cargo run --release
    cp -r assets/* build

build-prod: clean
    mkdir -p build
    PROD=true cargo run --release
    cp -r assets/* build

dev port="8000": build-dev
    @echo "Serving on http://127.0.0.1:{{port}}"
    python3 -m http.server {{port}} -b 0.0.0.0 -d build

prod port="8000": build-prod
    @echo "Serving on http://127.0.0.1:{{port}}"
    python3 -m http.server {{port}} -b 0.0.0.0 -d build

check:
    cargo +nightly fmt --all -- --check
    cargo +nightly check
    cargo clippy

clean:
    rm -rf build/*

fmt:
    cargo +nightly fmt

deploy: build-prod
    ./deploy.sh
