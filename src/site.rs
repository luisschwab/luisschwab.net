use std::{path::PathBuf, str::FromStr};

use tera::Tera;

use engine::{config::{SiteConfig, parse_config_file}, error::EngineError, markdown::process_md_file};
use walkdir::WalkDir;

pub(crate) mod engine;


fn main() -> Result<(), EngineError>{
    let mut config_path: PathBuf = PathBuf::from("config.toml");
    if !config_path.exists() {
        return Err(EngineError::InvalidPath(config_path.to_string_lossy().to_string()));
    }
    let config: SiteConfig = parse_config_file(config_path)?;
    //println!("{config:?}");

    let mut tera = Tera::new("./src/templates/**/*")?;

    let build_dir = &config.build_path;
    let content_dir = &config.content_path;
    for entry in WalkDir::new(&content_dir).follow_links(true).into_iter().filter_map(|e| e.ok()) {
        let file_path = entry.path();

        if file_path.extension().and_then(|s| s.to_str()) == Some("md") {
            println!("building {}", file_path.display());
            process_md_file(&mut tera, &config, file_path, &content_dir, &build_dir)?;
        }
    }

    Ok(())
}
