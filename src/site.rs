use std::path::PathBuf;

use tera::Tera;
use walkdir::WalkDir;

pub(crate) mod engine;
use crate::engine::{
    config::{SiteConfig, parse_config_file},
    error::EngineError,
    markdown::process_md_file,
};

/// The file where site-wide definitions must be defined.
///
/// The path is relative to the Cargo project's root.
const CONFIG_FILE: &str = "config.toml";

fn main() -> Result<(), EngineError> {
    let config_path: PathBuf = PathBuf::from(CONFIG_FILE);
    if !config_path.exists() {
        return Err(EngineError::InvalidPath(config_path.display().to_string()));
    }
    let config: SiteConfig = parse_config_file(config_path)?;

    let mut tera = Tera::new("./src/templates/**/*")?;

    let build_dir = &config.build_path;
    let content_dir = &config.content_path;
    for entry in WalkDir::new(content_dir)
        .follow_links(true)
        .into_iter()
        .filter_map(|e| e.ok())
    {
        let file_path = entry.path();

        if file_path.extension().and_then(|s| s.to_str()) == Some("md") {
            process_md_file(&mut tera, &config, file_path, content_dir, build_dir)?;
        }
    }

    Ok(())
}
