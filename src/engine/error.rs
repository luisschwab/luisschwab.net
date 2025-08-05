use std::path::PathBuf;

use thiserror::Error;

#[derive(Debug, Error)]
pub(crate) enum EngineError {
    #[error("I/O: {0}")]
    IO(#[from] std::io::Error),

    #[error("TOML: {0}")]
    TOML(#[from] toml::de::Error),

    #[error("Invalid path: {0}")]
    InvalidPath(String),

    #[error("Tera: {0}")]
    Tera(#[from] tera::Error),

    #[error("No frontmatter")]
    NoMatter,

    #[error("StripPrefix: {0}")]
    StripPrefix(#[from] std::path::StripPrefixError),
}
