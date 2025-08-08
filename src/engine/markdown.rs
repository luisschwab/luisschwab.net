use std::{collections::HashMap, fs, path::Path};

use matter;
use pulldown_cmark::{Event, Options, Parser, Tag, TagEnd, html};
use regex::Regex;
use serde::{Deserialize, Serialize};
use syntect::{highlighting::ThemeSet, html::highlighted_html_for_string, parsing::SyntaxSet};
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
    ///
    /// TODO(@luisschwab): parse this into a date type.
    pub(crate) date: String,
    /// The page's last edit date.
    pub(crate) edited: Option<String>,
}

pub(crate) struct Highlighter {
    pub(crate) syntax_set: SyntaxSet,
    pub(crate) theme_set: ThemeSet,
}

impl Highlighter {
    fn new() -> Self {
        Self {
            syntax_set: SyntaxSet::load_defaults_newlines(),
            theme_set: ThemeSet::load_defaults(),
        }
    }

    fn highlight(&self, code: &str, lang: &str) -> String {
        let syntax = self
            .syntax_set
            .find_syntax_by_token(lang)
            .unwrap_or_else(|| self.syntax_set.find_syntax_plain_text());
        println!("Using syntax: {}", syntax.name);

        // Set the theme.
        //
        // TODO(@luisschwab): set the theme on `config.toml`.
        let theme = &self.theme_set.themes["base16-ocean.dark"];

        highlighted_html_for_string(code, &self.syntax_set, syntax, theme).unwrap_or_else(|_| {
            format!("<pre><code>{}</code></pre>", html_escape::encode_text(code))
        })
    }
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

/// Processing of the markdown contents
/// (split from `process_md_file` for this to be a pure function).
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

    // Process and convert sidenote notation into Tufte classes.
    let markdown_sidenotes = process_sidenotes(&markdown)?;

    // Process `LaTeX` expressions with `katex-rs`.
    let markdown_katex = process_katex(&markdown_sidenotes)?;

    // Process code blocks with `syntect`.
    let markdown_syntect = process_syntect(&markdown_katex)?;

    // Finally, process the rest of the markdown.
    let parser = Parser::new_ext(&markdown_syntect, Options::ENABLE_TABLES);
    let mut html_content = String::new();
    html::push_html(&mut html_content, parser);

    Ok((frontmatter, html_content))
}

