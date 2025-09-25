use std::{fs, path::PathBuf};

use log::info;
use serde::{Deserialize, Serialize};

use crate::EngineError;

#[derive(Debug, Serialize, Deserialize)]
pub(crate) struct SiteConfig {
    /// The cannonical name for the site.
    pub(crate) cname: String,
    /// The deafult title for the site.
    pub(crate) title: String,
    /// The default description for the site.
    pub(crate) description: String,
    /// The content directory path, relative to the project's root.
    pub(crate) content_path: String,
    /// The build directory path, relative to the project's root.
    pub(crate) build_path: String,
}

pub(crate) fn parse_config_file(config_path: PathBuf) -> Result<SiteConfig, EngineError> {
    let config_raw: String = fs::read_to_string(config_path)?;
    let config: SiteConfig = toml::from_str(&config_raw)?;

    info!("Succesfully read configuration file");

    Ok(config)
}
