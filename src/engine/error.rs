use thiserror::Error;

#[derive(Debug, Error)]
pub(crate) enum EngineError {
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),

    #[error("TOML error: {0}")]
    Toml(#[from] toml::de::Error),

    #[error("Invalid path: {0}")]
    InvalidPath(String),

    #[error("Tera error: {0}")]
    Tera(#[from] tera::Error),

    #[error("No frontmatter")]
    NoMatter,

    #[error("StripPrefix error: {0}")]
    StripPrefix(#[from] std::path::StripPrefixError),

    #[error("Regex erro: {0}")]
    Regex(#[from] regex::Error),
}
