use std::{fs, path::{Path, PathBuf}};

use pulldown_cmark::{html, Options, Parser};
use tera::{Context, Tera};
use matter;

use crate::EngineError;
use crate::SiteConfig;

use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub(crate) struct Frontmatter {
    /// The template to be used for this page.
    pub(crate) template: Option<String>,
    /// The page's title.
    pub(crate) title: String,
    /// The pages's description.
    pub(crate) description: String,
    /// The page's date of creation.
    pub(crate) date: String,
    /// The page's last edit date.
    pub(crate) edited: Option<String>,
}


pub(crate) fn process_md_file(tera: &mut Tera, site_config: &SiteConfig, file_path: &Path, content_dir: &str, build_dir: &str) -> Result<(), EngineError> {
    let content = fs::read_to_string(file_path)?;
    let (frontmatter, html_content) = process_md_content(&content)?;

    let mut ctx = Context::new();
    ctx.insert("site", &site_config);
    ctx.insert("page", &frontmatter);
    ctx.insert("content", &html_content);

    let relative_path = file_path.strip_prefix(content_dir)?;
    let build_path = Path::new(build_dir).join(relative_path).with_extension("html");

    let template = frontmatter.template.unwrap_or("base.html".to_string());
    let rendered = tera.render(&template, &ctx)?;

    if let Some(parent) = build_path.parent() {
        fs::create_dir_all(parent)?;
    }

    fs::write(&build_path, rendered)?;
    println!("built {}", build_path.display());

    Ok(())
}

fn process_md_content(content: &str) -> Result<(Frontmatter, String), EngineError> {
    // Extract and split TOML frontmatter and markdown.
    let extracted = match matter::matter(content) {
        Some(ext) => ext,
        None => return Err(EngineError::NoMatter),
    };

    // Parse frontmatter into [`Frontmatter`].
    let frontmatter_str = extracted.0;
    let frontmatter: Frontmatter = toml::from_str(&frontmatter_str)?;

    let markdown = extracted.1;
    let parser = Parser::new_ext(&markdown, Options::empty());
    let mut html_content = String::new();
    html::push_html(&mut html_content, parser);

    Ok((frontmatter, html_content))
}