/// Process inline (`$ <expr> $`) and display (`$$ <expr> $$) LaTeX into HTML with `katex`.
///
/// The KaTeX CSS file must be available. You can get it from
/// https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.css
fn process_katex(content: &str) -> Result<String, EngineError> {
    let mut result = content.to_string();

    // Exclude code blocks from `katex` processing
    // by matching and removing them temporarily.
    let mut ctr = 0;
    let mut code_blocks = Vec::new();
    let code_block_rgx = Regex::new(r"(?s)```[^\n]*\n.*?```")?;
    result = code_block_rgx
        .replace_all(&result, |caps: &regex::Captures| {
            let placeholder = format!("__CODE_BLOCK_PLACEHOLDER_{}__", ctr);
            code_blocks.push(caps[0].to_string());
            ctr += 1;
            placeholder
        })
        .to_string();

    // Render display math: $$ <expr> $$
    let display_rgx = Regex::new(r"(?s)\$\$(.*?)\$\$")?;
    let mut processed = display_rgx
        .replace_all(&result, |caps: &regex::Captures| {
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

    // Insert code blocks back by matching and replacing.
    for (i, code_block) in code_blocks.iter().enumerate() {
        let placeholder = format!("__CODE_BLOCK_PLACEHOLDER_{}__", i);
        processed = processed.replace(&placeholder, code_block);
    }

    Ok(processed)
}

/// Process code blocks into HTML with `syntect`.
fn process_syntect(content: &str) -> Result<String, EngineError> {
    let highlighter = Highlighter::new();
    let parser = Parser::new_ext(content, Options::ENABLE_TABLES);
    let mut html_content = String::new();

    let events: Vec<_> = parser.collect();
    let mut processed_events: Vec<_> = Vec::new();
    let mut in_code_block: bool = false;
    let mut code_lang: String = String::new();
    let mut code_content: String = String::new();

    for event in events {
        match event {
            Event::Start(Tag::CodeBlock(lang)) => {
                in_code_block = true;
                code_lang = match lang {
                    pulldown_cmark::CodeBlockKind::Indented => "".to_string(),
                    pulldown_cmark::CodeBlockKind::Fenced(lang_str) => lang_str.to_string(),
                };
                code_content.clear();
            }
            Event::End(TagEnd::CodeBlock) => {
                if in_code_block {
                    let highlighted = highlighter.highlight(&code_content, &code_lang);
                    processed_events.push(Event::Html(highlighted.into()));
                    in_code_block = false;
                }
            }
            Event::Text(text) if in_code_block => {
                code_content.push_str(&text);
            }
            _ => {
                if !in_code_block {
                    processed_events.push(event);
                }
            }
        }
    }
    html::push_html(&mut html_content, processed_events.into_iter());

    Ok(html_content)
}

/// Process sidenote (`[^key]`) and marginnote (`[*key]`) into TufteCSS classes.
fn process_sidenotes(content: &str) -> Result<String, EngineError> {
    let mut result_lines = Vec::new();
    let mut sidenotes = HashMap::new();
    let mut marginnotes = HashMap::new();
    let lines: Vec<&str> = content.lines().collect();

    let mut i = 0;
    while i < lines.len() {
        let line = lines[i];

        // Match on sidenote notation: `[^key]`
        if let Some(caps) = Regex::new(r"^\[\^([^\]]+)\]:\s*(.*)$")?.captures(line) {
            let key = caps[1].to_string();
            let mut content = caps[2].to_string();

            // Sidenote notations can be multiline, given they are indented with 4 spaces.
            i += 1;
            while i < lines.len() && (lines[i].starts_with("    ") || lines[i].starts_with("\t")) {
                content.push(' ');
                content.push_str(lines[i].trim());
                i += 1;
            }

            sidenotes.insert(key, content.trim().to_string());
            continue; // Skip adding this line to result
        }

        // Match on marginnote definition: `[*key]`
        if let Some(caps) = Regex::new(r"^\[\*([^\]]+)\]:\s*(.*)$")?.captures(line) {
            let key = caps[1].to_string();
            let mut content = caps[2].to_string();

            // Marginnote notations can be multiline, given they are indented with 4 spaces.
            i += 1;
            while i < lines.len() && (lines[i].starts_with("    ") || lines[i].starts_with("\t")) {
                content.push(' ');
                content.push_str(lines[i].trim());
                i += 1;
            }

            marginnotes.insert(key, content.trim().to_string());
            continue; // Skip adding this line to result
        }

        result_lines.push(line);
        i += 1;
    }

    // Replace numbered sidenote references: `[^key]`
    let mut sidenote_ctr = 0;
    let mut result = result_lines.join("\n");
    let sidenote_ref_rgx = Regex::new(r"\[\^([^\]]+)\]")?;
    result = sidenote_ref_rgx.replace_all(&result, |caps: &regex::Captures| {
        let key = &caps[1];
        if let Some(note_content) = sidenotes.get(key) {
            sidenote_ctr += 1;
            format!(
                r#"<sup>{}</sup><label for="sn-{}" class="margin-toggle sidenote-number"></label><input type="checkbox" id="sn-{}" class="margin-toggle"/><span class="sidenote"><sup>{}</sup> {}</span>"#,
                sidenote_ctr, key, key, sidenote_ctr, note_content,
            )
        } else {
            format!("[^{} - NOT FOUND]", key)
        }
    }).to_string();

    // Replace unnumbered marginnote references: `[*key]`
    let marginnote_ref_rgx = Regex::new(r"\[\*([^\]]+)\]")?;
    result = marginnote_ref_rgx.replace_all(&result, |caps: &regex::Captures| {
        let key = &caps[1];
        if let Some(note_content) = marginnotes.get(key) {
            format!(
                r#"<label for="mn-{}" class="margin-toggle">⊕</label><input type="checkbox" id="mn-{}" class="margin-toggle"/><span class="marginnote">{}</span>"#,
                key, key, note_content
            )
        } else {
            format!("[*{} - NOT FOUND]", key)
        }
    }).to_string();

    Ok(result)
}
