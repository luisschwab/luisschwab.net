use std::{
    collections::HashMap,
    env, fs,
    path::{Path, PathBuf},
    process,
};

use env_logger::Env;
use log::{error, info};
use serde::{Deserialize, Serialize};
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

#[derive(Clone, Debug, Serialize, Deserialize)]
pub(crate) struct TagIndex {
    pub(crate) tag: String,
    pub(crate) posts: Vec<PageMetadata>,
}

fn main() -> Result<(), EngineError> {
    // Initialize environment logger.
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();

    // Check if this is a production build.
    let prod: bool = match env::var("PROD").unwrap_or(false.to_string()).parse() {
        Ok(prod) => {
            info!("Succesfully parsed PROD={prod} environment variable");
            prod
        }
        Err(e) => {
            error!("Failed to parsed PROD environment variable: {e}");
            process::exit(1);
        }
    };

    let config_path: PathBuf = PathBuf::from(CONFIG_FILE);
    if !config_path.exists() {
        error!(
            "Failed to read a configuration file at {}",
            config_path.display()
        );
        return Err(EngineError::InvalidPath(config_path.display().to_string()));
    }
    let config: SiteConfig = parse_config_file(config_path)?;

    // Content (src) and Build (dst) directories.
    let build_dir = &config.build_path;
    let content_dir = &config.content_path;

    // Create a Tera object and context.
    let mut tera = Tera::new("src/templates/**/*.html")?;
    let mut tera_ctx = Context::new();
    info!("Succesfully built a Tera context");

    // Build a quote JSON array from `QUOTES`.
    let quotes_json = json!(
        QUOTES
            .iter()
            .map(|(text, author)| {
                json!({"text": text.replace("\n", "<br/>"), "author": author.replace("\n", "<br/>")})
            })
            .collect::<Vec<_>>()
    );
    tera_ctx.insert("quotes_json", &quotes_json.to_string());
    info!("Inserted quotes JSON array into Tera's context");

    // Display the lats quote from `QUOTES`, if the browser has "JavaScripto" disabled.
    let fallback_quote: (&str, &str) = QUOTES[QUOTES.len() - 1];
    let fallback_quote = (
        fallback_quote.0.replace("\n", "<br/>"),
        fallback_quote.1.replace("\n", "<br/>"),
    );
    tera_ctx.insert("quote_text", &fallback_quote.0);
    tera_ctx.insert("quote_author", &fallback_quote.1);

    // Build an index of blog posts to be inserted to the context later.
    let blog_index = build_blog_index(content_dir, prod)?;
    tera_ctx.insert("blog_index", &blog_index);
    info!("Inserted blog post index into Tera's context");

    let blog_tag_index = build_tag_index(&blog_index);
    tera_ctx.insert("blog_tag_index", &blog_tag_index);
    info!("Inserted blog tag index into Tera's context");

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
            } else {
                // Copy assets from the content directory.
                copy_asset_file(file_path, content_dir, build_dir)?;
            }
        }
    }

    Ok(())
}

/// Build an index of the blog posts.
fn build_blog_index(content_dir: &String, prod: bool) -> Result<Vec<PageMetadata>, EngineError> {
    let mut blog_index = Vec::new();
    for entry in WalkDir::new(content_dir).into_iter().filter_map(|e| e.ok()) {
        let file_path = entry.path();
        if file_path.extension().and_then(|s| s.to_str()) == Some("md")
            && file_path.to_str().unwrap().contains("/blog/")
        {
            // Parse the frontmatter.
            let content = std::fs::read_to_string(file_path)?;
            if let Some(extracted) = matter::matter(&content) {
                let mut metadata: PageMetadata = toml::from_str(&extracted.0)?;
                // Don't include a draft page in the build output
                // if the `PROD=true` enviromnet variable is set.
                #[allow(clippy::bool_comparison)]
                if metadata.draft == Some(true) && prod == true {
                    continue;
                }
                let rel_path = file_path.strip_prefix(content_dir)?;

                // Generate clean URLs.
                let path = if file_path.file_name().unwrap() == "index.md" {
                    // For `index.md` files, use the parent directory path.
                    format!("/{}/", rel_path.parent().unwrap().display())
                } else {
                    // For files that are not `index.md`, use their names.
                    format!("/{}", rel_path.with_extension("html").display())
                };
                metadata.path = Some(path);

                let is_blog_index = rel_path.to_str().unwrap() == "blog/index.md"
                    || rel_path.to_str().unwrap() == "blog/tags/index.md";
                if !is_blog_index {
                    blog_index.push(metadata);
                }
            }
        }
    }
    // Insert blog post metadata to Tera's context, sorted by date in descending order.
    blog_index.sort_by(|a, b| {
        let date_a = a.date;
        let date_b = b.date;
        date_b.cmp(&date_a)
    });

    Ok(blog_index)
}

/// Build an index of blog posts organized by tags.
fn build_tag_index(blog_posts: &[PageMetadata]) -> Vec<TagIndex> {
    let mut tag_map: HashMap<String, Vec<PageMetadata>> = HashMap::new();

    // Group blog posts by tag.
    for post in blog_posts {
        if let Some(tags) = &post.tags {
            for tag in tags {
                tag_map.entry(tag.clone()).or_default().push(post.clone());
            }
        }
    }

    // Convert to Vec<TagIndex> and sort
    let mut tag_index: Vec<TagIndex> = tag_map
        .into_iter()
        .map(|(tag, mut posts)| {
            // Sort posts within each tag by date (newest first)
            posts.sort_by(|a, b| b.date.cmp(&a.date));
            TagIndex { tag, posts }
        })
        .collect();

    // Sort tags alphabetically
    tag_index.sort_by(|a, b| a.tag.cmp(&b.tag));

    tag_index
}

// Copy asset files (images, etc.) to the build directory while preserving structure.
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
    info!(
        "Copied asset file {} to {}",
        file_path.display(),
        build_path.display()
    );

    Ok(())
}
