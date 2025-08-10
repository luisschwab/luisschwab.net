use std::{
    fs,
    path::{Path, PathBuf},
};

use rand::Rng;
use serde_json::json;
use tera::{Context, Tera};
use walkdir::WalkDir;

mod engine;
mod quotes;

use engine::{
    config::{SiteConfig, parse_config_file},
    error::EngineError,
    markdown::{PageMetadata, process_md_file},
};
use quotes::QUOTES;

/// The file where site-wide definitions must be declared.
/// The path is relative to the Cargo project's root.
const CONFIG_FILE: &str = "config.toml";
/// Image extensions.
const IMAGE_EXTS: &[&str] = &["jpg", "jpeg", "png", "gif", "webp", "svg"];

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

    // Build a quote JSON array from `QUOTES`.
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

    // Build an index of blog posts to be inserted to the context later.
    let mut blog_posts = Vec::new();
    for entry in WalkDir::new(content_dir).into_iter().filter_map(|e| e.ok()) {
        let file_path = entry.path();
        if file_path.extension().and_then(|s| s.to_str()) == Some("md")
            && file_path.to_str().unwrap().contains("/blog/")
        {
            // Read and parse frontmatter only
            let content = std::fs::read_to_string(file_path)?;
            if let Some(extracted) = matter::matter(&content) {
                let mut metadata: PageMetadata = toml::from_str(&extracted.0)?;
                let rel_path = file_path.strip_prefix(content_dir)?;
                let path = format!("/{}", rel_path.with_extension("html").display());
                metadata.path = Some(path);

                // Don't index the main index.
                if metadata.path.as_ref().unwrap() != "/blog/index.html" {
                    blog_posts.push(metadata);
                }
            }
        }
    }
    // Insert blog post metadata to Tera's context, sorted by date in descending order.
    blog_posts.sort_by(|a, b| {
        let date_a = a.date;
        let date_b = b.date;
        date_b.cmp(&date_a)
    });
    tera_ctx.insert("blog_index", &blog_posts);

    // Process file contents.
    for entry in WalkDir::new(content_dir).into_iter().filter_map(|e| e.ok()) {
        let file_path = entry.path();

        if let Some(extension) = file_path.extension().and_then(|s| s.to_str()) {
            if extension == "md" {
                process_md_file(
                    &mut tera,
                    &mut tera_ctx,
                    &config,
                    file_path,
                    content_dir,
                    build_dir,
                )?;
            } else if IMAGE_EXTS.contains(&extension.to_lowercase().as_str()) {
                copy_asset_file(file_path, content_dir, build_dir)?;
            }
        }
    }

    Ok(())
}

// Copy asset files (images, etc.) to the build directory while preserving structure
fn copy_asset_file(
    file_path: &Path,
    content_dir: &str,
    build_dir: &str,
) -> Result<(), EngineError> {
    let relative_path = file_path.strip_prefix(content_dir)?;
    let build_path = Path::new(build_dir).join(relative_path);

    // Create the build directory, if absent
    if let Some(parent) = build_path.parent() {
        fs::create_dir_all(parent)?;
    }

    // Copy the file
    fs::copy(file_path, &build_path)?;
    println!("Copied {} to {}", file_path.display(), build_path.display());

    Ok(())
}
