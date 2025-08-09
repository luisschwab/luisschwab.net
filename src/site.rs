use std::path::PathBuf;

use rand::Rng;
use serde_json::json;
use tera::{Context, Tera};
use walkdir::WalkDir;

mod engine;
mod quotes;

use engine::{
    config::{SiteConfig, parse_config_file},
    error::EngineError,
    markdown::process_md_file,
};
use quotes::QUOTES;

/// The file where site-wide definitions must be defined.
///
/// The path is relative to the Cargo project's root.
const CONFIG_FILE: &str = "config.toml";

fn main() -> Result<(), EngineError> {
    let mut rng = rand::rng();

    let config_path: PathBuf = PathBuf::from(CONFIG_FILE);
    if !config_path.exists() {
        return Err(EngineError::InvalidPath(config_path.display().to_string()));
    }
    let config: SiteConfig = parse_config_file(config_path)?;

    // Create a Tera object and context.
    let mut tera = Tera::new("./src/templates/**/*")?;
    let mut tera_ctx = Context::new();

    // Build a quote json array from `QUOTES`.
    let quotes_json = json!(
        QUOTES
            .iter()
            .map(|(text, author)| {
                json!({"text": text.replace('\n', "<br/>"), "author": author})
            })
            .collect::<Vec<_>>()
    );
    tera_ctx.insert("quotes_json", &quotes_json.to_string());
    // Used if the browser has "JavaScripto" disabled.
    let fallback_quote: (&str, &str) = QUOTES[rng.random_range(0..QUOTES.len())];
    let fallback_quote = (fallback_quote.0.to_string(), fallback_quote.1.to_string());
    tera_ctx.insert("quote_text", &fallback_quote.0);
    tera_ctx.insert("quote_author", &fallback_quote.1);

    let build_dir = &config.build_path;
    let content_dir = &config.content_path;
    for entry in WalkDir::new(content_dir)
        .follow_links(true)
        .into_iter()
        .filter_map(|e| e.ok())
    {
        let file_path = entry.path();

        if file_path.extension().and_then(|s| s.to_str()) == Some("md") {
            process_md_file(
                &mut tera,
                &mut tera_ctx,
                &config,
                file_path,
                content_dir,
                build_dir,
            )?;
        }
    }

    Ok(())
}
