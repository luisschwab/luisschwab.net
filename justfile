_default:
    @just --list

build: clean
    mkdir -p build
    cargo run --release
    cp -r src/assets/* build

dev port="8000": build
    @echo "Serving on http://127.0.0.1:{{port}}"
    python3 -m http.server {{port}} -b 0.0.0.0 -d build

check:
    cargo +nightly fmt --all -- --check
    cargo check
    cargo clippy

clean:
    rm -rf build/*

fmt:
    cargo +nightly fmt
