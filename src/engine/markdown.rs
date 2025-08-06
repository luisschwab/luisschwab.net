use std::{fs, path::Path};

use pulldown_cmark::{Options, Parser, html};
use regex::Regex;
use serde::{Deserialize, Serialize};
use tera::{Context, Tera};

use crate::{EngineError, SiteConfig};

/// The frontmatter is parsed from markdwown
/// files and deserialized into [`FrontMatter`].
#[derive(Debug, Serialize, Deserialize)]
pub(crate) struct FrontMatter {
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

/// End-to-end processing of a markdown file.
///
/// Reads the file, parses `Latex` expressions and renders them into HTML with `katex`,
/// renders the rest of the markdown into HTML, and writes it to the file system.
pub(crate) fn process_md_file(
    tera: &mut Tera,
    site_config: &SiteConfig,
    file_path: &Path,
    content_dir: &str,
    build_dir: &str,
) -> Result<(), EngineError> {
    // Read the file to a [`String`].
    let content = fs::read_to_string(file_path)?;

    // Split the Frontmatter from the Markdown and process the Markdown.
    let (frontmatter, html_content) = process_md_content(&content)?;

    // Create a `tera` context and insert parameters into it.
    let mut ctx = Context::new();
    ctx.insert("site", &site_config);
    ctx.insert("page", &frontmatter);
    ctx.insert("content", &html_content);

    // Assemble the final build path.
    let relative_path = file_path.strip_prefix(content_dir)?;
    let build_path = Path::new(build_dir)
        .join(relative_path)
        .with_extension("html");

    // Select a template defined in the Frontmatter. Defaults to "base.html".
    let template = frontmatter.template.unwrap_or("base.html".to_string());

    // Render the `tera` context with the selected template.
    let rendered = tera.render(&template, &ctx)?;

    // Create the build directory, if absent.
    if let Some(parent) = build_path.parent() {
        fs::create_dir_all(parent)?;
    }

    // Write the rendered HTML to the build directory.
    fs::write(&build_path, rendered)?;
    println!(
        "Built {} into {}",
        file_path.display(),
        build_path.display()
    );

    Ok(())
}

/// Processing of the markdown contents (split from `process_md_file` for this to be a pure function).
///
///
fn process_md_content(content: &str) -> Result<(FrontMatter, String), EngineError> {
    // Extract and split TOML frontmatter and markdown.
    let extracted = match matter::matter(content) {
        Some(ext) => ext,
        None => return Err(EngineError::NoMatter),
    };

    // Parse frontmatter into [`Frontmatter`].
    let frontmatter_str = extracted.0;
    let frontmatter: FrontMatter = toml::from_str(&frontmatter_str)?;

    let markdown = extracted.1;

    // Process `LaTeX` expressions with `katex-rs`.
    let markdown_katex = process_katex(&markdown)?;

    let parser = Parser::new_ext(&markdown_katex, Options::empty());
    let mut html_content = String::new();
    html::push_html(&mut html_content, parser);

    Ok((frontmatter, html_content))
}

fn process_katex(content: &str) -> Result<String, EngineError> {
    // Render display math: $$ <expr> $$
    let display_rgx = Regex::new(r"(?s)\$\$(.*?)\$\$")?;
    let mut processed = display_rgx
        .replace_all(content, |caps: &regex::Captures| {
            let math = caps[1].trim();
            match katex::render_with_opts(
                math,
                katex::Opts::builder().display_mode(true).build().unwrap(),
            ) {
                Ok(rendered) => rendered,
                Err(_) => "wtf".to_owned(),
            }
        })
        .to_string();

    // Render inline math: $ <expr> $
    let inline_rgx = Regex::new(r"\$([^$\n]+?)\$")?;
    processed = inline_rgx
        .replace_all(&processed, |caps: &regex::Captures| {
            let math = caps[1].trim();
            match katex::render(math) {
                Ok(rendered) => rendered,
                Err(e) => {
                    println!("display not rendered: {e}");
                    "wtf".to_owned()
                }
            }
        })
        .to_string();

    Ok(processed)
}
